/**
 * Parses a date string in DD/MM/YYYY or DD/MM/YY format to ISO string (YYYY-MM-DD)
 * Returns empty string if invalid
 */
export function parseDateInput(input: string): string {
  if (!input || input.length < 10) return "";

  // Remove any non-numeric/non-slash characters
  const cleaned = input.replace(/[^\d/]/g, "");

  // Split by slash
  const parts = cleaned.split("/");

  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return "";

  let [day, month, year] = parts;

  // Validate day and month
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  let yearNum = parseInt(year, 10);

  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return "";
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) return "";

  // Convert 2-digit year to 4-digit year
  // If year is 0-50, assume 2000-2050
  // If year is 51-99, assume 1951-1999
  if (year.length === 2) {
    yearNum = yearNum <= 50 ? 2000 + yearNum : 1900 + yearNum;
  }

  // Validate year is reasonable (1950-2100)
  if (yearNum < 1950 || yearNum > 2100) return "";

  // Create date and validate it exists
  const date = new Date(yearNum, monthNum - 1, dayNum);
  const isValidDate =
    date.getFullYear() === yearNum &&
    date.getMonth() === monthNum - 1 &&
    date.getDate() === dayNum;

  if (!isValidDate) return "";

  // Return ISO format (YYYY-MM-DD) without timezone conversion
  const mm = String(monthNum).padStart(2, "0");
  const dd = String(dayNum).padStart(2, "0");
  return `${yearNum}-${mm}-${dd}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) to DD/MM/YYYY for display
 */
export function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";

  const date = new Date(isoDate + "T00:00:00Z");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats input as user types: allows only digits and slashes
 * Automatically adds slashes after day and month
 */
export function formatDateInput(input: string): string {
  // Only allow digits and slashes
  let cleaned = input.replace(/[^\d/]/g, "");

  // Remove extra slashes
  cleaned = cleaned.replace(/\/+/g, "/");

  // Auto-format: DD/MM/YYYY
  if (cleaned.length >= 2 && !cleaned.includes("/")) {
    cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  }

  if (cleaned.length >= 5 && cleaned.split("/").length === 2) {
    const parts = cleaned.split("/");
    cleaned = parts[0] + "/" + parts[1].slice(0, 2) + "/" + parts[1].slice(2);
  }

  // Limit to DD/MM/YYYY format (10 chars max)
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(0, 10);
  }

  return cleaned;
}

/**
 * Validates if the input is a complete, valid date
 */
export function isValidDate(input: string): boolean {
  const isoDate = parseDateInput(input);
  return isoDate.length > 0;
}
