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
  return price;
}

export type CalculateResponse =
  | {
      yieldUSD: number;
      yieldARS: number | null;
      fxImpact: number | null;
      buyPriceUSD: number;
      currentPriceUSD: number;
      cclAtBuy: number | null;
      cclCurrent: number;
    }
  | { error: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticker, purchasePrice, currency, cclAtBuy } = body as {
      ticker: string;
      purchasePrice: string;
      currency: "ARS" | "USD";
      cclAtBuy?: string;
    };

    if (!ticker || !purchasePrice) {
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

    const cclAtBuyNum = currency === "ARS" && cclAtBuy ? parseArgentineNumber(cclAtBuy) : null;
    if (currency === "ARS" && (!cclAtBuyNum || isNaN(cclAtBuyNum) || cclAtBuyNum <= 0)) {
      return NextResponse.json(
        { error: "Ingresá el CCL al momento de la compra" },
        { status: 400 }
      );
    }

    const [currentPriceUSD, cclCurrent] = await Promise.all([
      fetchCurrentPrice(ticker),
      fetchCurrentCCL(),
    ]);

    // Precio del subyacente al momento de compra:
    // - En ARS: precioARS × ratio ÷ CCL_compra
    // - En USD: precioUSD × ratio (usuario ingresa precio por CEDEAR en USD)
    const buyPriceUSD =
      currency === "ARS"
        ? (purchasePriceNum * cedear.ratio) / cclAtBuyNum!
        : purchasePriceNum * cedear.ratio;

    const yieldUSD = currentPriceUSD / buyPriceUSD - 1;

    let fxImpact: number | null = null;
    let yieldARS: number | null = null;

    if (currency === "ARS" && cclAtBuyNum) {
      fxImpact = cclCurrent / cclAtBuyNum - 1;
      yieldARS = (1 + yieldUSD) * (1 + fxImpact) - 1;
    }

    return NextResponse.json({
      yieldUSD,
      yieldARS,
      fxImpact,
      buyPriceUSD,
      currentPriceUSD,
      cclAtBuy: cclAtBuyNum,
      cclCurrent,
    } satisfies CalculateResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
