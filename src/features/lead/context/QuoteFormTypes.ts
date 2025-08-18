import type { FormData, FieldValid } from '@/features/lead/context/types';
import type { I18N_TEXT as I18N_TYPE } from '@/features/lead/context/i18n';
import type { ComponentType } from 'react';

export interface QuoteFormContextValue {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  fieldValid: FieldValid;
  setFieldValid: React.Dispatch<React.SetStateAction<FieldValid>>;

  // Step 1 UI state
  countrySearch: string;
  setCountrySearch: React.Dispatch<React.SetStateAction<string>>;
  isCountryListVisible: boolean;
  setIsCountryListVisible: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedCountryIndex: number;
  setHighlightedCountryIndex: React.Dispatch<React.SetStateAction<number>>;

  // Language
  userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru';
  setUserLang: React.Dispatch<
    React.SetStateAction<'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru'>
  >;

  phonePrefixSearch: string;
  setPhonePrefixSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedCountrySearch: string;
  setDebouncedCountrySearch: React.Dispatch<React.SetStateAction<string>>;

  // Destination
  destPortSearch: string;
  setDestPortSearch: React.Dispatch<React.SetStateAction<string>>;
  isDestPortListVisible: boolean;
  setIsDestPortListVisible: React.Dispatch<React.SetStateAction<boolean>>;

  // Origin
  originPortSearch: string;
  setOriginPortSearch: React.Dispatch<React.SetStateAction<string>>;
  isOriginPortListVisible: boolean;
  setIsOriginPortListVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleOriginLocationTypeSelect: (typeId: string) => void;
  handleOriginPortSelect: (portCode: string) => void;

  // Step 5
  step5SubStep: number;
  setStep5SubStep: React.Dispatch<React.SetStateAction<number>>;
  activeLoadIndex: number;
  setActiveLoadIndex: React.Dispatch<React.SetStateAction<number>>;
  shippingType: 'container' | 'pallets' | 'loose';
  setShippingType: React.Dispatch<React.SetStateAction<'container' | 'pallets' | 'loose'>>;

  // Currency (Step 5)
  currencySearch: string;
  setCurrencySearch: React.Dispatch<React.SetStateAction<string>>;
  isCurrencyListVisible: boolean;
  setIsCurrencyListVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleCurrencySelect: (currencyCode: string) => void;

  // Filtering
  getDestinationLocationTypes: () => Array<{
    id: string;
    name: string;
    icon: ComponentType<{ size?: number | string; className?: string }>;
  }>;
  getFilteredDestinationPorts: () => Array<{ code: string; name: string; flag: string; type?: string; volume?: string }>;
  getFilteredOriginPorts: () => Array<{ code: string; name: string; flag: string; type?: string; volume?: string }>;
  filteredCountries: Array<{ code: string; name: string; flag: string }>;
  sanitizedCountrySearch: string;

  // I18N and helpers
  I18N_TEXT: typeof I18N_TYPE;
  getText: (key: string, fallback?: string) => string;
  getLocationTypeName: (typeId: string, userLang: string) => string;
  getLocationTypeDescription: (typeId: string, userLang: string) => string;
  getTranslatedPortNameLocal: (port: { code: string; name: string }, userLang: string) => string;
  getTranslatedPortType: (portType: string, userLang: string) => string;
  getSearchPortsText: (countryCode: string, userLang: string) => string;
  getTranslatedCountryName: (
    countryCode: string,
    userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru'
  ) => string;

  // Handlers
  handleCountrySelect: (countryCode: string) => void;
  handleCountrySearchKeyDown: (e: React.KeyboardEvent) => void;
  clearCountrySelection: () => void;
  handleDestLocationTypeSelect: (typeId: string) => void;
  handleDestPortSelect: (portCode: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

