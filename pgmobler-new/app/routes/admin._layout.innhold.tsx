import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { getDb } from "~/lib/services/db.server";
import { getAllCmsContent, upsertCmsContent } from "~/lib/services/cms.server";

const CMS_SECTIONS = [
  {
    id: "page",
    label: "Forsiden",
    fields: [
      { key: "front_page_header", label: "Overskrift", multiline: false },
      { key: "front_page_subtitle", label: "Undertittel", multiline: false },
      { key: "front_page_button_text", label: "Knappetekst", multiline: false },
      { key: "recent_product_header", label: "Nye produkter — overskrift", multiline: false },
      { key: "recent_product_text", label: "Nye produkter — beskrivelse", multiline: false },
      { key: "bestseller_header", label: "Bestselgere — overskrift", multiline: false },
      { key: "bestseller_text", label: "Bestselgere — beskrivelse", multiline: false },
      { key: "sale_catalogue", label: "Salgsbrosjyre URL", multiline: false },
    ],
  },
  {
    id: "nav",
    label: "Navigasjon",
    fields: [
      { key: "nav_item_1", label: "Menypunkt 1", multiline: false },
      { key: "nav_item_2", label: "Menypunkt 2", multiline: false },
      { key: "nav_item_3", label: "Menypunkt 3", multiline: false },
      { key: "nav_item_4", label: "Menypunkt 4", multiline: false },
    ],
  },
  {
    id: "footer",
    label: "Bunntekst",
    fields: [
      { key: "footer_header_1", label: "Kolonne 1 overskrift", multiline: false },
      { key: "footer_subtitle_1", label: "Kolonne 1 beskrivelse", multiline: true },
      { key: "footer_header_2", label: "Kolonne 2 overskrift", multiline: false },
      { key: "footer_header_3", label: "Kolonne 3 overskrift", multiline: false },
      { key: "footer_header_4", label: "Kolonne 4 overskrift", multiline: false },
    ],
  },
  {
    id: "business",
    label: "Bedriftsinformasjon",
    fields: [
      { key: "street_address", label: "Adresse", multiline: false },
      { key: "zip_code", label: "Postnummer", multiline: false },
      { key: "zip_code_area", label: "Sted", multiline: false },
      { key: "main_phone", label: "Telefon", multiline: false },
      { key: "secondary_phone", label: "Telefon 2", multiline: false },
      { key: "main_email", label: "E-post", multiline: false },
      { key: "secondary_email", label: "E-post 2", multiline: false },
      { key: "about_us_text", label: "Om oss-tekst", multiline: true },
    ],
  },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const cms = await getAllCmsContent(db);
  return json({ cms });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const formData = await request.formData();

  for (const section of CMS_SECTIONS) {
    for (const field of section.fields) {
      const value = formData.get(field.key) as string;
      if (value !== null && value !== undefined) {
        await upsertCmsContent(db, field.key, value, section.id);
      }
    }
  }

  return json({ success: true });
}

export default function AdminContent() {
  const { cms } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("page");
  const saving = navigation.state === "submitting";

  const activeSection = CMS_SECTIONS.find((s) => s.id === activeTab)!;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Innhold</h1>
        <p className="text-muted text-sm mt-1">Rediger tekst og innhold på nettsiden</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1">
        {CMS_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === section.id
                ? "bg-primary text-white"
                : "text-muted hover:text-primary hover:bg-surface"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <Form method="post" className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-lg">{activeSection.label}</h2>

        {activeSection.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                id={field.key}
                name={field.key}
                defaultValue={cms[field.key] || ""}
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-y"
              />
            ) : (
              <input
                type="text"
                id={field.key}
                name={field.key}
                defaultValue={cms[field.key] || ""}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            )}
          </div>
        ))}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Lagrer...
              </>
            ) : (
              "Lagre endringer"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
