import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { authenticateCustomer } from "~/lib/services/customer.server";
import { createSession, createSessionCookie, getSessionFromRequest } from "~/lib/services/auth.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Logg inn" });

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
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/konto");

  if (!email || !password) {
    return json(
      { error: "Vennligst fyll inn e-post og passord." },
      { status: 400 }
    );
  }

  const customer = await authenticateCustomer(db, email, password);

  if (!customer) {
    return json(
      { error: "Feil e-post eller passord. Vennligst prøv igjen." },
      { status: 401 }
    );
  }

  const sessionId = await createSession(db, customer.id);
  const cookie = createSessionCookie(sessionId);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": cookie },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/konto";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Logg inn</h1>
          <p className="text-muted text-sm mt-2">
            Logg inn med din konto
          </p>
        </div>

        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

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
              autoComplete="email"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="din@epost.no"
            />
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
              autoComplete="current-password"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Logg inn
          </button>
        </Form>

        <div className="mt-6 text-center text-sm text-muted">
          <p>
            Har du ikke en konto?{" "}
            <Link
              to="/konto/registrer"
              className="text-secondary hover:text-secondary/80 font-medium"
            >
              Registrer deg
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
