import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./app/lib/db/migrations",
  schema: "./app/lib/db/schema.ts",
  dialect: "sqlite",
});
