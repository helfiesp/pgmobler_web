import {
  json,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, Link, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { suppliers } from "~/lib/db/schema";
import { slugify } from "~/lib/utils/slugify";

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();

  const name = form.get("name") as string;
  if (!name) return json({ error: "Navn er påkrevd" }, { status: 400 });

  await db.insert(suppliers).values({
    name,
    slug: slugify(name),
  });

  return redirect("/admin/leverandorer");
}

export default function AdminNewSupplier() {
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/admin/leverandorer" className="text-sm text-muted hover:text-primary transition-colors">
          &larr; Tilbake til leverandører
        </Link>
        <h1 className="text-2xl font-bold mt-1">Ny leverandør</h1>
        <p className="text-muted text-sm mt-1">Legg til en ny leverandør</p>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Leverandørnavn *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="f.eks. Stressless"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Opprett leverandør"}
          </button>
        </div>
      </Form>
    </div>
  );
}
