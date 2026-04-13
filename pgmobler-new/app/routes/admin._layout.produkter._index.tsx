import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getProducts, type SortOption } from "~/lib/services/product.server";
import { formatPrice, formatDate } from "~/lib/utils/format";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || undefined;
  const page = Number(url.searchParams.get("side")) || 1;

  const { products, total } = await getProducts(db, {
    page,
    perPage: 25,
    sort: "newly_added",
    search,
    onlyEnabled: false,
  });

  return json({ products, total, currentPage: page, search: search ?? "" });
}

export default function AdminProducts() {
  const { products, total, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produkter</h1>
          <p className="text-muted text-sm mt-1">{total} produkter totalt</p>
        </div>
        <Link
          to="/admin/produkter/ny"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nytt produkt
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const q = form.get("q") as string;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            setSearchParams(params);
          }}
          className="flex gap-3"
        >
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Søk etter produkt..."
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-surface rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Søk
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Produkt</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Pris</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden lg:table-cell">Oppdatert</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-surface"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        {product.categoryName && (
                          <p className="text-xs text-muted">{product.categoryName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {product.salePrice ? (
                        <>
                          <p className="font-medium text-danger">{formatPrice(product.salePrice)}</p>
                          <p className="text-xs text-muted line-through">{formatPrice(product.price)}</p>
                        </>
                      ) : (
                        <p className="font-medium">{formatPrice(product.price)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        product.enabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.enabled ? "Aktiv" : "Deaktivert"}
                    </span>
                    {product.bestseller && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 ml-1">
                        Bestselger
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs hidden lg:table-cell">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/produkt/${product.slug}`}
                        className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-primary"
                        title="Vis på nettside"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                      <Link
                        to={`/admin/produkter/${product.id}`}
                        className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-primary"
                        title="Rediger"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted">
                    Ingen produkter funnet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
