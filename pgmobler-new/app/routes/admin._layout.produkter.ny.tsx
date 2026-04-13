import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { products, categories, suppliers } from "~/lib/db/schema";
import { slugify } from "~/lib/utils/slugify";
import { eq, sql } from "drizzle-orm";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const [allCategories, allSuppliers] = await Promise.all([
    db.select().from(categories).all(),
    db.select().from(suppliers).all(),
  ]);
  return json({ categories: allCategories, suppliers: allSuppliers });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();

  const title = form.get("title") as string;
  if (!title) return json({ error: "Tittel er påkrevd" }, { status: 400 });

  // Generate unique slug
  let slug = slugify(title);
  const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).get();
  if (existing) {
    const count = await db.select({ c: sql<number>`count(*)` }).from(products).where(sql`${products.slug} LIKE ${slug + "%"}`).get();
    slug = `${slug}-${(count?.c ?? 0) + 1}`;
  }

  const categoryId = form.get("categoryId") ? Number(form.get("categoryId")) : null;
  const supplierId = form.get("supplierId") ? Number(form.get("supplierId")) : null;
  const price = form.get("price") ? Number(form.get("price")) : null;
  const salePrice = form.get("salePrice") ? Number(form.get("salePrice")) : null;

  await db.insert(products).values({
    slug,
    title,
    subtitle: (form.get("subtitle") as string) || "",
    categoryId,
    description: (form.get("description") as string) || null,
    price,
    salePrice,
    material: (form.get("material") as string) || null,
    height: (form.get("height") as string) || null,
    width: (form.get("width") as string) || null,
    depth: (form.get("depth") as string) || null,
    supplierId,
    enabled: form.get("enabled") === "on",
    bestseller: form.get("bestseller") === "on",
    moreInformation: (form.get("moreInformation") as string) || null,
  });

  return redirect("/admin/produkter");
}

export default function AdminNewProduct() {
  const { categories: cats, suppliers: sups } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nytt produkt</h1>
        <p className="text-muted text-sm mt-1">Legg til et nytt produkt i butikken</p>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-border divide-y divide-border">
        {/* Basic info */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Grunnleggende</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Tittel *
              </label>
              <input type="text" name="title" id="title" required className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subtitle" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Undertittel
              </label>
              <input type="text" name="subtitle" id="subtitle" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Kategori
              </label>
              <select name="categoryId" id="categoryId" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
                <option value="">Ingen kategori</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="supplierId" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Leverandør
              </label>
              <select name="supplierId" id="supplierId" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
                <option value="">Ingen leverandør</option>
                {sups.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Pris</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Pris (kr)
              </label>
              <input type="number" name="price" id="price" min="0" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Tilbudspris (kr)
              </label>
              <input type="number" name="salePrice" id="salePrice" min="0" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Beskrivelse</h2>
          <textarea name="description" rows={4} placeholder="Produktbeskrivelse..." className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y" />
          <textarea name="moreInformation" rows={3} placeholder="Mer informasjon..." className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y" />
        </div>

        {/* Dimensions */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Detaljer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["material", "height", "width", "depth"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  {{material: "Materiale", height: "Høyde", width: "Bredde", depth: "Dybde"}[field]}
                </label>
                <input type="text" name={field} id={field} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
              </div>
            ))}
          </div>
        </div>

        {/* Toggles + Submit */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="enabled" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/20" />
              <span className="text-sm">Aktiv</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="bestseller" className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/20" />
              <span className="text-sm">Bestselger</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Opprett produkt"}
          </button>
        </div>
      </Form>
    </div>
  );
}
