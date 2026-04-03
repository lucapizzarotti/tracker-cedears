"use client";

import { Share2 } from "lucide-react";
import { TickerLogo } from "@/components/ticker-logo";

export type Results = {
  yieldUSD: number;
  yieldARS: number;
  fxImpact: number;
  buyPriceUSD: number;
  currentPriceUSD: number;
  cclAtBuy: number;
  cclCurrent: number;
  // Computed display values
  inversionInicialARS: number;
  valorActualARS: number;
  ticker: string;
  cedearName: string;
};

type Props = {
  results: Results;
  onNuevoCalculo: () => void;
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtCCL = (n: number) =>
  "$ " +
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function pctColor(n: number) {
  if (n > 0) return "text-[#00E676]";
  if (n < 0) return "text-red-400";
  return "text-zinc-400";
}

export default function ResultsPanel({ results, onNuevoCalculo }: Props) {
  const shareText =
    `Calculé el rendimiento de mis $${results.ticker} con Cedereal: ` +
    `${fmtPct(results.yieldUSD)} en USD 🚀`;

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-4">
      {/* Card */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">

        {/* Header: logo + ticker - name */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <TickerLogo ticker={results.ticker} size={36} />
          <span className="font-semibold text-base text-zinc-100">
            {results.ticker}
            <span className="text-zinc-500"> — </span>
            {results.cedearName}
          </span>
        </div>

        {/* Hero: rendimiento USD */}
        <div className="px-5 py-6 text-center border-b border-zinc-800">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Rendimiento Neto (USD)
          </p>
          <p className={`text-5xl font-bold tabular-nums leading-none tracking-tight ${pctColor(results.yieldUSD)}`}>
            {fmtPct(results.yieldUSD)}
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 border-b border-zinc-800">
          <GridCell label="Inversión Inicial" value={fmtARS(results.inversionInicialARS)} />
          <GridCell label="Valor Actual" value={fmtARS(results.valorActualARS)} borderLeft />
          <GridCell
            label="Impacto FX"
            value={fmtPct(results.fxImpact)}
            valueClass={pctColor(results.fxImpact)}
            borderTop
          />
          <GridCell
            label="Rendimiento en ARS"
            value={fmtPct(results.yieldARS)}
            valueClass={pctColor(results.yieldARS)}
            borderTop
            borderLeft
          />
        </div>

        {/* Detail rows */}
        <div className="px-5 py-4 space-y-3">
          <DetailRow
            label="Precio subyacente"
            value={`${fmtUSD(results.buyPriceUSD)} → ${fmtUSD(results.currentPriceUSD)}`}
          />
          <DetailRow
            label="Dólar CCL"
            value={`${fmtCCL(results.cclAtBuy)} → ${fmtCCL(results.cclCurrent)}`}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onNuevoCalculo}
          className="h-12 rounded-lg bg-[#00E676] hover:bg-[#00FF87] text-black font-semibold text-sm transition-colors cursor-pointer"
        >
          Nuevo cálculo
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-100 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          Compartir en X
        </a>
      </div>
    </div>
  );
}

function GridCell({
  label,
  value,
  valueClass,
  borderTop,
  borderLeft,
}: {
  label: string;
  value: string;
  valueClass?: string;
  borderTop?: boolean;
  borderLeft?: boolean;
}) {
  return (
    <div
      className={[
        "px-5 py-4 space-y-1",
        borderTop ? "border-t border-zinc-800" : "",
        borderLeft ? "border-l border-zinc-800" : "",
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className={`text-lg font-semibold tabular-nums leading-tight ${valueClass ?? "text-zinc-100"}`}>
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-sm font-mono text-zinc-300">{value}</span>
    </div>
  );
}
