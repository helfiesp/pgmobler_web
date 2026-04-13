import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { getDb } from "~/lib/services/db.server";
import { upsertCmsContent } from "~/lib/services/cms.server";

export async function action({ request, context }: ActionFunctionArgs) {
  // TODO: Add proper auth check here
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-cms") {
    const key = formData.get("key") as string;
    const value = formData.get("value") as string;

    if (!key) {
      return json({ error: "Missing key" }, { status: 400 });
    }

    const db = getDb(context);

    // Determine section from key prefix
    let section = "page";
    if (key.startsWith("footer_")) section = "footer";
    else if (
      ["street_address", "zip_code", "zip_code_area", "main_email", "secondary_email", "main_phone", "secondary_phone", "about_us_text"].includes(key)
    ) {
      section = "business";
    } else if (key.startsWith("nav_item")) {
      section = "nav";
    }

    await upsertCmsContent(db, key, value, section);

    return json({ success: true });
  }

  return json({ error: "Unknown intent" }, { status: 400 });
}
