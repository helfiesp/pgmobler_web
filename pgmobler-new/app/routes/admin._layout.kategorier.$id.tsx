import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getDb } from "~/lib/services/db.server";
import { categories } from "~/lib/db/schema";
import { slugify } from "~/lib/utils/slugify";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .get();

  if (!category) {
    throw json({ message: "Kategori ikke funnet" }, { status: 404 });
  }

  const allCategories = await db.select().from(categories).all();
  const parentOptions = allCategories.filter(
    (c) => !c.parentId && c.id !== id
  );

  return json({ category, parentOptions });
}

export async function action({ params, request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "delete") {
    await db.delete(categories).where(eq(categories.id, id));
    return redirect("/admin/kategorier");
  }

  const name = form.get("name") as string;
  if (!name) return json({ error: "Navn er påkrevd" }, { status: 400 });

  const parentId = form.get("parentId") ? Number(form.get("parentId")) : null;
  const imageUrl = (form.get("imageUrl") as string) || null;

  await db
    .update(categories)
    .set({
      name,
      slug: slugify(name),
      parentId,
      imageUrl,
      imageKey: imageUrl ? imageUrl.replace("/media/", "") : null,
    })
    .where(eq(categories.id, id));

  return json({ success: true });
}

export default function AdminEditCategory() {
  const { category, parentOptions } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/kategorier"
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            &larr; Tilbake til kategorier
          </Link>
          <h1 className="text-2xl font-bold mt-1">Rediger: {category.name}</h1>
        </div>
        <Link
          to={`/kategorier/${category.slug}`}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Vis på nettside &rarr;
        </Link>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {/* Basic info */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Grunnleggende</h2>

          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5"
            >
              Kategorinavn
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={category.name}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="parentId"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5"
            >
              Overordnet kategori
            </label>
            <select
              name="parentId"
              id="parentId"
              defaultValue={category.parentId ?? ""}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              <option value="">Ingen (hovedkategori)</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category image */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Bilde</h2>
          <p className="text-sm text-stone-400">
            Bildet vises på kategorisiden og forsiden. Bruk et representativt produktbilde.
          </p>

          {/* Current image preview */}
          {category.imageUrl && (
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Image URL input — simple approach for now */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5"
            >
              Bilde-URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              defaultValue={category.imageUrl ?? ""}
              placeholder="/media/category_images/eksempel.jpg"
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
            <p className="text-xs text-stone-400 mt-1.5">
              Skriv inn bildeadressen, f.eks. /media/category_images/bilde.jpg
            </p>
          </div>

          {/* Quick-pick: use a product image from this category */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Eller bruk et produktbilde fra kategorien
            </p>
            <QuickPickImages categorySlug={category.slug} />
          </div>
        </div>

        {/* Save */}
        <div className="p-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </div>
      </Form>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-bold text-red-600 mb-2">Faresone</h2>
        <p className="text-sm text-stone-500 mb-4">
          Sletting av en kategori fjerner den permanent. Produkter i kategorien
          mister sin kategoritilknytning.
        </p>
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <button
            type="submit"
            onClick={(e) => {
              if (
                !window.confirm(
                  `Er du sikker på at du vil slette "${category.name}"?`
                )
              )
                e.preventDefault();
            }}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Slett kategori
          </button>
        </Form>
      </div>
    </div>
  );
}

/** Shows small thumbnails of products in this category to quick-pick as the category image */
function QuickPickImages({ categorySlug }: { categorySlug: string }) {
  // This is a placeholder — in a full implementation, we'd fetch product images
  // via a loader or a client-side fetch. For now we show guidance text.
  return (
    <p className="text-xs text-stone-400 italic">
      Tips: Gå til produktoversikten, høyreklikk et produktbilde og kopier
      bildeadressen. Lim den inn i feltet over.
    </p>
  );
}
