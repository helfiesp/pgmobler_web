import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import {
  getCustomerById,
  getCustomerOrders,
  updateCustomer,
} from "~/lib/services/customer.server";
import { formatPrice, formatDate } from "~/lib/utils/format";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Venter", className: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Bekreftet", className: "bg-blue-50 text-blue-700" },
  processing: { label: "Under behandling", className: "bg-amber-50 text-amber-700" },
  shipped: { label: "Sendt", className: "bg-purple-50 text-purple-700" },
  delivered: { label: "Levert", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Kansellert", className: "bg-red-50 text-red-700" },
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);

  const customer = await getCustomerById(db, id);
  if (!customer) {
    throw json({ message: "Kunde ikke funnet" }, { status: 404 });
  }

  const orders = await getCustomerOrders(db, id);

  return json({ customer, orders });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "update") {
    const name = form.get("name") as string;
    if (!name) return json({ error: "Navn er påkrevd" }, { status: 400 });

    await updateCustomer(db, id, {
      name,
      email: (form.get("email") as string) || undefined,
      phone: (form.get("phone") as string) || undefined,
      streetAddress: (form.get("streetAddress") as string) || undefined,
      zipCode: (form.get("zipCode") as string) || undefined,
      city: (form.get("city") as string) || undefined,
    });

    return json({ ok: true });
  }

  return json({ error: "Ukjent handling" }, { status: 400 });
}

export default function AdminCustomerDetail() {
  const { customer, orders } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/kunder" className="text-sm text-muted hover:text-primary transition-colors">
            &larr; Tilbake til kunder
          </Link>
          <h1 className="text-2xl font-bold mt-1">{customer.name}</h1>
          <p className="text-muted text-sm mt-1">Kunde siden {formatDate(customer.createdAt)}</p>
        </div>
        <Link
          to={`/admin/bestillinger/ny/${customer.id}`}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ny bestilling
        </Link>
      </div>

      {/* Customer form */}
      <Form method="post" className="bg-white rounded-xl border border-border divide-y divide-border">
        <input type="hidden" name="intent" value="update" />

        <div className="p-6 space-y-4">
          <h2 className="font-bold">Kundeinformasjon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Navn *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                defaultValue={customer.name}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                E-post
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={customer.email ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                defaultValue={customer.phone ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="streetAddress" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Gateadresse
              </label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                defaultValue={customer.streetAddress ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Postnummer
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                defaultValue={customer.zipCode ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Sted
              </label>
              <input
                type="text"
                name="city"
                id="city"
                defaultValue={customer.city ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </div>
      </Form>

      {/* Order history */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold">Bestillingshistorikk</h2>
          <span className="text-xs text-muted">{orders.length} bestillinger</span>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ordre #</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Beløp</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted hidden md:table-cell">Dato</th>
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            Ingen bestillinger registrert for denne kunden
          </div>
        )}
      </div>
    </div>
  );
}
