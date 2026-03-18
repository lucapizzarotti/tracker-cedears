"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CEDEARS } from "@/lib/cedears";
import { isValidPositiveNumber } from "@/lib/parse-number";

export type FormValues = {
  ticker: string;
  quantity: string;
  purchaseDate: string;
  purchasePrice: string;
  currency: "ARS" | "USD";
  cclAtBuy: string;
};

type Props = {
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
};

export default function CalculatorForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormValues>({
    ticker: "",
    quantity: "",
    purchaseDate: "",
    purchasePrice: "",
    currency: "ARS",
    cclAtBuy: "",
  });

  const selectedCedear = CEDEARS.find((c) => c.ticker === form.ticker);

  const isFormValid =
    !!form.ticker &&
    !!form.quantity &&
    Number(form.quantity) > 0 &&
    !!form.purchaseDate &&
    isValidPositiveNumber(form.purchasePrice) &&
    (form.currency === "USD" || isValidPositiveNumber(form.cclAtBuy));

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isFormValid) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CEDEAR selector */}
      <div className="space-y-1.5">
        <Label htmlFor="ticker" className="text-zinc-400 text-xs uppercase tracking-wider">
          CEDEAR
        </Label>
        <Select
          value={form.ticker}
          onValueChange={(v) => setForm({ ...form, ticker: v ?? "" })}
        >
          <SelectTrigger
            id="ticker"
            className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700 h-11"
          >
            <SelectValue placeholder="Seleccioná un ticker…" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {CEDEARS.map((c) => (
              <SelectItem
                key={c.ticker}
                value={c.ticker}
                className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-50"
              >
                <span className="font-mono font-semibold">{c.ticker}</span>
                <span className="ml-2 text-zinc-500">{c.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCedear && (
          <p className="text-zinc-600 text-xs">
            Ratio de conversión:{" "}
            <span className="text-zinc-500">{selectedCedear.ratio}:1</span>
            <span className="ml-1">(1 acción = {selectedCedear.ratio} CEDEARs)</span>
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

      {/* Precio + Moneda */}
      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-xs uppercase tracking-wider">
          Precio de compra por CEDEAR
        </Label>
        <div className="flex gap-3">
          <Input
            id="purchasePrice"
            type="text"
            inputMode="decimal"
            placeholder={form.currency === "ARS" ? "43.720" : "150,50"}
            value={form.purchasePrice}
            onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-11 flex-1"
          />
          {/* Currency toggle */}
          <div className="flex rounded-md border border-zinc-800 overflow-hidden h-11 shrink-0">
            {(["ARS", "USD"] as const).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setForm({ ...form, currency: cur, cclAtBuy: "" })}
                className={`px-4 text-sm font-semibold transition-colors ${
                  form.currency === cur
                    ? "bg-zinc-100 text-zinc-900"
                    : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CCL al momento de compra — solo en ARS */}
      {form.currency === "ARS" && (
        <div className="space-y-1.5">
          <Label htmlFor="cclAtBuy" className="text-zinc-400 text-xs uppercase tracking-wider">
            CCL al momento de compra
          </Label>
          <Input
            id="cclAtBuy"
            type="text"
            inputMode="decimal"
            placeholder="1.050"
            value={form.cclAtBuy}
            onChange={(e) => setForm({ ...form, cclAtBuy: e.target.value })}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-11"
          />
          <p className="text-zinc-600 text-xs">
            Consultá el CCL histórico en{" "}
            <span className="text-zinc-500">ambito.com</span> o tu broker.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full h-11 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold disabled:opacity-30"
      >
        {loading ? "Calculando…" : "Calcular rendimiento"}
      </Button>
    </form>
  );
}
