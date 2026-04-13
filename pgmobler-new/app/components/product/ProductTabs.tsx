import { useState } from "react";
import type { Product } from "~/lib/db/schema";

interface ProductTabsProps {
  product: Product;
  tabLabels?: {
    description?: string;
    details?: string;
    moreInfo?: string;
  };
}

export function ProductTabs({ product, tabLabels }: ProductTabsProps) {
  const tabs = [
    {
      id: "description",
      label: tabLabels?.description || "Beskrivelse",
      content: product.description,
    },
    {
      id: "details",
      label: tabLabels?.details || "Detaljer",
      content: buildDetailsContent(product),
    },
    {
      id: "more",
      label: tabLabels?.moreInfo || "Mer informasjon",
      content: product.moreInformation,
    },
  ].filter((tab) => tab.content);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "description");

  if (tabs.length === 0) return null;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: tab.content || "" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function buildDetailsContent(product: Product): string | null {
  const rows: string[] = [];

  if (product.material) rows.push(`<tr><td class="font-medium pr-4">Materiale</td><td>${product.material}</td></tr>`);
  if (product.color) rows.push(`<tr><td class="font-medium pr-4">Farge</td><td>${product.color}</td></tr>`);
  if (product.height) rows.push(`<tr><td class="font-medium pr-4">Høyde</td><td>${product.height}</td></tr>`);
  if (product.width) rows.push(`<tr><td class="font-medium pr-4">Bredde</td><td>${product.width}</td></tr>`);
  if (product.depth) rows.push(`<tr><td class="font-medium pr-4">Dybde</td><td>${product.depth}</td></tr>`);
  if (product.length) rows.push(`<tr><td class="font-medium pr-4">Lengde</td><td>${product.length}</td></tr>`);

  if (rows.length === 0) return null;

  return `<table class="w-full"><tbody>${rows.join("")}</tbody></table>`;
}
