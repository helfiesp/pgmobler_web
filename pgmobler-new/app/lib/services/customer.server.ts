import { eq, desc } from "drizzle-orm";
import { customers, orders, type Customer } from "~/lib/db/schema";
import type { Database } from "./db.server";

// Simple password hashing for Cloudflare Workers (no bcrypt native)
// Uses Web Crypto API PBKDF2
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(
    saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16))
  );
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const computed = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === hashHex;
}

export async function createCustomer(
  db: Database,
  data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    streetAddress?: string;
    zipCode?: string;
    city?: string;
  }
): Promise<Customer> {
  const passwordHash = await hashPassword(data.password);
  const result = await db
    .insert(customers)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      phone: data.phone || null,
      streetAddress: data.streetAddress || null,
      zipCode: data.zipCode || null,
      city: data.city || null,
    })
    .returning();
  return result[0];
}

export async function createCustomerManual(
  db: Database,
  data: {
    name: string;
    email?: string;
    phone?: string;
    streetAddress?: string;
    zipCode?: string;
    city?: string;
  }
): Promise<Customer> {
  const result = await db
    .insert(customers)
    .values({
      name: data.name,
      email: data.email?.toLowerCase() || null,
      phone: data.phone || null,
      streetAddress: data.streetAddress || null,
      zipCode: data.zipCode || null,
      city: data.city || null,
    })
    .returning();
  return result[0];
}

export async function authenticateCustomer(
  db: Database,
  email: string,
  password: string
): Promise<Customer | null> {
  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.email, email.toLowerCase()))
    .get();

  if (!customer || !customer.passwordHash) return null;
  const valid = await verifyPassword(password, customer.passwordHash);
  return valid ? customer : null;
}

export async function getCustomerById(
  db: Database,
  id: number
): Promise<Customer | null> {
  return (
    (await db.select().from(customers).where(eq(customers.id, id)).get()) ??
    null
  );
}

export async function updateCustomer(
  db: Database,
  id: number,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    streetAddress: string;
    zipCode: string;
    city: string;
  }>
) {
  await db.update(customers).set(data).where(eq(customers.id, id));
}

export async function getCustomerOrders(db: Database, customerId: number) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt))
    .all();
}
