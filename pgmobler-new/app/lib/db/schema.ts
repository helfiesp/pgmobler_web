import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ===== SUPPLIERS =====
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  imageKey: text("image_key"),
  imageUrl: text("image_url"),
});

// ===== CATEGORIES =====
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references((): any => categories.id, {
    onDelete: "set null",
  }),
  imageKey: text("image_key"),
  imageUrl: text("image_url"),
});

// ===== PRODUCTS =====
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").default(""),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  price: integer("price"), // NOK whole kroner (matching existing data)
  salePrice: integer("sale_price"),
  material: text("material"),
  color: text("color").default(
    "Mange varianter tilgjengelige, flere hundre kombinasjoner"
  ),
  height: text("height"),
  width: text("width"),
  depth: text("depth"),
  length: text("length"),
  supplierId: integer("supplier_id").references(() => suppliers.id, {
    onDelete: "set null",
  }),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  bestseller: integer("bestseller", { mode: "boolean" }).default(false),
  moreInformation: text("more_information"),
  priceTagInfo: text("price_tag_info"),
  priceTagType: integer("price_tag_type", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  // Color variant flags
  colorBlack: integer("color_black", { mode: "boolean" }).default(false),
  colorSmoked: integer("color_smoked", { mode: "boolean" }).default(false),
  colorGreyoiled: integer("color_greyoiled", { mode: "boolean" }).default(
    false
  ),
  colorWhiteoiled: integer("color_whiteoiled", { mode: "boolean" }).default(
    false
  ),
  colorLightOak: integer("color_light_oak", { mode: "boolean" }).default(
    false
  ),
});

// ===== PRODUCT IMAGES =====
export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageKey: text("image_key").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").default(0),
  color: text("color"), // 'black'|'smoked'|'greyoiled'|'whiteoiled'|'light_oak'|null
});

// ===== CMS CONTENT =====
export const cmsContent = sqliteTable("cms_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  section: text("section").notNull(), // 'page'|'footer'|'business'|'nav'
});

// ===== CUSTOMERS =====
export const customers = sqliteTable(
  "customers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email"),
    passwordHash: text("password_hash"),
    name: text("name").notNull(),
    phone: text("phone"),
    streetAddress: text("street_address"),
    zipCode: text("zip_code"),
    city: text("city"),
    isVerified: integer("is_verified", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  },
  (table) => ({
    emailIdx: uniqueIndex("customers_email_idx").on(table.email),
  })
);

// ===== ORDERS =====
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: integer("order_number").notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  status: text("status").default("pending"), // pending|confirmed|processing|shipped|delivered|cancelled
  deliveryInfo: text("delivery_info"),
  deliveryPrice: integer("delivery_price").default(0),
  extraInfo: text("extra_info"),
  totalPrice: integer("total_price").notNull(),
  paidAmount: integer("paid_amount").default(0),
  remainingAmount: integer("remaining_amount").default(0),
  depositAmount: integer("deposit_amount").default(0),
  salesman: text("salesman"),
  paymentMethod: text("payment_method"), // vipps|klarna|stripe|in_store|invoice
  paymentId: text("payment_id"),
  paymentStatus: text("payment_status").default("unpaid"), // unpaid|partial|paid|refunded
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  source: text("source").default("online"), // online|in_store
  deleted: integer("deleted", { mode: "boolean" }).default(false),
  completed: integer("completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ===== ORDER ITEMS =====
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  productInfo: text("product_info"),
  fabric: text("fabric"),
  legs: text("legs"),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  sortOrder: integer("sort_order").default(0),
});

// ===== CARTS =====
export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(), // UUID
  customerId: integer("customer_id").references(() => customers.id),
  sessionId: text("session_id"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ===== CART ITEMS =====
export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  fabric: text("fabric"),
  legs: text("legs"),
  notes: text("notes"),
});

// ===== SESSIONS =====
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  data: text("data"), // JSON blob
  expiresAt: text("expires_at").notNull(),
});

// ===== INSTAGRAM POSTS =====
export const instagramPosts = sqliteTable("instagram_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  postType: text("post_type").default("post"), // 'post' | 'reel' | 'story'
  pinned: integer("pinned", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  visible: integer("visible", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ===== TYPE EXPORTS =====
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CmsContent = typeof cmsContent.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type InstagramPost = typeof instagramPosts.$inferSelect;
