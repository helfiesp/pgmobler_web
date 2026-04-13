import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { getDb } from "~/lib/services/db.server";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "~/lib/services/instagram.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const posts = await getAllPosts(db);
  return json({ posts });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  switch (intent) {
    case "create": {
      const url = form.get("url") as string;
      if (!url) return json({ error: "URL er påkrevd" }, { status: 400 });
      await createPost(db, {
        url,
        thumbnailUrl: (form.get("thumbnailUrl") as string) || undefined,
        caption: (form.get("caption") as string) || undefined,
        postType: (form.get("postType") as string) || "post",
        pinned: form.get("pinned") === "on",
      });
      return json({ success: true });
    }
    case "update": {
      const id = Number(form.get("id"));
      await updatePost(db, id, {
        url: form.get("url") as string,
        thumbnailUrl: (form.get("thumbnailUrl") as string) || null,
        caption: (form.get("caption") as string) || null,
        postType: (form.get("postType") as string) || "post",
        pinned: form.get("pinned") === "on",
        visible: form.get("visible") !== "off",
        sortOrder: Number(form.get("sortOrder")) || 0,
      });
      return json({ success: true });
    }
    case "toggle-pin": {
      const id = Number(form.get("id"));
      const pinned = form.get("pinned") === "true";
      await updatePost(db, id, { pinned: !pinned });
      return json({ success: true });
    }
    case "toggle-visible": {
      const id = Number(form.get("id"));
      const visible = form.get("visible") === "true";
      await updatePost(db, id, { visible: !visible });
      return json({ success: true });
    }
    case "delete": {
      const id = Number(form.get("id"));
      await deletePost(db, id);
      return json({ success: true });
    }
    default:
      return json({ error: "Ukjent handling" }, { status: 400 });
  }
}

export default function AdminInstagram() {
  const { posts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const saving = navigation.state === "submitting";

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instagram</h1>
          <p className="text-stone-400 text-sm mt-1">
            {posts.length} innlegg &middot; {posts.filter((p) => p.pinned).length} festet &middot;{" "}
            {posts.filter((p) => p.visible).length} synlige
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditId(null); }}
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nytt innlegg
        </button>
      </div>

      {/* Add new post form */}
      {showAddForm && (
        <Form
          method="post"
          onSubmit={() => setShowAddForm(false)}
          className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 animate-fade-in"
        >
          <input type="hidden" name="intent" value="create" />
          <h2 className="font-bold">Legg til Instagram-innlegg</h2>
          <p className="text-sm text-stone-400">
            Innlegget vises som en live-embed direkte fra Instagram med bilde/video, likes og kommentarer.
          </p>

          <div className="bg-stone-50 rounded-lg p-4 text-sm text-stone-500 space-y-1">
            <p className="font-medium text-stone-600">Slik finner du URL-en:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-xs">
              <li>Åpne innlegget eller reelen på Instagram</li>
              <li>Trykk på de tre prikkene (...) og velg &ldquo;Kopier lenke&rdquo;</li>
              <li>Lim inn URL-en under</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Instagram URL *
              </label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://www.instagram.com/reel/ABC123/ eller /p/ABC123/"
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Intern notat (valgfritt)
                </label>
                <input
                  type="text"
                  name="caption"
                  placeholder="F.eks. 'Ny sofa-video' — vises ikke på nettsiden"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Type
                </label>
                <select
                  name="postType"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option value="reel">Reel / Video</option>
                  <option value="post">Bilde / Karusell</option>
                </select>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="pinned" className="w-4 h-4 rounded border-stone-300 text-secondary focus:ring-secondary/20" />
            <span className="text-sm">Fest til toppen (vises alltid først)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Legger til..." : "Legg til"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              Avbryt
            </button>
          </div>
        </Form>
      )}

      {/* Posts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`relative group bg-white rounded-xl border overflow-hidden transition-colors ${
              !post.visible ? "opacity-50 border-stone-200" : "border-stone-200 hover:border-stone-300"
            }`}
          >
            {/* Live preview */}
            <div className="aspect-[4/5] bg-stone-50 relative overflow-hidden">
              <iframe
                src={post.url.replace(/\/$/, "") + "/embed/"}
                className="w-full h-full border-0"
                loading="lazy"
                allowTransparency
                title={post.caption || "Instagram innlegg"}
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                {post.postType === "reel" && (
                  <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    REEL
                  </span>
                )}
                {post.pinned && (
                  <span className="bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    FESTET
                  </span>
                )}
                {!post.visible && (
                  <span className="bg-stone-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    SKJULT
                  </span>
                )}
              </div>
            </div>

            {/* Info + actions */}
            <div className="p-3 space-y-2">
              {post.caption && (
                <p className="text-xs text-stone-500 line-clamp-1">{post.caption}</p>
              )}

              <div className="flex items-center gap-1">
                {/* Pin toggle */}
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="toggle-pin" />
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="pinned" value={String(post.pinned)} />
                  <button
                    type="submit"
                    title={post.pinned ? "Fjern festing" : "Fest til toppen"}
                    className={`p-1.5 rounded-md transition-colors ${
                      post.pinned
                        ? "text-secondary bg-secondary/10"
                        : "text-stone-300 hover:text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                </fetcher.Form>

                {/* Visibility toggle */}
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="toggle-visible" />
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="visible" value={String(post.visible)} />
                  <button
                    type="submit"
                    title={post.visible ? "Skjul" : "Vis"}
                    className={`p-1.5 rounded-md transition-colors ${
                      post.visible
                        ? "text-green-500 bg-green-50"
                        : "text-stone-300 hover:text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      {post.visible ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      )}
                      {post.visible && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                    </svg>
                  </button>
                </fetcher.Form>

                {/* Open in Instagram */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-stone-300 hover:text-stone-500 hover:bg-stone-50 transition-colors"
                  title="Åpne i Instagram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>

                {/* Delete */}
                <fetcher.Form method="post" className="ml-auto">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    onClick={(e) => {
                      if (!window.confirm("Slett dette innlegget?")) e.preventDefault();
                    }}
                    className="p-1.5 rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Slett"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </fetcher.Form>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            <p className="text-lg mb-2">Ingen Instagram-innlegg ennå</p>
            <p className="text-sm">Legg til innlegg for å vise dem på forsiden</p>
          </div>
        )}
      </div>
    </div>
  );
}
