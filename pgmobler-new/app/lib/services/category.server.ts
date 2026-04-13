import { eq, isNull } from "drizzle-orm";
import { categories } from "~/lib/db/schema";
import type { Database } from "./db.server";
import type { Category } from "~/lib/db/schema";

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export async function getAllCategories(db: Database): Promise<Category[]> {
  return db.select().from(categories).all();
}

export async function getCategoriesWithChildren(
  db: Database
): Promise<CategoryWithChildren[]> {
  const all = await getAllCategories(db);

  const parents = all.filter((c) => !c.parentId);
  return parents.map((parent) => ({
    ...parent,
    children: all.filter((c) => c.parentId === parent.id),
  }));
}

export async function getTopLevelCategories(
  db: Database
): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(isNull(categories.parentId))
    .all();
}

export async function getCategoryBySlug(
  db: Database,
  slug: string
): Promise<Category | undefined> {
  return db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .get();
}

export async function getSubcategories(
  db: Database,
  parentId: number
): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(eq(categories.parentId, parentId))
    .all();
}
