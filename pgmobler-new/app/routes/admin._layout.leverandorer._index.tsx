import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { suppliers } from "~/lib/db/schema";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const allSuppliers = await db.select().from(suppliers).all();
  return json({ suppliers: allSuppliers });
}

export default function AdminSuppliers() {
  const { suppliers: supplierList } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leverandører</h1>
          <p className="text-muted text-sm mt-1">{supplierList.length} leverandører</p>
        </div>
        <Link
          to="/admin/leverandorer/ny"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ny leverandør
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {supplierList.map((supplier) => (
          <div key={supplier.id} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
            <div className="flex items-center gap-4">
              {supplier.imageUrl ? (
                <img
                  src={supplier.imageUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-surface"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm">{supplier.name}</h3>
                <p className="text-xs text-muted">/{supplier.slug}</p>
              </div>
            </div>
          </div>
        ))}
        {supplierList.length === 0 && (
          <div className="p-12 text-center text-muted">
            Ingen leverandører registrert ennå
          </div>
        )}
      </div>
    </div>
  );
}
