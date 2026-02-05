/**
 * Format a tax rate or number value
 * Examples:
 *   5      → "5"
 *   5.5    → "5.50"
 *   5.00   → "5"
 *   null   → "0"
 */
export const formatNumber = (value: any): string => {
  const num = parseFloat(value ?? 0);

  if (isNaN(num)) return "0";

  return num.toFixed(2).replace(/\.00$/, "");
};

export const formatCurrency = (amount: any) => {
   const num = Number(amount);
   return `AED ${isNaN(num) ? "0.00" : num.toFixed(2)}`;
 };