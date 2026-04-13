import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, Link, useActionData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { createCustomer } from "~/lib/services/customer.server";
import { createSession, createSessionCookie, getSessionFromRequest } from "~/lib/services/auth.server";
import { customers } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Registrer deg", description: "Opprett en konto hos PG Møbler" });

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionData = await getSessionFromRequest(request, context);
  if (sessionData?.customer) {
    return redirect("/konto");
  }
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const formData = await request.formData();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Navn er påkrevd";
  if (!email) errors.email = "E-post er påkrevd";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Ugyldig e-postadresse";
  if (!password) errors.password = "Passord er påkrevd";
  else if (password.length < 6) errors.password = "Passordet må være minst 6 tegn";
  if (!confirmPassword) errors.confirmPassword = "Bekreft passordet";
  else if (password !== confirmPassword) errors.confirmPassword = "Passordene samsvarer ikke";

  if (Object.keys(errors).length > 0) {
    return json(
      { errors, values: { name, email, phone } },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.email, email.toLowerCase()))
    .get();

  if (existing) {
    return json(
      {
        errors: { email: "Denne e-postadressen er allerede registrert" },
        values: { name, email, phone },
      },
      { status: 400 }
    );
  }

  const customer = await createCustomer(db, {
    name,
    email,
    password,
    phone: phone || undefined,
  });

  // Auto-login
  const sessionId = await createSession(db, customer.id);
  const cookie = createSessionCookie(sessionId);

  return redirect("/konto", {
    headers: { "Set-Cookie": cookie },
  });
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>() as any;
  const errors: Record<string, string> = actionData?.errors ?? {};
  const values: Record<string, string> = actionData?.values ?? {};

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Opprett konto</h1>
          <p className="text-muted text-sm mt-2">
            Registrer deg for å handle hos PG Møbler
          </p>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Fullt navn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={values.name ?? ""}
              autoComplete="name"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="Ola Nordmann"
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={values.email ?? ""}
              autoComplete="email"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="din@epost.no"
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Passord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="Minst 6 tegn"
            />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Bekreft passord
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              autoComplete="new-password"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="Gjenta passordet"
            />
            {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Telefon <span className="font-normal normal-case tracking-normal">(valgfritt)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={values.phone ?? ""}
              autoComplete="tel"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="900 00 000"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Opprett konto
          </button>
        </Form>

        <div className="mt-6 text-center text-sm text-muted">
          <p>
            Har du allerede en konto?{" "}
            <Link
              to="/konto/logg-inn"
              className="text-secondary hover:text-secondary/80 font-medium"
            >
              Logg inn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
