"use client";

import { useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import CalculatorForm, { type FormValues } from "@/components/calculator-form";
import ResultsPanel, { type Results } from "@/components/results-panel";
import { Separator } from "@/components/ui/separator";
import type { CalculateResponse } from "@/app/api/calculate/route";

export default function Home() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function handleSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setHasSubmitted(true);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: CalculateResponse = await res.json();

      if ("error" in data) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor. Verificá tu conexión.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="mx-auto w-full max-w-xl px-4 py-12 sm:py-16 flex-1">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/80">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              CEDEAR Real Yield
            </h1>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed pl-11">
            Rendimiento real de tus CEDEARs en USD, ARS y el impacto del tipo de cambio.
          </p>
        </header>

        {/* Form card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <CalculatorForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Results */}
        {hasSubmitted && (
          <>
            <Separator className="my-8 bg-zinc-800" />
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Resultados
              </h2>

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Consultando precios y CCL histórico…
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-950/40 border border-red-900/40 px-4 py-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              ) : (
                <ResultsPanel results={results} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zinc-600">
        Hecho por{" "}
        <a
          href="https://github.com/lucapizzarotti"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Luca Pizzarotti
        </a>
      </footer>
    </div>
  );
}
