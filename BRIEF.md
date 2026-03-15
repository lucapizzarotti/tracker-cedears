# CEDEAR Real Yield — Project Brief

## Qué es
Calculadora web que muestra el rendimiento real de CEDEARs desglosado en USD, ARS e impacto del tipo de cambio. Pensada para inversores retail argentinos que quieren entender cuánto ganaron o perdieron realmente.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS (sistema de estilos utilitario)
- shadcn/ui (componentes pre-armados construidos con Tailwind)
- Deploy en Vercel

## Qué hace la V1
- El usuario selecciona un CEDEAR de una lista (tickers principales: SPY, QQQ, AAPL, TSLA, MSFT, GOOGL, AMZN, PFE, NU, etc.)
- Ingresa cantidad de CEDEARs comprados
- Ingresa fecha de compra
- Ingresa precio pagado por CEDEAR (en ARS)
- Toggle para elegir si compró en ARS o USD
- La app consulta el precio actual del activo en USD vía API
- La app consulta el dólar CCL actual vía API
- Muestra resultados:
  - Rendimiento en USD (%)
  - Rendimiento en ARS (%)
  - Impacto del tipo de cambio (%)
  - Precio de compra vs. precio actual del subyacente
  - CCL al momento de compra vs. CCL actual

## Qué NO hace la V1
- No tiene login ni autenticación
- No guarda datos (cada visita es nueva)
- No trackea dividendos
- No permite cargar múltiples CEDEARs a la vez
- No tiene base de datos

## APIs
- Precios de acciones US: Alpha Vantage (free tier, 25 req/día)
- Dólar CCL actual: DolarApi.com (gratuita, open source)
- CCL histórico: a investigar (puede ser carga manual del usuario en V1)

## Diseño
- Una sola página
- Estilo simple, oscuro, limpio
- Referencias de diseño: https://comparatasas.ar/ y https://www.interfacecraft.dev/
- Mobile responsive
- Sin elementos decorativos innecesarios
- La información es la protagonista

## Lógica de cálculo
- Rendimiento USD = (precio actual USD / precio compra USD) - 1
- Impacto FX = (CCL actual / CCL compra) - 1
- Rendimiento ARS = ((1 + Rendimiento USD) * (1 + Impacto FX)) - 1
- Si compró en USD: no se calcula impacto FX
