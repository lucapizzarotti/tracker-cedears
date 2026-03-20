import { NextRequest, NextResponse } from "next/server";
import { CEDEAR_MAP } from "@/lib/cedears";
import { parseArgentineNumber } from "@/lib/parse-number";

const AV_KEY = process.env.ALPHA_VANTAGE_API_KEY;

async function fetchCurrentPrice(ticker: string): Promise<number> {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${AV_KEY}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Error al consultar Alpha Vantage");
  const data = await res.json();

  if (data["Note"] || data["Information"]) {
    throw new Error("Límite de requests de Alpha Vantage alcanzado. Intentá en unos minutos.");
  }

  const price = parseFloat(data["Global Quote"]?.["05. price"]);
  if (isNaN(price)) throw new Error(`No se encontró precio para ${ticker}`);
  return price;
}

async function fetchCurrentCCL(): Promise<number> {
  const res = await fetch("https://dolarapi.com/v1/dolares/contadoconliqui", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Error al consultar DolarApi.com");
  const data = await res.json();
  const price = data.venta ?? data.compra;
  if (!price) throw new Error("No se pudo obtener el CCL actual");
  return parseFloat(price);
}

async function fetchHistoricalCCL(dateStr: string): Promise<number> {
  // Intenta hasta 5 días hacia atrás para cubrir fines de semana y feriados
  for (let daysBack = 0; daysBack <= 5; daysBack++) {
    const d = new Date(`${dateStr}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - daysBack);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");

    try {
      const url = `https://api.argentinadatos.com/v1/cotizaciones/dolares/contadoconliqui/${y}/${m}/${dd}`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;

      const data = await res.json();
      const entry = Array.isArray(data) ? data[0] : data;
      const raw = entry?.venta ?? entry?.compra;
      const price = parseFloat(raw);
      if (!isNaN(price) && price > 0) return price;
    } catch {
      continue;
    }
  }

  throw new Error(
    `No se encontró el CCL histórico para la fecha ${dateStr}. ` +
      "Verificá que la fecha sea correcta y que no sea muy antigua."
  );
}

export type CalculateResponse =
  | {
      yieldUSD: number;
      yieldARS: number;
      fxImpact: number;
      buyPriceUSD: number;
      currentPriceUSD: number;
      cclAtBuy: number;
      cclCurrent: number;
    }
  | { error: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticker, purchasePrice, purchaseDate } = body as {
      ticker: string;
      purchasePrice: string;
      purchaseDate: string;
    };

    if (!ticker || !purchasePrice || !purchaseDate) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const cedear = CEDEAR_MAP[ticker];
    if (!cedear) {
      return NextResponse.json({ error: `CEDEAR desconocido: ${ticker}` }, { status: 400 });
    }

    const purchasePriceNum = parseArgentineNumber(purchasePrice);
    if (isNaN(purchasePriceNum) || purchasePriceNum <= 0) {
      return NextResponse.json({ error: "Precio de compra inválido" }, { status: 400 });
    }

    const [currentPriceUSD, cclCurrent, cclAtBuy] = await Promise.all([
      fetchCurrentPrice(ticker),
      fetchCurrentCCL(),
      fetchHistoricalCCL(purchaseDate),
    ]);

    // Precio del subyacente al momento de compra:
    // precioARS × ratio ÷ CCL_compra = precio subyacente en USD
    const buyPriceUSD = (purchasePriceNum * cedear.ratio) / cclAtBuy;

    const yieldUSD = currentPriceUSD / buyPriceUSD - 1;
    const fxImpact = cclCurrent / cclAtBuy - 1;
    const yieldARS = (1 + yieldUSD) * (1 + fxImpact) - 1;

    return NextResponse.json({
      yieldUSD,
      yieldARS,
      fxImpact,
      buyPriceUSD,
      currentPriceUSD,
      cclAtBuy,
      cclCurrent,
    } satisfies CalculateResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
