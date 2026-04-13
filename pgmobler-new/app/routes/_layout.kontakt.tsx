import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCmsBySection } from "~/lib/services/cms.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () => {
  return buildMeta({
    title: "Kontakt",
    description: "Ta kontakt med PG Møbler. Vi hjelper deg gjerne!",
  });
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const business = await getCmsBySection(db, "business");
  return json({ business });
}

export default function ContactPage() {
  const { business } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Kontakt oss</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-lg mb-3">Adresse</h2>
            <address className="not-italic text-gray-700 leading-relaxed">
              {business.street_address && <p>{business.street_address}</p>}
              {(business.zip_code || business.zip_code_area) && (
                <p>
                  {business.zip_code} {business.zip_code_area}
                </p>
              )}
            </address>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Telefon</h2>
            {business.main_phone && (
              <a
                href={`tel:${business.main_phone}`}
                className="text-accent hover:underline text-lg"
              >
                {business.main_phone}
              </a>
            )}
            {business.secondary_phone && (
              <p className="mt-1">
                <a
                  href={`tel:${business.secondary_phone}`}
                  className="text-accent hover:underline"
                >
                  {business.secondary_phone}
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">E-post</h2>
            {business.main_email && (
              <a
                href={`mailto:${business.main_email}`}
                className="text-accent hover:underline"
              >
                {business.main_email}
              </a>
            )}
            {business.secondary_email && (
              <p className="mt-1">
                <a
                  href={`mailto:${business.secondary_email}`}
                  className="text-accent hover:underline"
                >
                  {business.secondary_email}
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Følg oss</h2>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/www.pgmobler.no"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/pgmobler/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Map or image placeholder */}
        <div className="bg-surface rounded-lg aspect-square flex items-center justify-center text-muted">
          <p className="text-center text-sm">
            Almedalsveien 4<br />
            Stavanger
          </p>
        </div>
      </div>
    </div>
  );
}
