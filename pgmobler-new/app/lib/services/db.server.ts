import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/lib/db/schema";
import type { AppLoadContext } from "@remix-run/cloudflare";

export function getDb(context: AppLoadContext) {
  return drizzle(context.cloudflare.env.DB, { schema });
}

export type Database = ReturnType<typeof getDb>;
