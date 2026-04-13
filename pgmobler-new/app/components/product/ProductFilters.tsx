import { useSearchParams, Link } from "@remix-run/react";
import { useState } from "react";
import type { SortOption } from "~/lib/services/product.server";
import type { Category } from "~/lib/db/schema";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newly_added", label: "Nyeste" },
  { value: "price_low_high", label: "Pris: lav → høy" },
  { value: "price_high_low", label: "Pris: høy → lav" },
  { value: "name_a_z", label: "Navn: A → Å" },
  { value: "name_z_a", label: "Navn: Å → A" },
  { value: "most_discounted", label: "Størst rabatt" },
];

const PRICE_RANGES = [
  { label: "Alle priser", min: undefined, max: undefined },
  { label: "Under 3 000 kr", min: undefined, max: 3000 },
  { label: "3 000 – 10 000 kr", min: 3000, max: 10000 },
  { label: "10 000 – 25 000 kr", min: 10000, max: 25000 },
  { label: "25 000 – 50 000 kr", min: 25000, max: 50000 },
  { label: "Over 50 000 kr", min: 50000, max: undefined },
];

interface ProductFiltersProps {
  sort: string;
  total: number;
  categories?: Category[];
  currentCategory?: string;
  showCategoryFilter?: boolean;
}

export function ProductFilters({
  sort,
  total,
  categories,
  currentCategory,
  showCategoryFilter = false,
}: ProductFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPriceMin = searchParams.get("pris_min");
  const currentPriceMax = searchParams.get("pris_max");
  const currentOnSale = searchParams.get("tilbud") === "1";

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("side"); // Reset pagination
    setSearchParams(params);
  }

  function setPriceRange(min?: number, max?: number) {
    const params = new URLSearchParams(searchParams);
    if (min != null) params.set("pris_min", String(min));
    else params.delete("pris_min");
    if (max != null) params.set("pris_max", String(max));
    else params.delete("pris_max");
    params.delete("side");
    setSearchParams(params);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    setSearchParams(params);
  }

  const hasActiveFilters = currentPriceMin || currentPriceMax || currentOnSale;
  const activePriceRange = PRICE_RANGES.find(
    (r) =>
      String(r.min ?? "") === (currentPriceMin ?? "") &&
      String(r.max ?? "") === (currentPriceMax ?? "")
  );

  return (
    <div className="space-y-4">
      {/* Top bar — sort + filter toggle + result count */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-stone-400">
          {total} {total === 1 ? "produkt" : "produkter"}
        </p>

        <div className="flex items-center gap-2">
          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
              hasActiveFilters
                ? "border-secondary bg-secondary/5 text-secondary"
                : "border-stone-200 text-stone-600 hover:border-stone-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filter
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            )}
          </button>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => updateParam("sortering", e.target.value)}
            className="px-4 py-2 text-sm rounded-lg border border-stone-200 text-stone-600 bg-white hover:border-stone-300 focus:outline-none focus:border-secondary transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expandable filter panel */}
      {filtersOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-5 animate-fade-in">
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            {/* Price range */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Prisklasse
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range) => {
                  const isActive =
                    String(range.min ?? "") === (currentPriceMin ?? "") &&
                    String(range.max ?? "") === (currentPriceMax ?? "");
                  return (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange(range.min, range.max)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        isActive
                          ? "border-secondary bg-secondary/5 text-secondary font-medium"
                          : "border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* On sale toggle */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Tilbud
              </h3>
              <button
                onClick={() =>
                  updateParam("tilbud", currentOnSale ? undefined : "1")
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  currentOnSale
                    ? "border-red-300 bg-red-50 text-red-600 font-medium"
                    : "border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
              >
                Kun tilbudsvarer
              </button>
            </div>

            {/* Category — only on "all products" page */}
            {showCategoryFilter && categories && categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Kategori
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/produkter"
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      !currentCategory
                        ? "border-secondary bg-secondary/5 text-secondary font-medium"
                        : "border-stone-200 text-stone-500 hover:border-stone-300"
                    }`}
                  >
                    Alle
                  </Link>
                  {categories
                    .filter((c) => !c.parentId)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/kategorier/${cat.slug}`}
                        className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
            >
              Fjern alle filtre
            </button>
          )}
        </div>
      )}

      {/* Active filter chips — shown when panel is closed */}
      {!filtersOpen && hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activePriceRange && activePriceRange.label !== "Alle priser" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-stone-100 text-stone-600">
              {activePriceRange.label}
              <button
                onClick={() => setPriceRange(undefined, undefined)}
                className="hover:text-stone-900"
              >
                &times;
              </button>
            </span>
          )}
          {currentOnSale && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-red-50 text-red-600">
              Kun tilbud
              <button
                onClick={() => updateParam("tilbud", undefined)}
                className="hover:text-red-800"
              >
                &times;
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2"
          >
            Fjern alle
          </button>
        </div>
      )}
    </div>
  );
}
