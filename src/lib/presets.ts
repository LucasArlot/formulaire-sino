export type PackagePreset = {
  code: string;
  label: string;
  // dimensions in CM
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export const PALLET_PRESETS: PackagePreset[] = [
  { code: 'eur1', label: 'Palette EUR1 (120×80 cm)', lengthCm: 120, widthCm: 80, heightCm: 150 },
  { code: 'standard', label: 'Palette Standard (120×100 cm)', lengthCm: 120, widthCm: 100, heightCm: 150 },
];

export const BOX_PRESETS: PackagePreset[] = [
  { code: 'cardboard_small', label: 'Carton petit (30×25×20 cm)', lengthCm: 30, widthCm: 25, heightCm: 20 },
  { code: 'cardboard_medium', label: 'Carton moyen (40×30×30 cm)', lengthCm: 40, widthCm: 30, heightCm: 30 },
  { code: 'cardboard_large', label: 'Carton grand (60×40×40 cm)', lengthCm: 60, widthCm: 40, heightCm: 40 },
];

