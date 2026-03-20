"use client";

import { Separator } from "@/components/ui/separator";

export type Results = {
  yieldUSD: number;
  yieldARS: number;
  fxImpact: number;
  buyPriceUSD: number;
  currentPriceUSD: number;
  cclAtBuy: number;
  cclCurrent: number;
};

type Props = {
  results: Results | null;
};

const fmtPct = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "always",
  })
    .format(n)
    .replace(/\s/, "");

const fmtUSD = (n: number) =>
  "USD " +
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtARS = (n: number) =>
  "$ " +
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function pctColor(value: number) {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-zinc-400";
}

export default function ResultsPanel({ results }: Props) {
  if (!results) {
    return (
      <p className="text-center text-zinc-600 text-sm py-10">
        Completá el formulario para ver tu rendimiento real.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI hero — Rendimiento USD */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Rendimiento en USD
        </p>
        <p
          className={`text-[2.75rem] leading-none font-bold tabular-nums tracking-tight ${pctColor(results.yieldUSD)}`}
        >
          {fmtPct(results.yieldUSD)}
        </p>
      </div>

      {/* KPIs secundarios */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
            Rendimiento ARS
          </p>
          <p className={`text-2xl font-semibold tabular-nums leading-tight ${pctColor(results.yieldARS)}`}>
            {fmtPct(results.yieldARS)}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
            Impacto FX
          </p>
          <p className={`text-2xl font-semibold tabular-nums leading-tight ${pctColor(results.fxImpact)}`}>
            {fmtPct(results.fxImpact)}
          </p>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Detalle */}
      <div className="space-y-3">
        <DetailRow
          label="Precio subyacente"
          sub="compra → actual"
          value={`${fmtUSD(results.buyPriceUSD)} → ${fmtUSD(results.currentPriceUSD)}`}
        />
        <DetailRow
          label="Dólar CCL"
          sub="compra → actual"
          value={`${fmtARS(results.cclAtBuy)} → ${fmtARS(results.cclCurrent)}`}
        />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  sub,
  value,
}: {
  label: string;
  sub?: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <span className="text-zinc-400 text-sm">{label}</span>
        {sub && <span className="ml-1.5 text-zinc-600 text-xs">{sub}</span>}
      </div>
      <span className="text-zinc-200 text-sm font-mono shrink-0">{value}</span>
    </div>
  );
}
