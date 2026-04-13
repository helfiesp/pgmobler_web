import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Søk"
      >
        <Form action="/produkter" method="get" onSubmit={onClose}>
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              name="q"
              placeholder="Søk etter produkter, kategorier..."
              className="w-full pl-14 pr-14 py-5 text-base border-0 focus:outline-none placeholder:text-muted/50"
              autoComplete="off"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-muted bg-surface rounded border border-border">
                ESC
              </kbd>
            </div>
          </div>
        </Form>
        <div className="px-5 py-3 border-t border-border bg-surface/50">
          <p className="text-xs text-muted">
            Tips: Bruk <kbd className="px-1 py-0.5 text-[10px] font-mono bg-white rounded border border-border">⌘K</kbd> for hurtigsøk
          </p>
        </div>
      </div>
    </div>
  );
}
