/** Format price in NOK (e.g., "12 995 kr") */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  return `${price.toLocaleString("nb-NO")} kr`;
}

/** Calculate discount percentage between original and sale price */
export function discountPercent(
  price: number,
  salePrice: number
): number {
  if (!price || !salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/** Calculate savings amount */
export function savingsAmount(
  price: number,
  salePrice: number
): number {
  if (!price || !salePrice || salePrice >= price) return 0;
  return price - salePrice;
}

/** Format a date string for display */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
