import { useEffect, useRef, useState } from "react";
import type { InstagramPost } from "~/lib/db/schema";

interface InstagramFeedProps {
  posts: InstagramPost[];
}

export function InstagramFeed({ posts }: InstagramFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Load Instagram embed script
  useEffect(() => {
    if (posts.length === 0) return;
    const existing = document.querySelector('script[src*="instagram.com/embed"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Re-process embeds when posts change
      (window as any).instgrm?.Embeds?.process();
    }
  }, [posts]);

  // After embeds load, re-process
  useEffect(() => {
    const timer = setTimeout(() => {
      (window as any).instgrm?.Embeds?.process();
    }, 1000);
    return () => clearTimeout(timer);
  }, [posts]);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333 2.175 8.741 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="text-sm font-semibold tracking-wide">@pgmobler</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Følg oss på Instagram
            </h2>
          </div>
          <a
            href="https://www.instagram.com/pgmobler/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Følg oss
          </a>
        </div>

        {/* Scrollable carousel of live embeds */}
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-elevated flex items-center justify-center hover:bg-stone-50 transition-colors"
              aria-label="Scroll venstre"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-elevated flex items-center justify-center hover:bg-stone-50 transition-colors"
              aria-label="Scroll høyre"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 snap-start"
                style={{ width: "min(320px, 80vw)" }}
              >
                <InstagramEmbed url={post.url} caption={post.caption} />
              </div>
            ))}

            {/* Final card — CTA to follow */}
            <div
              className="flex-shrink-0 snap-start flex items-center justify-center"
              style={{ width: "min(320px, 80vw)" }}
            >
              <a
                href="https://www.instagram.com/pgmobler/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors p-8 text-center"
              >
                <svg className="w-10 h-10 text-stone-300 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333 2.175 8.741 2.163 12 2.163z" />
                </svg>
                <p className="text-stone-500 font-medium mb-1">Se mer på Instagram</p>
                <p className="text-stone-400 text-sm">@pgmobler</p>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile follow button */}
        <div className="sm:hidden text-center mt-6">
          <a
            href="https://www.instagram.com/pgmobler/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-xl text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333 2.175 8.741 2.163 12 2.163z" />
            </svg>
            Følg @pgmobler
          </a>
        </div>
      </div>
    </section>
  );
}

/** Single Instagram embed — uses the official blockquote + embed.js approach */
function InstagramEmbed({ url, caption }: { url: string; caption?: string | null }) {
  // Clean the URL and build the embed permalink
  const cleanUrl = url.replace(/\/$/, "") + "/";

  return (
    <blockquote
      className="instagram-media rounded-xl overflow-hidden"
      data-instgrm-captioned={caption ? "" : undefined}
      data-instgrm-permalink={cleanUrl}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: "12px",
        margin: 0,
        maxWidth: "100%",
        minWidth: "280px",
        padding: 0,
        width: "100%",
      }}
    />
  );
}
