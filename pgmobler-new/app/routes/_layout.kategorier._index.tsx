import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCategoriesWithChildren } from "~/lib/services/category.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () => {
  return buildMeta({
    title: "Kategorier",
    description: "Bla gjennom våre møbelkategorier.",
  });
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const categories = await getCategoriesWithChildren(db);
  return json({ categories });
}

export default function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();

  // Separate parent categories from standalone ones
  const parents = categories.filter((c) => c.children && c.children.length > 0);
  const standalone = categories.filter(
    (c) => (!c.children || c.children.length === 0) && !c.parentId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Kategorier</h1>
      <p className="text-stone-400 mb-10">
        Finn møblene du trenger — organisert etter rom og type
      </p>

      {/* Parent categories with subcategories */}
      <div className="space-y-12">
        {parents.map((parent) => (
          <div key={parent.id}>
            {/* Parent header with image */}
            <Link
              to={`/kategorier/${parent.slug}`}
              className="group block relative aspect-[3/1] sm:aspect-[4/1] rounded-2xl overflow-hidden bg-stone-100 mb-5"
            >
              {parent.imageUrl && (
                <img
                  src={parent.imageUrl}
                  alt={parent.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 md:px-10">
                <div>
                  <h2 className="text-white text-2xl md:text-3xl font-bold">
                    {parent.name}
                  </h2>
                  <span className="text-white/60 text-sm mt-1">
                    {parent.children.length} underkategorier
                  </span>
                </div>
              </div>
            </Link>

            {/* Subcategory grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {parent.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/kategorier/${child.slug}`}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100"
                >
                  {child.imageUrl ? (
                    <img
                      src={child.imageUrl}
                      alt={child.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                      <span className="text-stone-300 text-sm">{child.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <span className="text-white text-sm font-medium">
                      {child.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Standalone categories (no children, like Hyttemøbler) */}
      {standalone.length > 0 && (
        <div className="mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {standalone.map((cat) => (
              <Link
                key={cat.id}
                to={`/kategorier/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100"
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <span className="text-white text-sm font-medium">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
