import { redirect } from "@remix-run/cloudflare";
import { eq, and, gt } from "drizzle-orm";
import { sessions, customers } from "~/lib/db/schema";
import type { Database } from "./db.server";
import type { AppLoadContext } from "@remix-run/cloudflare";
import { getDb } from "./db.server";

const SESSION_COOKIE = "pgm_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getSessionFromRequest(
  request: Request,
  context: AppLoadContext
) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;

  const sessionId = match[1];
  const db = getDb(context);

  const session = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, new Date().toISOString())
      )
    )
    .get();

  if (!session) return null;

  // Fetch customer
  if (session.customerId) {
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, session.customerId))
      .get();
    return { session, customer: customer ?? null };
  }

  return { session, customer: null };
}

export async function requireAdmin(
  request: Request,
  context: AppLoadContext
) {
  const sessionData = await getSessionFromRequest(request, context);

  // For now, any logged-in user is considered admin.
  // TODO: Add role field to customers table for proper RBAC
  if (!sessionData?.customer) {
    const url = new URL(request.url);
    throw redirect(`/konto/logg-inn?redirect=${encodeURIComponent(url.pathname)}`);
  }

  return sessionData;
}

export function createSessionCookie(sessionId: string): string {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function createSession(
  db: Database,
  customerId: number
): Promise<string> {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await db.insert(sessions).values({
    id,
    customerId,
    expiresAt,
  });

  return id;
}
