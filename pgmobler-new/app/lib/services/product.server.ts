import { eq, desc, asc, like, or, sql, inArray, and } from "drizzle-orm";
import {
  products,
  productImages,
  categories,
  type Product,
  type ProductImage,
} from "~/lib/db/schema";
import type { Database } from "./db.server";

export interface ProductWithImages extends Product {
  images: ProductImage[];
  categoryName?: string | null;
}

export type SortOption =
  | "newly_added"
  | "price_low_high"
  | "price_high_low"
  | "name_a_z"
  | "name_z_a"
  | "most_discounted";

interface ProductListOptions {
  page?: number;
  perPage?: number;
  sort?: SortOption;
  search?: string;
  categoryId?: number;
  categoryIds?: number[];
  supplierId?: number;
  onlyEnabled?: boolean;
  onlyBestsellers?: boolean;
  priceMin?: number;
  priceMax?: number;
  onSale?: boolean;
}

export async function getProducts(
  db: Database,
  options: ProductListOptions = {}
): Promise<{ products: ProductWithImages[]; total: number }> {
  const {
    page = 1,
    perPage = 20,
    sort = "newly_added",
    search,
    categoryId,
    categoryIds,
    supplierId,
    onlyEnabled = true,
    onlyBestsellers = false,
    priceMin,
    priceMax,
    onSale,
  } = options;

  const conditions = [];

  if (onlyEnabled) {
    conditions.push(eq(products.enabled, true));
  }
  if (onlyBestsellers) {
    conditions.push(eq(products.bestseller, true));
  }
  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }
  if (categoryIds && categoryIds.length > 0) {
    conditions.push(inArray(products.categoryId, categoryIds));
  }
  if (supplierId) {
    conditions.push(eq(products.supplierId, supplierId));
  }
  if (search) {
    const term = `%${search}%`;
    conditions.push(
      or(
        like(products.title, term),
        like(products.subtitle, term),
        like(products.description, term)
      )!
    );
  }
  if (priceMin != null) {
    conditions.push(
      sql`COALESCE(${products.salePrice}, ${products.price}) >= ${priceMin}`
    );
  }
  if (priceMax != null) {
    conditions.push(
      sql`COALESCE(${products.salePrice}, ${products.price}) <= ${priceMax}`
    );
  }
  if (onSale) {
    conditions.push(sql`${products.salePrice} IS NOT NULL AND ${products.salePrice} < ${products.price}`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where)
    .get();
  const total = countResult?.count ?? 0;

  // Build order clause
  let orderBy;
  switch (sort) {
    case "price_low_high":
      orderBy = asc(products.price);
      break;
    case "price_high_low":
      orderBy = desc(products.price);
      break;
    case "name_a_z":
      orderBy = asc(products.title);
      break;
    case "name_z_a":
      orderBy = desc(products.title);
      break;
    case "most_discounted":
      orderBy = desc(
        sql`CASE WHEN ${products.salePrice} IS NOT NULL AND ${products.price} > 0
          THEN (${products.price} - ${products.salePrice}) * 100 / ${products.price}
          ELSE 0 END`
      );
      break;
    case "newly_added":
    default:
      orderBy = desc(products.createdAt);
      break;
  }

  const offset = (page - 1) * perPage;

  const productRows = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(orderBy)
    .limit(perPage)
    .offset(offset)
    .all();

  if (productRows.length === 0) {
    return { products: [], total };
  }

  // Fetch images for all products
  const productIds = productRows.map((p) => p.id);
  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds))
    .orderBy(asc(productImages.sortOrder))
    .all();

  // Fetch category names
  const categoryIdsToFetch = [
    ...new Set(productRows.map((p) => p.categoryId).filter(Boolean)),
  ] as number[];
  let categoryMap: Record<number, string> = {};
  if (categoryIdsToFetch.length > 0) {
    const cats = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(inArray(categories.id, categoryIdsToFetch))
      .all();
    categoryMap = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  }

  const imageMap: Record<number, ProductImage[]> = {};
  for (const img of images) {
    if (!imageMap[img.productId]) imageMap[img.productId] = [];
    imageMap[img.productId].push(img);
  }

  const result = productRows.map((p) => ({
    ...p,
    images: imageMap[p.id] ?? [],
    categoryName: p.categoryId ? categoryMap[p.categoryId] ?? null : null,
  }));

  return { products: result, total };
}

export async function getProductBySlug(
  db: Database,
  slug: string
): Promise<ProductWithImages | null> {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .get();

  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.sortOrder))
    .all();

  let categoryName: string | null = null;
  if (product.categoryId) {
    const cat = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, product.categoryId))
      .get();
    categoryName = cat?.name ?? null;
  }

  return { ...product, images, categoryName };
}

export async function getRecentProducts(
  db: Database,
  limit: number = 8
): Promise<ProductWithImages[]> {
  const result = await getProducts(db, {
    perPage: limit,
    sort: "newly_added",
    onlyEnabled: true,
  });
  return result.products;
}

export async function getBestsellers(
  db: Database,
  limit: number = 8
): Promise<ProductWithImages[]> {
  const result = await getProducts(db, {
    perPage: limit,
    onlyEnabled: true,
    onlyBestsellers: true,
  });
  return result.products;
}
