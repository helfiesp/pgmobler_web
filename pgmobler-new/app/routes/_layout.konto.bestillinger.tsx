import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getSessionFromRequest } from "~/lib/services/auth.server";
import { getCustomerOrders } from "~/lib/services/customer.server";
import { formatPrice, formatDate } from "~/lib/utils/format";
import { buildMeta } from "~/lib/utils/seo";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Venter", className: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Bekreftet", className: "bg-blue-50 text-blue-700" },
  processing: { label: "Under behandling", className: "bg-amber-50 text-amber-700" },
  shipped: { label: "Sendt", className: "bg-purple-50 text-purple-700" },
  delivered: { label: "Levert", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Kansellert", className: "bg-red-50 text-red-700" },
};

const PAYMENT_LABELS: Record<string, string> = {
  paid: "Betalt",
  partial: "Delvis betalt",
  unpaid: "Ubetalt",
  refunded: "Refundert",
};

export const meta: MetaFunction = () =>
  buildMeta({ title: "Mine bestillinger" });

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionData = await getSessionFromRequest(request, context);

  if (!sessionData?.customer) {
    return redirect("/konto/logg-inn?redirect=/konto/bestillinger");
  }

  const db = getDb(context);
  const orders = await getCustomerOrders(db, sessionData.customer.id);

  return json({ orders });
}

export default function OrderHistoryPage() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mine bestillinger</h1>
          <p className="text-muted text-sm mt-1">{orders.length} bestillinger totalt</p>
        </div>
        <Link
          to="/konto"
          className="text-sm text-secondary hover:text-secondary/80 font-medium"
        >
          Tilbake til konto
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ordre #</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Dato</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden md:table-cell">Betaling</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Beløp</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const status = STATUS_LABELS[order.status || "pending"] || STATUS_LABELS.pending;
                  const payment = PAYMENT_LABELS[order.paymentStatus || "unpaid"] || "Ubetalt";
                  return (
                    <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          to={`/konto/bestillinger/${order.orderNumber}`}
                          className="font-mono font-medium text-accent hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
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
                          {payment}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(order.totalPrice)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/konto/bestillinger/${order.orderNumber}`}
                          className="text-xs text-secondary hover:text-secondary/80 font-medium"
                        >
                          Vis detaljer
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          <h2 className="text-lg font-bold mb-2">Ingen bestillinger</h2>
          <p className="text-muted mb-6">Du har ingen bestillinger ennå.</p>
          <Link
            to="/produkter"
            className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se produkter
          </Link>
        </div>
      )}
    </div>
  );
}
