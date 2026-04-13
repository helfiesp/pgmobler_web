import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { getDb } from "~/lib/services/db.server";
import {
  getOrCreateCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  createCartCookie,
} from "~/lib/services/cart.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  const { cartId, isNew } = await getOrCreateCart(db, request);
  const headers = new Headers();
  if (isNew) {
    headers.set("Set-Cookie", createCartCookie(cartId));
  }

  switch (intent) {
    case "add": {
      const productId = Number(form.get("productId"));
      const quantity = Number(form.get("quantity")) || 1;
      const fabric = (form.get("fabric") as string) || undefined;
      const legs = (form.get("legs") as string) || undefined;
      if (!productId) return json({ error: "Missing productId" }, { status: 400 });
      await addToCart(db, cartId, productId, quantity, { fabric, legs });
      return json({ success: true }, { headers });
    }
    case "update": {
      const itemId = Number(form.get("itemId"));
      const quantity = Number(form.get("quantity"));
      if (!itemId) return json({ error: "Missing itemId" }, { status: 400 });
      await updateCartItemQuantity(db, itemId, quantity);
      return json({ success: true }, { headers });
    }
    case "remove": {
      const itemId = Number(form.get("itemId"));
      if (!itemId) return json({ error: "Missing itemId" }, { status: 400 });
      await removeCartItem(db, itemId);
      return json({ success: true }, { headers });
    }
    default:
      return json({ error: "Unknown intent" }, { status: 400 });
  }
}
