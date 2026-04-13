import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getSessionFromRequest } from "~/lib/services/auth.server";
import { getOrderByNumber } from "~/lib/services/order.server";
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

export const meta: MetaFunction = () =>
  buildMeta({ title: "Ordredetaljer" });

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const sessionData = await getSessionFromRequest(request, context);

  if (!sessionData?.customer) {
    return redirect(`/konto/logg-inn?redirect=/konto/bestillinger/${params.id}`);
  }

  const db = getDb(context);
  const orderNumber = Number(params.id);

  if (isNaN(orderNumber)) {
    throw new Response("Ugyldig ordrenummer", { status: 400 });
  }

  const order = await getOrderByNumber(db, orderNumber);

  if (!order) {
    throw new Response("Bestilling ikke funnet", { status: 404 });
  }

  // Verify the order belongs to this customer
  if (order.customerId !== sessionData.customer.id) {
    throw new Response("Ingen tilgang", { status: 403 });
  }

  return json({ order });
}

export default function OrderDetailPage() {
  const { order } = useLoaderData<typeof loader>();
  const status = STATUS_LABELS[order.status || "pending"] || STATUS_LABELS.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/konto/bestillinger"
            className="text-sm text-muted hover:text-primary transition-colors mb-2 inline-block"
          >
            &larr; Tilbake til bestillinger
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            Bestilling #{order.orderNumber}
          </h1>
          <p className="text-muted text-sm mt-1">
            Bestilt {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order info */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Ordrestatus</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Status</span>
              <span className="font-medium">{status.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Kilde</span>
              <span className="font-medium">{order.source === "online" ? "Nettbutikk" : "Butikk"}</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Betaling</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Metode</span>
              <span className="font-medium">
                {order.paymentMethod === "invoice"
                  ? "Faktura"
                  : order.paymentMethod === "in_store"
                    ? "Betal i butikk"
                    : order.paymentMethod === "vipps"
                      ? "Vipps"
                      : order.paymentMethod || "Ikke angitt"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Betalingsstatus</span>
              <span className={`font-medium ${
                order.paymentStatus === "paid"
                  ? "text-emerald-600"
                  : order.paymentStatus === "partial"
                    ? "text-amber-600"
                    : "text-gray-500"
              }`}>
                {order.paymentStatus === "paid"
                  ? "Betalt"
                  : order.paymentStatus === "partial"
                    ? "Delvis betalt"
                    : order.paymentStatus === "refunded"
                      ? "Refundert"
                      : "Ubetalt"}
              </span>
            </div>
            {order.paidAmount ? (
              <div className="flex justify-between">
                <span className="text-muted">Betalt</span>
                <span className="font-medium">{formatPrice(order.paidAmount)}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Levering</h2>
          <div className="space-y-2 text-sm">
            {order.customer && (
              <>
                <p className="font-medium">{order.customer.name}</p>
                {order.customer.streetAddress && <p className="text-muted">{order.customer.streetAddress}</p>}
                {(order.customer.zipCode || order.customer.city) && (
                  <p className="text-muted">{order.customer.zipCode} {order.customer.city}</p>
                )}
              </>
            )}
            {order.trackingNumber && (
              <div className="mt-2 pt-2 border-t border-border">
                <span className="text-muted">Sporingsnummer:</span>
                <p className="font-mono font-medium">{order.trackingNumber}</p>
              </div>
            )}
            {order.deliveryInfo && (
              <div className="mt-2 pt-2 border-t border-border">
                <span className="text-muted">Leveringsnotater:</span>
                <p>{order.deliveryInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg">Produkter</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Produkt</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Antall</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Pris</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Sum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.productName}</p>
                    {item.productInfo && (
                      <p className="text-xs text-muted mt-0.5">{item.productInfo}</p>
                    )}
                    {item.fabric && (
                      <p className="text-xs text-muted">Stoff: {item.fabric}</p>
                    )}
                    {item.legs && (
                      <p className="text-xs text-muted">Ben: {item.legs}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatPrice(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(item.unitPrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {order.deliveryPrice ? (
                <tr className="border-t border-border">
                  <td colSpan={3} className="px-4 py-3 text-right text-muted">Frakt</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(order.deliveryPrice)}</td>
                </tr>
              ) : null}
              <tr className="border-t border-border bg-surface/50">
                <td colSpan={3} className="px-4 py-3 text-right font-bold">Totalt</td>
                <td className="px-4 py-3 text-right font-bold text-base">{formatPrice(order.totalPrice)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
