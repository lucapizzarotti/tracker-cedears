"use client";

import { Separator } from "@/components/ui/separator";

export type Results = {
  yieldUSD: number;
  yieldARS: number | null;
  fxImpact: number | null;
  buyPriceUSD: number;
  currentPriceUSD: number;
  cclAtBuy: number | null;
  cclCurrent: number;
};

type Props = {
  results: Results | null;
};

function formatPct(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

function pctColor(value: number) {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-zinc-400";
}

export default function ResultsPanel({ results }: Props) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-zinc-600 text-sm">
          Completá el formulario para ver tu rendimiento real.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main yields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Rendimiento USD</p>
          <p className={`text-2xl font-semibold tabular-nums ${pctColor(results.yieldUSD)}`}>
            {formatPct(results.yieldUSD)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Rendimiento ARS</p>
          {results.yieldARS !== null ? (
            <p className={`text-2xl font-semibold tabular-nums ${pctColor(results.yieldARS)}`}>
              {formatPct(results.yieldARS)}
            </p>
          ) : (
            <p className="text-2xl font-semibold text-zinc-600">—</p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Impacto FX</p>
          {results.fxImpact !== null ? (
            <p className={`text-2xl font-semibold tabular-nums ${pctColor(results.fxImpact)}`}>
              {formatPct(results.fxImpact)}
            </p>
          ) : (
            <p className="text-2xl font-semibold text-zinc-600">—</p>
          )}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Detail rows */}
      <div className="space-y-3">
        <DetailRow
          label="Precio subyacente (compra → actual)"
          value={`$${results.buyPriceUSD.toFixed(2)} → $${results.currentPriceUSD.toFixed(2)}`}
        />
        {results.cclAtBuy !== null && (
          <DetailRow
            label="CCL (compra → actual)"
            value={`$${results.cclAtBuy.toFixed(0)} → $${results.cclCurrent.toFixed(0)}`}
          />
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 text-sm">{label}</span>
      <span className="text-zinc-200 text-sm font-mono">{value}</span>
    </div>
  );
}
