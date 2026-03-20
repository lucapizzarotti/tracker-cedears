"use client";

import { useCallback, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CEDEARS } from "@/lib/cedears";
import { isValidPositiveNumber } from "@/lib/parse-number";

export type FormValues = {
  ticker: string;
  quantity: string;
  purchaseDate: string;
  purchasePrice: string;
};

type Props = {
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
};

function TickerLogo({ ticker, size = 20 }: { ticker: string; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        className="shrink-0 flex items-center justify-center rounded-full bg-zinc-700 font-bold text-zinc-300 tabular-nums"
      >
        {ticker.slice(0, 2)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://assets.parqet.com/logos/symbol/${ticker}?format=png`}
      alt={ticker}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-contain bg-white"
      onError={() => setFailed(true)}
    />
  );
}

export default function CalculatorForm({ onSubmit, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [form, setForm] = useState<FormValues>({
    ticker: "",
    quantity: "",
    purchaseDate: "",
    purchasePrice: "",
  });

  const measureTrigger = useCallback((el: HTMLButtonElement | null) => {
    if (el) setTriggerWidth(el.offsetWidth);
  }, []);

  const selectedCedear = CEDEARS.find((c) => c.ticker === form.ticker);

  const isFormValid =
    !!form.ticker &&
    !!form.quantity &&
    Number(form.quantity) > 0 &&
    !!form.purchaseDate &&
    isValidPositiveNumber(form.purchasePrice);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isFormValid) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* CEDEAR combobox */}
      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-xs uppercase tracking-wider">CEDEAR</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            ref={measureTrigger}
            className="w-full h-11 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {selectedCedear ? (
              <span className="flex items-center gap-2.5">
                <TickerLogo ticker={selectedCedear.ticker} size={20} />
                <span className="font-semibold">{selectedCedear.ticker}</span>
                <span className="text-zinc-400">{selectedCedear.name}</span>
              </span>
            ) : (
              <span className="text-zinc-500">Seleccioná un ticker…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-zinc-500" />
          </PopoverTrigger>

          <PopoverContent
            style={{ minWidth: triggerWidth || undefined }}
            className="p-0 bg-zinc-900 border-zinc-800 w-auto"
          >
            <Command
              filter={(value, search) => {
                const c = CEDEARS.find((x) => x.ticker.toLowerCase() === value.toLowerCase());
                if (!c) return 0;
                const q = search.toLowerCase();
                return c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
                  ? 1
                  : 0;
              }}
            >
              <CommandInput
                placeholder="Buscar ticker o nombre…"
                className="h-10 text-zinc-100 placeholder:text-zinc-500 border-b border-zinc-800"
              />
              <CommandList>
                <CommandEmpty className="py-4 text-center text-sm text-zinc-500">
                  No se encontró ningún ticker.
                </CommandEmpty>
                <CommandGroup>
                  {CEDEARS.map((c) => (
                    <CommandItem
                      key={c.ticker}
                      value={c.ticker}
                      onSelect={(v) => {
                        setForm({ ...form, ticker: v === form.ticker ? "" : v });
                        setOpen(false);
                      }}
                      className="flex items-center justify-between gap-3 py-2 cursor-pointer text-zinc-100 data-[selected=true]:bg-zinc-800"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <TickerLogo ticker={c.ticker} size={24} />
                        <span className="font-semibold shrink-0">{c.ticker}</span>
                        <span className="text-zinc-500 text-sm truncate">{c.name}</span>
                      </span>
                      <Check
                        className={cn(
                          "h-4 w-4 text-zinc-400 shrink-0",
                          form.ticker === c.ticker ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedCedear && (
          <p className="text-zinc-600 text-xs">
            Ratio {selectedCedear.ratio}:1 — 1 acción subyacente = {selectedCedear.ratio} CEDEARs
          </p>
        )}
      </div>

      {/* Cantidad + Fecha */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-zinc-400 text-xs uppercase tracking-wider">
            Cantidad
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            placeholder="100"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchaseDate" className="text-zinc-400 text-xs uppercase tracking-wider">
            Fecha de compra
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Precio de compra */}
      <div className="space-y-1.5">
        <Label htmlFor="purchasePrice" className="text-zinc-400 text-xs uppercase tracking-wider">
          Precio de compra por CEDEAR (ARS)
        </Label>
        <Input
          id="purchasePrice"
          type="text"
          inputMode="decimal"
          placeholder="43.720"
          value={form.purchasePrice}
          onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
          className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-11"
        />
        <p className="text-zinc-600 text-xs">
          Podés usar punto como separador de miles: 43.720 o 43720
        </p>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Consultando APIs…
          </>
        ) : (
          "Calcular rendimiento"
        )}
      </Button>
    </form>
  );
}
