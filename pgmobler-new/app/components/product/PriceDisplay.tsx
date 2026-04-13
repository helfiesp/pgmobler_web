import { formatPrice, savingsAmount, discountPercent } from "~/lib/utils/format";

interface PriceDisplayProps {
  price: number | null | undefined;
  salePrice: number | null | undefined;
  size?: "sm" | "lg";
}

export function PriceDisplay({
  price,
  salePrice,
  size = "lg",
}: PriceDisplayProps) {
  if (!price) return null;

  const hasSale = salePrice && salePrice < price;
  const savings = hasSale ? savingsAmount(price, salePrice) : 0;
  const discount = hasSale ? discountPercent(price, salePrice) : 0;

  const priceClass = size === "lg" ? "text-2xl" : "text-sm";
  const originalClass = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-3">
        <span
          className={`${priceClass} font-bold ${hasSale ? "text-danger" : ""}`}
        >
          {formatPrice(hasSale ? salePrice : price)}
        </span>
        {hasSale && (
          <span className={`${originalClass} text-muted line-through`}>
            {formatPrice(price)}
          </span>
        )}
      </div>
      {hasSale && savings > 0 && (
        <p className="text-sm text-danger font-medium">
          Spar {formatPrice(savings)} ({discount}%)
        </p>
      )}
    </div>
  );
}
