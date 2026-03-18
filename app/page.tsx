"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            CEDEAR Real Yield
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Calculá tu rendimiento real en USD, ARS y el impacto del tipo de cambio.
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
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-zinc-500">Consultando APIs…</p>
                </div>
              ) : error ? (
                <p className="rounded-md bg-red-950/40 border border-red-900/50 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              ) : (
                <ResultsPanel results={results} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
