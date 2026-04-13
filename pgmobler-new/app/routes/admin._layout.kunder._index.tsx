import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { customers } from "~/lib/db/schema";
import { like, or, desc } from "drizzle-orm";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const url = new URL(request.url);
  const search = url.searchParams.get("q");

  let query = db.select().from(customers).orderBy(desc(customers.createdAt));

  if (search) {
    const term = `%${search}%`;
    query = query.where(
      or(
        like(customers.name, term),
        like(customers.email, term),
        like(customers.phone, term)
      )
    ) as typeof query;
  }

  const rows = await query.limit(50).all();

  return json({ customers: rows, search: search ?? "" });
}

export default function AdminCustomers() {
  const { customers: customerList, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kunder</h1>
          <p className="text-muted text-sm mt-1">{customerList.length} kunder</p>
        </div>
        <Link
          to="/admin/kunder/ny"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ny kunde
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const q = form.get("q") as string;
            setSearchParams(q ? { q } : {});
          }}
          className="flex gap-3"
        >
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Søk etter navn, e-post eller telefon..."
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
          <button type="submit" className="px-4 py-2 bg-surface rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Søk
          </button>
        </form>
      </div>

      {/* Customer list */}
      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {customerList.map((c) => (
          <Link
            key={c.id}
            to={`/admin/kunder/${c.id}`}
            className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                <span className="text-sm font-semibold text-muted">
                  {c.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted">
                  {[c.email, c.phone].filter(Boolean).join(" · ") || "Ingen kontaktinfo"}
                </p>
              </div>
            </div>
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
        {customerList.length === 0 && (
          <div className="p-12 text-center text-muted">
            {search ? "Ingen kunder funnet" : "Ingen kunder registrert ennå"}
          </div>
        )}
      </div>
    </div>
  );
}
