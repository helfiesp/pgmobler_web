import { Link } from "@remix-run/react";
import { formatPrice, savingsAmount, discountPercent } from "~/lib/utils/format";
import type { ProductWithImages } from "~/lib/services/product.server";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const savings = product.salePrice
    ? savingsAmount(product.price ?? 0, product.salePrice)
    : 0;
  const discount = product.salePrice
    ? discountPercent(product.price ?? 0, product.salePrice)
    : 0;

  return (
    <Link to={`/produkt/${product.slug}`} className="group block">
      {/* Fixed-size image container — object-contain keeps proportions, bg fills space */}
      <div className="relative bg-stone-50 rounded-xl overflow-hidden aspect-square mb-3">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-stone-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}

        {/* Second image on hover */}
        {secondaryImage && (
          <img
            src={secondaryImage.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product info — consistent height */}
      <div className="min-h-[72px]">
        {product.categoryName && (
          <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-0.5">
            {product.categoryName}
          </p>
        )}
        <h3 className="text-sm font-medium leading-snug text-stone-900 group-hover:text-secondary transition-colors line-clamp-1">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{product.subtitle}</p>
        )}
        <div className="flex items-baseline gap-2 mt-1.5">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-red-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : product.price ? (
            <span className="text-sm font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-xs text-stone-400">Ta kontakt for pris</span>
          )}
        </div>
        {savings > 0 && (
          <p className="text-[11px] text-red-600 mt-0.5">
            Spar {formatPrice(savings)}
          </p>
        )}
      </div>
    </Link>
  );
}
