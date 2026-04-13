import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { products, productImages, categories, suppliers } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "~/lib/utils/format";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);

  const product = await db.select().from(products).where(eq(products.id, id)).get();
  if (!product) {
    throw json({ message: "Produkt ikke funnet" }, { status: 404 });
  }

  const [images, allCategories, allSuppliers] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, id)).all(),
    db.select().from(categories).all(),
    db.select().from(suppliers).all(),
  ]);

  return json({ product, images, categories: allCategories, suppliers: allSuppliers });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const id = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "delete") {
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(products).where(eq(products.id, id));
    return redirect("/admin/produkter");
  }

  if (intent === "delete-image") {
    const imageId = Number(form.get("imageId"));
    if (imageId) {
      await db.delete(productImages).where(eq(productImages.id, imageId));
    }
    return json({ ok: true });
  }

  // Default: update product
  const title = form.get("title") as string;
  if (!title) return json({ error: "Tittel er påkrevd" }, { status: 400 });

  const categoryId = form.get("categoryId") ? Number(form.get("categoryId")) : null;
  const supplierId = form.get("supplierId") ? Number(form.get("supplierId")) : null;
  const price = form.get("price") ? Number(form.get("price")) : null;
  const salePrice = form.get("salePrice") ? Number(form.get("salePrice")) : null;

  await db
    .update(products)
    .set({
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
    })
    .where(eq(products.id, id));

  return json({ ok: true });
}

export default function AdminEditProduct() {
  const { product, images, categories: cats, suppliers: sups } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/produkter" className="text-sm text-muted hover:text-primary transition-colors">
            &larr; Tilbake til produkter
          </Link>
          <h1 className="text-2xl font-bold mt-1">Rediger produkt</h1>
          <p className="text-muted text-sm mt-1">{product.title}</p>
        </div>
      </div>

      <Form method="post" className="bg-white rounded-xl border border-border divide-y divide-border">
        <input type="hidden" name="intent" value="update" />

        {/* Basic info */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Grunnleggende</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Tittel *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={product.title}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subtitle" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Undertittel
              </label>
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                defaultValue={product.subtitle ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Kategori
              </label>
              <select
                name="categoryId"
                id="categoryId"
                defaultValue={product.categoryId ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
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
              <select
                name="supplierId"
                id="supplierId"
                defaultValue={product.supplierId ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
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
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                defaultValue={product.price ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Tilbudspris (kr)
              </label>
              <input
                type="number"
                name="salePrice"
                id="salePrice"
                min="0"
                defaultValue={product.salePrice ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Beskrivelse</h2>
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description ?? ""}
            placeholder="Produktbeskrivelse..."
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y"
          />
          <textarea
            name="moreInformation"
            rows={3}
            defaultValue={product.moreInformation ?? ""}
            placeholder="Mer informasjon..."
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y"
          />
        </div>

        {/* Dimensions */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold">Detaljer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="material" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Materiale
              </label>
              <input
                type="text"
                name="material"
                id="material"
                defaultValue={product.material ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Høyde
              </label>
              <input
                type="text"
                name="height"
                id="height"
                defaultValue={product.height ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Bredde
              </label>
              <input
                type="text"
                name="width"
                id="width"
                defaultValue={product.width ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="depth" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Dybde
              </label>
              <input
                type="text"
                name="depth"
                id="depth"
                defaultValue={product.depth ?? ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Toggles + Submit */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={product.enabled ?? true}
                className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/20"
              />
              <span className="text-sm">Aktiv</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="bestseller"
                defaultChecked={product.bestseller ?? false}
                className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/20"
              />
              <span className="text-sm">Bestselger</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </div>
      </Form>

      {/* Product Images */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-bold">Bilder</h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.imageUrl}
                  alt=""
                  className="w-full aspect-square rounded-lg object-cover bg-surface"
                />
                <Form method="post" className="absolute top-2 right-2">
                  <input type="hidden" name="intent" value="delete-image" />
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    type="submit"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-red-50 text-red-600 p-1.5 rounded-lg shadow-sm"
                    title="Slett bilde"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </Form>
                {img.color && (
                  <span className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-0.5 rounded-full">
                    {img.color}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">Ingen bilder lastet opp ennå.</p>
        )}
      </div>

      {/* Delete product */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-bold text-red-700">Faresone</h2>
        <p className="text-sm text-muted mt-1 mb-4">
          Denne handlingen kan ikke angres. Produktet og alle tilhørende bilder vil bli permanent slettet.
        </p>
        <Form
          method="post"
          onSubmit={(e) => {
            if (!window.confirm("Er du sikker på at du vil slette dette produktet? Denne handlingen kan ikke angres.")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="intent" value="delete" />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Slett produkt
          </button>
        </Form>
      </div>
    </div>
  );
}
