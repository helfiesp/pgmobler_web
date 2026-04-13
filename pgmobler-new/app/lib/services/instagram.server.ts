import { eq, desc, asc, and, sql } from "drizzle-orm";
import { instagramPosts, type InstagramPost } from "~/lib/db/schema";
import type { Database } from "./db.server";

/** Get visible posts for the frontend — pinned first, then by sort order / newest */
export async function getVisiblePosts(
  db: Database,
  limit: number = 8
): Promise<InstagramPost[]> {
  return db
    .select()
    .from(instagramPosts)
    .where(eq(instagramPosts.visible, true))
    .orderBy(desc(instagramPosts.pinned), asc(instagramPosts.sortOrder), desc(instagramPosts.createdAt))
    .limit(limit)
    .all();
}

/** Get all posts for admin */
export async function getAllPosts(db: Database): Promise<InstagramPost[]> {
  return db
    .select()
    .from(instagramPosts)
    .orderBy(desc(instagramPosts.pinned), asc(instagramPosts.sortOrder), desc(instagramPosts.createdAt))
    .all();
}

export async function createPost(
  db: Database,
  data: { url: string; thumbnailUrl?: string; caption?: string; postType?: string; pinned?: boolean }
) {
  return db.insert(instagramPosts).values({
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || null,
    caption: data.caption || null,
    postType: data.postType || "post",
    pinned: data.pinned || false,
  });
}

export async function updatePost(
  db: Database,
  id: number,
  data: Partial<{
    url: string;
    thumbnailUrl: string | null;
    caption: string | null;
    postType: string;
    pinned: boolean;
    sortOrder: number;
    visible: boolean;
  }>
) {
  await db
    .update(instagramPosts)
    .set(data)
    .where(eq(instagramPosts.id, id));
}

export async function deletePost(db: Database, id: number) {
  await db.delete(instagramPosts).where(eq(instagramPosts.id, id));
}
