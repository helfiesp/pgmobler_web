import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getOrderByNumber } from "~/lib/services/order.server";
import { orders } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice, formatDate } from "~/lib/utils/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "Venter" },
  { value: "confirmed", label: "Bekreftet" },
  { value: "processing", label: "Under behandling" },
  { value: "shipped", label: "Sendt" },
  { value: "delivered", label: "Levert" },
  { value: "cancelled", label: "Kansellert" },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Venter", className: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Bekreftet", className: "bg-blue-50 text-blue-700" },
  processing: { label: "Under behandling", className: "bg-amber-50 text-amber-700" },
  shipped: { label: "Sendt", className: "bg-purple-50 text-purple-700" },
  delivered: { label: "Levert", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Kansellert", className: "bg-red-50 text-red-700" },
};

const PAYMENT_LABELS: Record<string, { label: string; className: string }> = {
  unpaid: { label: "Ubetalt", className: "bg-gray-100 text-gray-500" },
  partial: { label: "Delvis betalt", className: "bg-amber-50 text-amber-700" },
  paid: { label: "Betalt", className: "bg-emerald-50 text-emerald-700" },
  refunded: { label: "Refundert", className: "bg-red-50 text-red-700" },
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const orderNumber = Number(params.id);

  const order = await getOrderByNumber(db, orderNumber);
  if (!order) {
    throw json({ message: "Bestilling ikke funnet" }, { status: 404 });
  }

  return json({ order });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const orderNumber = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  const order = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .get();

  if (!order) {
    throw json({ message: "Bestilling ikke funnet" }, { status: 404 });
  }

  if (intent === "update-status") {
    const status = form.get("status") as string;
    await db.update(orders).set({ status }).where(eq(orders.id, order.id));
    return json({ ok: true });
  }

  if (intent === "toggle-complete") {
    const completed = form.get("completed") === "true";
    await db.update(orders).set({ completed }).where(eq(orders.id, order.id));
    return json({ ok: true });
  }

  if (intent === "update-payment") {
    const paidAmount = Number(form.get("paidAmount")) || 0;
    const totalPrice = Number(form.get("totalPrice")) || 0;
    const remainingAmount = Math.max(0, totalPrice - paidAmount);
    const paymentStatus = paidAmount >= totalPrice ? "paid" : paidAmount > 0 ? "partial" : "unpaid";

    await db
      .update(orders)
      .set({ paidAmount, remainingAmount, paymentStatus })
      .where(eq(orders.id, order.id));
    return json({ ok: true });
  }

  return json({ error: "Ukjent handling" }, { status: 400 });
}

export default function AdminOrderDetail() {
  const { order } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  const status = STATUS_LABELS[order.status || "pending"] || STATUS_LABELS.pending;
  const payment = PAYMENT_LABELS[order.paymentStatus || "unpaid"] || PAYMENT_LABELS.unpaid;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/bestillinger" className="text-sm text-muted hover:text-primary transition-colors">
            &larr; Tilbake til bestillinger
          </Link>
          <h1 className="text-2xl font-bold mt-1">Bestilling #{order.orderNumber}</h1>
          <p className="text-muted text-sm mt-1">Opprettet {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${payment.className}`}>
            {payment.label}
          </span>
          {order.completed && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Fullført
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          {order.customer && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-3">
              <h2 className="font-bold">Kundeinformasjon</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Navn</p>
                  <p className="mt-0.5">{order.customer.name}</p>
                </div>
                {order.customer.phone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Telefon</p>
                    <p className="mt-0.5">{order.customer.phone}</p>
                  </div>
                )}
                {order.customer.email && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">E-post</p>
                    <p className="mt-0.5">{order.customer.email}</p>
                  </div>
                )}
                {(order.customer.streetAddress || order.customer.zipCode || order.customer.city) && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Adresse</p>
                    <p className="mt-0.5">
                      {[order.customer.streetAddress, `${order.customer.zipCode ?? ""} ${order.customer.city ?? ""}`.trim()]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <Link
                  to={`/admin/kunder/${order.customer.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  Se kundeprofil
                </Link>
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold">Ordrelinjer</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Produkt</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Stoff</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ben</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ant.</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Enhetspris</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.productName}</p>
                        {item.productInfo && (
                          <p className="text-xs text-muted">{item.productInfo}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{item.fabric || "-"}</td>
                      <td className="px-4 py-3 text-muted">{item.legs || "-"}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-6 border-t border-border space-y-2">
              {order.deliveryInfo && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Leveringsinfo</span>
                  <span>{order.deliveryInfo}</span>
                </div>
              )}
              {(order.deliveryPrice ?? 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Frakt</span>
                  <span>{formatPrice(order.deliveryPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                <span>Totalt</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Betalt</span>
                <span className="text-emerald-600">{formatPrice(order.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Gjenstående</span>
                <span className="text-red-600">{formatPrice(order.remainingAmount)}</span>
              </div>
              {(order.depositAmount ?? 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Depositum</span>
                  <span>{formatPrice(order.depositAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Extra info */}
          {(order.extraInfo || order.salesman || order.source) && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-3">
              <h2 className="font-bold">Tilleggsinformasjon</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {order.salesman && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Selger</p>
                    <p className="mt-0.5">{order.salesman}</p>
                  </div>
                )}
                {order.source && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Kilde</p>
                    <p className="mt-0.5">{order.source === "in_store" ? "Butikk" : "Nettbutikk"}</p>
                  </div>
                )}
                {order.extraInfo && (
                  <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Ekstra info</p>
                    <p className="mt-0.5 whitespace-pre-wrap">{order.extraInfo}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="space-y-6">
          {/* Update status */}
          <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-bold">Ordrestatus</h2>
            <input type="hidden" name="intent" value="update-status" />
            <div>
              <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Status
              </label>
              <select
                name="status"
                id="status"
                defaultValue={order.status || "pending"}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Lagrer..." : "Oppdater status"}
            </button>
          </Form>

          {/* Toggle complete */}
          <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-bold">Fullføring</h2>
            <input type="hidden" name="intent" value="toggle-complete" />
            <input type="hidden" name="completed" value={order.completed ? "false" : "true"} />
            <p className="text-sm text-muted">
              {order.completed
                ? "Denne bestillingen er merket som fullført."
                : "Merk bestillingen som fullført når alt er levert og betalt."}
            </p>
            <button
              type="submit"
              disabled={saving}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                order.completed
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {order.completed ? "Merk som ufullført" : "Merk som fullført"}
            </button>
          </Form>

          {/* Update payment */}
          <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-bold">Betaling</h2>
            <input type="hidden" name="intent" value="update-payment" />
            <input type="hidden" name="totalPrice" value={order.totalPrice} />
            <div>
              <label htmlFor="paidAmount" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Betalt beløp (kr)
              </label>
              <input
                type="number"
                name="paidAmount"
                id="paidAmount"
                min="0"
                defaultValue={order.paidAmount ?? 0}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div className="text-sm text-muted space-y-1">
              <div className="flex justify-between">
                <span>Totalt</span>
                <span className="font-medium text-primary">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gjenstående</span>
                <span className="font-medium text-red-600">{formatPrice(order.remainingAmount)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Lagrer..." : "Oppdater betaling"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
