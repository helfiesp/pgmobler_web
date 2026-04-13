import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getProducts, type SortOption } from "~/lib/services/product.server";
import { getAllCategories } from "~/lib/services/category.server";
import { ProductGrid } from "~/components/product/ProductGrid";
import { ProductFilters } from "~/components/product/ProductFilters";
import { Pagination } from "~/components/ui/Pagination";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    title: "Alle produkter",
    description: "Se hele vårt utvalg av kvalitetsmøbler.",
  });

const PER_PAGE = 24;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const url = new URL(request.url);

  const search = url.searchParams.get("q") || undefined;
  const sort = (url.searchParams.get("sortering") as SortOption) || "newly_added";
  const page = Number(url.searchParams.get("side")) || 1;
  const priceMin = url.searchParams.get("pris_min") ? Number(url.searchParams.get("pris_min")) : undefined;
  const priceMax = url.searchParams.get("pris_max") ? Number(url.searchParams.get("pris_max")) : undefined;
  const onSale = url.searchParams.get("tilbud") === "1";

  const [{ products, total }, allCategories] = await Promise.all([
    getProducts(db, { page, perPage: PER_PAGE, sort, search, priceMin, priceMax, onSale: onSale || undefined }),
    getAllCategories(db),
  ]);

  return json({
    products,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
    currentPage: page,
    sort,
    search: search ?? "",
    categories: allCategories,
  });
}

export default function ProductsPage() {
  const { products, total, totalPages, currentPage, sort, search, categories } =
    useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        {search ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold">Søkeresultater</h1>
            <p className="text-stone-400 mt-1">
              {total} treff for &ldquo;{search}&rdquo;
            </p>
          </>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold">Alle produkter</h1>
        )}
      </div>

      {/* Filters */}
      <ProductFilters
        sort={sort}
        total={total}
        categories={categories}
        showCategoryFilter
      />

      {/* Grid */}
      <div className="mt-8">
        <ProductGrid products={products} columns={4} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
