import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
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

export const meta: MetaFunction = () =>
  buildMeta({ title: "Min konto" });

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionData = await getSessionFromRequest(request, context);

  if (!sessionData?.customer) {
    return redirect("/konto/logg-inn");
  }

  const db = getDb(context);
  const orders = await getCustomerOrders(db, sessionData.customer.id);

  return json({
    customer: sessionData.customer,
    recentOrders: orders.slice(0, 5),
    totalOrders: orders.length,
  });
}

export default function AccountDashboardPage() {
  const { customer, recentOrders, totalOrders } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Min konto</h1>
          <p className="text-muted text-sm mt-1">Velkommen tilbake, {customer.name}!</p>
        </div>
        <Form method="post" action="/konto/logg-ut">
          <button
            type="submit"
            className="border border-border text-sm px-4 py-2 rounded-lg hover:bg-surface transition-colors font-medium"
          >
            Logg ut
          </button>
        </Form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Profil</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Navn</span>
              <p className="font-medium">{customer.name}</p>
            </div>
            {customer.email && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">E-post</span>
                <p className="font-medium">{customer.email}</p>
              </div>
            )}
            {customer.phone && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Telefon</span>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
            {customer.streetAddress && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Adresse</span>
                <p className="font-medium">
                  {customer.streetAddress}
                  {(customer.zipCode || customer.city) && (
                    <>, {customer.zipCode} {customer.city}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Oversikt</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted">Totalt antall bestillinger</span>
              <span className="text-sm font-bold">{totalOrders}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted">Kunde siden</span>
              <span className="text-sm font-medium">{formatDate(customer.createdAt)}</span>
            </div>
          </div>
          <Link
            to="/konto/bestillinger"
            className="block w-full mt-4 text-center border border-border py-2.5 rounded-lg text-sm font-medium hover:bg-surface transition-colors"
          >
            Se alle bestillinger
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg">Siste bestillinger</h2>
          {totalOrders > 5 && (
            <Link to="/konto/bestillinger" className="text-sm text-secondary hover:text-secondary/80 font-medium">
              Se alle
            </Link>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Ordre #</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Dato</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Beløp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const status = STATUS_LABELS[order.status || "pending"] || STATUS_LABELS.pending;
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
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(order.totalPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-muted">
            <p className="mb-4">Du har ingen bestillinger ennå.</p>
            <Link
              to="/produkter"
              className="inline-block bg-primary text-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
            >
              Se produkter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
