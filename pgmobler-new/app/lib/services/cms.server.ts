import { eq } from "drizzle-orm";
import { cmsContent } from "~/lib/db/schema";
import type { Database } from "./db.server";

export async function getAllCmsContent(db: Database) {
  const rows = await db.select().from(cmsContent).all();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return map;
}

export async function getCmsValue(db: Database, key: string) {
  const row = await db
    .select()
    .from(cmsContent)
    .where(eq(cmsContent.key, key))
    .get();
  return row?.value ?? "";
}

export async function getCmsBySection(db: Database, section: string) {
  const rows = await db
    .select()
    .from(cmsContent)
    .where(eq(cmsContent.section, section))
    .all();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return map;
}

export async function upsertCmsContent(
  db: Database,
  key: string,
  value: string,
  section: string
) {
  await db
    .insert(cmsContent)
    .values({ key, value, section })
    .onConflictDoUpdate({
      target: cmsContent.key,
      set: { value },
    });
}
