/**
 * Data Migration Script: PostgreSQL -> Cloudflare D1
 *
 * This script connects to the existing PostgreSQL database, reads all data,
 * transforms it to match the new schema, and outputs SQL statements for D1.
 *
 * Usage:
 *   npx tsx scripts/migrate-data.ts --pg-url "postgresql://user:pass@host/db" --output ./migration.sql
 *
 * Or export to JSON for inspection:
 *   npx tsx scripts/migrate-data.ts --pg-url "postgresql://user:pass@host/db" --json --output ./migration-data/
 */

import pg from "pg";

const { Client } = pg;

// Norwegian-aware slugify (matches the app's slugify utility)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface MigrationOptions {
  pgUrl: string;
  outputPath: string;
  jsonMode: boolean;
}

function parseArgs(): MigrationOptions {
  const args = process.argv.slice(2);
  let pgUrl = "";
  let outputPath = "./migration.sql";
  let jsonMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pg-url" && args[i + 1]) pgUrl = args[++i];
    if (args[i] === "--output" && args[i + 1]) outputPath = args[++i];
    if (args[i] === "--json") jsonMode = true;
  }

  if (!pgUrl) {
    console.error("Usage: npx tsx scripts/migrate-data.ts --pg-url <url> [--output <path>] [--json]");
    process.exit(1);
  }

  return { pgUrl, outputPath, jsonMode };
}

function escSql(val: string | null | undefined): string {
  if (val == null) return "NULL";
  return `'${val.replace(/'/g, "''")}'`;
}

function numOrNull(val: unknown): string {
  if (val == null) return "NULL";
  const n = Number(val);
  return isNaN(n) ? "NULL" : String(n);
}

function boolSql(val: unknown): string {
  return val ? "1" : "0";
}

async function migrate() {
  const opts = parseArgs();
  const client = new Client({ connectionString: opts.pgUrl });
  await client.connect();

  const sql: string[] = [];

  console.log("Connected to PostgreSQL. Starting migration...\n");

  // ===== 1. SUPPLIERS =====
  console.log("Migrating suppliers...");
  const { rows: supplierRows } = await client.query(
    "SELECT * FROM website_app_supplier ORDER BY id"
  );
  const supplierMap = new Map<string, number>(); // name -> id for product mapping

  for (const s of supplierRows) {
    const slug = slugify(s.name);
    supplierMap.set(s.name, s.id);
    sql.push(
      `INSERT INTO suppliers (id, name, slug, image_key, image_url) VALUES (${s.id}, ${escSql(s.name)}, ${escSql(slug)}, ${escSql(s.image)}, ${escSql(s.image ? `/media/${s.image}` : null)});`
    );
  }
  console.log(`  -> ${supplierRows.length} suppliers`);

  // ===== 2. CATEGORIES =====
  console.log("Migrating categories...");
  const { rows: categoryRows } = await client.query(
    "SELECT * FROM website_app_category ORDER BY id"
  );

  for (const c of categoryRows) {
    const slug = slugify(c.name);
    sql.push(
      `INSERT INTO categories (id, name, slug, parent_id, image_key, image_url) VALUES (${c.id}, ${escSql(c.name)}, ${escSql(slug)}, ${numOrNull(c.parent_id)}, ${escSql(c.image)}, ${escSql(c.image ? `/media/${c.image}` : null)});`
    );
  }
  console.log(`  -> ${categoryRows.length} categories`);

  // ===== 3. PRODUCTS =====
  console.log("Migrating products...");
  const { rows: productRows } = await client.query(
    "SELECT * FROM website_app_product ORDER BY id"
  );

  // Build a set of supplier names that exist as products.supplier (string field)
  // but may not exist in the supplier table — create them if needed
  const existingSupplierNames = new Set(supplierMap.keys());
  let nextSupplierId = supplierRows.length > 0 ? Math.max(...supplierRows.map((s: any) => s.id)) + 1 : 1;

  for (const p of productRows) {
    const supplierName = p.supplier;
    let supplierId: number | null = null;

    if (supplierName && !existingSupplierNames.has(supplierName)) {
      // Create a new supplier record
      supplierId = nextSupplierId++;
      supplierMap.set(supplierName, supplierId);
      existingSupplierNames.add(supplierName);
      sql.push(
        `INSERT INTO suppliers (id, name, slug) VALUES (${supplierId}, ${escSql(supplierName)}, ${escSql(slugify(supplierName))});`
      );
    } else if (supplierName) {
      supplierId = supplierMap.get(supplierName) ?? null;
    }

    sql.push(
      `INSERT INTO products (id, slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, length, supplier_id, enabled, bestseller, more_information, price_tag_info, price_tag_type, created_at, updated_at, color_black, color_smoked, color_greyoiled, color_whiteoiled, color_light_oak) VALUES (${p.id}, ${escSql(p.string_id)}, ${escSql(p.title)}, ${escSql(p.subtitle)}, ${numOrNull(p.category_id)}, ${escSql(p.description)}, ${numOrNull(p.price)}, ${numOrNull(p.sale_price)}, ${escSql(p.material)}, ${escSql(p.color)}, ${escSql(p.height)}, ${escSql(p.width)}, ${escSql(p.depth)}, ${escSql(p.length)}, ${numOrNull(supplierId)}, ${boolSql(p.enabled)}, ${boolSql(p.bestseller)}, ${escSql(p.more_information)}, ${escSql(p.price_tag_info)}, ${boolSql(p.price_tag_type)}, ${escSql(p.date_added?.toISOString())}, ${escSql(p.date_edited?.toISOString())}, ${boolSql(p.color_black)}, ${boolSql(p.color_smoked)}, ${boolSql(p.color_greyoiled)}, ${boolSql(p.color_whiteoiled)}, ${boolSql(p.color_light_oak)});`
    );
  }
  console.log(`  -> ${productRows.length} products`);

  // ===== 4. PRODUCT IMAGES =====
  console.log("Migrating product images...");
  const { rows: imageRows } = await client.query(
    "SELECT * FROM website_app_product_image ORDER BY product_id, \"order\""
  );

  for (const img of imageRows) {
    sql.push(
      `INSERT INTO product_images (id, product_id, image_key, image_url, sort_order, color) VALUES (${img.id}, ${img.product_id}, ${escSql(img.image)}, ${escSql(img.image ? `/media/${img.image}` : "")}, ${numOrNull(img.order)}, ${escSql(img.color)});`
    );
  }
  console.log(`  -> ${imageRows.length} product images`);

  // ===== 5. CMS CONTENT (text_areas + footer_textareas + business_information) =====
  console.log("Migrating CMS content...");
  let cmsCount = 0;

  // text_areas -> section: 'page'
  const { rows: textAreaRows } = await client.query(
    "SELECT * FROM website_app_text_areas LIMIT 1"
  );
  if (textAreaRows.length > 0) {
    const ta = textAreaRows[0];
    const pageFields = [
      "front_page_header", "front_page_subtitle", "front_page_button_text",
      "recent_product_header", "recent_product_text",
      "bestseller_header", "bestseller_text",
      "nav_item_1", "nav_item_2", "nav_item_3", "nav_item_4",
      "purchase_button_1", "purchase_button_2",
      "product_desc_item_1", "product_desc_item_2", "product_desc_item_3",
      "sale_catalogue",
    ];
    for (const field of pageFields) {
      if (ta[field] != null) {
        sql.push(
          `INSERT INTO cms_content (key, value, section) VALUES (${escSql(field)}, ${escSql(ta[field])}, 'page');`
        );
        cmsCount++;
      }
    }
  }

  // footer_textareas -> section: 'footer'
  const { rows: footerRows } = await client.query(
    "SELECT * FROM website_app_footer_textareas LIMIT 1"
  );
  if (footerRows.length > 0) {
    const ft = footerRows[0];
    for (const [key, val] of Object.entries(ft)) {
      if (key !== "id" && val != null) {
        sql.push(
          `INSERT INTO cms_content (key, value, section) VALUES (${escSql(key)}, ${escSql(String(val))}, 'footer');`
        );
        cmsCount++;
      }
    }
  }

  // business_information -> section: 'business'
  const { rows: bizRows } = await client.query(
    "SELECT * FROM website_app_business_information LIMIT 1"
  );
  if (bizRows.length > 0) {
    const biz = bizRows[0];
    for (const [key, val] of Object.entries(biz)) {
      if (key !== "id" && val != null) {
        sql.push(
          `INSERT INTO cms_content (key, value, section) VALUES (${escSql(key)}, ${escSql(String(val))}, 'business');`
        );
        cmsCount++;
      }
    }
  }
  console.log(`  -> ${cmsCount} CMS entries`);

  // ===== 6. CUSTOMERS =====
  console.log("Migrating customers...");
  const { rows: customerRows } = await client.query(
    "SELECT * FROM website_app_customers ORDER BY id"
  );

  for (const c of customerRows) {
    sql.push(
      `INSERT INTO customers (id, name, email, phone, street_address, zip_code) VALUES (${c.id}, ${escSql(c.name)}, ${escSql(c.email)}, ${escSql(c.phone_number)}, ${escSql(c.street_address)}, ${escSql(c.zip_code)});`
    );
  }
  console.log(`  -> ${customerRows.length} customers`);

  // ===== 7. ORDERS =====
  console.log("Migrating orders...");
  const { rows: orderRows } = await client.query(
    "SELECT * FROM website_app_orders ORDER BY order_number"
  );

  for (const o of orderRows) {
    const totalPrice = parseInt(o.price) || 0;
    const paidAmount = parseInt(o.paid) || 0;
    const remainingAmount = parseInt(o.remaining) || 0;
    const depositAmount = parseInt(o.a_paid) || 0;

    sql.push(
      `INSERT INTO orders (id, order_number, customer_id, status, delivery_info, delivery_price, extra_info, total_price, paid_amount, remaining_amount, deposit_amount, salesman, source, deleted, completed, created_at) VALUES (${o.order_number}, ${o.order_number}, ${o.customer_id}, ${o.completed ? "'delivered'" : o.deleted ? "'cancelled'" : "'confirmed'"}, ${escSql(o.delivery_info)}, ${numOrNull(o.delivery_price)}, ${escSql(o.extra_info)}, ${totalPrice}, ${paidAmount}, ${remainingAmount}, ${depositAmount}, ${escSql(o.salesman)}, 'in_store', ${boolSql(o.deleted)}, ${boolSql(o.completed)}, ${escSql(o.date_added?.toISOString())});`
    );

    // Parse order items from JSON field
    let items: any[] = [];
    try {
      items = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      sql.push(
        `INSERT INTO order_items (order_id, product_name, product_info, fabric, legs, quantity, unit_price, sort_order) VALUES (${o.order_number}, ${escSql(item.product || item.product_name || "Ukjent")}, ${escSql(item.product_info)}, ${escSql(item.fabric)}, ${escSql(item.legs)}, ${numOrNull(item.amount || item.quantity || 1)}, ${numOrNull(item.price || 0)}, ${idx});`
      );
    }
  }
  console.log(`  -> ${orderRows.length} orders`);

  await client.end();

  // ===== OUTPUT =====
  const { writeFileSync, mkdirSync } = await import("fs");

  if (opts.jsonMode) {
    mkdirSync(opts.outputPath, { recursive: true });
    writeFileSync(`${opts.outputPath}/migration.sql`, sql.join("\n"));
  } else {
    writeFileSync(opts.outputPath, sql.join("\n"));
  }

  console.log(`\nMigration SQL written to ${opts.outputPath}`);
  console.log(`Total statements: ${sql.length}`);
  console.log("\nTo apply:");
  console.log(`  wrangler d1 execute pgmobler-db --local --file=${opts.outputPath}`);
  console.log(`  wrangler d1 execute pgmobler-db --remote --file=${opts.outputPath}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
