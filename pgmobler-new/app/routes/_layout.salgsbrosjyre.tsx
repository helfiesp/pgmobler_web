import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/lib/services/db.server";
import { getCmsValue } from "~/lib/services/cms.server";
import { buildMeta } from "~/lib/utils/seo";

export const meta: MetaFunction = () => {
  return buildMeta({
    title: "Salgsbrosjyre",
    description: "Se vår siste salgsbrosjyre med gode tilbud.",
  });
};

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context);
  const catalogueUrl = await getCmsValue(db, "sale_catalogue");
  return json({ catalogueUrl });
}

export default function SaleCataloguePage() {
  const { catalogueUrl } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Salgsbrosjyre</h1>

      {catalogueUrl ? (
        <div className="aspect-[3/4] md:aspect-[4/3] w-full">
          <iframe
            src={catalogueUrl}
            title="Salgsbrosjyre"
            className="w-full h-full rounded-lg border border-gray-200"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <p>Ingen salgsbrosjyre tilgjengelig for øyeblikket.</p>
        </div>
      )}
    </div>
  );
}
