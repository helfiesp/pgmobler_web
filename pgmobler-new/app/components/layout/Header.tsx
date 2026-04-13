import { Link, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import type { CategoryWithChildren } from "~/lib/services/category.server";

interface HeaderProps {
  categories: CategoryWithChildren[];
  cms: Record<string, string>;
  cartCount?: number;
  isLoggedIn?: boolean;
}

export function Header({ categories, cms, cartCount = 0, isLoggedIn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Top-level parent categories for the nav bar
  const parentCategories = categories.filter((c) => !c.parentId || categories.every(p => p.id !== c.parentId));

  return (
    <>
      {/* Top strip */}
      <div className="bg-stone-900 text-stone-300 text-center py-2 px-4 text-[13px]">
        {cms.front_page_subtitle || "Besøk oss — Man-Fre 11-18, Lør 10-15"}
      </div>

      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px] md:h-[68px]">
            {/* Left — hamburger on mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-stone-50 rounded-lg transition-colors"
              aria-label="Åpne meny"
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Center — logo (always centered) */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-[22px] md:text-[26px] font-bold tracking-[0.18em] uppercase select-none">
                PG Møbler
              </span>
            </Link>

            {/* Right — actions */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 hover:bg-stone-50 rounded-lg transition-colors"
                aria-label="Søk"
              >
                <svg className="w-[21px] h-[21px] text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <Link
                to={isLoggedIn ? "/konto" : "/konto/logg-inn"}
                className="hidden sm:flex p-2.5 hover:bg-stone-50 rounded-lg transition-colors"
                aria-label={isLoggedIn ? "Min konto" : "Logg inn"}
              >
                <svg className="w-[21px] h-[21px] text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
              <Link
                to="/handlekurv"
                className="p-2.5 hover:bg-stone-50 rounded-lg transition-colors relative"
                aria-label="Handlekurv"
              >
                <svg className="w-[21px] h-[21px] text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Category nav — desktop only */}
        <nav className="hidden lg:block border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex items-center justify-center gap-1 py-1">
              {parentCategories.map((cat) => {
                const isActive = location.pathname === `/kategorier/${cat.slug}`;
                const hasChildren = cat.children?.length > 0;

                return (
                  <li key={cat.id} className="relative group">
                    <Link
                      to={`/kategorier/${cat.slug}`}
                      className={`block px-4 py-2.5 text-[13px] tracking-wide transition-colors rounded-md ${
                        isActive
                          ? "text-secondary font-semibold"
                          : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      {cat.name}
                    </Link>

                    {/* Simple dropdown for subcategories */}
                    {hasChildren && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 hidden group-hover:block z-50">
                        <div className="bg-white rounded-xl shadow-elevated border border-stone-100 py-2 min-w-[200px]">
                          <Link
                            to={`/kategorier/${cat.slug}`}
                            className="block px-5 py-2.5 text-sm text-stone-900 font-medium hover:bg-stone-50 transition-colors"
                          >
                            Vis alle {cat.name.toLowerCase()}
                          </Link>
                          <div className="h-px bg-stone-100 my-1" />
                          {cat.children.map((child) => (
                            <Link
                              key={child.id}
                              to={`/kategorier/${child.slug}`}
                              className="block px-5 py-2.5 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}

              <li>
                <Link
                  to="/produkter"
                  className={`block px-4 py-2.5 text-[13px] tracking-wide transition-colors rounded-md ${
                    location.pathname === "/produkter"
                      ? "text-secondary font-semibold"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  Alle produkter
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        isLoggedIn={isLoggedIn}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
