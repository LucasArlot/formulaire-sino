export type LengthUnit = 'CM' | 'M' | 'IN';
export type WeightUnit = 'KG' | 'LB' | 'T';
export type VolumeUnit = 'CBM' | 'CFT';

const CM_PER_IN = 2.54;
const M_PER_CM = 0.01;
const KG_PER_LB = 0.45359237;
const KG_PER_TON = 1000;
const CFT_PER_CBM = 35.3146667;

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  if (!isFinite(value)) return 0;
  // normalize to CM
  let cm = value;
  if (from === 'M') cm = value / M_PER_CM;
  if (from === 'IN') cm = value * CM_PER_IN;
  // CM to target
  if (to === 'CM') return round(cm, 3);
  if (to === 'M') return round(cm * M_PER_CM, 4);
  if (to === 'IN') return round(cm / CM_PER_IN, 3);
  return value;
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (!isFinite(value)) return 0;
  // normalize to KG
  let kg = value;
  if (from === 'LB') kg = value * KG_PER_LB;
  if (from === 'T') kg = value * KG_PER_TON;
  // KG to target
  if (to === 'KG') return round(kg, 3);
  if (to === 'LB') return round(kg / KG_PER_LB, 3);
  if (to === 'T') return round(kg / KG_PER_TON, 3);
  return value;
}

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (!isFinite(value)) return 0;
  // normalize to CBM
  let cbm = value;
  if (from === 'CFT') cbm = value / CFT_PER_CBM;
  // CBM to target
  if (to === 'CBM') return round(cbm, 3);
  if (to === 'CFT') return round(cbm * CFT_PER_CBM, 3);
  return value;
}

export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

export function safeParseFloat(value?: string): number | null {
  if (value == null) return null;
  const n = parseFloat(String(value).replace(',', '.'));
  return isFinite(n) ? n : null;
}

