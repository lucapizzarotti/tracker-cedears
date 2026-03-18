/**
 * Parsea un número en formato argentino o estándar.
 *
 * Formato argentino: punto como separador de miles, coma como decimal.
 *   "43.720"    → 43720
 *   "1.446,58"  → 1446.58
 *   "1.050"     → 1050   (3 dígitos tras el punto → separador de miles)
 *
 * Formato estándar (también aceptado):
 *   "1446.58"   → 1446.58
 *   "43720"     → 43720
 */
export function parseArgentineNumber(value: string): number {
  const cleaned = value.trim();
  if (!cleaned) return NaN;

  // Si hay coma, es formato argentino: puntos = miles, coma = decimal
  if (cleaned.includes(",")) {
    return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  }

  // Sin coma, múltiples puntos → todos son separadores de miles
  const dotCount = (cleaned.match(/\./g) || []).length;
  if (dotCount > 1) {
    return parseFloat(cleaned.replace(/\./g, ""));
  }

  // Un solo punto: si hay exactamente 3 dígitos después → separador de miles
  // (ej: "1.050" → 1050, pero "43.72" → 43.72)
  if (dotCount === 1) {
    const afterDot = cleaned.split(".")[1];
    if (afterDot && afterDot.length === 3) {
      return parseFloat(cleaned.replace(".", ""));
    }
  }

  // Formato estándar
  return parseFloat(cleaned);
}

/** Devuelve true si el string representa un número válido > 0 */
export function isValidPositiveNumber(value: string): boolean {
  const n = parseArgentineNumber(value);
  return !isNaN(n) && n > 0;
}
