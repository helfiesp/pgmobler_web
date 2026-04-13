import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCart, clearCart, getCartIdFromRequest } from "~/lib/services/cart.server";
import { getSessionFromRequest } from "~/lib/services/auth.server";
import { createCustomerManual } from "~/lib/services/customer.server";
import { getNextOrderNumber } from "~/lib/services/order.server";
import { orders, orderItems } from "~/lib/db/schema";
import { formatPrice } from "~/lib/utils/format";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () =>
  buildMeta({ title: "Kasse", description: "Fullfør din bestilling hos PG Møbler" });

export async function loader({ request, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const cart = await getCart(db, request);

  if (!cart || cart.items.length === 0) {
    return redirect("/handlekurv");
  }

  const sessionData = await getSessionFromRequest(request, context);

  return json({
    cart,
    customer: sessionData?.customer ?? null,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const cart = await getCart(db, request);

  if (!cart || cart.items.length === 0) {
    return redirect("/handlekurv");
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const streetAddress = String(formData.get("streetAddress") || "").trim();
  const zipCode = String(formData.get("zipCode") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const paymentMethod = String(formData.get("paymentMethod") || "invoice").trim();
  const deliveryNotes = String(formData.get("deliveryNotes") || "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Navn er påkrevd";
  if (!email) errors.email = "E-post er påkrevd";
  if (!phone) errors.phone = "Telefonnummer er påkrevd";
  if (!streetAddress) errors.streetAddress = "Adresse er påkrevd";
  if (!zipCode) errors.zipCode = "Postnummer er påkrevd";
  if (!city) errors.city = "Poststed er påkrevd";

  if (Object.keys(errors).length > 0) {
    return json({ errors, values: { name, email, phone, streetAddress, zipCode, city, paymentMethod, deliveryNotes } }, { status: 400 });
  }

  // Check if logged in, otherwise create a guest customer
  const sessionData = await getSessionFromRequest(request, context);
  let customerId: number;

  if (sessionData?.customer) {
    customerId = sessionData.customer.id;
  } else {
    const customer = await createCustomerManual(db, {
      name,
      email,
      phone,
      streetAddress,
      zipCode,
      city,
    });
    customerId = customer.id;
  }

  const orderNumber = await getNextOrderNumber(db);

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerId,
      status: "pending",
      totalPrice: cart.totalPrice,
      paymentMethod,
      paymentStatus: "unpaid",
      deliveryInfo: deliveryNotes || null,
      source: "online",
    })
    .returning();

  for (const item of cart.items) {
    const unitPrice = item.product.salePrice ?? item.product.price ?? 0;
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: item.productId,
      productName: item.product.title,
      productInfo: [item.fabric, item.legs].filter(Boolean).join(", ") || null,
      fabric: item.fabric,
      legs: item.legs,
      quantity: item.quantity,
      unitPrice,
    });
  }

  // Clear the cart
  const cartId = getCartIdFromRequest(request);
  if (cartId) {
    await clearCart(db, cartId);
  }

  return redirect(`/kasse/bekreftelse/${orderNumber}`);
}

export default function CheckoutPage() {
  const { cart, customer } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const errors: Record<string, string> = actionData?.errors ?? {};
  const values: Record<string, string> = actionData?.values ?? {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Kasse</h1>

      <Form method="post">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping info */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Leveringsinformasjon</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Fullt navn
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    defaultValue={values.name ?? customer?.name ?? ""}
                    autoComplete="name"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    E-post
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    defaultValue={values.email ?? customer?.email ?? ""}
                    autoComplete="email"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    defaultValue={values.phone ?? customer?.phone ?? ""}
                    autoComplete="tel"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="streetAddress" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Gateadresse
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    required
                    defaultValue={values.streetAddress ?? customer?.streetAddress ?? ""}
                    autoComplete="street-address"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.streetAddress && <p className="text-danger text-xs mt-1">{errors.streetAddress}</p>}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Postnummer
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    defaultValue={values.zipCode ?? customer?.zipCode ?? ""}
                    autoComplete="postal-code"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.zipCode && <p className="text-danger text-xs mt-1">{errors.zipCode}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Poststed
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    defaultValue={values.city ?? customer?.city ?? ""}
                    autoComplete="address-level2"
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                  {errors.city && <p className="text-danger text-xs mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Betalingsmetode</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-secondary/40 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="invoice"
                    defaultChecked={!values.paymentMethod || values.paymentMethod === "invoice"}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div>
                    <p className="text-sm font-medium">Faktura</p>
                    <p className="text-xs text-muted">Betal med faktura etter levering</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-secondary/40 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="in_store"
                    defaultChecked={values.paymentMethod === "in_store"}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div>
                    <p className="text-sm font-medium">Betal i butikk</p>
                    <p className="text-xs text-muted">Betal ved henting i butikk</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery notes */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Leveringsnotater</h2>
              <textarea
                name="deliveryNotes"
                rows={3}
                defaultValue={values.deliveryNotes ?? ""}
                placeholder="Eventuelle merknader til leveringen (valgfritt)"
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none"
              />
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Ordresammendrag</h2>

              <div className="space-y-3 mb-4">
                {cart.items.map((item) => {
                  const price = item.product.salePrice ?? item.product.price ?? 0;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-muted">Antall: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium whitespace-nowrap">{formatPrice(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Delsum</span>
                  <span className="font-medium">{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Frakt</span>
                  <span className="text-muted">Avtales separat</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-bold">Totalt</span>
                    <span className="font-bold">{formatPrice(cart.totalPrice)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-3.5 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
              >
                Fullfør bestilling
              </button>

              <Link
                to="/handlekurv"
                className="block w-full mt-3 text-center text-sm text-muted hover:text-primary transition-colors"
              >
                Tilbake til handlekurv
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
