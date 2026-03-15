"use client";

import { useState } from "react";
import CalculatorForm, { type FormValues } from "@/components/calculator-form";
import ResultsPanel, { type Results } from "@/components/results-panel";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    setLoading(true);
    // TODO: call APIs and compute results
    console.log("Form submitted:", values);
    // Placeholder — remove when real logic is wired up
    await new Promise((r) => setTimeout(r, 500));
    setResults(null);
    setLoading(false);
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
        {(results || !loading) && (
          <>
            <Separator className="my-8 bg-zinc-800" />
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Resultados
              </h2>
              <ResultsPanel results={results} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
