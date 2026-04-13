import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getOrderStats } from "~/lib/services/order.server";
import { sql, eq, lt } from "drizzle-orm";
import { products, categories, customers } from "~/lib/db/schema";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);

  const staleDateThreshold = new Date(
    Date.now() - 180 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [orderStats, productCount, categoryCount, customerCount, staleProducts] =
    await Promise.all([
      getOrderStats(db),
      db.select({ c: sql<number>`count(*)` }).from(products).get(),
      db.select({ c: sql<number>`count(*)` }).from(categories).get(),
      db.select({ c: sql<number>`count(*)` }).from(customers).get(),
      db
        .select({ id: products.id, title: products.title, slug: products.slug, updatedAt: products.updatedAt })
        .from(products)
        .where(lt(products.updatedAt, staleDateThreshold))
        .limit(10)
        .all(),
    ]);

  return json({
    orderStats,
    productCount: productCount?.c ?? 0,
    categoryCount: categoryCount?.c ?? 0,
    customerCount: customerCount?.c ?? 0,
    staleProducts,
  });
}

export default function AdminDashboard() {
  const { orderStats, productCount, categoryCount, customerCount, staleProducts } =
    useLoaderData<typeof loader>();

  const statCards = [
    { label: "Produkter", value: productCount, href: "/admin/produkter", color: "bg-blue-50 text-blue-700" },
    { label: "Kategorier", value: categoryCount, href: "/admin/kategorier", color: "bg-purple-50 text-purple-700" },
    { label: "Bestillinger", value: orderStats.total, href: "/admin/bestillinger", color: "bg-amber-50 text-amber-700" },
    { label: "Kunder", value: customerCount, href: "/admin/kunder", color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Oversikt</h1>
        <p className="text-muted text-sm mt-1">Velkommen til administrasjonspanelet</p>
      </div>

      {/* Alert: Stale products */}
      {staleProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800">
                {staleProducts.length} produkt{staleProducts.length !== 1 ? "er" : ""} ikke oppdatert på 180+ dager
              </h3>
              <ul className="mt-2 space-y-1">
                {staleProducts.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/admin/produkter/${p.id}`}
                      className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {staleProducts.length > 5 && (
                <Link
                  to="/admin/produkter"
                  className="inline-block mt-2 text-sm text-amber-700 font-medium hover:text-amber-900"
                >
                  Se alle {staleProducts.length} &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-soft transition-shadow"
          >
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">
              {stat.label}
            </p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Bestillinger</h2>
          <Link
            to="/admin/bestillinger"
            className="text-sm text-secondary hover:text-secondary/80 font-medium"
          >
            Se alle &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orderStats.total}</p>
            <p className="text-xs text-muted mt-1">Totalt</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{orderStats.pending}</p>
            <p className="text-xs text-amber-600 mt-1">Aktive</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{orderStats.completed}</p>
            <p className="text-xs text-emerald-600 mt-1">Fullførte</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/admin/produkter/ny", label: "Nytt produkt", desc: "Legg til et nytt produkt i butikken", icon: "M12 4.5v15m7.5-7.5h-15" },
          { href: "/admin/kategorier/ny", label: "Ny kategori", desc: "Opprett en ny produktkategori", icon: "M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" },
          { href: "/admin/innhold", label: "Rediger innhold", desc: "Oppdater tekst på forsiden og bunntekst", icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" },
        ].map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-soft hover:border-secondary/30 transition-all group"
          >
            <div className="w-10 h-10 bg-surface-warm rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/10 transition-colors">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">{action.label}</h3>
            <p className="text-xs text-muted mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
