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

const CEDEARS = [
  { ticker: "SPY", name: "S&P 500 ETF" },
  { ticker: "QQQ", name: "Nasdaq 100 ETF" },
  { ticker: "AAPL", name: "Apple" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "META", name: "Meta" },
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "BABA", name: "Alibaba" },
  { ticker: "PFE", name: "Pfizer" },
  { ticker: "KO", name: "Coca-Cola" },
  { ticker: "DIS", name: "Disney" },
  { ticker: "NU", name: "Nu Holdings" },
  { ticker: "MELI", name: "MercadoLibre" },
];

export type FormValues = {
  ticker: string;
  quantity: string;
  purchaseDate: string;
  purchasePrice: string;
  currency: "ARS" | "USD";
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
  });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
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
          Precio de compra
        </Label>
        <div className="flex gap-3">
          <Input
            id="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder={form.currency === "ARS" ? "15.000,00" : "150,00"}
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
                onClick={() => setForm({ ...form, currency: cur })}
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

      <Button
        type="submit"
        disabled={!form.ticker || !form.quantity || !form.purchaseDate || !form.purchasePrice || loading}
        className="w-full h-11 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold disabled:opacity-30"
      >
        {loading ? "Calculando…" : "Calcular rendimiento"}
      </Button>
    </form>
  );
}
