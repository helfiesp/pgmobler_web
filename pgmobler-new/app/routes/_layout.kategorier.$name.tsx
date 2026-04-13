import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import {
  getCategoryBySlug,
  getSubcategories,
} from "~/lib/services/category.server";
import { getProducts, type SortOption } from "~/lib/services/product.server";
import { ProductGrid } from "~/components/product/ProductGrid";
import { ProductFilters } from "~/components/product/ProductFilters";
import { Pagination } from "~/components/ui/Pagination";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.category) return buildMeta({ title: "Kategori ikke funnet" });
  return buildMeta({
    title: data.category.name,
    description: `Se vårt utvalg av ${data.category.name.toLowerCase()}.`,
  });
};

const PER_PAGE = 24;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const category = await getCategoryBySlug(db, params.name!);

  if (!category) {
    throw json({ message: "Kategori ikke funnet" }, { status: 404 });
  }

  const url = new URL(request.url);
  const sort = (url.searchParams.get("sortering") as SortOption) || "newly_added";
  const page = Number(url.searchParams.get("side")) || 1;
  const priceMin = url.searchParams.get("pris_min") ? Number(url.searchParams.get("pris_min")) : undefined;
  const priceMax = url.searchParams.get("pris_max") ? Number(url.searchParams.get("pris_max")) : undefined;
  const onSale = url.searchParams.get("tilbud") === "1";

  const subcategories = await getSubcategories(db, category.id);
  const categoryIds = [category.id, ...subcategories.map((s) => s.id)];

  const { products, total } = await getProducts(db, {
    categoryIds,
    page,
    perPage: PER_PAGE,
    sort,
    priceMin,
    priceMax,
    onSale: onSale || undefined,
  });

  return json({
    category,
    subcategories,
    products,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
    currentPage: page,
    sort,
  });
}

export default function CategoryPage() {
  const { category, subcategories, products, total, totalPages, currentPage, sort } =
    useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-400 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-stone-600 transition-colors">Hjem</Link>
          <span>/</span>
          <Link to="/kategorier" className="hover:text-stone-600 transition-colors">Kategorier</Link>
          <span>/</span>
          <span className="text-stone-700">{category.name}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
      </div>

      {/* Subcategory pills */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/kategorier/${sub.slug}`}
              className="px-4 py-2 text-sm rounded-full border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Filters */}
      <ProductFilters sort={sort} total={total} />

      {/* Grid */}
      <div className="mt-8">
        <ProductGrid products={products} columns={4} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
