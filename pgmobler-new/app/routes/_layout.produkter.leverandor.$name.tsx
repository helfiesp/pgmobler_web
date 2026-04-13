import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getDb } from "~/lib/services/db.server";
import { suppliers } from "~/lib/db/schema";
import { getProducts, type SortOption } from "~/lib/services/product.server";
import { ProductGrid } from "~/components/product/ProductGrid";
import { Pagination } from "~/components/ui/Pagination";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.supplier) return buildMeta({ title: "Leverandør ikke funnet" });
  return buildMeta({
    title: data.supplier.name,
    description: `Se produkter fra ${data.supplier.name}.`,
  });
};

const PER_PAGE = 20;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const supplier = await db
    .select()
    .from(suppliers)
    .where(eq(suppliers.slug, params.name!))
    .get();

  if (!supplier) {
    throw json({ message: "Leverandør ikke funnet" }, { status: 404 });
  }

  const url = new URL(request.url);
  const sort =
    (url.searchParams.get("sortering") as SortOption) || "newly_added";
  const page = Number(url.searchParams.get("side")) || 1;

  const { products, total } = await getProducts(db, {
    supplierId: supplier.id,
    page,
    perPage: PER_PAGE,
    sort,
  });

  return json({
    supplier,
    products,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
    currentPage: page,
    sort,
  });
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newly_added", label: "Nyheter" },
  { value: "price_low_high", label: "Pris lav-høy" },
  { value: "price_high_low", label: "Pris høy-lav" },
  { value: "name_a_z", label: "Navn A-Å" },
  { value: "name_z_a", label: "Navn Å-A" },
];

export default function SupplierPage() {
  const { supplier, products, total, totalPages, currentPage, sort } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  function updateSort(newSort: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sortering", newSort);
    params.delete("side");
    setSearchParams(params);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{supplier.name}</h1>
        <p className="text-muted mt-1">{total} produkter</p>
      </div>

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs text-muted uppercase tracking-wider">
            Sortering:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid products={products} columns={4} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
