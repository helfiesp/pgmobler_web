import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { getDb } from "~/lib/services/db.server";
import {
  getProductBySlug,
  getProducts,
} from "~/lib/services/product.server";
import { ProductGallery } from "~/components/product/ProductGallery";
import { ColorSelector } from "~/components/product/ColorSelector";
import { PriceDisplay } from "~/components/product/PriceDisplay";
import { ProductTabs } from "~/components/product/ProductTabs";
import { ProductGrid } from "~/components/product/ProductGrid";
import { buildMeta, productJsonLd } from "~/lib/utils/seo";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) return buildMeta({ title: "Produkt ikke funnet" });
  return buildMeta({
    title: data.product.title,
    description:
      data.product.subtitle || data.product.description?.slice(0, 160) || "",
    image: data.product.images[0]?.imageUrl,
    type: "product",
  });
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const product = await getProductBySlug(db, params.slug!);

  if (!product) {
    throw json({ message: "Produkt ikke funnet" }, { status: 404 });
  }

  let relatedProducts: Awaited<ReturnType<typeof getProducts>>["products"] =
    [];
  if (product.categoryId) {
    const result = await getProducts(db, {
      categoryId: product.categoryId,
      perPage: 4,
      onlyEnabled: true,
    });
    relatedProducts = result.products.filter((p) => p.id !== product.id);
  }

  const siteUrl = context.cloudflare.env.SITE_URL || "https://pgmobler.no";
  return json({ product, relatedProducts, siteUrl });
}

export default function ProductPage() {
  const { product, relatedProducts, siteUrl } =
    useLoaderData<typeof loader>();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const cartFetcher = useFetcher();

  const filteredImages = selectedColor
    ? product.images.filter(
        (img) => img.color === selectedColor || !img.color
      )
    : product.images;

  const jsonLd = productJsonLd({
    title: product.title,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    imageUrl: product.images[0]?.imageUrl,
    slug: product.slug,
    siteUrl,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Brødsmuler">
          <Link to="/" className="hover:text-primary transition-colors">
            Hjem
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          {product.categoryName && (
            <>
              <Link
                to={`/kategorier/${product.categoryName.toLowerCase()}`}
                className="hover:text-primary transition-colors"
              >
                {product.categoryName}
              </Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </>
          )}
          <span className="text-primary font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery — 7 cols */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={filteredImages}
              productTitle={product.title}
            />
          </div>

          {/* Info — 5 cols */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Category */}
              {product.categoryName && (
                <Link
                  to={`/kategorier/${product.categoryName.toLowerCase()}`}
                  className="inline-block text-xs uppercase tracking-wider text-secondary font-semibold hover:text-secondary/80 transition-colors"
                >
                  {product.categoryName}
                </Link>
              )}

              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-muted mt-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="pt-2">
                <PriceDisplay
                  price={product.price}
                  salePrice={product.salePrice}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Color selector */}
              <ColorSelector
                images={product.images}
                colorFlags={{
                  colorBlack: product.colorBlack,
                  colorSmoked: product.colorSmoked,
                  colorGreyoiled: product.colorGreyoiled,
                  colorWhiteoiled: product.colorWhiteoiled,
                  colorLightOak: product.colorLightOak,
                }}
                onColorSelect={setSelectedColor}
                selectedColor={selectedColor}
              />

              {/* Quantity + Add to cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Antall
                  </label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-muted hover:text-primary transition-colors"
                      aria-label="Reduser antall"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-muted hover:text-primary transition-colors"
                      aria-label="Øk antall"
                    >
                      +
                    </button>
                  </div>
                </div>

                <cartFetcher.Form method="post" action="/api/cart" onSubmit={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); }}>
                  <input type="hidden" name="intent" value="add" />
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={quantity} />
                  <button
                    type="submit"
                    className={`w-full py-4 text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      addedToCart
                        ? "bg-success text-white"
                        : "bg-primary hover:bg-gray-800 text-white"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Lagt til!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Legg i handlekurv
                      </>
                    )}
                  </button>
                </cartFetcher.Form>
              </div>

              {/* Quick specs */}
              {(product.material || product.color) && (
                <div className="bg-surface rounded-xl p-4 space-y-2">
                  {product.material && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Materiale</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.height && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Høyde</span>
                      <span className="font-medium">{product.height}</span>
                    </div>
                  )}
                  {product.width && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Bredde</span>
                      <span className="font-medium">{product.width}</span>
                    </div>
                  )}
                  {product.depth && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Dybde</span>
                      <span className="font-medium">{product.depth}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-border pt-8">
          <ProductTabs product={product} />
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl md:text-2xl font-bold mb-8">
              Du vil kanskje også like
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}
