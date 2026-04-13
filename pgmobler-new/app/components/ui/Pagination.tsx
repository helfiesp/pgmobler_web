import { Link, useSearchParams } from "@remix-run/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const [searchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("side", String(page));
    return `?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Sidenavigasjon">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          to={buildUrl(currentPage - 1)}
          className="px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
          aria-label="Forrige side"
        >
          &laquo;
        </Link>
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 py-2 text-muted text-sm">
            ...
          </span>
        ) : (
          <Link
            key={page}
            to={buildUrl(page)}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          to={buildUrl(currentPage + 1)}
          className="px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
          aria-label="Neste side"
        >
          &raquo;
        </Link>
      )}
    </nav>
  );
}
