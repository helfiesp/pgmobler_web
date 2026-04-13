import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCmsBySection } from "~/lib/services/cms.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () => {
  return buildMeta({
    title: "Om oss",
    description: "Lær mer om PG Møbler — din møbelbutikk i Stavanger.",
  });
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const business = await getCmsBySection(db, "business");
  return json({ business });
}

export default function AboutPage() {
  const { business } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Om oss</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          {business.about_us_text ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: business.about_us_text }}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              PG Møbler er en familiedrevet møbelbutikk med et bredt utvalg av
              kvalitetsmøbler. Vi tilbyr møbler til stue, spisestue og soverom
              fra kjente leverandører.
            </p>
          )}
        </div>

        <div className="bg-surface rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4">Besøk oss</h2>
          <address className="not-italic text-gray-700 space-y-2 text-sm">
            {business.street_address && <p>{business.street_address}</p>}
            {(business.zip_code || business.zip_code_area) && (
              <p>
                {business.zip_code} {business.zip_code_area}
              </p>
            )}
            {business.main_phone && (
              <p>
                Telefon:{" "}
                <a href={`tel:${business.main_phone}`} className="text-accent hover:underline">
                  {business.main_phone}
                </a>
              </p>
            )}
            {business.main_email && (
              <p>
                E-post:{" "}
                <a href={`mailto:${business.main_email}`} className="text-accent hover:underline">
                  {business.main_email}
                </a>
              </p>
            )}
          </address>
        </div>
      </div>
    </div>
  );
}
