interface MetaArgs {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function buildMeta({
  title,
  description,
  image,
  url,
  type = "website",
}: MetaArgs) {
  const siteName = "PG Møbler";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  const meta: Record<string, string>[] = [
    { title: fullTitle },
    ...(description ? [{ name: "description", content: description }] : []),
    { property: "og:title", content: fullTitle },
    { property: "og:site_name", content: siteName },
    { property: "og:type", content: type },
    ...(description
      ? [{ property: "og:description", content: description }]
      : []),
    ...(image ? [{ property: "og:image", content: image }] : []),
    ...(url ? [{ property: "og:url", content: url }] : []),
  ];

  return meta;
}

/** Generate JSON-LD Product schema for SEO */
export function productJsonLd(product: {
  title: string;
  description?: string | null;
  price?: number | null;
  salePrice?: number | null;
  imageUrl?: string | null;
  slug: string;
  siteUrl: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    ...(product.description && { description: product.description }),
    ...(product.imageUrl && { image: product.imageUrl }),
    url: `${product.siteUrl}/produkt/${product.slug}`,
  };

  if (product.price) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: product.salePrice || product.price,
      availability: "https://schema.org/InStock",
      ...(product.salePrice && {
        priceSpecification: {
          "@type": "PriceSpecification",
          price: product.salePrice,
          priceCurrency: "NOK",
        },
      }),
    };
  }

  return schema;
}
