import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getOrderByNumber } from "~/lib/services/order.server";
import { formatPrice } from "~/lib/utils/format";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Ordrebekreftelse", description: "Takk for din bestilling hos PG Møbler" });

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const orderNumber = Number(params.id);

  if (isNaN(orderNumber)) {
    throw new Response("Ugyldig ordrenummer", { status: 400 });
  }

  const order = await getOrderByNumber(db, orderNumber);

  if (!order) {
    throw new Response("Bestilling ikke funnet", { status: 404 });
  }

  return json({ order });
}

export default function OrderConfirmationPage() {
  const { order } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      {/* Success banner */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Takk for din bestilling!</h1>
        <p className="text-muted">
          Din bestilling er mottatt og vil bli behandlet snarest.
        </p>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Ordredetaljer</h2>
          <span className="font-mono text-sm text-muted">#{order.orderNumber}</span>
        </div>

        <div className="space-y-3 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{item.productName}</p>
                {item.productInfo && (
                  <p className="text-xs text-muted">{item.productInfo}</p>
                )}
                <p className="text-xs text-muted">Antall: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-base">
            <span className="font-bold">Totalt</span>
            <span className="font-bold">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Customer info */}
      {order.customer && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-bold text-lg mb-3">Leveringsadresse</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">{order.customer.name}</p>
            {order.customer.streetAddress && <p>{order.customer.streetAddress}</p>}
            {(order.customer.zipCode || order.customer.city) && (
              <p>{order.customer.zipCode} {order.customer.city}</p>
            )}
            {order.customer.email && <p>{order.customer.email}</p>}
            {order.customer.phone && <p>{order.customer.phone}</p>}
          </div>
        </div>
      )}

      {/* Payment info */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <h2 className="font-bold text-lg mb-3">Betalingsinformasjon</h2>
        <div className="text-sm text-gray-700">
          <p>
            <span className="text-muted">Betalingsmetode:</span>{" "}
            <span className="font-medium">
              {order.paymentMethod === "invoice" ? "Faktura" : order.paymentMethod === "in_store" ? "Betal i butikk" : order.paymentMethod}
            </span>
          </p>
          <p className="mt-1">
            <span className="text-muted">Betalingsstatus:</span>{" "}
            <span className="font-medium">
              {order.paymentStatus === "paid" ? "Betalt" : order.paymentStatus === "partial" ? "Delvis betalt" : "Venter på betaling"}
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors text-center"
        >
          Tilbake til forsiden
        </Link>
        <Link
          to="/konto/bestillinger"
          className="inline-block border border-border text-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-surface transition-colors text-center"
        >
          Mine bestillinger
        </Link>
      </div>
    </div>
  );
}
