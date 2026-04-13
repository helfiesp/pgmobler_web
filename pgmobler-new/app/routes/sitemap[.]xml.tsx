import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getDb } from "~/lib/services/db.server";
import { products, categories } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const siteUrl = context.cloudflare.env.SITE_URL || "https://pgmobler.no";

  const [allProducts, allCategories] = await Promise.all([
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.enabled, true))
      .all(),
    db.select({ slug: categories.slug }).from(categories).all(),
  ]);

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/produkter", priority: "0.9", changefreq: "daily" },
    { url: "/kategorier", priority: "0.8", changefreq: "weekly" },
    { url: "/om-oss", priority: "0.5", changefreq: "monthly" },
    { url: "/kontakt", priority: "0.5", changefreq: "monthly" },
    { url: "/salgsbrosjyre", priority: "0.6", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
${allCategories
  .map(
    (c) => `  <url>
    <loc>${siteUrl}/kategorier/${c.slug}</loc>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
${allProducts
  .map(
    (p) => `  <url>
    <loc>${siteUrl}/produkt/${p.slug}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
