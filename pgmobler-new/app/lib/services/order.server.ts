import { eq, desc, and, sql } from "drizzle-orm";
import { orders, orderItems, customers } from "~/lib/db/schema";
import type { Database } from "./db.server";

export interface OrderWithCustomer {
  id: number;
  orderNumber: number;
  status: string | null;
  totalPrice: number;
  paymentStatus: string | null;
  source: string | null;
  deleted: boolean | null;
  completed: boolean | null;
  createdAt: string | null;
  customerName: string;
  customerPhone: string | null;
}

export async function getAllOrders(
  db: Database,
  opts: { includeDeleted?: boolean } = {}
): Promise<OrderWithCustomer[]> {
  const conditions = [];
  if (!opts.includeDeleted) {
    conditions.push(eq(orders.deleted, false));
  }

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalPrice: orders.totalPrice,
      paymentStatus: orders.paymentStatus,
      source: orders.source,
      deleted: orders.deleted,
      completed: orders.completed,
      createdAt: orders.createdAt,
      customerName: customers.name,
      customerPhone: customers.phone,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .all();

  return rows;
}

export async function getOrderByNumber(db: Database, orderNumber: number) {
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .get();

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .all();

  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, order.customerId))
    .get();

  return { ...order, items, customer };
}

export async function getNextOrderNumber(db: Database): Promise<number> {
  const result = await db
    .select({ max: sql<number>`MAX(${orders.orderNumber})` })
    .from(orders)
    .get();
  return (result?.max ?? 999) + 1;
}

export async function getOrderStats(db: Database) {
  const [totalResult, pendingResult, completedResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.deleted, false))
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.deleted, false), eq(orders.completed, false)))
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.deleted, false), eq(orders.completed, true)))
      .get(),
  ]);

  return {
    total: totalResult?.count ?? 0,
    pending: pendingResult?.count ?? 0,
    completed: completedResult?.count ?? 0,
  };
}
