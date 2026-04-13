import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getAllOrders } from "~/lib/services/order.server";
import { formatPrice, formatDate } from "~/lib/utils/format";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Venter", className: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Bekreftet", className: "bg-blue-50 text-blue-700" },
  processing: { label: "Under behandling", className: "bg-amber-50 text-amber-700" },
  shipped: { label: "Sendt", className: "bg-purple-50 text-purple-700" },
  delivered: { label: "Levert", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Kansellert", className: "bg-red-50 text-red-700" },
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const orders = await getAllOrders(db);
  return json({ orders });
}

export default function AdminOrders() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bestillinger</h1>
          <p className="text-muted text-sm mt-1">{orders.length} bestillinger</p>
        </div>
        <Link
          to="/admin/kunder"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ny bestilling
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ordre #</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Kunde</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden md:table-cell">Betaling</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Beløp</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden lg:table-cell">Dato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const status = STATUS_LABELS[order.status || "pending"] || STATUS_LABELS.pending;
                return (
                  <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/bestillinger/${order.orderNumber}`}
                        className="font-mono font-medium text-accent hover:underline"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-xs text-muted">{order.customerPhone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.paymentStatus === "partial"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-500"
                      }`}>
                        {order.paymentStatus === "paid" ? "Betalt" : order.paymentStatus === "partial" ? "Delvis" : "Ubetalt"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden lg:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    Ingen bestillinger ennå
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
