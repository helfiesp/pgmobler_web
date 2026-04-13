import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { categories } from "~/lib/db/schema";
import { slugify } from "~/lib/utils/slugify";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const allCategories = await db.select().from(categories).all();
  return json({ categories: allCategories.filter((c) => !c.parentId) });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();

  const name = form.get("name") as string;
  if (!name) return json({ error: "Navn er påkrevd" }, { status: 400 });

  const parentId = form.get("parentId") ? Number(form.get("parentId")) : null;

  await db.insert(categories).values({
    name,
    slug: slugify(name),
    parentId,
  });

  return redirect("/admin/kategorier");
}

export default function AdminNewCategory() {
  const { categories: parentCats } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ny kategori</h1>
        <p className="text-muted text-sm mt-1">Opprett en ny produktkategori</p>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Kategorinavn *
          </label>
          <input type="text" name="name" id="name" required className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" placeholder="f.eks. Spisestoler" />
        </div>

        <div>
          <label htmlFor="parentId" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Overordnet kategori (valgfritt)
          </label>
          <select name="parentId" id="parentId" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
            <option value="">Ingen (hovedkategori)</option>
            {parentCats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Opprett kategori"}
          </button>
        </div>
      </Form>
    </div>
  );
}
