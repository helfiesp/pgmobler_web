import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCategoriesWithChildren } from "~/lib/services/category.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const categories = await getCategoriesWithChildren(db);
  return json({ categories });
}

export default function AdminCategories() {
  const { categories } = useLoaderData<typeof loader>();
  const totalSubs = categories.reduce((n, c) => n + (c.children?.length ?? 0), 0);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategorier</h1>
          <p className="text-stone-400 text-sm mt-1">
            {categories.length} hovedkategorier, {totalSubs} underkategorier
          </p>
        </div>
        <Link
          to="/admin/kategorier/ny"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ny kategori
        </Link>
      </div>

      {/* Category grid */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id}>
            {/* Parent category card */}
            <Link
              to={`/admin/kategorier/${cat.id}`}
              className="group flex items-center gap-5 bg-white rounded-xl border border-stone-200 p-4 hover:border-stone-300 transition-colors"
            >
              {/* Image */}
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm group-hover:text-secondary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  /{cat.slug}
                  {cat.children.length > 0 && (
                    <span> &middot; {cat.children.length} underkategorier</span>
                  )}
                </p>
              </div>

              {/* Edit icon */}
              <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>

            {/* Subcategories */}
            {cat.children.length > 0 && (
              <div className="ml-8 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {cat.children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/admin/kategorier/${child.id}`}
                    className="group flex items-center gap-3 bg-stone-50 rounded-lg p-3 hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-stone-200 flex-shrink-0">
                      {child.imageUrl ? (
                        <img
                          src={child.imageUrl}
                          alt={child.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] text-stone-400">
                            {child.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors truncate">
                      {child.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            Ingen kategorier opprettet ennå
          </div>
        )}
      </div>
    </div>
  );
}
