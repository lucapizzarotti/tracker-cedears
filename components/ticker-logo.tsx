"use client";

import { useState } from "react";

export function TickerLogo({ ticker, size = 20 }: { ticker: string; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        className="shrink-0 flex items-center justify-center rounded-full bg-zinc-700 font-bold text-zinc-300"
      >
        {ticker.slice(0, 2)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://assets.parqet.com/logos/symbol/${ticker}?format=png`}
      alt={ticker}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-contain bg-white"
      onError={() => setFailed(true)}
    />
  );
}
