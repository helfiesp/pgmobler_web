import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCustomerById } from "~/lib/services/customer.server";
import { getNextOrderNumber } from "~/lib/services/order.server";
import { products, orders, orderItems } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "~/lib/utils/format";
import { useState } from "react";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const customerId = Number(params.customerId);

  const customer = await getCustomerById(db, customerId);
  if (!customer) {
    throw json({ message: "Kunde ikke funnet" }, { status: 404 });
  }

  const allProducts = await db.select().from(products).where(eq(products.enabled, true)).all();

  return json({ customer, products: allProducts });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const customerId = Number(params.customerId);
  const form = await request.formData();

  const customer = await getCustomerById(db, customerId);
  if (!customer) {
    throw json({ message: "Kunde ikke funnet" }, { status: 404 });
  }

  // Collect items from form
  const itemNames = form.getAll("itemName") as string[];
  const itemProductIds = form.getAll("itemProductId") as string[];
  const itemFabrics = form.getAll("itemFabric") as string[];
  const itemLegs = form.getAll("itemLegs") as string[];
  const itemQuantities = form.getAll("itemQuantity") as string[];
  const itemPrices = form.getAll("itemPrice") as string[];

  if (itemNames.length === 0) {
    return json({ error: "Legg til minst én ordrelinje" }, { status: 400 });
  }

  // Calculate total
  let itemsTotal = 0;
  const parsedItems = [];
  for (let i = 0; i < itemNames.length; i++) {
    const name = itemNames[i];
    if (!name) continue;

    const quantity = Number(itemQuantities[i]) || 1;
    const unitPrice = Number(itemPrices[i]) || 0;
    itemsTotal += quantity * unitPrice;

    parsedItems.push({
      productId: itemProductIds[i] ? Number(itemProductIds[i]) : null,
      productName: name,
      fabric: (itemFabrics[i] as string) || null,
      legs: (itemLegs[i] as string) || null,
      quantity,
      unitPrice,
      sortOrder: i,
    });
  }

  if (parsedItems.length === 0) {
    return json({ error: "Legg til minst én ordrelinje" }, { status: 400 });
  }

  const deliveryPrice = Number(form.get("deliveryPrice")) || 0;
  const totalPrice = itemsTotal + deliveryPrice;
  const orderNumber = await getNextOrderNumber(db);

  const [newOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerId,
      status: "confirmed",
      deliveryInfo: (form.get("deliveryInfo") as string) || null,
      deliveryPrice,
      extraInfo: (form.get("extraInfo") as string) || null,
      totalPrice,
      paidAmount: 0,
      remainingAmount: totalPrice,
      depositAmount: 0,
      salesman: (form.get("salesman") as string) || null,
      source: "in_store",
      paymentStatus: "unpaid",
    })
    .returning();

  // Insert order items
  for (const item of parsedItems) {
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.productName,
      fabric: item.fabric,
      legs: item.legs,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      sortOrder: item.sortOrder,
    });
  }

  return redirect(`/admin/bestillinger/${orderNumber}`);
}

interface ItemRow {
  key: number;
}

export default function AdminNewOrder() {
  const { customer, products: allProducts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";
  const [items, setItems] = useState<ItemRow[]>([{ key: 0 }]);
  const [nextKey, setNextKey] = useState(1);

  function addItem() {
    setItems((prev) => [...prev, { key: nextKey }]);
    setNextKey((k) => k + 1);
  }

  function removeItem(key: number) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link to={`/admin/kunder/${customer.id}`} className="text-sm text-muted hover:text-primary transition-colors">
          &larr; Tilbake til {customer.name}
        </Link>
        <h1 className="text-2xl font-bold mt-1">Ny bestilling</h1>
        <p className="text-muted text-sm mt-1">Opprett bestilling for {customer.name}</p>
      </div>

      <Form method="post" className="space-y-6">
        {/* Order items */}
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          <div className="p-6 flex items-center justify-between">
            <h2 className="font-bold">Ordrelinjer</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Legg til linje
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={item.key} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Linje {idx + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Fjern
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Produkt
                  </label>
                  <select
                    name="itemProductId"
                    onChange={(e) => {
                      const sel = e.currentTarget;
                      const opt = sel.options[sel.selectedIndex];
                      const nameInput = sel.closest(".space-y-4")?.querySelector<HTMLInputElement>('input[name="itemName"]');
                      const priceInput = sel.closest(".space-y-4")?.querySelector<HTMLInputElement>('input[name="itemPrice"]');
                      if (nameInput && opt.dataset.name) {
                        nameInput.value = opt.dataset.name;
                      }
                      if (priceInput && opt.dataset.price) {
                        priceInput.value = opt.dataset.price;
                      }
                    }}
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  >
                    <option value="">Velg produkt eller skriv inn manuelt</option>
                    {allProducts.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        data-name={p.title}
                        data-price={p.salePrice ?? p.price ?? 0}
                      >
                        {p.title} {p.price ? `- ${formatPrice(p.price)}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Produktnavn *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    required
                    placeholder="Produktnavn"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Stoff
                  </label>
                  <input
                    type="text"
                    name="itemFabric"
                    placeholder="f.eks. Hallingdal 65"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Ben
                  </label>
                  <input
                    type="text"
                    name="itemLegs"
                    placeholder="f.eks. Eik natur"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Antall
                  </label>
                  <input
                    type="number"
                    name="itemQuantity"
                    min="1"
                    defaultValue="1"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Enhetspris (kr)
                  </label>
                  <input
                    type="number"
                    name="itemPrice"
                    min="0"
                    defaultValue="0"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery & extras */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-bold">Levering og tillegg</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="deliveryInfo" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Leveringsinformasjon
              </label>
              <input
                type="text"
                name="deliveryInfo"
                id="deliveryInfo"
                placeholder="f.eks. Leveres til 2. etasje"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="deliveryPrice" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Fraktpris (kr)
              </label>
              <input
                type="number"
                name="deliveryPrice"
                id="deliveryPrice"
                min="0"
                defaultValue="0"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="salesman" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Selger
              </label>
              <input
                type="text"
                name="salesman"
                id="salesman"
                placeholder="Navn på selger"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="extraInfo" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Ekstra informasjon
              </label>
              <textarea
                name="extraInfo"
                id="extraInfo"
                rows={3}
                placeholder="Eventuelle merknader til bestillingen..."
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Oppretter..." : "Opprett bestilling"}
          </button>
        </div>
      </Form>
    </div>
  );
}
