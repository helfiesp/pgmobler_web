import { type MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Siden ble ikke funnet" });

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-gray-200">404</p>
        <h1 className="text-2xl font-bold mt-4">Siden ble ikke funnet</h1>
        <p className="text-muted mt-2">
          Beklager, vi finner ikke siden du leter etter. Den kan ha blitt
          flyttet eller slettet.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
          >
            Til forsiden
          </Link>
          <Link
            to="/produkter"
            className="inline-block border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-surface transition-colors"
          >
            Se produkter
          </Link>
        </div>
      </div>
    </div>
  );
}
