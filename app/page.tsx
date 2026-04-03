"use client";

import { useState } from "react";
import CalculatorForm, { type FormValues } from "@/components/calculator-form";
import ResultsPanel, { type Results } from "@/components/results-panel";
import type { CalculateResponse } from "@/app/api/calculate/route";
import { CEDEAR_MAP } from "@/lib/cedears";
import { parseArgentineNumber } from "@/lib/parse-number";

type View = "form" | "results";

export default function Home() {
  const [view, setView] = useState<View>("form");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: CalculateResponse = await res.json();

      if ("error" in data) {
        setError(data.error);
      } else {
        const cedear = CEDEAR_MAP[values.ticker];
        const quantity = Number(values.quantity);
        const purchasePriceARS = parseArgentineNumber(values.purchasePrice);

        setResults({
          ...data,
          inversionInicialARS: quantity * purchasePriceARS,
          valorActualARS: (quantity * data.currentPriceUSD * data.cclCurrent) / cedear.ratio,
          ticker: values.ticker,
          cedearName: cedear.name,
        });
        setView("results");
      }
    } catch {
      setError("No se pudo conectar con el servidor. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  function handleNuevoCalculo() {
    setView("form");
    setResults(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      <div className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16 flex-1">

        {view === "form" ? (
          <>
            {/* Header */}
            <header className="mb-10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#00E676] shrink-0" />
              <h1 className="text-3xl font-bold tracking-tight text-white">Cedereal</h1>
            </header>

            <CalculatorForm onSubmit={handleSubmit} loading={loading} error={error} />
          </>
        ) : (
          results && <ResultsPanel results={results} onNuevoCalculo={handleNuevoCalculo} />
        )}

      </div>

      <footer className="py-6 text-center text-xs text-zinc-600">
        Proyecto 🧪 por{" "}
        <a
          href="https://github.com/lucapizzarotti"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-400 transition-colors"
        >
          Luca
        </a>
      </footer>
    </div>
  );
}
