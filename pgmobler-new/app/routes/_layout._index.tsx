import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import {
  getRecentProducts,
  getBestsellers,
} from "~/lib/services/product.server";
import { getTopLevelCategories } from "~/lib/services/category.server";
import { getCmsBySection } from "~/lib/services/cms.server";
import { ProductGrid } from "~/components/product/ProductGrid";
import { EditableText } from "~/components/admin/EditableText";
import { InstagramFeed } from "~/components/layout/InstagramFeed";
import { getVisiblePosts } from "~/lib/services/instagram.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () => {
  return buildMeta({
    title: "PG Møbler",
    description:
      "Din møbelbutikk i Stavanger. Stort utvalg av kvalitetsmøbler til stue, spisestue og soverom.",
  });
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);

  const [recentProducts, bestsellers, topCategories, pageCms, instagramPosts] =
    await Promise.all([
      getRecentProducts(db, 8),
      getBestsellers(db, 4),
      getTopLevelCategories(db),
      getCmsBySection(db, "page"),
      getVisiblePosts(db, 8),
    ]);

  return json({ recentProducts, bestsellers, topCategories, cms: pageCms, instagramPosts });
}

export default function Index() {
  const { recentProducts, bestsellers, topCategories, cms, instagramPosts } =
    useLoaderData<typeof loader>();
  const { editMode } = useOutletContext<{ editMode: boolean }>();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-black" />
        {/* Decorative grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <EditableText
              cmsKey="front_page_header"
              value={cms.front_page_header || "Tidløse møbler for ditt hjem"}
              editMode={editMode}
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            />
            <EditableText
              cmsKey="front_page_subtitle"
              value={
                cms.front_page_subtitle ||
                "Håndplukkede kvalitetsmøbler fra Skandinavias beste produsenter. Besøk vår butikk i Stavanger."
              }
              editMode={editMode}
              as="p"
              className="mt-6 text-lg md:text-xl text-stone-300 leading-relaxed max-w-lg"
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/produkter"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                {cms.front_page_button_text || "Se alle produkter"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/kategorier"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Kategorier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section — clean, spacious cards */}
      {topCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-3">
            Møbler for hele hjemmet
          </h2>
          <p className="text-center text-stone-400 mb-12 max-w-md mx-auto">
            Utforsk vårt sortiment — fra stue og spisestue til soverom
          </p>

          {/* 3-column grid, large images, minimal overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {topCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/kategorier/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100"
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
                {/* Gentle bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-white text-base md:text-lg font-semibold tracking-wide">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* "See all" link */}
          <div className="text-center mt-8">
            <Link
              to="/kategorier"
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              Se alle kategorier
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="bg-surface-warm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <EditableText
                  cmsKey="bestseller_header"
                  value={cms.bestseller_header || "Bestselgere"}
                  editMode={editMode}
                  as="h2"
                  className="text-2xl md:text-3xl font-bold"
                />
                <EditableText
                  cmsKey="bestseller_text"
                  value={cms.bestseller_text || "Våre mest populære møbler"}
                  editMode={editMode}
                  as="p"
                  className="text-muted mt-1"
                />
              </div>
              <Link
                to="/produkter?sortering=most_discounted"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                Se alle
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <ProductGrid products={bestsellers} columns={4} />
          </div>
        </section>
      )}

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <EditableText
                cmsKey="recent_product_header"
                value={cms.recent_product_header || "Nytt i butikken"}
                editMode={editMode}
                as="h2"
                className="text-2xl md:text-3xl font-bold"
              />
              <EditableText
                cmsKey="recent_product_text"
                value={cms.recent_product_text || "Siste tilskudd i sortimentet"}
                editMode={editMode}
                as="p"
                className="text-muted mt-1"
              />
            </div>
            <Link
              to="/produkter"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
            >
              Se alle
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={recentProducts} columns={4} />
        </section>
      )}

      {/* Instagram Feed */}
      <InstagramFeed posts={instagramPosts} />

      {/* Trust bar */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.008v-.008h.008v.008zm0 0V3.375m0 0h17.25m0 0v10.875",
                title: "Levering til hele Norge",
                desc: "Vi leverer møbler til hele landet",
              },
              {
                icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
                title: "Kvalitetsgaranti",
                desc: "Kun anerkjente leverandører",
              },
              {
                icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
                title: "Personlig rådgivning",
                desc: "Ring oss eller besøk butikken",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface-warm flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
