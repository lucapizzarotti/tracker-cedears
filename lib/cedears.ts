export type Cedear = {
  ticker: string;
  name: string;
  /** Relación de conversión: cuántos CEDEARs equivalen a 1 acción subyacente */
  ratio: number;
};

// Ratios vigentes a 2024. Verificar con el broker ante dudas.
export const CEDEARS: Cedear[] = [
  { ticker: "SPY",   name: "S&P 500 ETF",    ratio: 20  },
  { ticker: "QQQ",   name: "Nasdaq 100 ETF", ratio: 20  },
  { ticker: "AAPL",  name: "Apple",          ratio: 10  },
  { ticker: "MSFT",  name: "Microsoft",      ratio: 10  },
  { ticker: "GOOGL", name: "Alphabet",       ratio: 10  },
  { ticker: "AMZN",  name: "Amazon",         ratio: 10  },
  { ticker: "TSLA",  name: "Tesla",          ratio: 10  },
  { ticker: "META",  name: "Meta",           ratio: 10  },
  { ticker: "NVDA",  name: "NVIDIA",         ratio: 10  },
  { ticker: "BABA",  name: "Alibaba",        ratio: 10  },
  { ticker: "PFE",   name: "Pfizer",         ratio: 5   },
  { ticker: "KO",    name: "Coca-Cola",      ratio: 5   },
  { ticker: "DIS",   name: "Disney",         ratio: 10  },
  { ticker: "NU",    name: "Nu Holdings",    ratio: 5   },
  { ticker: "MELI",  name: "MercadoLibre",   ratio: 100 },
];

export const CEDEAR_MAP = Object.fromEntries(CEDEARS.map((c) => [c.ticker, c]));
