import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCart } from "~/lib/services/cart.server";
import { formatPrice } from "~/lib/utils/format";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Handlekurv" });

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const cart = await getCart(db, request);
  return json({ cart });
}

export default function CartPage() {
  const { cart } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Handlekurven er tom</h1>
        <p className="text-muted mb-6">Du har ingen produkter i handlekurven</p>
        <Link to="/produkter" className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors">
          Se produkter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Handlekurv</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.product.salePrice ?? item.product.price ?? 0;
            return (
              <div key={item.id} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                <Link to={`/produkt/${item.product.slug}`} className="w-20 h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" /></svg>
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/produkt/${item.product.slug}`} className="font-medium text-sm hover:text-secondary transition-colors">
                    {item.product.title}
                  </Link>
                  <p className="text-sm font-bold mt-1">{formatPrice(price)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <fetcher.Form method="post" action="/api/cart">
                        <input type="hidden" name="intent" value="update" />
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quantity" value={Math.max(0, item.quantity - 1)} />
                        <button type="submit" className="px-2.5 py-1 text-muted hover:text-primary text-sm">-</button>
                      </fetcher.Form>
                      <span className="px-2 py-1 text-sm font-medium">{item.quantity}</span>
                      <fetcher.Form method="post" action="/api/cart">
                        <input type="hidden" name="intent" value="update" />
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quantity" value={item.quantity + 1} />
                        <button type="submit" className="px-2.5 py-1 text-muted hover:text-primary text-sm">+</button>
                      </fetcher.Form>
                    </div>
                    <fetcher.Form method="post" action="/api/cart">
                      <input type="hidden" name="intent" value="remove" />
                      <input type="hidden" name="itemId" value={item.id} />
                      <button type="submit" className="text-xs text-muted hover:text-danger transition-colors">
                        Fjern
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatPrice(price * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Sammendrag</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Delsum</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Frakt</span>
                <span className="text-muted">Beregnes ved kasse</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-base">
                  <span className="font-bold">Totalt</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/kasse"
              className="block w-full mt-6 bg-primary text-white py-3.5 text-center text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
            >
              Gå til kasse
            </Link>
            <Link
              to="/produkter"
              className="block w-full mt-3 text-center text-sm text-muted hover:text-primary transition-colors"
            >
              Fortsett å handle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
