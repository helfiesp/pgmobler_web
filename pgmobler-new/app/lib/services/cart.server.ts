import { eq, and } from "drizzle-orm";
import { carts, cartItems, products, productImages } from "~/lib/db/schema";
import type { Database } from "./db.server";
import { nanoid } from "nanoid";

export interface CartWithItems {
  id: string;
  items: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  fabric: string | null;
  legs: string | null;
  notes: string | null;
  product: {
    title: string;
    slug: string;
    price: number | null;
    salePrice: number | null;
    imageUrl: string | null;
  };
}

const CART_COOKIE = "pgm_cart";

export function getCartIdFromRequest(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${CART_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function createCartCookie(cartId: string): string {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  return `${CART_COOKIE}=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export async function getOrCreateCart(
  db: Database,
  request: Request
): Promise<{ cart: CartWithItems; cartId: string; isNew: boolean }> {
  let cartId = getCartIdFromRequest(request);
  let isNew = false;

  if (cartId) {
    const existing = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .get();
    if (existing) {
      const items = await getCartItems(db, cartId);
      return {
        cart: buildCart(cartId, items),
        cartId,
        isNew: false,
      };
    }
  }

  // Create new cart
  cartId = nanoid();
  await db.insert(carts).values({ id: cartId });
  isNew = true;

  return { cart: buildCart(cartId, []), cartId, isNew };
}

export async function getCart(
  db: Database,
  request: Request
): Promise<CartWithItems | null> {
  const cartId = getCartIdFromRequest(request);
  if (!cartId) return null;

  const existing = await db
    .select()
    .from(carts)
    .where(eq(carts.id, cartId))
    .get();
  if (!existing) return null;

  const items = await getCartItems(db, cartId);
  return buildCart(cartId, items);
}

async function getCartItems(
  db: Database,
  cartId: string
): Promise<CartItemWithProduct[]> {
  const rows = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      fabric: cartItems.fabric,
      legs: cartItems.legs,
      notes: cartItems.notes,
      productTitle: products.title,
      productSlug: products.slug,
      productPrice: products.price,
      productSalePrice: products.salePrice,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId))
    .all();

  // Fetch first image for each product
  const productIds = [...new Set(rows.map((r) => r.productId))];
  const images: Record<number, string> = {};
  for (const pid of productIds) {
    const img = await db
      .select({ url: productImages.imageUrl })
      .from(productImages)
      .where(eq(productImages.productId, pid))
      .limit(1)
      .get();
    if (img) images[pid] = img.url;
  }

  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    quantity: r.quantity,
    fabric: r.fabric,
    legs: r.legs,
    notes: r.notes,
    product: {
      title: r.productTitle,
      slug: r.productSlug,
      price: r.productPrice,
      salePrice: r.productSalePrice,
      imageUrl: images[r.productId] ?? null,
    },
  }));
}

function buildCart(id: string, items: CartItemWithProduct[]): CartWithItems {
  let totalItems = 0;
  let totalPrice = 0;
  for (const item of items) {
    totalItems += item.quantity;
    const price = item.product.salePrice ?? item.product.price ?? 0;
    totalPrice += price * item.quantity;
  }
  return { id, items, totalItems, totalPrice };
}

export async function addToCart(
  db: Database,
  cartId: string,
  productId: number,
  quantity: number = 1,
  opts: { fabric?: string; legs?: string; notes?: string } = {}
) {
  // Check if item already in cart (same product + fabric + legs)
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId)
      )
    )
    .get();

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity,
      fabric: opts.fabric || null,
      legs: opts.legs || null,
      notes: opts.notes || null,
    });
  }
}

export async function updateCartItemQuantity(
  db: Database,
  itemId: number,
  quantity: number
) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId));
  }
}

export async function removeCartItem(db: Database, itemId: number) {
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
}

export async function clearCart(db: Database, cartId: string) {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function getCartItemCount(
  db: Database,
  request: Request
): Promise<number> {
  const cartId = getCartIdFromRequest(request);
  if (!cartId) return 0;
  const rows = await db
    .select({ q: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId))
    .all();
  return rows.reduce((sum, r) => sum + r.q, 0);
}
