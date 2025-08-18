export interface LoadDetails {
  shippingType: 'loose' | 'container' | 'unsure' | '';
  calculationType: 'unit' | 'total';
  packageType: 'pallets' | 'boxes' | '';
  numberOfUnits: number;
  palletType: string;
  dimensions: { length: string; width: string; height: string };
  dimensionUnit: string;
  weightPerUnit: string;
  weightUnit: string;
  totalVolume: string;
  totalVolumeUnit: string;
  totalWeight: string;
  totalWeightUnit: string;
  containerType: "20'" | "40'" | "40'HC" | "45'HC";
  isOverweight: boolean;
  specialRequirements?: string[];
  goodsDescription?: string;
  urgency?: string;
}

export const initialLoadDetails: LoadDetails = {
  shippingType: '',
  calculationType: 'total',
  packageType: 'pallets',
  numberOfUnits: 1,
  palletType: 'non_specified',
  dimensions: { length: '', width: '', height: '' },
  dimensionUnit: 'CM',
  weightPerUnit: '',
  weightUnit: 'KG',
  totalVolume: '',
  totalVolumeUnit: 'CBM',
  totalWeight: '',
  totalWeightUnit: 'KG',
  containerType: "20'",
  isOverweight: false,
  specialRequirements: [],
  goodsDescription: '',
  urgency: '',
};

export interface FormData {
  country: string;
  origin: string;
  mode: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  customerType?: 'individual' | 'company' | '';
  locationType: string;
  city: string;
  zipCode: string;
  destLocationType: string;
  destCity: string;
  destZipCode: string;
  destPort: string;
  firstName: string;
  lastName: string;
  companyName: string;
  shipperType: string;
  loads: LoadDetails[];
  goodsValue: string;
  goodsCurrency: string;
  isPersonalOrHazardous: boolean;
  areGoodsReady: string;
  goodsDescription: string;
  specialRequirements: string;
  remarks: string;
}

export const initialFormData: FormData = {
  country: '',
  origin: '',
  mode: '',
  email: '',
  phone: '',
  phoneCountryCode: '+234',
  customerType: '',
  locationType: '',
  city: '',
  zipCode: '',
  destLocationType: '',
  destCity: '',
  destZipCode: '',
  destPort: '',
  firstName: '',
  lastName: '',
  companyName: '',
  shipperType: '',
  loads: [JSON.parse(JSON.stringify(initialLoadDetails))],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  goodsDescription: '',
  specialRequirements: '',
  remarks: '',
};

export interface FieldValid {
  country: boolean | null;
  origin: boolean | null;
  mode: boolean | null;
  email: boolean | null;
  phone: boolean | null;
  phoneCountryCode: boolean | null;
  city: boolean | null;
  zipCode: boolean | null;
  destCity: boolean | null;
  destZipCode: boolean | null;
  destPort: boolean | null;
  firstName: boolean | null;
  lastName: boolean | null;
  companyName: boolean | null;
  shipperType: boolean | null;
  goodsValue: boolean | null;
  destLocationType: boolean | null;
}

export const initialFieldValid: FieldValid = {
  country: null,
  origin: null,
  mode: null,
  email: null,
  phone: null,
  phoneCountryCode: null,
  city: null,
  zipCode: null,
  destCity: null,
  destZipCode: null,
  destPort: null,
  firstName: null,
  lastName: null,
  companyName: null,
  shipperType: null,
  goodsValue: null,
  destLocationType: null,
};
