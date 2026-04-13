import { useState } from "react";
import type { ProductImage } from "~/lib/db/schema";

const COLOR_MAP: Record<string, { label: string; hex: string }> = {
  black: { label: "Sort", hex: "#1a1a1a" },
  smoked: { label: "Røkt eik", hex: "#5c4a3a" },
  greyoiled: { label: "Gråoljet", hex: "#8a8a8a" },
  whiteoiled: { label: "Hvitoljet", hex: "#e8dcc8" },
  light_oak: { label: "Lys eik", hex: "#c4a46c" },
};

interface ColorSelectorProps {
  images: ProductImage[];
  colorFlags: {
    colorBlack: boolean | null;
    colorSmoked: boolean | null;
    colorGreyoiled: boolean | null;
    colorWhiteoiled: boolean | null;
    colorLightOak: boolean | null;
  };
  onColorSelect: (color: string | null) => void;
  selectedColor: string | null;
}

export function ColorSelector({
  colorFlags,
  onColorSelect,
  selectedColor,
}: ColorSelectorProps) {
  const availableColors: { key: string; label: string; hex: string }[] = [];

  if (colorFlags.colorBlack) availableColors.push({ key: "black", ...COLOR_MAP.black });
  if (colorFlags.colorSmoked) availableColors.push({ key: "smoked", ...COLOR_MAP.smoked });
  if (colorFlags.colorGreyoiled) availableColors.push({ key: "greyoiled", ...COLOR_MAP.greyoiled });
  if (colorFlags.colorWhiteoiled) availableColors.push({ key: "whiteoiled", ...COLOR_MAP.whiteoiled });
  if (colorFlags.colorLightOak) availableColors.push({ key: "light_oak", ...COLOR_MAP.light_oak });

  if (availableColors.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-muted uppercase tracking-wider mb-2">
        Farge{selectedColor ? `: ${COLOR_MAP[selectedColor]?.label}` : ""}
      </p>
      <div className="flex gap-2">
        {availableColors.map((color) => (
          <button
            key={color.key}
            onClick={() =>
              onColorSelect(selectedColor === color.key ? null : color.key)
            }
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.key
                ? "border-primary scale-110"
                : "border-gray-200 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.label}
            aria-label={`Velg farge: ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
}
