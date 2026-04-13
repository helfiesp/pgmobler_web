import { Link, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { CategoryWithChildren } from "~/lib/services/category.server";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryWithChildren[];
  isLoggedIn?: boolean;
}

export function MobileMenu({ open, onClose, categories, isLoggedIn }: MobileMenuProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setExpandedId(null);
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const parentCategories = categories.filter((c) => !c.parentId || categories.every(p => p.id !== c.parentId));

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/25 z-50 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-50 lg:hidden flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-stone-100">
          <span className="font-bold text-lg tracking-[0.12em] uppercase">Meny</span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-stone-50 rounded-lg transition-colors"
            aria-label="Lukk"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <Form action="/produkter" method="get" onSubmit={onClose}>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Søk etter møbler..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl text-sm placeholder:text-stone-400 border-0 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </Form>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          {/* Quick links */}
          <div className="pb-2 mb-2 border-b border-stone-100">
            <Link to="/" onClick={onClose} className="flex items-center px-3 py-3 text-[15px] rounded-xl hover:bg-stone-50 transition-colors">
              Hjem
            </Link>
            <Link to="/produkter" onClick={onClose} className="flex items-center px-3 py-3 text-[15px] rounded-xl hover:bg-stone-50 transition-colors">
              Alle produkter
            </Link>
          </div>

          {/* Categories */}
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Kategorier
          </p>
          {parentCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center">
                <Link
                  to={`/kategorier/${cat.slug}`}
                  onClick={onClose}
                  className="flex-1 px-3 py-3 text-[15px] rounded-xl hover:bg-stone-50 transition-colors"
                >
                  {cat.name}
                </Link>
                {cat.children?.length > 0 && (
                  <button
                    onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                    className="p-3 hover:bg-stone-50 rounded-xl transition-colors"
                    aria-label={`${expandedId === cat.id ? "Skjul" : "Vis"} underkategorier`}
                  >
                    <svg
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                        expandedId === cat.id ? "rotate-180" : ""
                      }`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {expandedId === cat.id && cat.children?.length > 0 && (
                <div className="ml-3 pl-3 border-l-2 border-stone-100 mb-1">
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/kategorier/${child.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 text-[14px] text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer links */}
          <div className="pt-2 mt-2 border-t border-stone-100">
            <Link to="/om-oss" onClick={onClose} className="flex items-center px-3 py-3 text-[15px] text-stone-500 rounded-xl hover:bg-stone-50 transition-colors">
              Om oss
            </Link>
            <Link to="/kontakt" onClick={onClose} className="flex items-center px-3 py-3 text-[15px] text-stone-500 rounded-xl hover:bg-stone-50 transition-colors">
              Kontakt
            </Link>
          </div>
        </nav>

        {/* Account */}
        <div className="px-5 py-4 border-t border-stone-100">
          <Link
            to={isLoggedIn ? "/konto" : "/konto/logg-inn"}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {isLoggedIn ? "Min konto" : "Logg inn"}
          </Link>
        </div>
      </div>
    </>
  );
}
