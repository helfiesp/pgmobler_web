import {
  json,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, Link, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { createCustomerManual } from "~/lib/services/customer.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();

  const name = form.get("name") as string;
  if (!name) return json({ error: "Navn er påkrevd" }, { status: 400 });

  const customer = await createCustomerManual(db, {
    name,
    email: (form.get("email") as string) || undefined,
    phone: (form.get("phone") as string) || undefined,
    streetAddress: (form.get("streetAddress") as string) || undefined,
    zipCode: (form.get("zipCode") as string) || undefined,
    city: (form.get("city") as string) || undefined,
  });

  return redirect(`/admin/kunder/${customer.id}`);
}

export default function AdminNewCustomer() {
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/admin/kunder" className="text-sm text-muted hover:text-primary transition-colors">
          &larr; Tilbake til kunder
        </Link>
        <h1 className="text-2xl font-bold mt-1">Ny kunde</h1>
        <p className="text-muted text-sm mt-1">Registrer en ny kunde manuelt</p>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Navn *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Fullt navn"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              E-post
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="epost@eksempel.no"
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
              placeholder="f.eks. 912 34 567"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Gateadresse
          </label>
          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            placeholder="Storgata 1"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Postnummer
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              placeholder="0000"
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
              placeholder="Oslo"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Opprett kunde"}
          </button>
        </div>
      </Form>
    </div>
  );
}
