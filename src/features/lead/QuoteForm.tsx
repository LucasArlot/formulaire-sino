import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Timeline from './Timeline';
import Toast from '@/shared/components/Toast';
import CustomDropdown from '@/shared/components/CustomDropdown';
import { useQuoteForm, initialLoadDetails } from '@/features/lead/QuoteFormContext';
import { useToast } from '@/hooks';
import StepDestination from './steps/StepDestination';
import StepMode from './steps/StepMode';
import StepOrigin from './steps/StepOrigin';
import StepContact from './steps/StepContact';
import StepFreight from './steps/StepFreight';
import StepGoodsDetails from './steps/StepGoodsDetails';
import StepConfirmation from './steps/StepConfirmation';

import { COUNTRIES } from '@/data/countries';
// import { COUNTRY_TRANSLATIONS } from '@/data/countryTranslations';
// import { getTranslatedPortName } from '@/data/portTranslations';
// import { TEST_LEADS } from '@/data/testLeads';

// LOCATION_TYPES moved to context; local copy removed

// Helper function to get translated country name
// const getTranslatedCountryName = (countryCode: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru'): string => {
//   const translations = COUNTRY_TRANSLATIONS[countryCode];
//   if (translations && translations[userLang]) {
//     return translations[userLang];
//   }
//   if (translations && translations.en) {
//     return translations.en;
//   }
//   const country = COUNTRIES.find(c => c.code === countryCode);
//   return country ? country.name : countryCode;
// };

// Helper function to get the correct "search ports in/à/en" text with proper preposition
/* const getSearchPortsText = (countryCode: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru'): string => {
  const baseText = I18N_TEXT[userLang].searchPortsIn;
  
  // French preposition rules
  if (userLang === 'fr') {
    // Countries with "à" (cities and small states)
    const countriesWithA = ['MC', 'AD', 'LI', 'VA', 'SM']; // Monaco, Andorre, Liechtenstein, Vatican, Saint-Marin
    if (countriesWithA.includes(countryCode)) {
      return baseText.replace('en', 'à');
    }
    
    // Countries with "aux" (plural countries)
    const countriesWithAux = ['US', 'AE', 'NL', 'PH', 'MV']; // États-Unis, Émirats Arabes Unis, Pays-Bas, Philippines, Maldives
    if (countriesWithAux.includes(countryCode)) {
      return baseText.replace('en', 'aux');
    }
    
    // Countries with "au" (masculine countries)
    const countriesWithAu = [
      'CA', 'BR', 'MX', 'JP', 'VN', 'CN', 'KR', 'IN', 'PK', 'BD', 'KH', 'LA', 'MM', 'NP', 'LK', 'TH', 'AF',
      'IR', 'IQ', 'KW', 'OM', 'QA', 'SA', 'YE', 'BH', 'AZ', 'KZ', 'KG', 'TJ', 'TM', 'UZ', 'MN',
      'CL', 'PE', 'EC', 'PY', 'UY', 'VE', 'CO', 'BO', 'SR', 'GY',
      'MA', 'TN', 'DZ', 'EG', 'LY', 'SD', 'TD', 'NE', 'ML', 'BF', 'SN', 'GH', 'TG', 'BJ', 'NG', 'CM',
      'CF', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'MW', 'MZ', 'LS', 'SZ', 'BW', 'NA', 'ZA',
      'KE', 'UG', 'TZ', 'RW', 'BI', 'DJ', 'SO', 'ET', 'ER', 'SS',
      'PT', 'LU', 'DK', 'NO', 'FI', 'IS'
    ]; // Cambodge, Laos, Myanmar, Népal, Sri Lanka, Thaïlande, Afghanistan, Iran, Irak, etc.
    if (countriesWithAu.includes(countryCode)) {
      return baseText.replace('en', 'au');
    }
    
    // All other countries use "en" (France, Allemagne, Italie, Espagne, Belgique, Suisse, Autriche, etc.)
  }
  
  // German preposition rules (in + dative)
  if (userLang === 'de') {
    // Feminine plural countries (in die -> in den)
    const femininePlural = ['US', 'NL', 'AE', 'PH']; // die USA, die Niederlande, die VAE, die Philippinen
    if (femininePlural.includes(countryCode)) {
      return baseText.replace('in', 'in den');
    }
    
    // Masculine countries with article (in das -> im)
    const masculineCountries = [
      'IR', 'IQ', 'LB', 'SD', 'TD', 'KG', 'TJ', 'CF'
    ]; // der Iran, der Irak, der Libanon, der Sudan, der Tschad, der Kosovo, etc.
    if (masculineCountries.includes(countryCode)) {
      return baseText.replace('in', 'im');
    }
    
    // Feminine countries with article (in die -> in der)
    const feminineCountries = [
      'CH', 'TR', 'UA', 'MN', 'CF'
    ]; // die Schweiz, die Türkei, die Ukraine, die Mongolei, etc.
    if (feminineCountries.includes(countryCode)) {
      return baseText.replace('in', 'in der');
    }
    
    // All other countries use "in" (Deutschland, Frankreich, Italien, etc.)
  }
  
  // Spanish preposition rules
  if (userLang === 'es') {
    // Plural countries use "en los"
    const pluralCountries = ['US', 'AE', 'NL', 'PH']; // Estados Unidos, Emiratos Árabes Unidos, Países Bajos, Filipinas
    if (pluralCountries.includes(countryCode)) {
      return baseText.replace('en', 'en los');
    }
    
    // Feminine countries with article use "en la"
    const feminineCountries = ['IN', 'AR']; // la India, la Argentina
    if (feminineCountries.includes(countryCode)) {
      return baseText.replace('en', 'en la');
    }
    
    // All other countries use "en" (España, Francia, México, Brasil, etc.)
  }
  
  // Italian preposition rules
  if (userLang === 'it') {
    // Plural countries use "negli"
    const pluralCountries = ['US', 'NL', 'AE', 'PH']; // Stati Uniti, Paesi Bassi, Emirati Arabi Uniti, Filippine
    if (pluralCountries.includes(countryCode)) {
      return baseText.replace('in', 'negli');
    }
    
    // Masculine countries with vowel use "nell'"
    const masculineVowel = ['AF', 'IR', 'IQ', 'UY', 'EC', 'EG']; // Afghanistan, Iran, Iraq, Uruguay, Ecuador, Egitto
    if (masculineVowel.includes(countryCode)) {
      return baseText.replace('in', "nell'");
    }
    
    // Masculine countries use "nel"
    const masculineCountries = [
      'CA', 'BR', 'MX', 'JP', 'VN', 'CN', 'KR', 'IN', 'PK', 'BD', 'KH', 'LA', 'MM', 'NP', 'LK', 'TH',
      'KW', 'OM', 'QA', 'SA', 'YE', 'BH', 'AZ', 'KZ', 'KG', 'TJ', 'TM', 'UZ', 'MN',
      'CL', 'PE', 'EC', 'PY', 'UY', 'VE', 'CO', 'BO', 'SR', 'GY',
      'MA', 'TN', 'DZ', 'LY', 'SD', 'TD', 'NE', 'ML', 'BF', 'SN', 'GH', 'TG', 'BJ', 'NG', 'CM',
      'CF', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'MW', 'MZ', 'LS', 'SZ', 'BW', 'NA', 'ZA',
      'KE', 'UG', 'TZ', 'RW', 'BI', 'DJ', 'SO', 'ET', 'ER', 'SS',
      'PT', 'LU', 'DK', 'NO', 'FI', 'IS'
    ]; // Canada, Brasile, Messico, Giappone, etc.
    if (masculineCountries.includes(countryCode)) {
      return baseText.replace('in', 'nel');
    }
    
    // Feminine countries with vowel use "nell'"
    const feminineVowel = ['IN']; // India
    if (feminineVowel.includes(countryCode)) {
      return baseText.replace('in', "nell'");
    }
    
    // Feminine countries use "nella"
    const feminineCountries = ['AR']; // Argentina
    if (feminineCountries.includes(countryCode)) {
      return baseText.replace('in', 'nella');
    }
    
    // All other countries use "in" (Francia, Spagna, Grecia, Turchia, Russia, Svizzera, Germania, etc.)
  }
  
  // Portuguese preposition rules
  if (userLang === 'pt') {
    // Plural countries use "nos"
    const pluralCountries = ['US', 'NL', 'AE', 'PH']; // Estados Unidos, Países Baixos, Emirados Árabes Unidos, Filipinas
    if (pluralCountries.includes(countryCode)) {
      return baseText.replace('em', 'nos');
    }
    
    // Feminine countries use "na"
    const feminineCountries = [
      'FR', 'ES', 'GR', 'TR', 'RU', 'CH', 'GB', 'DE', 'IT', 'BE', 'AT', 'PL', 'CZ', 'HU', 'RO', 'BG',
      'HR', 'RS', 'SI', 'SK', 'EE', 'LV', 'LT', 'UA', 'BY', 'AR', 'AU', 'ZA'
    ]; // França, Espanha, Grécia, Turquia, Rússia, Suíça, Grã-Bretanha, Alemanha, Itália, etc.
    if (feminineCountries.includes(countryCode)) {
      return baseText.replace('em', 'na');
    }
    
    // Masculine countries use "no"
    const masculineCountries = [
      'CA', 'BR', 'MX', 'JP', 'VN', 'CN', 'KR', 'IN', 'PK', 'BD', 'KH', 'LA', 'MM', 'NP', 'LK', 'TH', 'AF',
      'IR', 'IQ', 'KW', 'OM', 'QA', 'SA', 'YE', 'BH', 'AZ', 'KZ', 'KG', 'TJ', 'TM', 'UZ', 'MN',
      'CL', 'PE', 'EC', 'PY', 'UY', 'VE', 'CO', 'BO', 'SR', 'GY',
      'MA', 'TN', 'DZ', 'EG', 'LY', 'SD', 'TD', 'NE', 'ML', 'BF', 'SN', 'GH', 'TG', 'BJ', 'NG', 'CM',
      'CF', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'MW', 'MZ', 'LS', 'SZ', 'BW', 'NA',
      'KE', 'UG', 'TZ', 'RW', 'BI', 'DJ', 'SO', 'ET', 'ER', 'SS',
      'PT', 'LU', 'DK', 'NO', 'FI', 'IS'
    ]; // Canadá, Brasil, México, Japão, etc.
    if (masculineCountries.includes(countryCode)) {
      return baseText.replace('em', 'no');
    }
    
    // All other countries use "em" (default)
  }
  
  // Dutch preposition rules
  if (userLang === 'nl') {
    // Most countries use "in", but some use "naar" for direction
    // For searching ports, "in" is correct for all countries
    // No changes needed - "in" works for all: "in Nederland", "in Frankrijk", "in de Verenigde Staten"
  }
  
  // Arabic preposition rules  
  if (userLang === 'ar') {
    // Arabic uses "في" (fi) for "in" for all countries
    // No changes needed - "في" works universally
  }
  
  // Turkish preposition rules
  if (userLang === 'tr') {
    // Turkish uses different suffixes/postpositions
    // The base text already handles this correctly
    // No changes needed
  }
  
  // Russian preposition rules
  if (userLang === 'ru') {
    // Russian uses "в" (v) + prepositional case
    // Most countries work with "в", some exceptions might exist
    // The base text already handles this correctly
    // No changes needed for now
  }
  
  // Chinese preposition rules
  if (userLang === 'zh') {
    // Chinese uses "在" (zài) for location
    // No changes needed - works for all countries
  }

  return baseText;
}; */

// Helper function to get translated location type name
/* const getLocationTypeName = (typeId: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode?: string) => {
  switch (typeId) {
    case 'factory': return I18N_TEXT[userLang].factoryWarehouse;
    case 'port': 
      // Dynamic translation based on shipping mode
      if (mode === 'Sea') {
        return I18N_TEXT[userLang].port;
      } else if (mode === 'Air' || mode === 'Express') {
        return I18N_TEXT[userLang].airport;
      } else if (mode === 'Rail') {
        return I18N_TEXT[userLang].railTerminal;
      } else {
        return I18N_TEXT[userLang].portAirport; // Fallback for no mode selected
      }
    case 'business': return I18N_TEXT[userLang].businessAddress;
    case 'residential': return I18N_TEXT[userLang].residentialAddress;
    default: return '';
  }
}; */

// Helper function to get translated location type description
/* const getLocationTypeDescription = (typeId: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  switch (typeId) {
    case 'business': return translations.businessDescription || 'Company address, office building';
    case 'residential': return translations.residentialDescription || 'House, apartment, personal address';
    case 'factory': return translations.factoryDescription || 'Factory, distribution center, warehouse';
    case 'port': return translations.portDescription || 'Direct to port/airport pickup';
    default: return '';
  }
}; */

// Helper function to get translated port/airport/terminal name
/* const getTranslatedPortNameLocal = (port: any, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  // Use the imported function from portTranslations.ts
  return getTranslatedPortName(port.code, userLang, port.name);
}; */

// Helper function to get translated port type
/* const getTranslatedPortType = (portType: 'sea' | 'air' | 'rail', userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  if (portType === 'sea') return I18N_TEXT[userLang].seaPort;
  if (portType === 'air') return I18N_TEXT[userLang].airport;
  if (portType === 'rail') return I18N_TEXT[userLang].railTerminal;
  return portType;
}; */

// Helper function to get translated region name
// getTranslatedRegionName is not used; removed to satisfy ESLint

// Helper function to get dynamic search placeholder text based on shipping mode
/* const getDynamicSearchText = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode: string) => {
  const translations = I18N_TEXT[userLang] as any;
  if (mode === 'Sea') {
    return translations.searchPort || 'Search for port...';
  } else if (mode === 'Air' || mode === 'Express') {
    return translations.searchAirport || 'Search for airport...';
  } else if (mode === 'Rail') {
    return translations.searchRailTerminal || 'Search for rail terminal...';
  } else {
    return translations.searchPortTerminal || 'Search for port/terminal/airport...';
  }
}; */

// Helper function to get dynamic selection title text based on shipping mode
/* const getDynamicSelectText = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode: string) => {
  const translations = I18N_TEXT[userLang] as any;
  if (mode === 'Sea') {
    return translations.selectPort || 'Select pickup port';
  } else if (mode === 'Air' || mode === 'Express') {
    return translations.selectAirport || 'Select pickup airport';
  } else if (mode === 'Rail') {
    return translations.selectRailTerminal || 'Select pickup rail terminal';
  } else {
    return translations.selectPortTerminal || 'Select pickup port/terminal/airport';
  }
}; */

// Helper function to get simplified generic description
/* const getLocationDescription = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  return translations.chooseLocationDescription || 'Choose your pickup location';
}; */

const SEA_PORTS = [
  {
    code: 'SHA',
    name: 'Shanghai',
    region: 'East China',
    type: 'sea',
    volume: '47M TEU',
    flag: '🚢',
  },
  {
    code: 'SZX',
    name: 'Shenzhen',
    region: 'South China',
    type: 'sea',
    volume: '28M TEU',
    flag: '🚢',
  },
  {
    code: 'NGB',
    name: 'Ningbo-Zhoushan',
    region: 'East China',
    type: 'sea',
    volume: '31M TEU',
    flag: '🚢',
  },
  {
    code: 'GZH',
    name: 'Guangzhou',
    region: 'South China',
    type: 'sea',
    volume: '24M TEU',
    flag: '🚢',
  },
  {
    code: 'QIN',
    name: 'Qingdao',
    region: 'North China',
    type: 'sea',
    volume: '23M TEU',
    flag: '🚢',
  },
  {
    code: 'TJN',
    name: 'Tianjin',
    region: 'North China',
    type: 'sea',
    volume: '20M TEU',
    flag: '🚢',
  },
  {
    code: 'XMN',
    name: 'Xiamen',
    region: 'South China',
    type: 'sea',
    volume: '12M TEU',
    flag: '🚢',
  },
  {
    code: 'DLN',
    name: 'Dalian',
    region: 'North China',
    type: 'sea',
    volume: '10M TEU',
    flag: '🚢',
  },
  {
    code: 'YTN',
    name: 'Yantian',
    region: 'South China',
    type: 'sea',
    volume: '14M TEU',
    flag: '🚢',
  },
  {
    code: 'LYG',
    name: 'Lianyungang',
    region: 'East China',
    type: 'sea',
    volume: '8M TEU',
    flag: '🚢',
  },
].sort((a, b) => a.name.localeCompare(b.name));
const AIRPORTS = [
  {
    code: 'PEK',
    name: 'Beijing Capital',
    region: 'North China',
    type: 'air',
    volume: '2M tons',
    flag: '✈️',
  },
  {
    code: 'PVG',
    name: 'Shanghai Pudong',
    region: 'East China',
    type: 'air',
    volume: '3.6M tons',
    flag: '✈️',
  },
  {
    code: 'CAN',
    name: 'Guangzhou Baiyun',
    region: 'South China',
    type: 'air',
    volume: '1.9M tons',
    flag: '✈️',
  },
  {
    code: 'SZX',
    name: "Shenzhen Bao'an",
    region: 'South China',
    type: 'air',
    volume: '1.4M tons',
    flag: '✈️',
  },
  {
    code: 'CTU',
    name: 'Chengdu Shuangliu',
    region: 'West China',
    type: 'air',
    volume: '1M tons',
    flag: '✈️',
  },
  {
    code: 'SHA',
    name: 'Shanghai Hongqiao',
    region: 'East China',
    type: 'air',
    volume: '0.8M tons',
    flag: '✈️',
  },
  {
    code: 'KMG',
    name: 'Kunming Changshui',
    region: 'Southwest China',
    type: 'air',
    volume: '0.7M tons',
    flag: '✈️',
  },
  {
    code: 'XIY',
    name: "Xi'an Xianyang",
    region: 'Northwest China',
    type: 'air',
    volume: '0.6M tons',
    flag: '✈️',
  },
  {
    code: 'HGH',
    name: 'Hangzhou Xiaoshan',
    region: 'East China',
    type: 'air',
    volume: '0.5M tons',
    flag: '✈️',
  },
  {
    code: 'NKG',
    name: 'Nanjing Lukou',
    region: 'East China',
    type: 'air',
    volume: '0.4M tons',
    flag: '✈️',
  },
].sort((a, b) => a.name.localeCompare(b.name));

// Rail terminals (for rail freight shipments)
const RAIL_TERMINALS = [
  {
    code: 'ZIH',
    name: 'Zhengzhou Rail Terminal',
    region: 'Central China',
    type: 'rail',
    volume: '250 000+ TEU',
    flag: '🚂',
  },
  {
    code: 'CQN',
    name: 'Chongqing Rail Terminal',
    region: 'Southwest China',
    type: 'rail',
    volume: '450 000+ TEU',
    flag: '🚂',
  },
  {
    code: 'XIY',
    name: "Xi'an Rail Terminal",
    region: 'Northwest China',
    type: 'rail',
    volume: '570 000+ TEU',
    flag: '🚂',
  },
  {
    code: 'WUH',
    name: 'Wuhan Rail Terminal',
    region: 'Central China',
    type: 'rail',
    volume: '200 000 TEU',
    flag: '🚂',
  },
  {
    code: 'CDU',
    name: 'Chengdu Rail Terminal',
    region: 'Southwest China',
    type: 'rail',
    volume: '500 000+ TEU',
    flag: '🚂',
  },
].sort((a, b) => a.name.localeCompare(b.name));
// Destination ports by country moved to context (local copy removed)
/* const DESTINATION_PORTS_BY_COUNTRY: Record<string, Array<{code: string, name: string, type: 'sea' | 'air' | 'rail', flag: string, volume?: string}>> = {
  // Europe
  'FR': [
    { code: 'FRMRS', name: 'Port de Marseille-Fos', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'FRLEH', name: 'Port du Havre', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'FRCDG', name: 'Aéroport Charles de Gaulle', type: 'air', flag: '✈️', volume: '2.1M tons' },
    { code: 'FRORY', name: 'Aéroport Paris-Orly', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'FRLYO', name: 'Aéroport Lyon-Saint Exupéry', type: 'air', flag: '✈️', volume: '0.15M tons' },
    { code: 'FRPAR_RAIL', name: 'Terminal ferroviaire de Paris', type: 'rail', flag: '🚂', volume: '0.3M TEU' },
    { code: 'FRLYO_RAIL', name: 'Terminal ferroviaire de Lyon', type: 'rail', flag: '🚂', volume: '0.2M TEU' }
  ],
  'DE': [
    { code: 'DEHAM', name: 'Port de Hambourg', type: 'sea', flag: '🚢', volume: '8.5M TEU' },
    { code: 'DEBRE', name: 'Port de Brême', type: 'sea', flag: '🚢', volume: '4.6M TEU' },
    { code: 'DEFRA', name: 'Aéroport de Francfort', type: 'air', flag: '✈️', volume: '2.0M tons' },
    { code: 'DEMUC', name: 'Aéroport de Munich', type: 'air', flag: '✈️', volume: '0.3M tons' },
    { code: 'DEHAM_RAIL', name: 'Terminal ferroviaire de Hambourg', type: 'rail', flag: '🚂', volume: '2.3M TEU' },
    { code: 'DEDUE_RAIL', name: 'Terminal ferroviaire de Duisbourg', type: 'rail', flag: '🚂', volume: '4.2M TEU' },
    { code: 'DEFRM_RAIL', name: 'Terminal ferroviaire de Francfort', type: 'rail', flag: '🚂', volume: '0.8M TEU' },
    { code: 'DEMUC_RAIL', name: 'Terminal ferroviaire de Munich', type: 'rail', flag: '🚂', volume: '0.5M TEU' },
    { code: 'DEBER_RAIL', name: 'Terminal ferroviaire de Berlin', type: 'rail', flag: '🚂', volume: '0.6M TEU' }
  ],
  'GB': [
    { code: 'GBFXT', name: 'Port de Felixstowe', type: 'sea', flag: '🚢', volume: '4.0M TEU' },
    { code: 'GBSOU', name: 'Port de Southampton', type: 'sea', flag: '🚢', volume: '1.9M TEU' },
    { code: 'GBLHR', name: 'Aéroport de Londres Heathrow', type: 'air', flag: '✈️', volume: '1.8M tons' },
    { code: 'GBLGW', name: 'Aéroport de Londres Gatwick', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'GBMAN', name: 'Aéroport de Manchester', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'GBLON_RAIL', name: 'Terminal ferroviaire de Londres', type: 'rail', flag: '🚂', volume: '0.4M TEU' },
    { code: 'GBMAN_RAIL', name: 'Terminal ferroviaire de Manchester', type: 'rail', flag: '🚂', volume: '0.2M TEU' },
    { code: 'GBBIR_RAIL', name: 'Terminal ferroviaire de Birmingham', type: 'rail', flag: '🚂', volume: '0.3M TEU' }
  ],
  'NL': [
    { code: 'NLRTM', name: 'Port de Rotterdam', type: 'sea', flag: '🚢', volume: '15.3M TEU' },
    { code: 'NLAMS', name: 'Aéroport d\'Amsterdam Schiphol', type: 'air', flag: '✈️', volume: '1.7M tons' },
    { code: 'NLRTM_RAIL', name: 'Terminal ferroviaire de Rotterdam', type: 'rail', flag: '🚂', volume: '0.9M TEU' },
    { code: 'NLAMS_RAIL', name: 'Terminal ferroviaire d\'Amsterdam', type: 'rail', flag: '🚂', volume: '0.3M TEU' }
  ],
  'BE': [
    { code: 'BEANR', name: 'Port d\'Anvers', type: 'sea', flag: '🚢', volume: '12.0M TEU' },
    { code: 'BEBRU', name: 'Aéroport de Bruxelles', type: 'air', flag: '✈️', volume: '0.8M tons' },
    { code: 'BELGG', name: 'Aéroport de Liège', type: 'air', flag: '✈️', volume: '0.9M tons' },
    { code: 'BEANR_RAIL', name: 'Terminal ferroviaire d\'Anvers', type: 'rail', flag: '🚂', volume: '0.6M TEU' },
    { code: 'BEBRU_RAIL', name: 'Terminal ferroviaire de Bruxelles', type: 'rail', flag: '🚂', volume: '0.2M TEU' }
  ],
  'IT': [
    { code: 'ITGOA', name: 'Port de Gênes', type: 'sea', flag: '🚢', volume: '2.6M TEU' },
    { code: 'ITLSP', name: 'Port de La Spezia', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'ITMXP', name: 'Aéroport de Milan Malpensa', type: 'air', flag: '✈️', volume: '0.7M tons' },
    { code: 'ITFCO', name: 'Aéroport de Rome Fiumicino', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'ITMIL_RAIL', name: 'Terminal ferroviaire de Milan', type: 'rail', flag: '🚂', volume: '0.4M TEU' },
    { code: 'ITROM_RAIL', name: 'Terminal ferroviaire de Rome', type: 'rail', flag: '🚂', volume: '0.3M TEU' },
    { code: 'ITVCE_RAIL', name: 'Terminal ferroviaire de Venise', type: 'rail', flag: '🚂', volume: '0.2M TEU' }
  ],
  'ES': [
    { code: 'ESALG', name: 'Port d\'Algésiras', type: 'sea', flag: '🚢', volume: '5.1M TEU' },
    { code: 'ESVAL', name: 'Port de Valence', type: 'sea', flag: '🚢', volume: '5.4M TEU' },
    { code: 'ESMAD', name: 'Aéroport de Madrid-Barajas', type: 'air', flag: '✈️', volume: '0.5M tons' },
    { code: 'ESBCN', name: 'Aéroport de Barcelone', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'ESMAD_RAIL', name: 'Terminal ferroviaire de Madrid', type: 'rail', flag: '🚂', volume: '0.3M TEU' },
    { code: 'ESBCN_RAIL', name: 'Terminal ferroviaire de Barcelone', type: 'rail', flag: '🚂', volume: '0.2M TEU' }
  ],
  'PT': [
    { code: 'PTLIS', name: 'Port de Lisbonne', type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'PTLEX', name: 'Port de Leixões (Porto)', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'PTLIS_AIR', name: 'Aéroport de Lisbonne', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'PTLIS_RAIL', name: 'Terminal ferroviaire de Lisbonne', type: 'rail', flag: '🚂', volume: '0.1M TEU' },
    { code: 'PTOPO_RAIL', name: 'Terminal ferroviaire de Porto', type: 'rail', flag: '🚂', volume: '0.08M TEU' }
  ],
  'PL': [
    { code: 'PLGDN', name: 'Port de Gdansk', type: 'sea', flag: '🚢', volume: '2.1M TEU' },
    { code: 'PLGDY', name: 'Port de Gdynia', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'PLWAW', name: 'Aéroport de Varsovie Chopin', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'PLWAW_RAIL', name: 'Terminal ferroviaire de Varsovie', type: 'rail', flag: '🚂', volume: '0.8M TEU' },
    { code: 'PLKRA_RAIL', name: 'Terminal ferroviaire de Cracovie', type: 'rail', flag: '🚂', volume: '0.4M TEU' },
    { code: 'PLMAL_RAIL', name: 'Terminal ferroviaire de Mała', type: 'rail', flag: '🚂', volume: '1.2M TEU' }
  ],
  'GR': [
    { code: 'GRPIR', name: 'Port du Pirée', type: 'sea', flag: '🚢', volume: '5.4M TEU' },
    { code: 'GRTHE', name: 'Port de Thessalonique', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'GRATH', name: 'Aéroport d\'Athènes', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'TR': [
    { code: 'TRMER', name: 'Port de Mersin', type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'TRIST', name: 'Port d\'Istanbul', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'TRIST_AIR', name: 'Aéroport d\'Istanbul', type: 'air', flag: '✈️', volume: '1.3M tons' }
  ],
  'NO': [
    { code: 'NOOSL', name: 'Port d\'Oslo', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    { code: 'NOOSLO', name: 'Aéroport d\'Oslo Gardermoen', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],
  'SE': [
    { code: 'SEGOT', name: 'Port de Göteborg', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'SESTO', name: 'Port de Stockholm', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'SEARN', name: 'Aéroport d\'Arlanda Stockholm', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'DK': [
    { code: 'DKAAR', name: 'Port d\'Aarhus', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'DKCPH', name: 'Aéroport de Copenhague', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'FI': [
    { code: 'FIHEN', name: 'Port d\'Helsinki', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'FIHEL', name: 'Aéroport d\'Helsinki-Vantaa', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],
  'EE': [
    { code: 'EETLL', name: 'Port de Tallinn', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'EETLL_AIR', name: 'Aéroport de Tallinn', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'LV': [
    { code: 'LVRIX', name: 'Port de Riga', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'LVRIX_AIR', name: 'Aéroport de Riga', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'LT': [
    { code: 'LTKLA', name: 'Port de Klaipeda', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'LTVNO', name: 'Aéroport de Vilnius', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'CZ': [
    { code: 'CZPRG', name: 'Aéroport de Prague', type: 'air', flag: '✈️', volume: '0.06M tons' },
    { code: 'CZPRG_RAIL', name: 'Terminal ferroviaire de Prague', type: 'rail', flag: '🚂', volume: '0.1M TEU' }
  ],
  'SK': [
    { code: 'SKBTS', name: 'Aéroport de Bratislava', type: 'air', flag: '✈️', volume: '0.01M tons' },
    { code: 'SKBTS_RAIL', name: 'Terminal ferroviaire de Bratislava', type: 'rail', flag: '🚂', volume: '0.2M TEU' }
  ],
  'HU': [
    { code: 'HUBUD', name: 'Aéroport de Budapest', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'HUBUD_RAIL', name: 'Terminal ferroviaire de Budapest', type: 'rail', flag: '🚂', volume: '0.3M TEU' }
  ],
  'RO': [
    { code: 'ROCND', name: 'Port de Constanta', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'ROBBU', name: 'Aéroport de Bucarest', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'BG': [
    { code: 'BGVAR', name: 'Port de Varna', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'BGSOF', name: 'Aéroport de Sofia', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'HR': [
    { code: 'HRRIU', name: 'Port de Rijeka', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'HRZAG', name: 'Aéroport de Zagreb', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'SI': [
    { code: 'SIKOP', name: 'Port de Koper', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'SILJB', name: 'Aéroport de Ljubljana', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'AT': [
    { code: 'ATVIE', name: 'Aéroport de Vienne', type: 'air', flag: '✈️', volume: '0.3M tons' },
    { code: 'ATVIE_RAIL', name: 'Terminal ferroviaire de Vienne', type: 'rail', flag: '🚂', volume: '0.5M TEU' }
  ],
  'CH': [
    { code: 'CHZUR', name: 'Aéroport de Zurich', type: 'air', flag: '✈️', volume: '0.5M tons' },
    { code: 'CHBAS_RAIL', name: 'Terminal ferroviaire de Bâle', type: 'rail', flag: '🚂', volume: '0.8M TEU' }
  ],
  'IE': [
    { code: 'IEDUB', name: 'Port de Dublin', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    { code: 'IEDUB_AIR', name: 'Aéroport de Dublin', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'IS': [
    { code: 'ISKEF', name: 'Aéroport de Reykjavik', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'RU': [
    { code: 'RULED', name: 'Port de St-Pétersbourg', type: 'sea', flag: '🚢', volume: '2.1M TEU' },
    { code: 'RUNVO', name: 'Port de Novorossiysk', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'RUSVO', name: 'Aéroport de Moscou Sheremetyevo', type: 'air', flag: '✈️', volume: '0.4M tons' },
    { code: 'RUMOW_RAIL', name: 'Terminal ferroviaire de Moscou', type: 'rail', flag: '🚂', volume: '2.0M TEU' }
  ],
  'UA': [
    { code: 'UAODE', name: 'Port d\'Odessa', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'UAKBP', name: 'Aéroport de Kiev Boryspil', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'BY': [
    { code: 'BYMSQ', name: 'Aéroport de Minsk', type: 'air', flag: '✈️', volume: '0.02M tons' },
    { code: 'BYMSQ_RAIL', name: 'Terminal ferroviaire de Minsk', type: 'rail', flag: '🚂', volume: '0.3M TEU' }
  ],

  // Americas
  'US': [
    { code: 'USLAX', name: 'Port de Los Angeles', type: 'sea', flag: '🚢', volume: '10.7M TEU' },
    { code: 'USLGB', name: 'Port de Long Beach', type: 'sea', flag: '🚢', volume: '8.1M TEU' },
    { code: 'USNYC', name: 'Port de New York/New Jersey', type: 'sea', flag: '🚢', volume: '7.8M TEU' },
    { code: 'USSAV', name: 'Port de Savannah', type: 'sea', flag: '🚢', volume: '4.6M TEU' },
    { code: 'USJFK', name: 'Aéroport JFK New York', type: 'air', flag: '✈️', volume: '1.3M tons' },
    { code: 'USLAX_AIR', name: 'Aéroport LAX Los Angeles', type: 'air', flag: '✈️', volume: '2.2M tons' },
    { code: 'USMIA', name: 'Aéroport de Miami', type: 'air', flag: '✈️', volume: '2.3M tons' },
    { code: 'USORD', name: 'Aéroport de Chicago O\'Hare', type: 'air', flag: '✈️', volume: '1.8M tons' }
  ],
  'CA': [
    { code: 'CAVAN', name: 'Port de Vancouver', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    { code: 'CAHAL', name: 'Port d\'Halifax', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'CAYYZ', name: 'Aéroport de Toronto Pearson', type: 'air', flag: '✈️', volume: '0.5M tons' },
    { code: 'CAVAN_AIR', name: 'Aéroport de Vancouver', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'MX': [
    { code: 'MXVER', name: 'Port de Veracruz', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'MXMEX', name: 'Aéroport de Mexico', type: 'air', flag: '✈️', volume: '0.7M tons' }
  ],
  'BR': [
    { code: 'BRSAN', name: 'Port de Santos', type: 'sea', flag: '🚢', volume: '4.3M TEU' },
    { code: 'BRRIG', name: 'Port de Rio Grande', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'BRGRU', name: 'Aéroport de São Paulo Guarulhos', type: 'air', flag: '✈️', volume: '0.4M tons' },
    { code: 'BRGIG', name: 'Aéroport de Rio de Janeiro Galeão', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'AR': [
    { code: 'ARBUE', name: 'Port de Buenos Aires', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'AREZE', name: 'Aéroport de Buenos Aires Ezeiza', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],
  'CL': [
    { code: 'CLVAP', name: 'Port de Valparaiso', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'CLSAN', name: 'Port de San Antonio', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'CLSCL', name: 'Aéroport de Santiago', type: 'air', flag: '✈️', volume: '0.5M tons' }
  ],
  'PE': [
    { code: 'PECAL', name: 'Port du Callao', type: 'sea', flag: '🚢', volume: '2.3M TEU' },
    { code: 'PELIM', name: 'Aéroport de Lima Jorge Chávez', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'CO': [
    { code: 'COCAR', name: 'Port de Carthagène', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'COBOG', name: 'Aéroport de Bogotá El Dorado', type: 'air', flag: '✈️', volume: '0.7M tons' }
  ],
  'EC': [
    { code: 'ECGYE', name: 'Port de Guayaquil', type: 'sea', flag: '🚢', volume: '1.9M TEU' },
    { code: 'ECUIO', name: 'Aéroport de Quito', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],

  // Asia-Pacific
  'CN': [
    { code: 'CNSHA', name: 'Port de Shanghai', type: 'sea', flag: '🚢', volume: '47M TEU' },
    { code: 'CNSZX', name: 'Port de Shenzhen', type: 'sea', flag: '🚢', volume: '28M TEU' },
    { code: 'CNPVG', name: 'Aéroport de Shanghai Pudong', type: 'air', flag: '✈️', volume: '3.6M tons' },
    { code: 'CNPEK', name: 'Aéroport de Beijing Capital', type: 'air', flag: '✈️', volume: '2M tons' }
  ],
  'JP': [
    { code: 'JPTYO', name: 'Port de Tokyo', type: 'sea', flag: '🚢', volume: '4.2M TEU' },
    { code: 'JPYOK', name: 'Port de Yokohama', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'JPNRT', name: 'Aéroport de Tokyo Narita', type: 'air', flag: '✈️', volume: '2.3M tons' },
    { code: 'JPKIX', name: 'Aéroport de Kansai Osaka', type: 'air', flag: '✈️', volume: '0.9M tons' }
  ],
  'KR': [
    { code: 'KRPUS', name: 'Port de Busan', type: 'sea', flag: '🚢', volume: '22.9M TEU' },
    { code: 'KRICN', name: 'Aéroport de Seoul Incheon', type: 'air', flag: '✈️', volume: '2.8M tons' }
  ],
  'TW': [
    { code: 'TWKAO', name: 'Port de Kaohsiung', type: 'sea', flag: '🚢', volume: '10.2M TEU' },
    { code: 'TWTPE', name: 'Aéroport de Taipei Taoyuan', type: 'air', flag: '✈️', volume: '2.2M tons' }
  ],
  'HK': [
    { code: 'HKHKG', name: 'Port de Hong Kong', type: 'sea', flag: '🚢', volume: '17.8M TEU' },
    { code: 'HKHKG_AIR', name: 'Aéroport de Hong Kong', type: 'air', flag: '✈️', volume: '4.2M tons' }
  ],
  'SG': [
    { code: 'SGSIN', name: 'Port de Singapour', type: 'sea', flag: '🚢', volume: '37.5M TEU' },
    { code: 'SGSIN_AIR', name: 'Aéroport de Singapour Changi', type: 'air', flag: '✈️', volume: '2.0M tons' }
  ],
  'MY': [
    { code: 'MYPKG', name: 'Port Klang', type: 'sea', flag: '🚢', volume: '13.6M TEU' },
    { code: 'MYKUL', name: 'Aéroport de Kuala Lumpur', type: 'air', flag: '✈️', volume: '0.8M tons' }
  ],
  'TH': [
    { code: 'THLCH', name: 'Port de Laem Chabang', type: 'sea', flag: '🚢', volume: '8.1M TEU' },
    { code: 'THBKK', name: 'Aéroport de Bangkok Suvarnabhumi', type: 'air', flag: '✈️', volume: '1.3M tons' }
  ],
  'VN': [
    { code: 'VNHPH', name: 'Port de Hai Phong', type: 'sea', flag: '🚢', volume: '2.7M TEU' },
    { code: 'VNSGN', name: 'Port de Ho Chi Minh Ville', type: 'sea', flag: '🚢', volume: '7.2M TEU' },
    { code: 'VNSGN_AIR', name: 'Aéroport de Ho Chi Minh Ville', type: 'air', flag: '✈️', volume: '0.6M tons' }
  ],
  'PH': [
    { code: 'PHMNL', name: 'Port de Manille', type: 'sea', flag: '🚢', volume: '4.2M TEU' },
    { code: 'PHMNL_AIR', name: 'Aéroport de Manille', type: 'air', flag: '✈️', volume: '0.7M tons' }
  ],
  'ID': [
    { code: 'IDJKT', name: 'Port de Jakarta (Tanjung Priok)', type: 'sea', flag: '🚢', volume: '7.6M TEU' },
    { code: 'IDCGK', name: 'Aéroport de Jakarta Soekarno-Hatta', type: 'air', flag: '✈️', volume: '0.7M tons' }
  ],
  'IN': [
    { code: 'INJNP', name: 'Port de Jawaharlal Nehru', type: 'sea', flag: '🚢', volume: '5.0M TEU' },
    { code: 'INMAA', name: 'Port de Chennai', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'INBOM', name: 'Aéroport de Mumbai', type: 'air', flag: '✈️', volume: '0.9M tons' },
    { code: 'INDEL', name: 'Aéroport de Delhi', type: 'air', flag: '✈️', volume: '1.1M tons' }
  ],
  'LK': [
    { code: 'LKCMB', name: 'Port de Colombo', type: 'sea', flag: '🚢', volume: '7.2M TEU' },
    { code: 'LKCMB_AIR', name: 'Aéroport de Colombo', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'AU': [
    { code: 'AUSYD', name: 'Port de Sydney', type: 'sea', flag: '🚢', volume: '2.6M TEU' },
    { code: 'AUMEL', name: 'Port de Melbourne', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'AUSYD_AIR', name: 'Aéroport de Sydney', type: 'air', flag: '✈️', volume: '0.5M tons' },
    { code: 'AUMEL_AIR', name: 'Aéroport de Melbourne', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'NZ': [
    { code: 'NZAKL', name: 'Port d\'Auckland', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'NZAKL_AIR', name: 'Aéroport d\'Auckland', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],

  // Middle East & Africa
  'AE': [
    { code: 'AEJEA', name: 'Port Jebel Ali (Dubai)', type: 'sea', flag: '🚢', volume: '14.1M TEU' },
    { code: 'AEDXB', name: 'Aéroport de Dubai', type: 'air', flag: '✈️', volume: '2.9M tons' },
    { code: 'AEAUH', name: 'Aéroport d\'Abu Dhabi', type: 'air', flag: '✈️', volume: '0.7M tons' }
  ],
  'SA': [
    { code: 'SAJED', name: 'Port du Roi Abdulaziz (Dammam)', type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'SARRH', name: 'Aéroport de Riyadh', type: 'air', flag: '✈️', volume: '0.5M tons' }
  ],
  'QA': [
    { code: 'QADOH', name: 'Port de Doha', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'QADOH_AIR', name: 'Aéroport de Doha Hamad', type: 'air', flag: '✈️', volume: '1.4M tons' }
  ],
  'KW': [
    { code: 'KWKWI', name: 'Port du Koweït', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'KWKWI_AIR', name: 'Aéroport du Koweït', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'OM': [
    { code: 'OMSLL', name: 'Port de Salalah', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    { code: 'OMSLL_AIR', name: 'Aéroport de Salalah', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'BH': [
    { code: 'BHBAH', name: 'Port de Bahreïn', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'BHBAH_AIR', name: 'Aéroport de Bahreïn', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'IL': [
    { code: 'ILASH', name: 'Port d\'Ashdod', type: 'sea', flag: '🚢', volume: '1.6M TEU' },
    { code: 'ILTLV', name: 'Aéroport de Tel Aviv Ben Gurion', type: 'air', flag: '✈️', volume: '0.4M tons' }
  ],
  'EG': [
    { code: 'EGALY', name: 'Port d\'Alexandrie', type: 'sea', flag: '🚢', volume: '2.5M TEU' },
    { code: 'EGCAI', name: 'Aéroport du Caire', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'ZA': [
    { code: 'ZADUR', name: 'Port de Durban', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'ZACPT', name: 'Port du Cap', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    { code: 'ZAJNB', name: 'Aéroport de Johannesburg OR Tambo', type: 'air', flag: '✈️', volume: '0.5M tons' }
  ],
  'MA': [
    { code: 'MACAS', name: 'Port de Casablanca', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'MATAN', name: 'Port de Tanger Med', type: 'sea', flag: '🚢', volume: '7.8M TEU' },
    { code: 'MACMN', name: 'Aéroport de Casablanca Mohammed V', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'NG': [
    { code: 'NGLOS', name: 'Port de Lagos', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'NGLOS_AIR', name: 'Aéroport de Lagos', type: 'air', flag: '✈️', volume: '0.2M tons' }
  ],
  'GH': [
    { code: 'GHTEM', name: 'Port de Tema', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'GHACC', name: 'Aéroport d\'Accra', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'CI': [
    { code: 'CIABJ', name: 'Port d\'Abidjan', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'CIABJ_AIR', name: 'Aéroport d\'Abidjan', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'KE': [
    { code: 'KEMBA', name: 'Port de Mombasa', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'KENBO', name: 'Aéroport de Nairobi Jomo Kenyatta', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'TZ': [
    { code: 'TZDAR', name: 'Port de Dar es Salaam', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'TZDAR_AIR', name: 'Aéroport de Dar es Salaam', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'DZ': [
    { code: 'DZALG', name: 'Port d\'Alger', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'DZALG_AIR', name: 'Aéroport d\'Alger', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'TN': [
    { code: 'TNRAD', name: 'Port de Radès', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'TNTUN', name: 'Aéroport de Tunis-Carthage', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],

  // Additional Asian Countries
  'KH': [
    { code: 'KHPNH', name: 'Port de Phnom Penh', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'KHPNH_AIR', name: 'Aéroport de Phnom Penh', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'KHKOS', name: 'Port de Sihanoukville', type: 'sea', flag: '🚢', volume: '0.8M TEU' }
  ],
  'LA': [
    { code: 'LAVTE', name: 'Aéroport de Vientiane', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'MM': [
    { code: 'MMRGN', name: 'Port de Yangon', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'MMRGN_AIR', name: 'Aéroport de Yangon', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'BD': [
    { code: 'BDCGP', name: 'Port de Chittagong', type: 'sea', flag: '🚢', volume: '3.1M TEU' },
    { code: 'BDDAC', name: 'Aéroport de Dhaka', type: 'air', flag: '✈️', volume: '0.3M tons' }
  ],
  'NP': [
    { code: 'NPKTM', name: 'Aéroport de Katmandou', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'BT': [
    { code: 'BTPAR', name: 'Aéroport de Paro', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'MV': [
    { code: 'MVMLE', name: 'Aéroport de Malé', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'BN': [
    { code: 'BNBWN', name: 'Aéroport de Bandar Seri Begawan', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'TL': [
    { code: 'TLDIL', name: 'Aéroport de Dili', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],

  // Additional Middle Eastern Countries
  'IR': [
    { code: 'IRIMA', name: 'Port de Bandar Abbas', type: 'sea', flag: '🚢', volume: '2.8M TEU' },
    { code: 'IRIMA_AIR', name: 'Aéroport de Téhéran Imam Khomeini', type: 'air', flag: '✈️', volume: '0.4M tons' }
  ],
  'IQ': [
    { code: 'IQBSR', name: 'Port de Bassorah', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'IQBGW', name: 'Aéroport de Bagdad', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'JO': [
    { code: 'JOAQJ', name: 'Port d\'Aqaba', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'JOAMM', name: 'Aéroport d\'Amman', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'LB': [
    { code: 'LBBEY', name: 'Port de Beyrouth', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'LBBEY_AIR', name: 'Aéroport de Beyrouth', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'SY': [
    { code: 'SYLAT', name: 'Port de Lattaquié', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'SYDAM', name: 'Aéroport de Damas', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'YE': [
    { code: 'YEADE', name: 'Port d\'Aden', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'YEADE_AIR', name: 'Aéroport d\'Aden', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],

  // Central Asian Countries
  'KZ': [
    { code: 'KZALA', name: 'Aéroport d\'Almaty', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'KZALA_RAIL', name: 'Terminal ferroviaire d\'Almaty', type: 'rail', flag: '🚂', volume: '0.5M TEU' }
  ],
  'UZ': [
    { code: 'UZTAS', name: 'Aéroport de Tashkent', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'UZTAS_RAIL', name: 'Terminal ferroviaire de Tashkent', type: 'rail', flag: '🚂', volume: '0.3M TEU' }
  ],
  'KG': [
    { code: 'KGFRU', name: 'Aéroport de Bichkek', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'TJ': [
    { code: 'TJDYU', name: 'Aéroport de Douchanbe', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'TM': [
    { code: 'TMASB', name: 'Aéroport d\'Achgabat', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'AF': [
    { code: 'AFKBL', name: 'Aéroport de Kaboul', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'PK': [
    { code: 'PKKHI', name: 'Port de Karachi', type: 'sea', flag: '🚢', volume: '2.4M TEU' },
    { code: 'PKKHI_AIR', name: 'Aéroport de Karachi', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'PKLHE', name: 'Aéroport de Lahore', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'MN': [
    { code: 'MNULN', name: 'Aéroport d\'Oulan-Bator', type: 'air', flag: '✈️', volume: '0.02M tons' },
    { code: 'MNULN_RAIL', name: 'Terminal ferroviaire d\'Oulan-Bator', type: 'rail', flag: '🚂', volume: '0.1M TEU' }
  ],

  // Additional African Countries
  'ET': [
    { code: 'ETADD', name: 'Aéroport d\'Addis-Abeba', type: 'air', flag: '✈️', volume: '0.4M tons' }
  ],
  'ER': [
    { code: 'ERASM', name: 'Port d\'Asmara', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'ERASM_AIR', name: 'Aéroport d\'Asmara', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'DJ': [
    { code: 'DJJIB', name: 'Port de Djibouti', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'DJJIB_AIR', name: 'Aéroport de Djibouti', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'SO': [
    { code: 'SOMGQ', name: 'Port de Mogadiscio', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'SOMGQ_AIR', name: 'Aéroport de Mogadiscio', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'UG': [
    { code: 'UGEBB', name: 'Aéroport d\'Entebbe', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'RW': [
    { code: 'RWKGL', name: 'Aéroport de Kigali', type: 'air', flag: '✈️', volume: '0.04M tons' }
  ],
  'BI': [
    { code: 'BIBJM', name: 'Aéroport de Bujumbura', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'SS': [
    { code: 'SSJUB', name: 'Aéroport de Juba', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'SD': [
    { code: 'SDPZB', name: 'Port de Port-Soudan', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'SDKRT', name: 'Aéroport de Khartoum', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'LY': [
    { code: 'LYTIP', name: 'Port de Tripoli', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'LYTIP_AIR', name: 'Aéroport de Tripoli', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'TD': [
    { code: 'TDNDJ', name: 'Aéroport de N\'Djaména', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'CF': [
    { code: 'CFBGF', name: 'Aéroport de Bangui', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'CD': [
    { code: 'CDFIH', name: 'Aéroport de Kinshasa', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'CDMAT', name: 'Port de Matadi', type: 'sea', flag: '🚢', volume: '0.5M TEU' }
  ],
  'CG': [
    { code: 'CGPNR', name: 'Port de Pointe-Noire', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'CGBZV', name: 'Aéroport de Brazzaville', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'CM': [
    { code: 'CMDLA', name: 'Port de Douala', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'CMDLA_AIR', name: 'Aéroport de Douala', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'CMNSM', name: 'Aéroport de Yaoundé', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'GA': [
    { code: 'GALIB', name: 'Port de Libreville', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'GALIB_AIR', name: 'Aéroport de Libreville', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'GQ': [
    { code: 'GQMSG', name: 'Aéroport de Malabo', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'ST': [
    { code: 'STTMS', name: 'Aéroport de São Tomé', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'AO': [
    { code: 'AOLAD', name: 'Port de Luanda', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'AOLAD_AIR', name: 'Aéroport de Luanda', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],

  // Additional African Countries (continued)
  'ZM': [
    { code: 'ZMLUN', name: 'Aéroport de Lusaka', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'ZW': [
    { code: 'ZWHRE', name: 'Aéroport de Harare', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'MW': [
    { code: 'MWBLZ', name: 'Aéroport de Blantyre', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'MZ': [
    { code: 'MZMPB', name: 'Port de Maputo', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'MZMPB_AIR', name: 'Aéroport de Maputo', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'MG': [
    { code: 'MGTNR', name: 'Port de Toamasina', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'MGTNR_AIR', name: 'Aéroport d\'Antananarivo', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'MU': [
    { code: 'MUPLU', name: 'Port Louis', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'MUPLU_AIR', name: 'Aéroport de Maurice', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'SC': [
    { code: 'SCSEZ', name: 'Aéroport de Victoria', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'KM': [
    { code: 'KMHAH', name: 'Aéroport de Moroni', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'LS': [
    { code: 'LSMSK', name: 'Aéroport de Maseru', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'SZ': [
    { code: 'SZMTS', name: 'Aéroport de Matsapha', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'BW': [
    { code: 'BWGBE', name: 'Aéroport de Gaborone', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'NA': [
    { code: 'NAWDH', name: 'Port de Walvis Bay', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'NAWDH_AIR', name: 'Aéroport de Windhoek', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],

  // Additional West African Countries
  'SN': [
    { code: 'SNDKR', name: 'Port de Dakar', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    { code: 'SNDKR_AIR', name: 'Aéroport de Dakar', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],
  'GM': [
    { code: 'GMBJL', name: 'Port de Banjul', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'GMBJL_AIR', name: 'Aéroport de Banjul', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'GW': [
    { code: 'GWOXB', name: 'Aéroport de Bissau', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'GN': [
    { code: 'GNCKY', name: 'Port de Conakry', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'GNCKY_AIR', name: 'Aéroport de Conakry', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'SL': [
    { code: 'SLFNA', name: 'Port de Freetown', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'SLFNA_AIR', name: 'Aéroport de Freetown', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'LR': [
    { code: 'LRMLW', name: 'Port de Monrovia', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'LRMLW_AIR', name: 'Aéroport de Monrovia', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'ML': [
    { code: 'MLBKO', name: 'Aéroport de Bamako', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'BF': [
    { code: 'BFOUA', name: 'Aéroport de Ouagadougou', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'NE': [
    { code: 'NENIM', name: 'Aéroport de Niamey', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'TG': [
    { code: 'TGLFW', name: 'Port de Lomé', type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'TGLFW_AIR', name: 'Aéroport de Lomé', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'BJ': [
    { code: 'BJCOO', name: 'Port de Cotonou', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'BJCOO_AIR', name: 'Aéroport de Cotonou', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],

  // Additional American Countries
  'GT': [
    { code: 'GTGUA', name: 'Aéroport de Guatemala City', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'GTPQU', name: 'Port de Puerto Quetzal', type: 'sea', flag: '🚢', volume: '0.9M TEU' }
  ],
  'BZ': [
    { code: 'BZBZE', name: 'Aéroport de Belize City', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'SV': [
    { code: 'SVSAL', name: 'Aéroport de San Salvador', type: 'air', flag: '✈️', volume: '0.02M tons' },
    { code: 'SVSAL_SEA', name: 'Port d\'Acajutla', type: 'sea', flag: '🚢', volume: '0.5M TEU' }
  ],
  'HN': [
    { code: 'HNTGU', name: 'Aéroport de Tegucigalpa', type: 'air', flag: '✈️', volume: '0.02M tons' },
    { code: 'HNPCO', name: 'Port de Puerto Cortés', type: 'sea', flag: '🚢', volume: '1.2M TEU' }
  ],
  'NI': [
    { code: 'NIMGA', name: 'Aéroport de Managua', type: 'air', flag: '✈️', volume: '0.02M tons' },
    { code: 'NICOR', name: 'Port de Corinto', type: 'sea', flag: '🚢', volume: '0.3M TEU' }
  ],
  'CR': [
    { code: 'CRSJO', name: 'Aéroport de San José', type: 'air', flag: '✈️', volume: '0.1M tons' },
    { code: 'CRLIM', name: 'Port de Limón', type: 'sea', flag: '🚢', volume: '1.2M TEU' }
  ],
  'PA': [
    { code: 'PAPTY', name: 'Aéroport de Panama City', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'PAPTY_SEA', name: 'Port de Balboa', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    { code: 'PACLN', name: 'Port de Colón', type: 'sea', flag: '🚢', volume: '4.3M TEU' }
  ],
  'CU': [
    { code: 'CUHAV', name: 'Port de La Havane', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'CUHAV_AIR', name: 'Aéroport de La Havane', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'JM': [
    { code: 'JMKIN', name: 'Port de Kingston', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'JMKIN_AIR', name: 'Aéroport de Kingston', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'HT': [
    { code: 'HTPAP', name: 'Port de Port-au-Prince', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'HTPAP_AIR', name: 'Aéroport de Port-au-Prince', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'DO': [
    { code: 'DOSDQ', name: 'Port de Santo Domingo', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'DOSDQ_AIR', name: 'Aéroport de Santo Domingo', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'TT': [
    { code: 'TTPOS', name: 'Port d\'Espagne', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'TTPOS_AIR', name: 'Aéroport de Port d\'Espagne', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'BB': [
    { code: 'BBBGI', name: 'Port de Bridgetown', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'BBBGI_AIR', name: 'Aéroport de Bridgetown', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'GY': [
    { code: 'GYGEO', name: 'Port de Georgetown', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'GYGEO_AIR', name: 'Aéroport de Georgetown', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'SR': [
    { code: 'SRPBM', name: 'Port de Paramaribo', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'SRPBM_AIR', name: 'Aéroport de Paramaribo', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'UY': [
    { code: 'UYMVD', name: 'Port de Montevideo', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'UYMVD_AIR', name: 'Aéroport de Montevideo', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'PY': [
    { code: 'PYASU', name: 'Aéroport d\'Asunción', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'BO': [
    { code: 'BOLPB', name: 'Aéroport de La Paz', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'BOVVI', name: 'Aéroport de Santa Cruz', type: 'air', flag: '✈️', volume: '0.08M tons' }
  ],
  'VE': [
    { code: 'VELCG', name: 'Port de La Guaira', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'VECCS', name: 'Aéroport de Caracas', type: 'air', flag: '✈️', volume: '0.1M tons' }
  ],

  // Additional Oceania Countries
  'FJ': [
    { code: 'FJSUV', name: 'Port de Suva', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'FJSUV_AIR', name: 'Aéroport de Suva', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'PG': [
    { code: 'PGPOM', name: 'Port de Port Moresby', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'PGPOM_AIR', name: 'Aéroport de Port Moresby', type: 'air', flag: '✈️', volume: '0.03M tons' }
  ],
  'NC': [
    { code: 'NCNOU', name: 'Port de Nouméa', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'NCNOU_AIR', name: 'Aéroport de Nouméa', type: 'air', flag: '✈️', volume: '0.02M tons' }
  ],
  'PF': [
    { code: 'PFPPT', name: 'Aéroport de Tahiti', type: 'air', flag: '✈️', volume: '0.05M tons' }
  ],
  'TO': [
    { code: 'TOTBU', name: 'Aéroport de Nuku\'alofa', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ],
  'WS': [
    { code: 'WSAPIA', name: 'Aéroport d\'Apia', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'VU': [
    { code: 'VUVLI', name: 'Aéroport de Port Vila', type: 'air', flag: '✈️', volume: '0.01M tons' }
  ],
  'SB': [
    { code: 'SBHIR', name: 'Aéroport de Honiara', type: 'air', flag: '✈️', volume: '0.005M tons' }
  ]
}; */

// NOTE: RAIL_FREIGHT_COUNTRIES removed (logic handled in StepMode and context)

// Prioritized countries by language - countries that are most relevant to speakers of each language
/* const PRIORITY_COUNTRIES_BY_LANG: Record<string, string[]> = {
  'fr': ['FR', 'BE', 'CH', 'CA', 'LU', 'MC'], // French-speaking countries and territories
  'en': ['US', 'GB', 'CA', 'AU', 'NZ', 'IE'], // English-speaking countries
  'de': ['DE', 'AT', 'CH', 'LI'], // German-speaking countries
  'es': ['ES', 'MX', 'AR', 'CO', 'PE', 'CL'], // Spanish-speaking countries
  'it': ['IT', 'SM', 'VA', 'CH'], // Italian-speaking countries
  'nl': ['NL', 'BE'], // Dutch-speaking countries
  'pt': ['PT', 'BR', 'AO', 'MZ'], // Portuguese-speaking countries  
  'zh': ['CN', 'TW', 'HK', 'MO', 'SG'], // Chinese-speaking countries/regions
  'ar': ['SA', 'AE', 'EG', 'JO', 'LB', 'MA'], // Arabic-speaking countries
  'tr': ['TR', 'CY'], // Turkish-speaking countries
  'ru': ['RU', 'BY', 'KZ', 'KG', 'UA'] // Russian-speaking countries
}; */

// ===== TRANSIT TIMES BY COUNTRY =====
// Structure to define transit times for each country and shipping mode
/* const TRANSIT_TIMES_BY_COUNTRY: Record<string, {
  sea: { min: number; max: number };
  air: { min: number; max: number };
  rail: { min: number; max: number };
  express: { min: number; max: number };
}> = {
  // Europe (closer, generally faster)
  'FR': { sea: { min: 25, max: 35 }, air: { min: 5, max: 8 }, rail: { min: 12, max: 18 }, express: { min: 2, max: 4 } },
  'DE': { sea: { min: 28, max: 38 }, air: { min: 5, max: 8 }, rail: { min: 12, max: 18 }, express: { min: 2, max: 4 } },
  'GB': { sea: { min: 30, max: 40 }, air: { min: 6, max: 9 }, rail: { min: 14, max: 20 }, express: { min: 3, max: 5 } },
  'IT': { sea: { min: 26, max: 36 }, air: { min: 5, max: 8 }, rail: { min: 13, max: 19 }, express: { min: 2, max: 4 } },
  'ES': { sea: { min: 28, max: 38 }, air: { min: 6, max: 9 }, rail: { min: 14, max: 20 }, express: { min: 3, max: 5 } },
  'NL': { sea: { min: 26, max: 36 }, air: { min: 5, max: 8 }, rail: { min: 12, max: 18 }, express: { min: 2, max: 4 } },
  'BE': { sea: { min: 27, max: 37 }, air: { min: 5, max: 8 }, rail: { min: 12, max: 18 }, express: { min: 2, max: 4 } },
  'PL': { sea: { min: 32, max: 42 }, air: { min: 6, max: 9 }, rail: { min: 10, max: 16 }, express: { min: 3, max: 5 } },
  'CH': { sea: { min: 28, max: 38 }, air: { min: 5, max: 8 }, rail: { min: 12, max: 18 }, express: { min: 2, max: 4 } },
  'AT': { sea: { min: 30, max: 40 }, air: { min: 6, max: 9 }, rail: { min: 11, max: 17 }, express: { min: 3, max: 5 } },

  // North America
  'US': { sea: { min: 18, max: 28 }, air: { min: 7, max: 10 }, rail: { min: 999, max: 999 }, express: { min: 3, max: 5 } }, // No rail to US
  'CA': { sea: { min: 20, max: 30 }, air: { min: 8, max: 11 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 6 } }, // No rail to Canada

  // Asia-Pacific (closer to China)
  'JP': { sea: { min: 8, max: 15 }, air: { min: 3, max: 5 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 3 } },
  'KR': { sea: { min: 6, max: 12 }, air: { min: 2, max: 4 }, rail: { min: 999, max: 999 }, express: { min: 1, max: 3 } },
  'SG': { sea: { min: 12, max: 20 }, air: { min: 4, max: 7 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 4 } },
  'AU': { sea: { min: 15, max: 25 }, air: { min: 8, max: 12 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 7 } },
  'NZ': { sea: { min: 18, max: 28 }, air: { min: 10, max: 14 }, rail: { min: 999, max: 999 }, express: { min: 5, max: 8 } },
  'TH': { sea: { min: 10, max: 18 }, air: { min: 4, max: 7 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 4 } },
  'MY': { sea: { min: 11, max: 19 }, air: { min: 4, max: 7 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 4 } },
  'VN': { sea: { min: 8, max: 16 }, air: { min: 3, max: 6 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 4 } },
  'PH': { sea: { min: 10, max: 18 }, air: { min: 4, max: 7 }, rail: { min: 999, max: 999 }, express: { min: 2, max: 4 } },
  'ID': { sea: { min: 12, max: 20 }, air: { min: 5, max: 8 }, rail: { min: 999, max: 999 }, express: { min: 3, max: 5 } },
  'IN': { sea: { min: 15, max: 25 }, air: { min: 6, max: 9 }, rail: { min: 999, max: 999 }, express: { min: 3, max: 6 } },

  // Middle East
  'AE': { sea: { min: 18, max: 28 }, air: { min: 6, max: 9 }, rail: { min: 999, max: 999 }, express: { min: 3, max: 5 } },
  'SA': { sea: { min: 20, max: 30 }, air: { min: 7, max: 10 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 6 } },
  'TR': { sea: { min: 25, max: 35 }, air: { min: 6, max: 9 }, rail: { min: 12, max: 18 }, express: { min: 3, max: 5 } },

  // Eastern Europe & CIS (Rail available)
  'RU': { sea: { min: 35, max: 45 }, air: { min: 8, max: 12 }, rail: { min: 8, max: 14 }, express: { min: 4, max: 7 } },
  'KZ': { sea: { min: 40, max: 50 }, air: { min: 9, max: 13 }, rail: { min: 7, max: 12 }, express: { min: 5, max: 8 } },
  'BY': { sea: { min: 32, max: 42 }, air: { min: 7, max: 10 }, rail: { min: 10, max: 16 }, express: { min: 4, max: 6 } },
  'UA': { sea: { min: 35, max: 45 }, air: { min: 7, max: 10 }, rail: { min: 12, max: 18 }, express: { min: 4, max: 6 } },

  // Africa (farther, longer transit)
  'ZA': { sea: { min: 25, max: 35 }, air: { min: 10, max: 14 }, rail: { min: 999, max: 999 }, express: { min: 5, max: 8 } },
  'NG': { sea: { min: 30, max: 40 }, air: { min: 8, max: 12 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 7 } },
  'EG': { sea: { min: 22, max: 32 }, air: { min: 7, max: 10 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 6 } },
  'MA': { sea: { min: 28, max: 38 }, air: { min: 8, max: 11 }, rail: { min: 999, max: 999 }, express: { min: 4, max: 7 } },

  // South America (very far)
  'BR': { sea: { min: 30, max: 45 }, air: { min: 12, max: 18 }, rail: { min: 999, max: 999 }, express: { min: 6, max: 10 } },
  'AR': { sea: { min: 32, max: 47 }, air: { min: 13, max: 19 }, rail: { min: 999, max: 999 }, express: { min: 7, max: 11 } },
  'CL': { sea: { min: 28, max: 43 }, air: { min: 14, max: 20 }, rail: { min: 999, max: 999 }, express: { min: 7, max: 12 } },
  'PE': { sea: { min: 26, max: 41 }, air: { min: 13, max: 19 }, rail: { min: 999, max: 999 }, express: { min: 6, max: 11 } },
  'CO': { sea: { min: 24, max: 39 }, air: { min: 11, max: 17 }, rail: { min: 999, max: 999 }, express: { min: 5, max: 9 } },
  'MX': { sea: { min: 22, max: 37 }, air: { min: 10, max: 16 }, rail: { min: 999, max: 999 }, express: { min: 5, max: 9 } },

  // Default/fallback times for countries not specifically listed
  'DEFAULT': { sea: { min: 30, max: 45 }, air: { min: 7, max: 10 }, rail: { min: 15, max: 25 }, express: { min: 3, max: 5 } }
}; */

// Function to get transit times for a specific country and mode (kept for future use)
/* const getTransitTimes = (countryCode: string, mode: string): { min: number; max: number } => {
  const countryTimes = TRANSIT_TIMES_BY_COUNTRY[countryCode] || TRANSIT_TIMES_BY_COUNTRY['DEFAULT'];
  
  switch (mode.toLowerCase()) {
    case 'sea':
      return countryTimes.sea;
    case 'air':
      return countryTimes.air;
    case 'rail':
      return countryTimes.rail;
    case 'express':
      return countryTimes.express;
    default:
      return { min: 0, max: 0 };
  }
}; */

// Function to generate dynamic shipping mode descriptions with country-specific transit times
/* const getDynamicModeDescription = (mode: string, countryCode: string, userLang: string): string => {
  const times = getTransitTimes(countryCode, mode);
  
  // If no rail service (999 days indicates not available)
  if (mode.toLowerCase() === 'rail' && times.min >= 999) {
    const notAvailableTranslations = {
      en: 'Not available for this destination',
      fr: 'Non disponible pour cette destination',
      zh: '此目的地不可用',
      de: 'Für dieses Ziel nicht verfügbar',
      es: 'No disponible para este destino',
      it: 'Non disponibile per questa destinazione',
      nl: 'Niet beschikbaar voor deze bestemming',
      ar: 'غير متوفر لهذه الوجهة',
      pt: 'Não disponível para este destino',
      tr: 'Bu hedef için mevcut değil',
      ru: 'Недоступно для этого направления'
    };
    return notAvailableTranslations[userLang as keyof typeof notAvailableTranslations] || notAvailableTranslations.en;
  }
  
  // Translations for day/days
  const dayTranslations = {
    en: { singular: 'day', plural: 'days' },
    fr: { singular: 'jour', plural: 'jours' },
    zh: { singular: '天', plural: '天' },
    de: { singular: 'Tag', plural: 'Tage' },
    es: { singular: 'día', plural: 'días' },
    it: { singular: 'giorno', plural: 'giorni' },
    nl: { singular: 'dag', plural: 'dagen' },
    ar: { singular: 'يوم', plural: 'أيام' },
    pt: { singular: 'dia', plural: 'dias' },
    tr: { singular: 'gün', plural: 'gün' },
    ru: { singular: 'день', plural: 'дней' }
  };

  // Translations for mode descriptors
  const modeTranslations = {
    en: { sea: 'Economical', air: 'Fast', rail: 'Cost-effective', express: 'Fastest' },
    fr: { sea: 'Économique', air: 'Rapide', rail: 'Rentable', express: 'Le plus rapide' },
    zh: { sea: '经济实惠', air: '快速', rail: '性价比高', express: '最快' },
    de: { sea: 'Wirtschaftlich', air: 'Schnell', rail: 'Kosteneffektiv', express: 'Am schnellsten' },
    es: { sea: 'Económico', air: 'Rápido', rail: 'Rentable', express: 'Más rápido' },
    it: { sea: 'Economico', air: 'Veloce', rail: 'Conveniente', express: 'Più veloce' },
    nl: { sea: 'Economisch', air: 'Snel', rail: 'Kosteneffectief', express: 'Snelste' },
    ar: { sea: 'اقتصادي', air: 'سريع', rail: 'فعال من حيث التكلفة', express: 'الأسرع' },
    pt: { sea: 'Econômico', air: 'Rápido', rail: 'Custo-efetivo', express: 'Mais rápido' },
    tr: { sea: 'Ekonomik', air: 'Hızlı', rail: 'Uygun maliyetli', express: 'En hızlı' },
    ru: { sea: 'Экономичный', air: 'Быстрый', rail: 'Выгодный', express: 'Самый быстрый' }
  };

  const currentLang = userLang as keyof typeof dayTranslations;
  const dayLang = dayTranslations[currentLang] || dayTranslations.en;
  const modeLang = modeTranslations[currentLang] || modeTranslations.en;
  
  const dayWord = times.max === 1 ? dayLang.singular : dayLang.plural;
  const timeString = `${times.min}-${times.max} ${dayWord}`;
  
  const modeKey = mode.toLowerCase() as keyof typeof modeLang;
  const modeWord = modeLang[modeKey] || modeLang.sea;
  
  return `${modeWord}, ${timeString}`;
}; */

// CustomDropdown component moved to shared/components/CustomDropdown.tsx
// Legacy CustomDropdown implementation removed (unused)

// Simple text dictionary for i18n (extend as needed)
// Casting to any to allow flexible dynamic keys without TypeScript errors
import { I18N_TEXT } from '@/features/lead/context/i18n';
// i18n helper with fallback to English
const getText = (key: string, lang: keyof typeof I18N_TEXT): string => {
  const dict =
    (I18N_TEXT as Record<string, Record<string, string>>)[lang] ||
    (I18N_TEXT as Record<string, Record<string, string>>).en ||
    {};
  return dict?.[key] ?? key;
};
// I18N moved fully to context; removing legacy commented block
/*
  en: {
    // Header
    mainTitle: 'Shipping Quote from China',
    mainSubtitle: 'Get a fast, reliable quote for your shipment from China',
    // Timeline steps
    timelineDestination: 'Destination',
    timelineMode: 'Mode',
    timelineOrigin: 'Origin',
    timelineCargo: 'Cargo',
    timelineGoodsDetails: 'Goods Details',
    timelineContact: 'Contact',
    // Navigation
    stepCounter: 'Step',
    next: 'Next',
    previous: 'Previous',
    trustBadge: 'Trusted by 55,000+ importers | Response < 24h | 100% Free',
    // Common
    searchCountry: 'Search for a country...',
    noCountryResults: 'No countries found. Try a different search.',
    mostUsed: 'Most used',
    // Step 1 translations
    step1Title: 'Where do you ship?',
    destinationCity: 'Destination City',
    destinationZipCode: 'Destination ZIP Code',
    clearCountry: 'Clear selected country',
    clearPort: 'Clear selected port',
    // Location types
    factoryWarehouse: 'Factory/Warehouse',
    portAirport: 'Port/Airport',
    port: 'Port',
    airport: 'Airport', 
    railTerminal: 'Rail Terminal',
    seaPort: 'Sea Port',
    volume: 'Volume',
    businessAddress: 'Business address',
    residentialAddress: 'Residential address',
    chooseLocationDescription: 'Choose your pickup location',
    // Step 2 translations
    step2Title: 'Preferred shipping mode',
    seaFreight: 'Sea Freight',
    seaFreightDesc: 'Economical, 30-45 days',
    railFreight: 'Rail Freight',
    railFreightDesc: 'Cost-effective, 15-25 days',
    airFreight: 'Air Freight',
    airFreightDesc: 'Fast, 7-10 days',
    express: 'Express',
    expressDesc: 'Fastest, 3-5 days',
    unsureShipping: "I'm not sure yet",
    unsureShippingDesc: 'Let the experts help',
    unsureShippingBenefits: 'Professional guidance',
    unsureShippingFeedback: "Great choice! We'll recommend the best shipping option for your specific needs and requirements",
    beginnerSectionTitle: 'For beginners',
    beginnerSectionDesc: 'Let our experts advise you for free',
    separatorText: 'Or choose yourself',
    unsureAboutChoice: 'Not sure about your choice?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Choose your preferred shipping method',
    shippingMethodDescription: 'Different shipping modes offer various trade-offs between cost, speed, and reliability.',
    railAvailableForDestination: 'Rail freight is available for your destination.',
    seaFreightBenefits: 'Best for large, heavy shipments',
    railFreightBenefits: 'Eco-friendly option',
    airFreightBenefits: 'Ideal for urgent shipments',
    expressBenefits: 'Door-to-door service',
    seaFeedback: 'Great choice for cost-effective shipping of larger volumes',
    railFeedback: 'Excellent balance of cost and speed with environmental benefits',
    airFeedback: 'Perfect for time-sensitive or high-value cargo',
    expressFeedback: 'Best for urgent, small-to-medium shipments with full tracking',
    // Beginner-friendly enhancements
    businessDescription: 'Company address, office building',
    residentialDescription: 'House, apartment, personal address', 
    factoryDescription: 'Factory, distribution center, warehouse',
    portDescription: 'Direct to port/airport pickup',
    helpChooseLocation: 'Not sure? Choose Business/Office for professional shipments or Residential for personal deliveries',
    startTyping: 'Start typing to search...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Select your destination country',
    searchCountryDescription: 'Search for the country where you want to ship your goods',
    addressTypeQuestion: 'What type of address is your destination?',
    selectDestinationLocationType: 'Please select a destination location type',
    selectDestinationPort: 'Select destination port',
    selectDestinationPortDescription: 'Choose the specific port or airport for delivery',
    searchPortsIn: 'Search ports in',
    searchDestinationPorts: 'Search destination ports',
    enterDestinationDetails: 'Enter destination details',
    // Validation messages
    validationShippingType: 'Please select a shipping type',
    validationPackageType: 'Please select a package type',
    validationDimensionsNonSpecified: 'Please enter all dimensions (L, W, H) for the non-specified pallet',
    validationPalletHeight: 'Please enter the height for the pallet',
    validationBoxDimensions: 'Please enter dimensions for the boxes/crates',
    validationWeightPerUnit: 'Please enter the weight per unit',
    validationTotalVolume: 'Please enter the total volume',
    validationTotalWeight: 'Please enter the total weight',
    validationAtLeastOneOfVolumeOrWeight: 'Please provide total volume or total weight',
    validationContainerType: 'Please select a container type',
    validationDestinationCountry: 'Please select a destination country',
    validationDestinationLocationType: 'Please select a destination location type',
    validationDestinationCity: 'Please enter a destination city',
    validationDestinationZip: 'Please enter a destination ZIP code',
    validationShippingMode: 'Please select a shipping mode',
    validationPickupLocationType: 'Please select a pickup location type',
    validationOriginPort: 'Please select an origin',
    validationPickupCity: 'Please enter a pickup city',
    validationPickupZip: 'Please enter a pickup ZIP code',
    validationGoodsValue: 'Please enter the goods value',
    validationReadyDate: 'Please select when your goods will be ready',
    validationShipperType: 'Please select if you are an individual or company',
    validationFirstName: 'Please enter your first name',
    validationLastName: 'Please enter your last name',
    validationCompanyName: 'Please enter your company name',
    validationShipperRole: 'Please select your shipper type',
    validationEmail: 'Please provide a valid email address',
    noCommitmentRequired: 'No commitment required - just expert guidance!',
    cityPostalDescription: 'Provide the city and postal code for accurate shipping',
    popular: 'Popular',
    otherCountries: 'Other countries',
    // Step 3 translations
    step3Title: 'Select pickup location in China',
    selectPickupLocationType: 'Select your pickup location type',
    pickupLocationDescription: 'Choose where we should collect your goods in China',
    enterPickupDetails: 'Enter pickup details',
    pickupCityPostalDescription: 'Provide the pickup city and postal code in China',
    searchPortTerminal: 'Search for port/terminal/airport...',
    selectPortTerminal: 'Select pickup port/terminal/airport',
    portTerminalDescription: 'Choose the specific port, terminal, or airport for pickup',
    pickupCity: 'Pickup City',
    pickupZipCode: 'Pickup ZIP Code',
    dontKnowPort: "I don't know",
    dontKnowPortDescription: "I'm not sure which port/terminal to choose",
    dontKnowPortFeedback: "No problem! We'll help you choose the best port/terminal for your shipment.",
    perfectPortFeedback: "Perfect! We'll collect from",
    cityPickupFeedback: "Great! We'll arrange pickup from {city}, China",
    annualVolume: "Annual volume",
    // Port translations
    ports: {
      // China pickup ports
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Beijing Capital',
      'PVG': 'Shanghai Pudong',
      'CAN': 'Guangzhou Baiyun',
      'CTU': 'Chengdu Shuangliu',
      'KMG': 'Kunming Changshui',
      'XIY': "Xi'an Xianyang",
      'HGH': 'Hangzhou Xiaoshan',
      'NKG': 'Nanjing Lukou',
      'ZIH': 'Zhengzhou Rail Terminal',
      'CQN': 'Chongqing Rail Terminal',
      'WUH': 'Wuhan Rail Terminal',
      'CDU': 'Chengdu Rail Terminal',
      // Destination ports - Europe
      'FRMRS': 'Port of Marseille-Fos',
      'FRLEH': 'Port of Le Havre',
      'FRCDG': 'Charles de Gaulle Airport',
      'FRORY': 'Paris-Orly Airport',
      'FRLYO': 'Lyon-Saint Exupéry Airport',
      'DEHAM': 'Port of Hamburg',
      'DEBRE': 'Port of Bremen',
      'DEFRA': 'Frankfurt Airport',
      'DEMUC': 'Munich Airport',
      'DEHAM_RAIL': 'Hamburg Rail Terminal',
      'GBFXT': 'Port of Felixstowe',
      'GBSOU': 'Port of Southampton',
      'GBLHR': 'London Heathrow Airport',
      'GBLGW': 'London Gatwick Airport',
      'GBMAN': 'Manchester Airport',
      'NLRTM': 'Port of Rotterdam',
      'NLAMS': 'Amsterdam Schiphol Airport',
      'BEANR': 'Port of Antwerp',
      'BEBRU': 'Brussels Airport',
      'BELGG': 'Liège Airport',
      'ITGOA': 'Port of Genoa',
      'ITLSP': 'Port of La Spezia',
      'ITMXP': 'Milan Malpensa Airport',
      'ITFCO': 'Rome Fiumicino Airport',
      'ESALG': 'Port of Algeciras',
      'ESVAL': 'Port of Valencia',
      'ESMAD': 'Madrid-Barajas Airport',
      'ESBCN': 'Barcelona Airport',
      'PTLIS': 'Port of Lisbon',
      'PTLEX': 'Port of Leixões (Porto)',
      'PTLIS_AIR': 'Lisbon Airport',
      'PLGDN': 'Port of Gdansk',
      'PLGDY': 'Port of Gdynia',
      'PLWAW': 'Warsaw Chopin Airport',
      'GRPIR': 'Port of Piraeus',
      'GRTHE': 'Port of Thessaloniki',
      'GRATH': 'Athens Airport',
      'TRMER': 'Port of Mersin',
      'TRIST': 'Port of Istanbul',
      'TRIST_AIR': 'Istanbul Airport',
      'NOOSL': 'Port of Oslo',
      'NOOSLO': 'Oslo Gardermoen Airport',
      'SEGOT': 'Port of Gothenburg',
      'SESTO': 'Port of Stockholm',
      'SEARN': 'Stockholm Arlanda Airport',
      'DKAAR': 'Port of Aarhus',
      'DKCPH': 'Copenhagen Airport',
      'FIHEN': 'Port of Helsinki',
      'FIHEL': 'Helsinki-Vantaa Airport',
      'EETLL': 'Port of Tallinn',
      'EETLL_AIR': 'Tallinn Airport',
      'LVRIX': 'Port of Riga',
      'LVRIX_AIR': 'Riga Airport',
      'LTKLA': 'Port of Klaipeda',
      'LTVNO': 'Vilnius Airport',
      'CZPRG': 'Prague Airport',
      'CZPRG_RAIL': 'Prague Rail Terminal',
      'SKBTS': 'Bratislava Airport',
      'SKBTS_RAIL': 'Bratislava Rail Terminal',
      'HUBUD': 'Budapest Airport',
      'HUBUD_RAIL': 'Budapest Rail Terminal',
      'ROCND': 'Port of Constanta',
      'ROBBU': 'Bucharest Airport',
      'BGVAR': 'Port of Varna',
      'BGSOF': 'Sofia Airport',
      'HRRIU': 'Port of Rijeka',
      'HRZAG': 'Zagreb Airport',
      'SIKOP': 'Port of Koper',
      'SILJB': 'Ljubljana Airport',
      'ATVIE': 'Vienna Airport',
      'ATVIE_RAIL': 'Vienna Rail Terminal',
      'CHZUR': 'Zurich Airport',
      'CHBAS_RAIL': 'Basel Rail Terminal',
      'IEDUB': 'Port of Dublin',
      'IEDUB_AIR': 'Dublin Airport',
      'ISKEF': 'Reykjavik Airport',
      'RULED': 'Port of St. Petersburg',
      'RUNVO': 'Port of Novorossiysk',
      'RUSVO': 'Moscow Sheremetyevo Airport',
      'RUMOW_RAIL': 'Moscow Rail Terminal',
      'UAODE': 'Port of Odessa',
      'UAKBP': 'Kiev Boryspil Airport',
      'BYMSQ': 'Minsk Airport',
      'BYMSQ_RAIL': 'Minsk Rail Terminal',
      // Americas
      'USLAX': 'Port of Los Angeles',
      'USLGB': 'Port of Long Beach',
      'USNYC': 'Port of New York/New Jersey',
      'USSAV': 'Port of Savannah',
      'USJFK': 'JFK Airport New York',
      'USLAX_AIR': 'LAX Airport Los Angeles',
      'USMIA': 'Miami Airport',
      'USORD': 'Chicago O\'Hare Airport',
      'CAVAN': 'Port of Vancouver',
      'CAHAL': 'Port of Halifax',
      'CAYYZ': 'Toronto Pearson Airport',
      'CAVAN_AIR': 'Vancouver Airport',
      'MXVER': 'Port of Veracruz',
      'MXMEX': 'Mexico City Airport',
      'BRSAN': 'Port of Santos',
      'BRRIG': 'Port of Rio Grande',
      'BRGRU': 'São Paulo Guarulhos Airport',
      'BRGIG': 'Rio de Janeiro Galeão Airport',
      'ARBUE': 'Port of Buenos Aires',
      'AREZE': 'Buenos Aires Ezeiza Airport',
      'CLVAP': 'Port of Valparaiso',
      'CLSAN': 'Port of San Antonio',
      'CLSCL': 'Santiago Airport',
      'PECAL': 'Port of Callao',
      'PELIM': 'Lima Jorge Chávez Airport',
      'COCAR': 'Port of Cartagena',
      'COBOG': 'Bogotá El Dorado Airport',
      'ECGYE': 'Port of Guayaquil',
      'ECUIO': 'Quito Airport',
      // Asia-Pacific
      'CNSHA': 'Port of Shanghai',
      'CNSZX': 'Port of Shenzhen',
      'CNPVG': 'Shanghai Pudong Airport',
      'CNPEK': 'Beijing Capital Airport',
      'JPTYO': 'Port of Tokyo',
      'JPYOK': 'Port of Yokohama',
      'JPNRT': 'Tokyo Narita Airport',
      'JPKIX': 'Kansai Osaka Airport',
      'KRPUS': 'Port of Busan',
      'KRICN': 'Seoul Incheon Airport',
      'TWKAO': 'Port of Kaohsiung',
      'TWTPE': 'Taipei Taoyuan Airport',
      'HKHKG': 'Port of Hong Kong',
      'HKHKG_AIR': 'Hong Kong Airport',
      'SGSIN': 'Port of Singapore',
      'SGSIN_AIR': 'Singapore Changi Airport',
      'MYPKG': 'Port Klang',
      'MYKUL': 'Kuala Lumpur Airport',
      'THLCH': 'Port of Laem Chabang',
      'THBKK': 'Bangkok Suvarnabhumi Airport',
      'VNHPH': 'Port of Hai Phong',
      'VNSGN': 'Port of Ho Chi Minh City',
      'VNSGN_AIR': 'Ho Chi Minh City Airport',
      'PHMNL': 'Port of Manila',
      'PHMNL_AIR': 'Manila Airport',
      'IDJKT': 'Port of Jakarta (Tanjung Priok)',
      'IDCGK': 'Jakarta Soekarno-Hatta Airport',
      'INJNP': 'Port of Jawaharlal Nehru',
      'INMAA': 'Port of Chennai',
      'INBOM': 'Mumbai Airport',
      'INDEL': 'Delhi Airport',
      'LKCMB': 'Port of Colombo',
      'LKCMB_AIR': 'Colombo Airport',
      'AUSYD': 'Port of Sydney',
      'AUMEL': 'Port of Melbourne',
      'AUSYD_AIR': 'Sydney Airport',
      'AUMEL_AIR': 'Melbourne Airport',
      'NZAKL': 'Port of Auckland',
      'NZAKL_AIR': 'Auckland Airport',
      // Middle East & Africa
      'AEJEA': 'Port Jebel Ali (Dubai)',
      'AEDXB': 'Dubai Airport',
      'AEAUH': 'Abu Dhabi Airport',
      'SAJED': 'King Abdulaziz Port (Dammam)',
      'SARRH': 'Riyadh Airport',
      'QADOH': 'Port of Doha',
      'QADOH_AIR': 'Doha Hamad Airport',
      'KWKWI': 'Port of Kuwait',
      'KWKWI_AIR': 'Kuwait Airport',
      'OMSLL': 'Port of Salalah',
      'OMSLL_AIR': 'Salalah Airport',
      'BHBAH': 'Port of Bahrain',
      'BHBAH_AIR': 'Bahrain Airport',
      'ILASH': 'Port of Ashdod',
      'ILTLV': 'Tel Aviv Ben Gurion Airport',
      'EGALY': 'Port of Alexandria',
      'EGCAI': 'Cairo Airport',
      'ZADUR': 'Port of Durban',
      'ZACPT': 'Port of Cape Town',
      'ZAJNB': 'Johannesburg OR Tambo Airport',
      'MACAS': 'Port of Casablanca',
      'MATAN': 'Port of Tanger Med',
      'MACMN': 'Casablanca Mohammed V Airport',
      'NGLOS': 'Port of Lagos',
      'NGLOS_AIR': 'Lagos Airport',
      'GHTEM': 'Port of Tema',
      'GHACC': 'Accra Airport',
      'CIABJ': 'Port of Abidjan',
      'CIABJ_AIR': 'Abidjan Airport',
      'KEMBA': 'Port of Mombasa',
      'KENBO': 'Nairobi Jomo Kenyatta Airport',
      'TZDAR': 'Port of Dar es Salaam',
      'TZDAR_AIR': 'Dar es Salaam Airport',
      'DZALG': 'Port of Algiers',
      'DZALG_AIR': 'Algiers Airport',
      'TNRAD': 'Port of Radès',
      'TNTUN': 'Tunis-Carthage Airport',
      // Cameroon ports
      'CMDLA': 'Port of Douala',
      'CMDLA_AIR': 'Douala Airport',
      'CMNSM': 'Yaoundé Airport'
    },
    // Region translations
    regions: {
      'East China': 'East China',
      'South China': 'South China',
      'North China': 'North China',
      'West China': 'West China',
      'Southwest China': 'Southwest China',
      'Northwest China': 'Northwest China',
      'Central China': 'Central China'
          },
      // Dynamic translations by mode
      searchPort: 'Search for port...',
      searchAirport: 'Search for airport...',
      searchRailTerminal: 'Search for rail terminal...',
      selectPort: 'Select pickup port',
      selectAirport: 'Select pickup airport', 
      selectRailTerminal: 'Select pickup rail terminal',
      portDescriptionDynamic: 'Choose the specific port for pickup',
      airportDescriptionDynamic: 'Choose the specific airport for pickup',
      railTerminalDescriptionDynamic: 'Choose the specific rail terminal for pickup',
      // Step 5 translations
      step5Title: 'Tell us about your goods',
      goodsValueDeclaration: 'Goods Value & Declaration',
      goodsValueDescription: 'Provide the commercial value for customs declaration and insurance purposes',
      commercialValue: 'Commercial value of goods',
      goodsValueHelp: 'This value is used for customs declaration and insurance calculations',
      personalOrHazardous: 'Personal effects or contains hazardous/restricted materials',
      personalHazardousHelp: 'Check this if shipping personal belongings or goods requiring special handling',
      shipmentReadiness: 'Shipment Readiness',
      shipmentTimingDescription: 'Help us plan your shipment timeline and provide accurate rates',
      goodsReadyQuestion: 'When will your goods be ready for pickup?',
      readyNow: '✅ Ready now - goods are available for immediate pickup',
      readyIn1Week: '📅 Within 1 week - currently preparing',
      readyIn2Weeks: '📅 Within 2 weeks - production in progress',
      readyIn1Month: '📅 Within 1 month - planning ahead',
      dateNotSet: '❓ Date not determined yet',
      timingHelp: 'Accurate timing helps us provide the most competitive rates',
      additionalDetails: 'Additional Details (Optional)',
      additionalDetailsDescription: 'Provide any special requirements or additional information',
      goodsDescription: 'Brief description of goods (optional)',
      goodsDescriptionPlaceholder: 'e.g., Electronics, Furniture, Clothing, Machinery...',
      goodsDescriptionHelp: 'Helps us ensure proper handling and documentation',
      specialRequirements: 'Special handling requirements (optional)',
      noSpecialRequirements: 'No special requirements',
      fragileGoods: '🔸 Fragile goods - handle with care',
      temperatureControlled: '🌡️ Temperature controlled',
      urgentTimeSensitive: '⚡ Urgent/time-sensitive',
      highValueInsurance: '🛡️ High-value insurance required',
      otherSpecify: '📝 Other (please specify in remarks)',
      rateValidityNotice: 'Rate Validity Notice:',
      rateValidityText: 'Quoted rates are valid until the expiry date shown on each quote. If your goods are not ready for pickup by this date, rates may be subject to change based on current market conditions.',
      selectOption: 'Select an option',
      // Step 6 translations
      step6Title: 'Contact details',
      personalInformation: 'Personal Information',
      personalInfoDescription: 'Tell us who you are',
      firstName: 'First Name',
      firstNamePlaceholder: 'Enter your first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Enter your last name',
      businessInformation: 'Business Information',
      businessInfoDescription: 'Tell us about your company',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Enter your company name',
      shippingExperience: 'Shipping Experience',
      selectExperience: 'Select your experience level',
    firstTimeShipper: 'First international shipment',
    upTo10Times: 'Occasional shipper',
    moreThan10Times: 'Experienced shipper',
    regularShipper: 'Regular shipper',
      contactInformation: 'Contact Information',
      contactInfoDescription: 'How can we reach you?',
      emailAddress: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      emailHelp: 'We\'ll send your quote and updates to this email',
      phoneNumber: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      phoneHelp: 'For urgent updates and clarifications',
      additionalNotes: 'Additional Notes',
      additionalNotesDescription: 'Anything else we should know?',
      remarks: 'Special Remarks',
      remarksPlaceholder: 'Any special instructions, requirements, or questions...',
      remarksHelp: 'Help us serve you better with any additional context',
      readyToSubmit: 'Ready to get your quote!',
      submitDescription: 'Click "Get My Quote" below to submit your request. We\'ll respond within 24 hours.',
      getMyQuote: 'Get My Quote',
      securityBadge: 'Secure & GDPR compliant',
      // Customer type selection
      customerTypeQuestion: 'Are you shipping as an individual or for a company?',
      customerTypeDescription: 'This helps us provide the most relevant information fields',
      individualCustomer: 'Individual',
      individualDescription: 'Personal shipment or private customer',
      companyCustomer: 'Company',
      companyDescription: 'Business shipment or commercial entity',
      // Confirmation page
      confirmationMainTitle: 'Request Confirmation',
      confirmationTitle: 'Quote Request Confirmed',
      confirmationSubtitle: 'Your request has been successfully submitted',
      referenceNumber: 'Reference Number',
      yourRequest: 'Your Request Summary',
      shipmentDetails: 'Shipment Details',
      fromTo: 'From {origin} to {destination}',
      mode: 'Mode',
      contactDetails: 'Contact Details',
      nextSteps: 'Next Steps',
      step1: 'Request received',
      step1Time: 'Now',
      step2: 'Analysis & quotation',
      step2Time: 'Within 4 business hours',
      step3: 'Commercial contact',
      step3Time: 'Within 24 hours',
      step4: 'Detailed quote',
      step4Time: 'Within 48 hours',
      aboutSino: 'About SINO Shipping & FS International',
      aboutSubtitle: 'Your request is in expert hands',
      sinoDescription: 'SINO Shipping, launched in 2018 by French entrepreneurs, became part of FS International in 2021. This partnership combines Western customer-focused approach with deep Chinese local expertise.',
      fsDescription: 'FS International, founded in Hong Kong in September 1989, is one of the most trusted names in global logistics and transportation in the region.',
      ourExpertise: 'Our Expertise',
      expertise1: 'Maritime, air, rail & multimodal transport',
      expertise2: 'E-commerce solutions (Amazon FBA, dropshipping)',
      expertise3: 'Sourcing & quality control',
      expertise4: 'Complete logistics services',
      keyNumbers: 'Key Numbers',
      number1: '15,000+ active users',
      number2: '1,000+ monthly quotes',
      number3: '50+ partner countries',
      number4: 'Since 1989',
      globalNetwork: 'Global Network',
      networkDescription: 'Strategic offices in key logistics hubs:',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
      hkOffice: 'Hong Kong: 1st Floor, Block C, Sea View Estate, 8 Watson Road, North Point',
      needHelp: 'Need Help?',
      actions: 'Quick Actions',
      newRequest: 'Make another request',
      ourServices: 'View our services',
      subscribe: 'Subscribe to updates',
      websites: 'Our Websites',
      // New statistics section
      impactInNumbers: 'Our Impact in Numbers',
      impactDescription: 'Delivering excellence across China with proven results and trusted service',
      satisfiedCustomers: 'Satisfied Customers',
      customerSatisfaction: 'Customer Satisfaction',
      teamMembers: 'Team Members',
      oceanVolume: 'TEU Ocean Volume',
      officesInChina: 'Offices in China',
    // Additional system messages
    errorSubmission: 'An error occurred while submitting your quote. Please try again.',
    noTestLeads: 'No test leads loaded at the moment.',
    pleaseSpecifyInRemarks: 'please specify in remarks',

      cfsFacilities: 'M² CFS Facilities',
    // Contact information
      community: 'Our community',
    contactEmail: 'Email',
    businessHours: '9am-6pm (China Time)',
      // Additional confirmation page items
      thankYouTitle: 'Thank you for your trust!',
      thankYouMessage: 'Your request will be handled with the utmost care by our international transport experts.',
      shipment: 'shipment',
      shipments: 'shipments',
      // Step 4 translations
      step4Title: 'What are you shipping?',
      managingShipments: 'Managing {count} Shipment{plural}',
      configureShipments: 'Configure each shipment individually or add multiple shipments for complex orders',
      addShipment: 'Add Shipment',
      validating: 'Validating...',
      active: 'Active',
      shipmentsCount: 'Shipments ({count})',
      addNewShipment: 'Add new shipment',
      duplicateShipment: 'Duplicate this shipment',
      removeShipment: 'Remove this shipment',
      consolidatedSummary: 'Consolidated Summary',
      totalVolume: 'Total Volume',
      totalWeight: 'Total Weight',
      totalShipments: 'Shipments',
      totalContainers: 'Containers',
      chooseShippingType: 'Choose your shipping type',
      shipmentXofY: 'Shipment {current} of {total}',
      selectPackagingMethod: 'Select how your goods are packaged for shipping',
      forThisSpecificShipment: 'for this specific shipment',
      looseCargo: 'Loose Cargo',
      looseCargoDesc: 'Pallets, boxes, or individual items',
      fullContainer: 'Full Container',
      fullContainerDesc: 'Complete container (FCL)',
      imNotSure: "I'm not sure",
      teamWillHelp: 'Our team will help you choose the best option',
      looseCargoFeedback: 'Perfect for mixed goods, small to medium quantities, or when you need flexible packaging',
      containerFeedback: 'Great choice for large volumes, complete product lines, or when you have enough goods to fill a container',
      unsureFeedback: "No worries! Our experienced team will guide you through the process and recommend the best shipping solution for your specific needs. We'll handle all the technical details.",
      whatHappensNext: 'What happens next:',
      expertsContact: 'Our shipping experts will contact you within 24 hours',
      discussRequirements: "We'll discuss your cargo details and requirements",
      personalizedRecommendations: "You'll receive personalized recommendations and pricing",
  
      describeLooseCargo: 'Describe your loose cargo',
      configureContainer: 'Configure your container',
      provideDimensionsWeight: 'Provide dimensions and weight details for accurate pricing',
      selectContainerType: 'Select container type and quantity for your shipment',
      calculateByUnit: 'Calculate by unit type',
      calculateByTotal: 'Calculate by total shipment',
      packageType: 'Package type',
      pallets: 'Pallets',
      boxesCrates: 'Boxes/Crates',
      numberOfUnits: '# of units',
      palletType: 'Pallet type',
      nonSpecified: 'Non-specified',
      euroPallet: 'Euro Pallet (120x80 cm)',
      standardPallet: 'Standard Pallet (120x100 cm)',
      customSize: 'Custom Size',
      dimensionsPerUnit: 'Dimensions (L×W×H per unit)',
      weightPerUnit: 'Weight (Per unit)',
      required: 'Required',
      containerInfoBanner: 'Select the container type and quantity that best fits your cargo volume.',
      unitInfoBanner: 'Provide details about each individual item or pallet for accurate calculation.',
      totalInfoBanner: 'Providing total shipment figures can be less precise. Inaccurate or oversized dimensions may lead to additional charges.',
      totalDescription: 'Enter the total dimensions and weight of your shipment.',
      containerType: 'Container type',
      numberOfContainers: 'Number of containers',
      overweightContainer: 'Overweight container (>25 tons)',
      container20: "20' Standard (33 CBM)",
      container40: "40' Standard (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Shipment',
      setupPending: 'Setup pending...',
      addAnotherShipment: 'Add Another Shipment',
      items: 'Items',
      each: 'each',
      totalCalculation: 'Total calculation',
      overweight: 'Overweight',
  },
  fr: {
    // Header
    mainTitle: 'Devis d\'Expédition depuis la Chine',
    mainSubtitle: 'Obtenez un devis rapide et fiable pour votre expédition depuis la Chine',
    // Timeline steps
    timelineDestination: 'Destination',
    timelineMode: 'Mode',
    timelineOrigin: 'Origine',
    timelineCargo: 'Fret',
    timelineGoodsDetails: 'Détails Marchandises',
    timelineContact: 'Contact',
    // Navigation
    stepCounter: 'Étape',
    next: 'Suivant',
    previous: 'Précédent',
    trustBadge: 'Approuvé par 55 000+ importateurs | Réponse < 24h | 100% Gratuit',
    // Common
    searchCountry: 'Rechercher un pays...',
    noCountryResults: 'Aucun pays trouvé. Essayez une autre recherche.',
    mostUsed: 'Les plus fréquents',
    // Step 1 translations
    step1Title: 'Où expédiez-vous ?',
    destinationCity: 'Ville de destination',
    destinationZipCode: 'Code postal de destination',
    clearCountry: 'Effacer le pays sélectionné',
    clearPort: 'Effacer le port sélectionné',
    // Location types
    factoryWarehouse: 'Usine/Entrepôt',
    portAirport: 'Port/Aéroport',
    port: 'Port',
    airport: 'Aéroport', 
    railTerminal: 'Terminal ferroviaire',
    seaPort: 'Port maritime',
    volume: 'Volume',
    businessAddress: 'Adresse commerciale',
    residentialAddress: 'Adresse résidentielle',
    chooseLocationDescription: 'Choisissez votre lieu de collecte',
    // Step 2 translations
    step2Title: 'Mode d\'expédition préféré',
    seaFreight: 'Fret Maritime',
    seaFreightDesc: 'Économique, 30-45 jours',
    railFreight: 'Fret Ferroviaire',
    railFreightDesc: 'Rentable, 15-25 jours',
    airFreight: 'Fret Aérien',
    airFreightDesc: 'Rapide, 7-10 jours',
    express: 'Express',
    expressDesc: 'Le plus rapide, 3-5 jours',
    unsureShipping: "Je ne sais pas encore",
    unsureShippingDesc: 'Laissez les experts aider',
    unsureShippingBenefits: 'Conseil professionnel',
    unsureShippingFeedback: "Excellent choix ! Nous recommanderons la meilleure option d'expédition pour vos besoins spécifiques",
    beginnerSectionTitle: 'Pour les débutants',
    beginnerSectionDesc: 'Laissez nos experts vous conseiller gratuitement',
    separatorText: 'Ou choisissez vous-même',
    unsureAboutChoice: 'Pas sûr de votre choix ?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Choisissez votre méthode d\'expédition préférée',
    shippingMethodDescription: 'Les différents modes d\'expédition offrent divers compromis entre coût, rapidité et fiabilité.',
    railAvailableForDestination: 'Le fret ferroviaire est disponible pour votre destination.',
    seaFreightBenefits: 'Idéal pour les gros envois lourds',
    railFreightBenefits: 'Option écologique',
    airFreightBenefits: 'Parfait pour les envois urgents',
    expressBenefits: 'Service porte-à-porte',
    seaFeedback: 'Excellent choix pour l\'expédition économique de gros volumes',
    railFeedback: 'Équilibre parfait entre coût et rapidité avec des avantages environnementaux',
    airFeedback: 'Parfait pour les marchandises sensibles au temps ou de grande valeur',
    expressFeedback: 'Idéal pour les envois urgents petits à moyens avec suivi complet',
    // Beginner-friendly enhancements
    businessDescription: 'Adresse d\'entreprise, bureau',
    residentialDescription: 'Maison, appartement, adresse personnelle',
    factoryDescription: 'Usine, centre de distribution, entrepôt',
    portDescription: 'Livraison directe au port/aéroport',
    helpChooseLocation: 'Pas sûr ? Choisissez Entreprise/Bureau pour les envois professionnels ou Résidentiel pour les livraisons personnelles',
    startTyping: 'Commencez à taper pour rechercher...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Sélectionnez votre pays de destination',
    searchCountryDescription: 'Recherchez le pays où vous souhaitez expédier vos marchandises',
    addressTypeQuestion: 'Quel type d\'adresse est votre destination ?',
    selectDestinationLocationType: 'Veuillez sélectionner un type de lieu de destination',
    selectDestinationPort: 'Sélectionner le port de destination',
    selectDestinationPortDescription: 'Choisissez le port ou aéroport spécifique pour la livraison',
    searchPortsIn: 'Rechercher des ports en',
    searchDestinationPorts: 'Rechercher des ports de destination',
    enterDestinationDetails: 'Entrez les détails de destination',
    // Messages de validation
    validationShippingType: 'Veuillez sélectionner un type d\'expédition',
    validationPackageType: 'Veuillez sélectionner un type d\'emballage',
    validationDimensionsNonSpecified: 'Veuillez entrer toutes les dimensions (L, l, H) pour la palette non spécifiée',
    validationPalletHeight: 'Veuillez entrer la hauteur de la palette',
    validationBoxDimensions: 'Veuillez entrer les dimensions des boîtes/caisses',
    validationWeightPerUnit: 'Veuillez entrer le poids par unité',
    validationTotalVolume: 'Veuillez entrer le volume total',
    validationTotalWeight: 'Veuillez entrer le poids total',
    validationAtLeastOneOfVolumeOrWeight: 'Veuillez fournir le volume total ou le poids total',
    validationContainerType: 'Veuillez sélectionner un type de conteneur',
    validationDestinationCountry: 'Veuillez sélectionner un pays de destination',
    validationDestinationLocationType: 'Veuillez sélectionner un type de lieu de destination',
    validationDestinationCity: 'Veuillez entrer une ville de destination',
    validationDestinationZip: 'Veuillez entrer un code postal de destination',
    validationShippingMode: 'Veuillez sélectionner un mode d\'expédition',
    validationPickupLocationType: 'Veuillez sélectionner un type de lieu de collecte',
    validationOriginPort: 'Veuillez sélectionner une origine',
    validationPickupCity: 'Veuillez entrer une ville de collecte',
    validationPickupZip: 'Veuillez entrer un code postal de collecte',
    validationGoodsValue: 'Veuillez entrer la valeur des marchandises',
    validationReadyDate: 'Veuillez sélectionner quand vos marchandises seront prêtes',
    validationShipperType: 'Veuillez sélectionner si vous êtes un particulier ou une entreprise',
    validationFirstName: 'Veuillez entrer votre prénom',
    validationLastName: 'Veuillez entrer votre nom de famille',
    validationCompanyName: 'Veuillez entrer le nom de votre entreprise',
    validationShipperRole: 'Veuillez sélectionner votre type d\'expéditeur',
    validationEmail: 'Veuillez fournir une adresse e-mail valide',
    noCommitmentRequired: 'Aucun engagement requis - juste des conseils d\'experts !',
    cityPostalDescription: 'Fournissez la ville et le code postal pour une expédition précise',
    popular: 'Populaire',
    otherCountries: 'Autres pays',
    // Step 3 translations
    step3Title: 'Sélectionner le lieu de collecte en Chine',
    selectPickupLocationType: 'Sélectionnez votre type de lieu de collecte',
    pickupLocationDescription: 'Choisissez où nous devons collecter vos marchandises en Chine',
    enterPickupDetails: 'Entrez les détails de collecte',
    pickupCityPostalDescription: 'Fournissez la ville et le code postal de collecte en Chine',
    searchPortTerminal: 'Rechercher port/terminal/aéroport...',
    selectPortTerminal: 'Sélectionner le port/terminal/aéroport de collecte',
    portTerminalDescription: 'Choisissez le port, terminal ou aéroport spécifique pour la collecte',
    pickupCity: 'Ville de collecte',
    pickupZipCode: 'Code postal de collecte',
    dontKnowPort: "Je ne sais pas",
    dontKnowPortDescription: "Je ne suis pas sûr(e) du port/terminal à choisir",
    dontKnowPortFeedback: "Pas de problème ! Nous vous aiderons à choisir le meilleur port/terminal pour votre expédition.",
    perfectPortFeedback: "Parfait ! Nous collecterons depuis",
    cityPickupFeedback: "Parfait ! Nous organiserons l'enlèvement depuis {city}, Chine",
    annualVolume: "Volume annuel",
    // Port translations
    ports: {
      // China pickup ports
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Aéroport Capital de Pékin',
      'PVG': 'Aéroport Pudong de Shanghai',
      'CAN': 'Aéroport Baiyun de Guangzhou',
      'CTU': 'Aéroport Shuangliu de Chengdu',
      'KMG': 'Aéroport Changshui de Kunming',
      'XIY': "Aéroport Xianyang de Xi'an",
      'HGH': 'Aéroport Xiaoshan de Hangzhou',
      'NKG': 'Aéroport Lukou de Nanjing',
      'ZIH': 'Terminal ferroviaire de Zhengzhou',
      'CQN': 'Terminal ferroviaire de Chongqing',
      'WUH': 'Terminal ferroviaire de Wuhan',
      'CDU': 'Terminal ferroviaire de Chengdu',
      // Destination ports - Europe
      'FRMRS': 'Port de Marseille-Fos',
      'FRLEH': 'Port du Havre',
      'FRCDG': 'Aéroport Charles de Gaulle',
      'FRORY': 'Aéroport Paris-Orly',
      'FRLYO': 'Aéroport Lyon-Saint Exupéry',
      'DEHAM': 'Port de Hambourg',
      'DEBRE': 'Port de Brême',
      'DEFRA': 'Aéroport de Francfort',
      'DEMUC': 'Aéroport de Munich',
      'DEHAM_RAIL': 'Terminal ferroviaire de Hambourg',
      'GBFXT': 'Port de Felixstowe',
      'GBSOU': 'Port de Southampton',
      'GBLHR': 'Aéroport de Londres Heathrow',
      'GBLGW': 'Aéroport de Londres Gatwick',
      'GBMAN': 'Aéroport de Manchester',
      'NLRTM': 'Port de Rotterdam',
      'NLAMS': 'Aéroport d\'Amsterdam Schiphol',
      'BEANR': 'Port d\'Anvers',
      'BEBRU': 'Aéroport de Bruxelles',
      'BELGG': 'Aéroport de Liège',
      'ITGOA': 'Port de Gênes',
      'ITLSP': 'Port de La Spezia',
      'ITMXP': 'Aéroport de Milan Malpensa',
      'ITFCO': 'Aéroport de Rome Fiumicino',
      'ESALG': 'Port d\'Algésiras',
      'ESVAL': 'Port de Valence',
      'ESMAD': 'Aéroport de Madrid-Barajas',
      'ESBCN': 'Aéroport de Barcelone',
      'PTLIS': 'Port de Lisbonne',
      'PTLEX': 'Port de Leixões (Porto)',
      'PTLIS_AIR': 'Aéroport de Lisbonne',
      'PLGDN': 'Port de Gdansk',
      'PLGDY': 'Port de Gdynia',
      'PLWAW': 'Aéroport de Varsovie Chopin',
      'GRPIR': 'Port du Pirée',
      'GRTHE': 'Port de Thessalonique',
      'GRATH': 'Aéroport d\'Athènes',
      'TRMER': 'Port de Mersin',
      'TRIST': 'Port d\'Istanbul',
      'TRIST_AIR': 'Aéroport d\'Istanbul',
      'NOOSL': 'Port d\'Oslo',
      'NOOSLO': 'Aéroport d\'Oslo Gardermoen',
      'SEGOT': 'Port de Göteborg',
      'SESTO': 'Port de Stockholm',
      'SEARN': 'Aéroport d\'Arlanda Stockholm',
      'DKAAR': 'Port d\'Aarhus',
      'DKCPH': 'Aéroport de Copenhague',
      'FIHEN': 'Port d\'Helsinki',
      'FIHEL': 'Aéroport d\'Helsinki-Vantaa',
      'EETLL': 'Port de Tallinn',
      'EETLL_AIR': 'Aéroport de Tallinn',
      'LVRIX': 'Port de Riga',
      'LVRIX_AIR': 'Aéroport de Riga',
      'LTKLA': 'Port de Klaipeda',
      'LTVNO': 'Aéroport de Vilnius',
      'CZPRG': 'Aéroport de Prague',
      'CZPRG_RAIL': 'Terminal ferroviaire de Prague',
      'SKBTS': 'Aéroport de Bratislava',
      'SKBTS_RAIL': 'Terminal ferroviaire de Bratislava',
      'HUBUD': 'Aéroport de Budapest',
      'HUBUD_RAIL': 'Terminal ferroviaire de Budapest',
      'ROCND': 'Port de Constanta',
      'ROBBU': 'Aéroport de Bucarest',
      'BGVAR': 'Port de Varna',
      'BGSOF': 'Aéroport de Sofia',
      'HRRIU': 'Port de Rijeka',
      'HRZAG': 'Aéroport de Zagreb',
      'SIKOP': 'Port de Koper',
      'SILJB': 'Aéroport de Ljubljana',
      'ATVIE': 'Aéroport de Vienne',
      'ATVIE_RAIL': 'Terminal ferroviaire de Vienne',
      'CHZUR': 'Aéroport de Zurich',
      'CHBAS_RAIL': 'Terminal ferroviaire de Bâle',
      'IEDUB': 'Port de Dublin',
      'IEDUB_AIR': 'Aéroport de Dublin',
      'ISKEF': 'Aéroport de Reykjavik',
      'RULED': 'Port de St-Pétersbourg',
      'RUNVO': 'Port de Novorossiysk',
      'RUSVO': 'Aéroport de Moscou Sheremetyevo',
      'RUMOW_RAIL': 'Terminal ferroviaire de Moscou',
      'UAODE': 'Port d\'Odessa',
      'UAKBP': 'Aéroport de Kiev Boryspil',
      'BYMSQ': 'Aéroport de Minsk',
      'BYMSQ_RAIL': 'Terminal ferroviaire de Minsk',
      // Americas
      'USLAX': 'Port de Los Angeles',
      'USLGB': 'Port de Long Beach',
      'USNYC': 'Port de New York/New Jersey',
      'USSAV': 'Port de Savannah',
      'USJFK': 'Aéroport JFK New York',
      'USLAX_AIR': 'Aéroport LAX Los Angeles',
      'USMIA': 'Aéroport de Miami',
      'USORD': 'Aéroport de Chicago O\'Hare',
      'CAVAN': 'Port de Vancouver',
      'CAHAL': 'Port d\'Halifax',
      'CAYYZ': 'Aéroport de Toronto Pearson',
      'CAVAN_AIR': 'Aéroport de Vancouver',
      'MXVER': 'Port de Veracruz',
      'MXMEX': 'Aéroport de Mexico',
      'BRSAN': 'Port de Santos',
      'BRRIG': 'Port de Rio Grande',
      'BRGRU': 'Aéroport de São Paulo Guarulhos',
      'BRGIG': 'Aéroport de Rio de Janeiro Galeão',
      'ARBUE': 'Port de Buenos Aires',
      'AREZE': 'Aéroport de Buenos Aires Ezeiza',
      'CLVAP': 'Port de Valparaiso',
      'CLSAN': 'Port de San Antonio',
      'CLSCL': 'Aéroport de Santiago',
      'PECAL': 'Port du Callao',
      'PELIM': 'Aéroport de Lima Jorge Chávez',
      'COCAR': 'Port de Carthagène',
      'COBOG': 'Aéroport de Bogotá El Dorado',
      'ECGYE': 'Port de Guayaquil',
      'ECUIO': 'Aéroport de Quito',
      // Asia-Pacific
      'CNSHA': 'Port de Shanghai',
      'CNSZX': 'Port de Shenzhen',
      'CNPVG': 'Aéroport de Shanghai Pudong',
      'CNPEK': 'Aéroport de Beijing Capital',
      'JPTYO': 'Port de Tokyo',
      'JPYOK': 'Port de Yokohama',
      'JPNRT': 'Aéroport de Tokyo Narita',
      'JPKIX': 'Aéroport de Kansai Osaka',
      'KRPUS': 'Port de Busan',
      'KRICN': 'Aéroport de Seoul Incheon',
      'TWKAO': 'Port de Kaohsiung',
      'TWTPE': 'Aéroport de Taipei Taoyuan',
      'HKHKG': 'Port de Hong Kong',
      'HKHKG_AIR': 'Aéroport de Hong Kong',
      'SGSIN': 'Port de Singapour',
      'SGSIN_AIR': 'Aéroport de Singapour Changi',
      'MYPKG': 'Port Klang',
      'MYKUL': 'Aéroport de Kuala Lumpur',
      'THLCH': 'Port de Laem Chabang',
      'THBKK': 'Aéroport de Bangkok Suvarnabhumi',
      'VNHPH': 'Port de Hai Phong',
      'VNSGN': 'Port de Ho Chi Minh Ville',
      'VNSGN_AIR': 'Aéroport de Ho Chi Minh Ville',
      'PHMNL': 'Port de Manille',
      'PHMNL_AIR': 'Aéroport de Manille',
      'IDJKT': 'Port de Jakarta (Tanjung Priok)',
      'IDCGK': 'Aéroport de Jakarta Soekarno-Hatta',
      'INJNP': 'Port de Jawaharlal Nehru',
      'INMAA': 'Port de Chennai',
      'INBOM': 'Aéroport de Mumbai',
      'INDEL': 'Aéroport de Delhi',
      'LKCMB': 'Port de Colombo',
      'LKCMB_AIR': 'Aéroport de Colombo',
      'AUSYD': 'Port de Sydney',
      'AUMEL': 'Port de Melbourne',
      'AUSYD_AIR': 'Aéroport de Sydney',
      'AUMEL_AIR': 'Aéroport de Melbourne',
      'NZAKL': 'Port d\'Auckland',
      'NZAKL_AIR': 'Aéroport d\'Auckland',
      // Middle East & Africa
      'AEJEA': 'Port Jebel Ali (Dubai)',
      'AEDXB': 'Aéroport de Dubai',
      'AEAUH': 'Aéroport d\'Abu Dhabi',
      'SAJED': 'Port du Roi Abdulaziz (Dammam)',
      'SARRH': 'Aéroport de Riyadh',
      'QADOH': 'Port de Doha',
      'QADOH_AIR': 'Aéroport de Doha Hamad',
      'KWKWI': 'Port du Koweït',
      'KWKWI_AIR': 'Aéroport du Koweït',
      'OMSLL': 'Port de Salalah',
      'OMSLL_AIR': 'Aéroport de Salalah',
      'BHBAH': 'Port de Bahreïn',
      'BHBAH_AIR': 'Aéroport de Bahreïn',
      'ILASH': 'Port d\'Ashdod',
      'ILTLV': 'Aéroport de Tel Aviv Ben Gurion',
      'EGALY': 'Port d\'Alexandrie',
      'EGCAI': 'Aéroport du Caire',
      'ZADUR': 'Port de Durban',
      'ZACPT': 'Port du Cap',
      'ZAJNB': 'Aéroport de Johannesburg OR Tambo',
      'MACAS': 'Port de Casablanca',
      'MATAN': 'Port de Tanger Med',
      'MACMN': 'Aéroport de Casablanca Mohammed V',
      'NGLOS': 'Port de Lagos',
      'NGLOS_AIR': 'Aéroport de Lagos',
      'GHTEM': 'Port de Tema',
      'GHACC': 'Aéroport d\'Accra',
      'CIABJ': 'Port d\'Abidjan',
      'CIABJ_AIR': 'Aéroport d\'Abidjan',
      'KEMBA': 'Port de Mombasa',
      'KENBO': 'Aéroport de Nairobi Jomo Kenyatta',
      'TZDAR': 'Port de Dar es Salaam',
      'TZDAR_AIR': 'Aéroport de Dar es Salaam',
      'DZALG': 'Port d\'Alger',
      'DZALG_AIR': 'Aéroport d\'Alger',
      'TNRAD': 'Port de Radès',
      'TNTUN': 'Aéroport de Tunis-Carthage',
      // Cameroon ports
      'CMDLA': 'Port de Douala',
      'CMDLA_AIR': 'Aéroport de Douala',
      'CMNSM': 'Aéroport de Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Chine de l\'Est',
      'South China': 'Chine du Sud',
      'North China': 'Chine du Nord',
      'West China': 'Chine de l\'Ouest',
      'Southwest China': 'Sud-Ouest de la Chine',
      'Northwest China': 'Nord-Ouest de la Chine',
      'Central China': 'Chine centrale'
    },
    // Dynamic translations by mode
    searchPort: 'Rechercher port...',
    searchAirport: 'Rechercher aéroport...',
    searchRailTerminal: 'Rechercher terminal ferroviaire...',
    selectPort: 'Sélectionner le port de collecte',
    selectAirport: 'Sélectionner l\'aéroport de collecte', 
    selectRailTerminal: 'Sélectionner le terminal ferroviaire de collecte',
    // Step 5 translations
    step5Title: 'Parlez-nous de vos marchandises',
    goodsValueDeclaration: 'Valeur et Déclaration des Marchandises',
    goodsValueDescription: 'Fournissez la valeur commerciale pour la déclaration douanière et les fins d\'assurance',
    commercialValue: 'Valeur commerciale des marchandises',
    goodsValueHelp: 'Cette valeur est utilisée pour la déclaration douanière et les calculs d\'assurance',
    personalOrHazardous: 'Effets personnels ou contient des matières dangereuses/restreintes',
    personalHazardousHelp: 'Cochez ceci si vous expédiez des effets personnels ou des marchandises nécessitant une manipulation spéciale',
    shipmentReadiness: 'Préparation de l\'Expédition',
    shipmentTimingDescription: 'Aidez-nous à planifier le calendrier de votre expédition et fournir des tarifs précis',
    goodsReadyQuestion: 'Quand vos marchandises seront-elles prêtes pour l\'enlèvement ?',
    readyNow: '✅ Prêt maintenant - marchandises disponibles pour enlèvement immédiat',
    readyIn1Week: '📅 Dans 1 semaine - actuellement en préparation',
    readyIn2Weeks: '📅 Dans 2 semaines - production en cours',
    readyIn1Month: '📅 Dans 1 mois - planification à l\'avance',
    dateNotSet: '❓ Date non déterminée encore',
    timingHelp: 'Un calendrier précis nous aide à fournir les tarifs les plus compétitifs',
    additionalDetails: 'Détails Supplémentaires (Optionnel)',
    additionalDetailsDescription: 'Fournissez toute exigence spéciale ou information supplémentaire',
    goodsDescription: 'Brève description des marchandises (optionnel)',
    goodsDescriptionPlaceholder: 'ex. Électronique, Meubles, Vêtements, Machines...',
    goodsDescriptionHelp: 'Nous aide à assurer une manipulation et documentation appropriées',
    specialRequirements: 'Exigences de manipulation spéciale (optionnel)',
    noSpecialRequirements: 'Aucune exigence spéciale',
    fragileGoods: '🔸 Marchandises fragiles - manipuler avec précaution',
    temperatureControlled: '🌡️ Contrôlé en température',
    urgentTimeSensitive: '⚡ Urgent/sensible au temps',
    highValueInsurance: '🛡️ Assurance haute valeur requise',
    otherSpecify: '📝 Autre (veuillez spécifier dans les remarques)',
    rateValidityNotice: 'Avis de Validité des Tarifs :',
    rateValidityText: 'Les tarifs cotés sont valides jusqu\'à la date d\'expiration indiquée sur chaque devis. Si vos marchandises ne sont pas prêtes pour l\'enlèvement avant cette date, les tarifs peuvent être sujets à changement selon les conditions actuelles du marché.',
    selectOption: 'Sélectionner une option',
    // Step 6 translations
    step6Title: 'Coordonnées',
    personalInformation: 'Informations Personnelles',
    personalInfoDescription: 'Dites-nous qui vous êtes',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Entrez votre prénom',
    lastName: 'Nom',
    lastNamePlaceholder: 'Entrez votre nom',
    businessInformation: 'Informations Entreprise',
    businessInfoDescription: 'Parlez-nous de votre entreprise',
    companyName: 'Nom de l\'Entreprise',
    companyNamePlaceholder: 'Entrez le nom de votre entreprise',
    shippingExperience: 'Expérience d\'Expédition',
    selectExperience: 'Sélectionnez votre niveau d\'expérience',
    firstTimeShipper: 'Premier envoi',
    upTo10Times: 'Expéditeur occasionnel',
    moreThan10Times: 'Expéditeur expérimenté',
    regularShipper: 'Expéditeur régulier',
    contactInformation: 'Informations de Contact',
    contactInfoDescription: 'Comment pouvons-nous vous joindre ?',
    emailAddress: 'Adresse e-mail',
    emailPlaceholder: 'Entrez votre adresse email',
    emailHelp: 'Nous enverrons votre devis et les mises à jour à cette adresse',
    phoneNumber: 'Numéro de Téléphone',
    phonePlaceholder: 'Entrez votre numéro de téléphone',
    phoneHelp: 'Pour les mises à jour urgentes et clarifications',
    additionalNotes: 'Notes Supplémentaires',
    additionalNotesDescription: 'Autre chose que nous devrions savoir ?',
    remarks: 'Remarques Spéciales',
    remarksPlaceholder: 'Instructions spéciales, exigences ou questions...',
    remarksHelp: 'Aidez-nous à mieux vous servir avec du contexte supplémentaire',
    readyToSubmit: 'Prêt à obtenir votre devis !',
    submitDescription: 'Cliquez sur "Obtenir Mon Devis" ci-dessous pour soumettre votre demande. Nous répondrons dans les 24 heures.',
    getMyQuote: 'Obtenir Mon Devis',
    securityBadge: 'Sécurisé et conforme RGPD',
    // Customer type selection
    customerTypeQuestion: 'Expédiez-vous en tant que particulier ou pour une entreprise ?',
    customerTypeDescription: 'Cela nous aide à fournir les champs d\'information les plus pertinents',
    individualCustomer: 'Particulier',
    individualDescription: 'Envoi personnel ou client privé',
    companyCustomer: 'Entreprise',
    companyDescription: 'Envoi commercial ou entité professionnelle',
    // Confirmation page
    confirmationMainTitle: 'Confirmation de Demande',
    confirmationTitle: 'Demande de Devis Confirmée',
    confirmationSubtitle: 'Votre demande a été soumise avec succès',
    referenceNumber: 'Numéro de Référence',
    yourRequest: 'Récapitulatif de Votre Demande',
    shipmentDetails: 'Détails de l\'Expédition',
    fromTo: 'De {origin} vers {destination}',
    mode: 'Mode',
    contactDetails: 'Coordonnées',
    nextSteps: 'Prochaines Étapes',
    step1: 'Demande reçue',
    step1Time: 'Maintenant',
    step2: 'Analyse et cotation',
    step2Time: 'Sous 4h ouvrées',
    step3: 'Contact commercial',
    step3Time: 'Sous 24h',
    step4: 'Devis détaillé',
    step4Time: 'Sous 48h',
    aboutSino: 'À Propos de SINO Shipping & FS International',
    aboutSubtitle: 'Votre demande est entre de bonnes mains',
    sinoDescription: 'SINO Shipping, lancée en 2018 par des entrepreneurs français, est devenue une marque de FS International en 2021. Ce partenariat combine l\'approche occidentale centrée client avec une expertise locale chinoise approfondie.',
    fsDescription: 'FS International, fondée à Hong Kong en septembre 1989, est l\'un des noms les plus fiables en logistique et transport global dans sa région.',
    ourExpertise: 'Notre Expertise',
    expertise1: 'Transport maritime, aérien, ferroviaire et multimodal',
    expertise2: 'Solutions e-commerce (Amazon FBA, dropshipping)',
    expertise3: 'Sourcing et contrôle qualité',
    expertise4: 'Services logistiques complets',
    keyNumbers: 'Chiffres Clés',
    number1: '15 000+ utilisateurs actifs',
    number2: '1 000+ devis mensuels',
    number3: '50+ pays partenaires',
    number4: 'Depuis 1989',
    globalNetwork: 'Réseau Mondial',
    networkDescription: 'Bureaux stratégiques dans les hubs logistiques clés :',
    chinaOffices: 'Chine : Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong : 1er étage, Bloc C, Sea View Estate, 8 Watson Road, North Point',
    needHelp: 'Besoin d\'Aide ?',
    actions: 'Actions Rapides',
    newRequest: 'Faire une autre demande',
    ourServices: 'Voir nos services',
    subscribe: 'S\'abonner aux mises à jour',
    websites: 'Nos Sites Web',
    // New statistics section
    impactInNumbers: 'Notre Impact en Chiffres',
    impactDescription: 'Offrir l\'excellence en Chine avec des résultats prouvés et un service de confiance',
    satisfiedCustomers: 'Clients Satisfaits',
    customerSatisfaction: 'Satisfaction Client',
    teamMembers: 'Membres de l\'Équipe',
    oceanVolume: 'Volume Maritime TEU',
    officesInChina: 'Bureaux en Chine',
    // Additional system messages
    errorSubmission: 'Une erreur s\'est produite lors de la soumission de votre devis. Veuillez réessayer.',
    noTestLeads: 'Aucun lead de test chargé pour le moment.',
    pleaseSpecifyInRemarks: 'veuillez spécifier dans les remarques',
    // Contact information
    community: 'Notre communauté',
    contactEmail: 'Email',
    businessHours: '9h-18h (Heure de Chine)',
    cfsFacilities: 'M² Installations CFS',
    // Additional confirmation page items
    thankYouTitle: 'Merci pour votre confiance !',
    thankYouMessage: 'Votre demande sera traitée avec le plus grand soin par nos experts en transport international.',
    shipment: 'expédition',
    shipments: 'expéditions',
    // Step 4 translations
    step4Title: 'Que transportez-vous ?',
    managingShipments: 'Gestion de {count} Expédition{plural}',
    configureShipments: 'Configurez chaque expédition individuellement ou ajoutez plusieurs expéditions pour des commandes complexes',
    addShipment: 'Ajouter une Expédition',
    validating: 'Validation...',
    active: 'Actif',
    shipmentsCount: 'Expéditions ({count})',
    addNewShipment: 'Ajouter une nouvelle expédition',
    duplicateShipment: 'Dupliquer cette expédition',
    removeShipment: 'Supprimer cette expédition',
    consolidatedSummary: 'Résumé Consolidé',
    totalVolume: 'Volume Total',
    totalWeight: 'Poids Total',
    totalShipments: 'Expéditions',
    totalContainers: 'Conteneurs',
    chooseShippingType: 'Choisissez votre type d\'expédition',
    shipmentXofY: 'Expédition {current} sur {total}',
    selectPackagingMethod: 'Sélectionnez comment vos marchandises sont emballées pour l\'expédition',
    forThisSpecificShipment: 'pour cette expédition spécifique',
    looseCargo: 'Fret en Vrac',
    looseCargoDesc: 'Palettes, cartons ou articles individuels',
    fullContainer: 'Conteneur Complet',
    fullContainerDesc: 'Conteneur complet (FCL)',
    imNotSure: 'Je ne suis pas sûr(e)',
    teamWillHelp: 'Notre équipe vous aidera à choisir la meilleure option',
    looseCargoFeedback: 'Parfait pour les marchandises mixtes, petites à moyennes quantités, ou quand vous avez besoin d\'un emballage flexible',
    containerFeedback: 'Excellent choix pour les gros volumes, les gammes de produits complètes, ou quand vous avez assez de marchandises pour remplir un conteneur',
    unsureFeedback: 'Pas d\'inquiétude ! Notre équipe expérimentée vous guidera dans le processus et recommandera la meilleure solution d\'expédition pour vos besoins spécifiques. Nous nous occuperons de tous les détails techniques.',
    whatHappensNext: 'Ce qui se passe ensuite :',
    expertsContact: 'Nos experts en expédition vous contacteront dans les 24 heures',
    discussRequirements: 'Nous discuterons des détails de votre fret et des exigences',
    personalizedRecommendations: 'Vous recevrez des recommandations personnalisées et des prix',

    describeLooseCargo: 'Décrivez votre fret en vrac',
    configureContainer: 'Configurez votre conteneur',
    provideDimensionsWeight: 'Fournissez les dimensions et détails de poids pour une tarification précise',
    selectContainerType: 'Sélectionnez le type et la quantité de conteneur pour votre expédition',
    calculateByUnit: 'Calculer par type d\'unité',
    calculateByTotal: 'Calculer par expédition totale',
    packageType: 'Type d\'emballage',
    pallets: 'Palettes',
    boxesCrates: 'Cartons/Caisses',
    numberOfUnits: '# d\'unités',
    palletType: 'Type de palette',
    nonSpecified: 'Non spécifiée',
    euroPallet: 'Palette Europe (120x80 cm)',
    standardPallet: 'Palette Standard (120x100 cm)',
    customSize: 'Taille Personnalisée',
    dimensionsPerUnit: 'Dimensions (L×l×H par unité)',
    weightPerUnit: 'Poids (Par unité)',
    required: 'Requis',
    containerInfoBanner: 'Sélectionnez le type et la quantité de conteneur qui convient le mieux au volume de votre fret.',
    unitInfoBanner: 'Fournissez des détails sur chaque article ou palette individuel pour un calcul précis.',
    totalInfoBanner: 'Fournir les chiffres totaux de l\'expédition peut être moins précis. Des dimensions inexactes ou surdimensionnées peuvent entraîner des frais supplémentaires.',
    totalDescription: 'Entrez les dimensions et le poids total de votre expédition.',
    containerType: 'Type de conteneur',
    numberOfContainers: 'Nombre de conteneurs',
    overweightContainer: 'Conteneur en surpoids (>25 tonnes)',
    container20: "20' Standard (33 CBM)",
    container40: "40' Standard (67 CBM)",
    container40HC: "40' High Cube (76 CBM)",
    container45HC: "45' High Cube (86 CBM)",
    // Additional shipment summary translations
    shipmentTitle: 'Expédition',
    setupPending: 'Configuration en attente...',
    addAnotherShipment: 'Ajouter une Autre Expédition',
    items: 'Articles',
    each: 'chacun',
    totalCalculation: 'Calcul total',
    overweight: 'Surpoids',
  },
  zh: {
    // Header
    mainTitle: '中国发货报价',
    mainSubtitle: '为您从中国的货运获取快速、可靠的报价',
    // Timeline steps
    timelineDestination: '目的地',
    timelineMode: '运输方式',
    timelineOrigin: '起运地',
    timelineCargo: '货物',
    timelineGoodsDetails: '货物详情',
    timelineContact: '联系方式',
    // Navigation
    stepCounter: '步骤',
    next: '下一步',
    previous: '上一步',
    trustBadge: '受55,000+进口商信赖 | 24小时内回复 | 100%免费',
    // Common
    searchCountry: '搜索国家...',
    noCountryResults: '未找到国家。请尝试其他搜索。',
    mostUsed: '最常用',
    // Step 1 translations
    step1Title: '您要运输到哪里？',
    destinationCity: '目的地城市',
    destinationZipCode: '目的地邮政编码',
    clearCountry: '清除所选国家',
    clearPort: '清除所选港口',
    // Location types
    factoryWarehouse: '工厂/仓库',
    portAirport: '港口/机场',
    port: '港口',
    airport: '机场', 
    railTerminal: '铁路枢纽',
    seaPort: '海港',
    volume: '体积',
    businessAddress: '商业地址',
    residentialAddress: '住宅地址',
    chooseLocationDescription: '选择您的取货地点',
    // Step 2 translations
    step2Title: '首选运输方式',
    seaFreight: '海运',
    seaFreightDesc: '经济实惠，30-45天',
    railFreight: '铁路运输',
    railFreightDesc: '性价比高，15-25天',
    airFreight: '空运',
    airFreightDesc: '快速，7-10天',
    express: '快递',
    expressDesc: '最快，3-5天',
    unsureShipping: '我还不确定',
    unsureShippingDesc: '让专家帮助您',
    unsureShippingBenefits: '专业指导',
    unsureShippingFeedback: '很好的选择！我们将为您的具体需求推荐最佳的运输方案',
    beginnerSectionTitle: '新手专区',
    beginnerSectionDesc: '让我们的专家免费为您提供建议',
    separatorText: '或自己选择',
    unsureAboutChoice: '不确定您的选择？',
    // Step 2 Enhanced
    chooseShippingMethod: '比较可用选项',
    shippingMethodDescription: '不同的运输模式在成本、速度和可靠性之间提供各种权衡。',
    railAvailableForDestination: '您的目的地可以使用铁路运输。',
    seaFreightBenefits: '适合大型重型货物',
    railFreightBenefits: '环保选择',
    airFreightBenefits: '适合紧急货物',
    expressBenefits: '门到门服务',
    seaFeedback: '大批量经济型运输的最佳选择',
    railFeedback: '成本和速度的完美平衡，具有环境效益',
    airFeedback: '适合时间敏感或高价值货物',
    expressFeedback: '适合急件小到中型货物的全程跟踪',
    // Beginner-friendly enhancements
    businessDescription: '公司地址，办公楼',
    residentialDescription: '住宅，公寓，个人地址',
    factoryDescription: '工厂，配送中心，仓库',
    portDescription: '直接到港口/机场取货',
    helpChooseLocation: '不确定？选择商业/办公室用于商务运输，或选择住宅用于个人配送',
    startTyping: '开始输入搜索...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: '选择您的目的地国家',
    searchCountryDescription: '搜索您要运送货物的国家',
    addressTypeQuestion: '您的目的地是什么类型的地址？',
    selectDestinationLocationType: '请选择目的地位置类型',
    selectDestinationPort: '选择目的地港口',
    selectDestinationPortDescription: '选择具体的港口或机场进行交付',
    searchPortsIn: '搜索港口在',
    searchDestinationPorts: '搜索目的地港口',
    enterDestinationDetails: '输入目的地详情',
    // 验证消息
    validationShippingType: '请选择运输类型',
    validationPackageType: '请选择包装类型',
    validationDimensionsNonSpecified: '请输入非标准托盘的所有尺寸（长、宽、高）',
    validationPalletHeight: '请输入托盘高度',
    validationBoxDimensions: '请输入箱子/木箱的尺寸',
    validationWeightPerUnit: '请输入单位重量',
    validationTotalVolume: '请输入总体积',
    validationTotalWeight: '请输入总重量',
    validationContainerType: '请选择集装箱类型',
    validationDestinationCountry: '请选择目的地国家',
    validationDestinationLocationType: '请选择目的地位置类型',
    validationDestinationCity: '请输入目的地城市',
    validationDestinationZip: '请输入目的地邮政编码',
    validationShippingMode: '请选择运输方式',
    validationPickupLocationType: '请选择取货地点类型',
    validationOriginPort: '请选择始发地',
    validationPickupCity: '请输入取货城市',
    validationPickupZip: '请输入取货邮政编码',
    validationGoodsValue: '请输入货物价值',
    validationReadyDate: '请选择货物准备就绪时间',
    validationShipperType: '请选择您是个人还是公司',
    validationFirstName: '请输入您的名字',
    validationLastName: '请输入您的姓氏',
    validationCompanyName: '请输入您的公司名称',
    validationShipperRole: '请选择您的发货人类型',
    validationEmail: '请提供有效的电子邮件地址',
    noCommitmentRequired: '无需承诺 - 只需专家指导！',
    cityPostalDescription: '提供城市和邮政编码以确保准确运输',
    popular: '热门',
    otherCountries: '其他国家',
    // Step 3 translations
    step3Title: '选择中国取货地点',
    selectPickupLocationType: '选择您的取货地点类型',
    pickupLocationDescription: '选择我们应该在中国哪里收集您的货物',
    enterPickupDetails: '输入取货详情',
    pickupCityPostalDescription: '提供中国的取货城市和邮政编码',
    searchPortTerminal: '搜索港口/码头/机场...',
    selectPortTerminal: '选择取货港口/码头/机场',
    portTerminalDescription: '选择具体的港口、码头或机场进行取货',
    pickupCity: '取货城市',
    pickupZipCode: '取货邮政编码',
    dontKnowPort: '我不知道',
    dontKnowPortDescription: '我不确定选择哪个港口/码头',
    dontKnowPortFeedback: '没问题！我们会帮您选择最合适的港口/码头。',
    perfectPortFeedback: '完美！我们将从以下地点取货：',
    cityPickupFeedback: '太好了！我们将安排从中国{city}取货',
    annualVolume: '年吞吐量',
    // Port translations
    ports: {
      // China pickup ports
      'SHA': '上海港',
      'SZX': '深圳港',
      'NGB': '宁波-舟山港',
      'GZH': '广州港',
      'QIN': '青岛港',
      'TJN': '天津港',
      'XMN': '厦门港',
      'DLN': '大连港',
      'YTN': '盐田港',
      'LYG': '连云港',
      'PEK': '北京首都国际机场',
      'PVG': '上海浦东国际机场',
      'CAN': '广州白云国际机场',
      'CTU': '成都双流国际机场',
      'KMG': '昆明长水国际机场',
      'XIY': '西安咸阳国际机场',
      'HGH': '杭州萧山国际机场',
      'NKG': '南京禄口国际机场',
      'ZIH': '郑州铁路枢纽',
      'CQN': '重庆铁路枢纽',
      'WUH': '武汉铁路枢纽',
      'CDU': '成都铁路枢纽',
      // Destination ports - Europe
      'FRMRS': '马赛-福斯港',
      'FRLEH': '勒阿弗尔港',
      'FRCDG': '戴高乐机场',
      'FRORY': '巴黎奥利机场',
      'FRLYO': '里昂圣埃克苏佩里机场',
      'DEHAM': '汉堡港',
      'DEBRE': '不来梅港',
      'DEFRA': '法兰克福机场',
      'DEMUC': '慕尼黑机场',
      'DEHAM_RAIL': '汉堡铁路终端',
      'GBFXT': '费利克斯托港',
      'GBSOU': '南安普敦港',
      'GBLHR': '伦敦希思罗机场',
      'GBLGW': '伦敦盖特威克机场',
      'GBMAN': '曼彻斯特机场',
      'NLRTM': '鹿特丹港',
      'NLAMS': '阿姆斯特丹史基浦机场',
      'BEANR': '安特卫普港',
      'BEBRU': '布鲁塞尔机场',
      'BELGG': '列日机场',
      'ITGOA': '热那亚港',
      'ITLSP': '拉斯佩齐亚港',
      'ITMXP': '米兰马尔彭萨机场',
      'ITFCO': '罗马菲乌米奇诺机场',
      'ESALG': '阿尔赫西拉斯港',
      'ESVAL': '瓦伦西亚港',
      'ESMAD': '马德里巴拉哈斯机场',
      'ESBCN': '巴塞罗那机场',
      'PTLIS': '里斯本港',
      'PTLEX': '莱雄港（波尔图）',
      'PTLIS_AIR': '里斯本机场',
      'PLGDN': '格但斯克港',
      'PLGDY': '格丁尼亚港',
      'PLWAW': '华沙肖邦机场',
      'GRPIR': '比雷埃夫斯港',
      'GRTHE': '塞萨洛尼基港',
      'GRATH': '雅典机场',
      'TRMER': '梅尔辛港',
      'TRIST': '伊斯坦布尔港',
      'TRIST_AIR': '伊斯坦布尔机场',
      'NOOSL': '奥斯陆港',
      'NOOSLO': '奥斯陆加勒穆恩机场',
      'SEGOT': '哥德堡港',
      'SESTO': '斯德哥尔摩港',
      'SEARN': '斯德哥尔摩阿兰达机场',
      'DKAAR': '奥胡斯港',
      'DKCPH': '哥本哈根机场',
      'FIHEN': '赫尔辛基港',
      'FIHEL': '赫尔辛基万塔机场',
      'EETLL': '塔林港',
      'EETLL_AIR': '塔林机场',
      'LVRIX': '里加港',
      'LVRIX_AIR': '里加机场',
      'LTKLA': '克莱佩达港',
      'LTVNO': '维尔纽斯机场',
      'CZPRG': '布拉格机场',
      'CZPRG_RAIL': '布拉格铁路终端',
      'SKBTS': '布拉迪斯拉发机场',
      'SKBTS_RAIL': '布拉迪斯拉发铁路终端',
      'HUBUD': '布达佩斯机场',
      'HUBUD_RAIL': '布达佩斯铁路终端',
      'ROCND': '康斯坦察港',
      'ROBBU': '布加勒斯特机场',
      'BGVAR': '瓦尔纳港',
      'BGSOF': '索非亚机场',
      'HRRIU': '里耶卡港',
      'HRZAG': '萨格勒布机场',
      'SIKOP': '科佩尔港',
      'SILJB': '卢布尔雅那机场',
      'ATVIE': '维也纳机场',
      'ATVIE_RAIL': '维也纳铁路终端',
      'CHZUR': '苏黎世机场',
      'CHBAS_RAIL': '巴塞尔铁路终端',
      'IEDUB': '都柏林港',
      'IEDUB_AIR': '都柏林机场',
      'ISKEF': '雷克雅未克机场',
      'RULED': '圣彼得堡港',
      'RUNVO': '新罗西斯克港',
      'RUSVO': '莫斯科谢列梅捷沃机场',
      'RUMOW_RAIL': '莫斯科铁路终端',
      'UAODE': '敖德萨港',
      'UAKBP': '基辅鲍里斯波尔机场',
      'BYMSQ': '明斯克机场',
      'BYMSQ_RAIL': '明斯克铁路终端',
      // Americas
      'USLAX': '洛杉矶港',
      'USLGB': '长滩港',
      'USNYC': '纽约/新泽西港',
      'USSAV': '萨凡纳港',
      'USJFK': 'JFK纽约机场',
      'USLAX_AIR': 'LAX洛杉矶机场',
      'USMIA': '迈阿密机场',
      'USORD': '芝加哥奥黑尔机场',
      'CAVAN': '温哥华港',
      'CAHAL': '哈利法克斯港',
      'CAYYZ': '多伦多皮尔逊机场',
      'CAVAN_AIR': '温哥华机场',
      'MXVER': '韦拉克鲁斯港',
      'MXMEX': '墨西哥城机场',
      'BRSAN': '桑托斯港',
      'BRRIG': '里奥格兰德港',
      'BRGRU': '圣保罗瓜鲁柳斯机场',
      'BRGIG': '里约热内卢加利昂机场',
      'ARBUE': '布宜诺斯艾利斯港',
      'AREZE': '布宜诺斯艾利斯埃塞萨机场',
      'CLVAP': '瓦尔帕莱索港',
      'CLSAN': '圣安东尼奥港',
      'CLSCL': '圣地亚哥机场',
      'PECAL': '卡亚俄港',
      'PELIM': '利马豪尔赫·查韦斯机场',
      'COCAR': '卡塔赫纳港',
      'COBOG': '波哥大埃尔多拉多机场',
      'ECGYE': '瓜亚基尔港',
      'ECUIO': '基多机场',
      // Asia-Pacific
      'CNSHA': '上海港',
      'CNSZX': '深圳港',
      'CNPVG': '上海浦东机场',
      'CNPEK': '北京首都机场',
      'JPTYO': '东京港',
      'JPYOK': '横滨港',
      'JPNRT': '东京成田机场',
      'JPKIX': '关西大阪机场',
      'KRPUS': '釜山港',
      'KRICN': '首尔仁川机场',
      'TWKAO': '高雄港',
      'TWTPE': '台北桃园机场',
      'HKHKG': '香港港',
      'HKHKG_AIR': '香港机场',
      'SGSIN': '新加坡港',
      'SGSIN_AIR': '新加坡樟宜机场',
      'MYPKG': '巴生港',
      'MYKUL': '吉隆坡机场',
      'THLCH': '林查班港',
      'THBKK': '曼谷素万那普机场',
      'VNHPH': '海防港',
      'VNSGN': '胡志明市港',
      'VNSGN_AIR': '胡志明市机场',
      'PHMNL': '马尼拉港',
      'PHMNL_AIR': '马尼拉机场',
      'IDJKT': '雅加达港（丹戎不碌）',
      'IDCGK': '雅加达苏加诺-哈达机场',
      'INJNP': '贾瓦哈拉尔·尼赫鲁港',
      'INMAA': '钦奈港',
      'INBOM': '孟买机场',
      'INDEL': '德里机场',
      'LKCMB': '科伦坡港',
      'LKCMB_AIR': '科伦坡机场',
      'AUSYD': '悉尼港',
      'AUMEL': '墨尔本港',
      'AUSYD_AIR': '悉尼机场',
      'AUMEL_AIR': '墨尔本机场',
      'NZAKL': '奥克兰港',
      'NZAKL_AIR': '奥克兰机场',
      // Middle East & Africa
      'AEJEA': '杰贝阿里港（迪拜）',
      'AEDXB': '迪拜机场',
      'AEAUH': '阿布扎比机场',
      'SAJED': '阿卜杜勒阿齐兹国王港（达曼）',
      'SARRH': '利雅得机场',
      'QADOH': '多哈港',
      'QADOH_AIR': '多哈哈马德机场',
      'KWKWI': '科威特港',
      'KWKWI_AIR': '科威特机场',
      'OMSLL': '萨拉拉港',
      'OMSLL_AIR': '萨拉拉机场',
      'BHBAH': '巴林港',
      'BHBAH_AIR': '巴林机场',
      'ILASH': '阿什杜德港',
      'ILTLV': '特拉维夫本古里安机场',
      'EGALY': '亚历山大港',
      'EGCAI': '开罗机场',
      'ZADUR': '德班港',
      'ZACPT': '开普敦港',
      'ZAJNB': '约翰内斯堡OR坦博机场',
      'MACAS': '卡萨布兰卡港',
      'MATAN': '丹吉尔地中海港',
      'MACMN': '卡萨布兰卡穆罕默德五世机场',
      'NGLOS': '拉各斯港',
      'NGLOS_AIR': '拉各斯机场',
      'GHTEM': '特马港',
      'GHACC': '阿克拉机场',
      'CIABJ': '阿比让港',
      'CIABJ_AIR': '阿比让机场',
      'KEMBA': '蒙巴萨港',
      'KENBO': '内罗毕乔莫·肯雅塔机场',
      'TZDAR': '达累斯萨拉姆港',
      'TZDAR_AIR': '达累斯萨拉姆机场',
      'DZALG': '阿尔及尔港',
      'DZALG_AIR': '阿尔及尔机场',
      'TNRAD': '拉德斯港',
      'TNTUN': '突尼斯迦太基机场',
      // Cameroon ports
      'CMDLA': '杜阿拉港',
      'CMDLA_AIR': '杜阿拉机场',
      'CMNSM': '雅温得机场'
    },
    // Region translations
    regions: {
      'East China': '华东地区',
      'South China': '华南地区',
      'North China': '华北地区',
      'West China': '华西地区',
      'Southwest China': '西南地区',
      'Northwest China': '西北地区',
      'Central China': '华中地区'
    },
    // Dynamic translations by mode
    searchPort: '搜索港口...',
    searchAirport: '搜索机场...',
    searchRailTerminal: '搜索铁路枢纽...',
    selectPort: '选择取货港口',
    selectAirport: '选择取货机场', 
    selectRailTerminal: '选择取货铁路枢纽',
    portDescriptionDynamic: '选择具体的港口进行取货',
    airportDescriptionDynamic: '选择具体的机场进行取货',
    railTerminalDescriptionDynamic: '选择具体的铁路枢纽进行取货',
    // Step 5 translations
    step5Title: '告诉我们您的货物信息',
    goodsValueDeclaration: '货物价值和申报',
    goodsValueDescription: '提供商业价值用于海关申报和保险目的',
    commercialValue: '货物商业价值',
    goodsValueHelp: '此价值用于海关申报和保险计算',
    personalOrHazardous: '个人物品或包含危险品/受限制物品',
    personalHazardousHelp: '如果运输个人物品或需要特殊处理的货物请勾选此项',
    shipmentReadiness: '货物准备情况',
    shipmentTimingDescription: '帮助我们规划您的运输时间并提供准确报价',
    goodsReadyQuestion: '您的货物何时准备好取货？',
    readyNow: '✅ 现在准备好 - 货物可立即取货',
    readyIn1Week: '📅 1周内 - 正在准备中',
    readyIn2Weeks: '📅 2周内 - 生产进行中',
    readyIn1Month: '📅 1个月内 - 提前规划',
    dateNotSet: '❓ 日期尚未确定',
    timingHelp: '准确的时间有助于我们提供最具竞争力的价格',
    additionalDetails: '其他详情（可选）',
    additionalDetailsDescription: '提供任何特殊要求或其他信息',
    goodsDescription: '货物简要描述（可选）',
    goodsDescriptionPlaceholder: '如：电子产品、家具、服装、机械设备...',
    goodsDescriptionHelp: '帮助我们确保适当的处理和文档',
    specialRequirements: '特殊处理要求（可选）',
    noSpecialRequirements: '无特殊要求',
    fragileGoods: '🔸 易碎货物 - 小心处理',
    temperatureControlled: '🌡️ 温度控制',
    urgentTimeSensitive: '⚡ 紧急/时间敏感',
    highValueInsurance: '🛡️ 需要高价值保险',
    otherSpecify: '📝 其他（请在备注中说明）',
    rateValidityNotice: '费率有效期通知：',
    rateValidityText: '报价有效期至每个报价单上显示的到期日期。如果您的货物在此日期之前未准备好取货，费率可能会根据当前市场条件发生变化。',
    selectOption: '选择一个选项',
    // Step 6 translations
    step6Title: '联系详情',
    personalInformation: '个人信息',
    personalInfoDescription: '告诉我们您是谁',
    firstName: '名字',
    firstNamePlaceholder: '输入您的名字',
    lastName: '姓氏',
    lastNamePlaceholder: '输入您的姓氏',
    businessInformation: '公司信息',
    businessInfoDescription: '告诉我们您的公司情况',
    companyName: '公司名称',
    companyNamePlaceholder: '输入您的公司名称',
    shippingExperience: '运输经验',
    selectExperience: '选择您的经验水平',
    firstTimeShipper: '首次发货',
    upTo10Times: '偶尔发货',
    moreThan10Times: '经验丰富',
    regularShipper: '定期发货',
    contactInformation: '联系信息',
    contactInfoDescription: '我们如何联系您？',
    emailAddress: '电子邮件地址',
    emailPlaceholder: '输入您的电子邮件地址',
    emailHelp: '我们将把报价和更新发送到此邮箱',
    phoneNumber: '电话号码',
    phonePlaceholder: '输入您的电话号码',
    phoneHelp: '用于紧急更新和澄清',
    additionalNotes: '附加说明',
    additionalNotesDescription: '还有什么我们应该知道的吗？',
    remarks: '特殊备注',
    remarksPlaceholder: '任何特殊说明、要求或问题...',
    remarksHelp: '通过提供额外的背景信息帮助我们更好地为您服务',
    readyToSubmit: '准备获取您的报价！',
    submitDescription: '点击下面的"获取我的报价"提交您的请求。我们将在24小时内回复。',
    getMyQuote: '获取我的报价',
    securityBadge: '安全且符合GDPR',
    // Customer type selection
    customerTypeQuestion: '您是以个人身份还是为公司运输？',
    customerTypeDescription: '这有助于我们提供最相关的信息字段',
    individualCustomer: '个人',
    individualDescription: '个人运输或私人客户',
    companyCustomer: '公司',
    companyDescription: '商业运输或商业实体',
    // New statistics section
    impactInNumbers: '我们的数字影响力',
    impactDescription: '在中国提供卓越服务，拥有经过验证的结果和可信赖的服务',
    satisfiedCustomers: '满意客户',
    customerSatisfaction: '客户满意度',
    teamMembers: '团队成员',
    oceanVolume: 'TEU海运量',
          officesInChina: '中国办公室',
      cfsFacilities: 'CFS设施平方米',
    // Contact information
    needHelp: '需要帮助?',
    community: '我们的社区',
    contactEmail: '邮箱',
    available: '可联系时间',
    businessHours: '上午9点-下午6点 (中国时间)',
    // Additional system messages
    errorSubmission: '提交您的报价时出现错误。请重试。',
    noTestLeads: '目前没有加载测试线索。',
    pleaseSpecifyInRemarks: '请在备注中说明',
      // Additional confirmation page items
      thankYouTitle: '感谢您的信任！',
      thankYouMessage: '您的请求将由我们的国际运输专家精心处理。',
      // Confirmation page
      confirmationMainTitle: '申请确认',
      confirmationTitle: '报价申请已确认',
      confirmationSubtitle: '您的申请已成功提交',
      referenceNumber: '参考编号',
      yourRequest: '您的申请摘要',
      shipmentDetails: '货运详情',
      fromTo: '从{origin}到{destination}',
      mode: '运输方式',
      contactDetails: '联系方式',
      nextSteps: '后续步骤',
      step1: '申请已接收',
      step1Time: '现在',
      step2: '分析和报价',
      step2Time: '4个工作小时内',
      step3: '商务联系',
      step3Time: '24小时内',
      step4: '详细报价',
      step4Time: '48小时内',
      aboutSino: '关于SINO Shipping & FS International',
      aboutSubtitle: '您的申请由专家处理',
      sinoDescription: 'SINO Shipping由法国企业家于2018年创立，2021年成为FS International的一部分。这种合作结合了西方以客户为中心的方法和深厚的中国本地专业知识。',
      fsDescription: 'FS International成立于1989年9月在香港，是该地区全球物流和运输最值得信赖的品牌之一。',
      ourExpertise: '我们的专业能力',
      expertise1: '海运、空运、铁路和多式联运',
      expertise2: '电子商务解决方案（亚马逊FBA、代发货）',
      expertise3: '采购和质量控制',
      expertise4: '完整的物流服务',
      keyNumbers: '关键数据',
      number1: '15,000+活跃用户',
      number2: '每月1,000+报价',
      number3: '50+合作伙伴国家',
      number4: '自1989年',
      globalNetwork: '全球网络',
      networkDescription: '在主要物流枢纽的战略办事处：',
      chinaOffices: '中国：上海、深圳、广州、宁波、天津、青岛、厦门',
      hkOffice: '香港：北角屈臣道8号海景大厦C座1楼',
      email: '电子邮件',
      actions: '快速操作',
      newRequest: '提交新申请',
      ourServices: '查看我们的服务',
      subscribe: '订阅更新',
      websites: '我们的网站',

      shipment: '货运',
      shipments: '货运',
      // Step 4 translations
      step4Title: '您要运输什么？',
      managingShipments: '管理 {count} 个货运',
      configureShipments: '单独配置每个货运或为复杂订单添加多个货运',
      addShipment: '添加货运',
      validating: '验证中...',
      active: '活跃',
      shipmentsCount: '货运 ({count})',
      addNewShipment: '添加新货运',
      duplicateShipment: '复制此货运',
      removeShipment: '删除此货运',
      consolidatedSummary: '合并摘要',
      totalVolume: '总体积',
      totalWeight: '总重量',
      totalShipments: '货运',
      totalContainers: '集装箱',
      chooseShippingType: '选择您的运输类型',
      shipmentXofY: '货运 {current} 共 {total}',
      selectPackagingMethod: '选择您的货物如何包装运输',
      forThisSpecificShipment: '针对此特定货运',
      looseCargo: '散货',
      looseCargoDesc: '托盘、箱子或单个物品',
      fullContainer: '整箱',
      fullContainerDesc: '完整集装箱 (FCL)',
      imNotSure: '我不确定',
      teamWillHelp: '我们的团队将帮助您选择最佳选项',
      looseCargoFeedback: '适合混合货物、中小数量，或当您需要灵活包装时',
      containerFeedback: '大容量、完整产品线的绝佳选择，或当您有足够货物填满集装箱时',
      unsureFeedback: '不用担心！我们经验丰富的团队将指导您完成流程，并为您的特定需求推荐最佳运输解决方案。我们将处理所有技术细节。',
      whatHappensNext: '接下来会发生什么：',
      expertsContact: '我们的运输专家将在24小时内联系您',
      discussRequirements: '我们将讨论您的货物详情和要求',
      personalizedRecommendations: '您将收到个性化推荐和定价',
  
      describeLooseCargo: '描述您的散货',
      configureContainer: '配置您的集装箱',
      provideDimensionsWeight: '提供尺寸和重量详情以获得准确定价',
      selectContainerType: '为您的货运选择集装箱类型和数量',
      calculateByUnit: '按单位类型计算',
      calculateByTotal: '按总货运量计算',
      packageType: '包装类型',
      pallets: '托盘',
      boxesCrates: '箱子/板条箱',
      numberOfUnits: '单位数量',
      palletType: '托盘类型',
      nonSpecified: '未指定',
      euroPallet: '欧洲托盘 (120x80 cm)',
      standardPallet: '标准托盘 (120x100 cm)',
      customSize: '自定义尺寸',
      dimensionsPerUnit: '尺寸 (每单位长×宽×高)',
      weightPerUnit: '重量 (每单位)',
      required: '必填',
      containerInfoBanner: '选择最适合您货物体积的集装箱类型和数量。',
      unitInfoBanner: '提供每个单独物品或托盘的详细信息以进行准确计算。',
      totalInfoBanner: '提供总货运数据可能不够精确。不准确或超大尺寸可能导致额外费用。',
      totalDescription: '输入您货运的总尺寸和重量。',
      containerType: '集装箱类型',
      numberOfContainers: '集装箱数量',
      overweightContainer: '超重集装箱 (>25吨)',
      container20: "20' 标准 (33 CBM)",
      container40: "40' 标准 (67 CBM)",
      container40HC: "40' 高箱 (76 CBM)",
      container45HC: "45' 高箱 (86 CBM)",
  },
  de: {
    // Header
    mainTitle: 'Versandangebot aus China',
    mainSubtitle: 'Erhalten Sie ein schnelles, zuverlässiges Angebot für Ihre Sendung aus China',
    // Timeline steps
    timelineDestination: 'Ziel',
    timelineMode: 'Modus',
    timelineOrigin: 'Ursprung',
    timelineCargo: 'Fracht',
    timelineGoodsDetails: 'Warendetails',
    timelineContact: 'Kontakt',
    // Navigation
    stepCounter: 'Schritt',
    next: 'Weiter',
    previous: 'Zurück',
    trustBadge: 'Vertraut von 55.000+ Importeuren | Antwort < 24h | 100% Kostenlos',
    // Common
    searchCountry: 'Nach einem Land suchen...',
    noCountryResults: 'Keine Länder gefunden. Versuchen Sie eine andere Suche.',
    mostUsed: 'Am häufigsten verwendet',
    // Step 1 translations
    step1Title: 'Wohin versenden Sie?',
    destinationCity: 'Zielstadt',
    destinationZipCode: 'Ziel-Postleitzahl',
    clearCountry: 'Ausgewähltes Land löschen',
    clearPort: 'Ausgewählten Hafen löschen',
    // Location types
    factoryWarehouse: 'Fabrik/Lager',
    portAirport: 'Hafen/Flughafen',
    port: 'Hafen',
    airport: 'Flughafen', 
    railTerminal: 'Bahnterminal',
    seaPort: 'Seehafen',
    volume: 'Volumen',
    businessAddress: 'Geschäftsadresse',
    residentialAddress: 'Wohnadresse',
    chooseLocationDescription: 'Wählen Sie Ihren Abholort',
    // Step 2 translations
    step2Title: 'Bevorzugter Versandmodus',
    seaFreight: 'Seefracht',
    seaFreightDesc: 'Wirtschaftlich, 30-45 Tage',
    railFreight: 'Schienenverkehr',
    railFreightDesc: 'Kosteneffektiv, 15-25 Tage',
    airFreight: 'Luftfracht',
    airFreightDesc: 'Schnell, 7-10 Tage',
    express: 'Express',
    expressDesc: 'Am schnellsten, 3-5 Tage',
    unsureShipping: 'Ich bin mir noch nicht sicher',
    unsureShippingDesc: 'Lassen Sie die Experten helfen',
    unsureShippingBenefits: 'Professionelle Beratung',
    unsureShippingFeedback: 'Ausgezeichnete Wahl! Wir empfehlen die beste Versandoption für Ihre spezifischen Bedürfnisse',
    beginnerSectionTitle: 'Für Anfänger',
    beginnerSectionDesc: 'Lassen Sie sich kostenlos von unseren Experten beraten',
    separatorText: 'Oder wählen Sie selbst',
    unsureAboutChoice: 'Unsicher bei Ihrer Wahl?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Optionen vergleichen',
    shippingMethodDescription: 'Verschiedene Versandarten bieten unterschiedliche Kompromisse zwischen Kosten, Geschwindigkeit und Zuverlässigkeit.',
    railAvailableForDestination: 'Schienentransport ist für Ihr Ziel verfügbar.',
    seaFreightBenefits: 'Ideal für große, schwere Sendungen',
    railFreightBenefits: 'Umweltfreundliche Option',
    airFreightBenefits: 'Ideal für dringende Sendungen',
    expressBenefits: 'Tür-zu-Tür-Service',
    seaFeedback: 'Tolle Wahl für kosteneffektiven Versand größerer Mengen',
    railFeedback: 'Ausgezeichnete Balance zwischen Kosten und Geschwindigkeit mit Umweltvorteilen',
    airFeedback: 'Perfekt für zeitkritische oder hochwertige Fracht',
    expressFeedback: 'Ideal für dringende, kleine bis mittlere Sendungen mit vollständiger Verfolgung',
    // Beginner-friendly enhancements
    businessDescription: 'Firmenadresse, Bürogebäude',
    residentialDescription: 'Haus, Wohnung, Privatadresse',
    factoryDescription: 'Fabrik, Verteilzentrum, Lager',
    portDescription: 'Direkt zum Hafen/Flughafen',
    helpChooseLocation: 'Unsicher? Wählen Sie Geschäft/Büro für berufliche Sendungen oder Wohnadresse für private Lieferungen',
    startTyping: 'Tippen Sie, um zu suchen...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Wählen Sie Ihr Zielland',
    searchCountryDescription: 'Suchen Sie das Land, in das Sie Ihre Waren versenden möchten',
    addressTypeQuestion: 'Welcher Adresstyp ist Ihr Ziel?',
    selectDestinationLocationType: 'Bitte wählen Sie einen Zielort-Typ',
    selectDestinationPort: 'Zielhafen auswählen',
    selectDestinationPortDescription: 'Wählen Sie den spezifischen Hafen oder Flughafen für die Lieferung',
    searchPortsIn: 'Häfen suchen in',
    searchDestinationPorts: 'Zielhäfen suchen',
    enterDestinationDetails: 'Zieldetails eingeben',
    // Validierungsnachrichten
    validationShippingType: 'Bitte wählen Sie einen Versandtyp',
    validationPackageType: 'Bitte wählen Sie einen Verpackungstyp',
    validationDimensionsNonSpecified: 'Bitte geben Sie alle Maße (L, B, H) für die nicht spezifizierte Palette ein',
    validationPalletHeight: 'Bitte geben Sie die Höhe der Palette ein',
    validationBoxDimensions: 'Bitte geben Sie die Maße der Kartons/Kisten ein',
    validationWeightPerUnit: 'Bitte geben Sie das Gewicht pro Einheit ein',
    validationTotalVolume: 'Bitte geben Sie das Gesamtvolumen ein',
    validationTotalWeight: 'Bitte geben Sie das Gesamtgewicht ein',
    validationContainerType: 'Bitte wählen Sie einen Containertyp',
    validationDestinationCountry: 'Bitte wählen Sie ein Zielland',
    validationDestinationLocationType: 'Bitte wählen Sie einen Zielort-Typ',
    validationDestinationCity: 'Bitte geben Sie eine Zielstadt ein',
    validationDestinationZip: 'Bitte geben Sie eine Ziel-Postleitzahl ein',
    validationShippingMode: 'Bitte wählen Sie einen Versandmodus',
    validationPickupLocationType: 'Bitte wählen Sie einen Abholort-Typ',
    validationOriginPort: 'Bitte wählen Sie einen Ursprung',
    validationPickupCity: 'Bitte geben Sie eine Abholstadt ein',
    validationPickupZip: 'Bitte geben Sie eine Abhol-Postleitzahl ein',
    validationGoodsValue: 'Bitte geben Sie den Warenwert ein',
    validationReadyDate: 'Bitte wählen Sie, wann Ihre Waren bereit sein werden',
    validationShipperType: 'Bitte wählen Sie, ob Sie eine Privatperson oder ein Unternehmen sind',
    validationFirstName: 'Bitte geben Sie Ihren Vornamen ein',
    validationLastName: 'Bitte geben Sie Ihren Nachnamen ein',
    validationCompanyName: 'Bitte geben Sie Ihren Firmennamen ein',
    validationShipperRole: 'Bitte wählen Sie Ihren Versendertyp',
    validationEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse an',
    noCommitmentRequired: 'Keine Verpflichtung erforderlich - nur Expertenberatung!',
    cityPostalDescription: 'Geben Sie Stadt und Postleitzahl für genauen Versand an',
    popular: 'Beliebt',
    otherCountries: 'Andere Länder',
    // Step 3 translations
    step3Title: 'Abholort in China auswählen',
    selectPickupLocationType: 'Wählen Sie Ihren Abholort-Typ',
    pickupLocationDescription: 'Wählen Sie, wo wir Ihre Waren in China abholen sollen',
    enterPickupDetails: 'Abholdetails eingeben',
    pickupCityPostalDescription: 'Geben Sie die Abholstadt und Postleitzahl in China an',
    searchPortTerminal: 'Hafen/Terminal/Flughafen suchen...',
    selectPortTerminal: 'Abholhafen/Terminal/Flughafen auswählen',
    portTerminalDescription: 'Wählen Sie den spezifischen Hafen, Terminal oder Flughafen für die Abholung',
    pickupCity: 'Abholstadt',
    pickupZipCode: 'Abhol-Postleitzahl',
    dontKnowPort: 'Ich weiß nicht',
    dontKnowPortDescription: 'Ich bin mir nicht sicher, welchen Hafen/Terminal ich wählen soll',
    dontKnowPortFeedback: 'Kein Problem! Wir helfen Ihnen bei der Auswahl des besten Hafens/Terminals für Ihre Sendung.',
    perfectPortFeedback: 'Perfekt! Wir holen ab von',
    cityPickupFeedback: 'Großartig! Wir arrangieren die Abholung von {city}, China',
    annualVolume: 'Jahresvolumen',
    // Port translations
    ports: {
      // China pickup ports
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Flughafen Peking-Capital',
      'PVG': 'Flughafen Shanghai-Pudong',
      'CAN': 'Flughafen Guangzhou-Baiyun',
      'CTU': 'Flughafen Chengdu-Shuangliu',
      'KMG': 'Flughafen Kunming-Changshui',
      'XIY': 'Flughafen X\'an-Xianyang',
      'HGH': 'Flughafen Hangzhou-Xiaoshan',
      'NKG': 'Flughafen Nanjing-Lukou',
      'ZIH': 'Bahnhof Zhengzhou',
      'CQN': 'Bahnhof Chongqing',
      'WUH': 'Bahnhof Wuhan',
      'CDU': 'Bahnhof Chengdu',
      // Destination ports - Europe
      'FRMRS': 'Hafen Marseille-Fos',
      'FRLEH': 'Hafen Le Havre',
      'FRCDG': 'Flughafen Charles de Gaulle',
      'FRORY': 'Flughafen Paris-Orly',
      'FRLYO': 'Flughafen Lyon-Saint Exupéry',
      'DEHAM': 'Hafen Hamburg',
      'DEBRE': 'Hafen Bremen',
      'DEFRA': 'Flughafen Frankfurt',
      'DEMUC': 'Flughafen München',
      'DEHAM_RAIL': 'Bahnhof Hamburg',
      'GBFXT': 'Hafen Felixstowe',
      'GBSOU': 'Hafen Southampton',
      'GBLHR': 'Flughafen London Heathrow',
      'GBLGW': 'Flughafen London Gatwick',
      'GBMAN': 'Flughafen Manchester',
      'NLRTM': 'Hafen Rotterdam',
      'NLAMS': 'Flughafen Amsterdam Schiphol',
      'BEANR': 'Hafen Antwerpen',
      'BEBRU': 'Flughafen Brüssel',
      'BELGG': 'Flughafen Lüttich',
      'ITGOA': 'Hafen Genua',
      'ITLSP': 'Hafen La Spezia',
      'ITMXP': 'Flughafen Mailand Malpensa',
      'ITFCO': 'Flughafen Rom Fiumicino',
      'ESALG': 'Hafen Algeciras',
      'ESVAL': 'Hafen Valencia',
      'ESMAD': 'Flughafen Madrid-Barajas',
      'ESBCN': 'Flughafen Barcelona',
      'PTLIS': 'Hafen Lissabon',
      'PTLEX': 'Hafen Leixões (Porto)',
      'PTLIS_AIR': 'Flughafen Lissabon',
      'PLGDN': 'Hafen Danzig',
      'PLGDY': 'Hafen Gdynia',
      'PLWAW': 'Flughafen Warschau Chopin',
      'GRPIR': 'Hafen Piräus',
      'GRTHE': 'Hafen Thessaloniki',
      'GRATH': 'Flughafen Athen',
      'TRMER': 'Hafen Mersin',
      'TRIST': 'Hafen Istanbul',
      'TRIST_AIR': 'Flughafen Istanbul',
      'NOOSL': 'Hafen Oslo',
      'NOOSLO': 'Flughafen Oslo Gardermoen',
      'SEGOT': 'Hafen Göteborg',
      'SESTO': 'Hafen Stockholm',
      'SEARN': 'Flughafen Stockholm Arlanda',
      'DKAAR': 'Hafen Aarhus',
      'DKCPH': 'Flughafen Kopenhagen',
      'FIHEN': 'Hafen Helsinki',
      'FIHEL': 'Flughafen Helsinki-Vantaa',
      'EETLL': 'Hafen Tallinn',
      'EETLL_AIR': 'Flughafen Tallinn',
      'LVRIX': 'Hafen Riga',
      'LVRIX_AIR': 'Flughafen Riga',
      'LTKLA': 'Hafen Klaipeda',
      'LTVNO': 'Flughafen Vilnius',
      'CZPRG': 'Flughafen Prag',
      'CZPRG_RAIL': 'Bahnhof Prag',
      'SKBTS': 'Flughafen Bratislava',
      'SKBTS_RAIL': 'Bahnhof Bratislava',
      'HUBUD': 'Flughafen Budapest',
      'HUBUD_RAIL': 'Bahnhof Budapest',
      'ROCND': 'Hafen Constanta',
      'ROBBU': 'Flughafen Bukarest',
      'BGVAR': 'Hafen Varna',
      'BGSOF': 'Flughafen Sofia',
      'HRRIU': 'Hafen Rijeka',
      'HRZAG': 'Flughafen Zagreb',
      'SIKOP': 'Hafen Koper',
      'SILJB': 'Flughafen Ljubljana',
      'ATVIE': 'Flughafen Wien',
      'ATVIE_RAIL': 'Bahnhof Wien',
      'CHZUR': 'Flughafen Zürich',
      'CHBAS_RAIL': 'Bahnhof Basel',
      'IEDUB': 'Hafen Dublin',
      'IEDUB_AIR': 'Flughafen Dublin',
      'ISKEF': 'Flughafen Reykjavik',
      'RULED': 'Hafen St. Petersburg',
      'RUNVO': 'Hafen Noworossijsk',
      'RUSVO': 'Flughafen Moskau Sheremetyevo',
      'RUMOW_RAIL': 'Bahnhof Moskau',
      'UAODE': 'Hafen Odessa',
      'UAKBP': 'Flughafen Kiew Boryspil',
      'BYMSQ': 'Flughafen Minsk',
      'BYMSQ_RAIL': 'Bahnhof Minsk',
      // Americas
      'USLAX': 'Hafen Los Angeles',
      'USLGB': 'Hafen Long Beach',
      'USNYC': 'Hafen New York/New Jersey',
      'USSAV': 'Hafen Savannah',
      'USJFK': 'Flughafen JFK New York',
      'USLAX_AIR': 'Flughafen LAX Los Angeles',
      'USMIA': 'Flughafen Miami',
      'USORD': 'Flughafen Chicago O\'Hare',
      'CAVAN': 'Hafen Vancouver',
      'CAHAL': 'Hafen Halifax',
      'CAYYZ': 'Flughafen Toronto Pearson',
      'CAVAN_AIR': 'Flughafen Vancouver',
      'MXVER': 'Hafen Veracruz',
      'MXMEX': 'Flughafen Mexiko-Stadt',
      'BRSAN': 'Hafen Santos',
      'BRRIG': 'Hafen Rio Grande',
      'BRGRU': 'Flughafen São Paulo Guarulhos',
      'BRGIG': 'Flughafen Rio de Janeiro Galeão',
      'ARBUE': 'Hafen Buenos Aires',
      'AREZE': 'Flughafen Buenos Aires Ezeiza',
      'CLVAP': 'Hafen Valparaiso',
      'CLSAN': 'Hafen San Antonio',
      'CLSCL': 'Flughafen Santiago',
      'PECAL': 'Hafen Callao',
      'PELIM': 'Flughafen Lima Jorge Chávez',
      'COCAR': 'Hafen Cartagena',
      'COBOG': 'Flughafen Bogotá El Dorado',
      'ECGYE': 'Hafen Guayaquil',
      'ECUIO': 'Flughafen Quito',
      // Asia-Pacific
      'CNSHA': 'Hafen Shanghai',
      'CNSZX': 'Hafen Shenzhen',
      'CNPVG': 'Flughafen Shanghai Pudong',
      'CNPEK': 'Flughafen Beijing Capital',
      'JPTYO': 'Hafen Tokio',
      'JPYOK': 'Hafen Yokohama',
      'JPNRT': 'Flughafen Tokio Narita',
      'JPKIX': 'Flughafen Kansai Osaka',
      'KRPUS': 'Hafen Busan',
      'KRICN': 'Flughafen Seoul Incheon',
      'TWKAO': 'Hafen Kaohsiung',
      'TWTPE': 'Flughafen Taipei Taoyuan',
      'HKHKG': 'Hafen Hongkong',
      'HKHKG_AIR': 'Flughafen Hongkong',
      'SGSIN': 'Hafen Singapur',
      'SGSIN_AIR': 'Flughafen Singapur Changi',
      'MYPKG': 'Hafen Klang',
      'MYKUL': 'Flughafen Kuala Lumpur',
      'THLCH': 'Hafen Laem Chabang',
      'THBKK': 'Flughafen Bangkok Suvarnabhumi',
      'VNHPH': 'Hafen Hai Phong',
      'VNSGN': 'Hafen Ho-Chi-Minh-Stadt',
      'VNSGN_AIR': 'Flughafen Ho-Chi-Minh-Stadt',
      'PHMNL': 'Hafen Manila',
      'PHMNL_AIR': 'Flughafen Manila',
      'IDJKT': 'Hafen Jakarta (Tanjung Priok)',
      'IDCGK': 'Flughafen Jakarta Soekarno-Hatta',
      'INJNP': 'Hafen Jawaharlal Nehru',
      'INMAA': 'Hafen Chennai',
      'INBOM': 'Flughafen Mumbai',
      'INDEL': 'Flughafen Delhi',
      'LKCMB': 'Hafen Colombo',
      'LKCMB_AIR': 'Flughafen Colombo',
      'AUSYD': 'Hafen Sydney',
      'AUMEL': 'Hafen Melbourne',
      'AUSYD_AIR': 'Flughafen Sydney',
      'AUMEL_AIR': 'Flughafen Melbourne',
      'NZAKL': 'Hafen Auckland',
      'NZAKL_AIR': 'Flughafen Auckland',
      // Middle East & Africa
      'AEJEA': 'Hafen Jebel Ali (Dubai)',
      'AEDXB': 'Flughafen Dubai',
      'AEAUH': 'Flughafen Abu Dhabi',
      'SAJED': 'König-Abdulaziz-Hafen (Dammam)',
      'SARRH': 'Flughafen Riad',
      'QADOH': 'Hafen Doha',
      'QADOH_AIR': 'Flughafen Doha Hamad',
      'KWKWI': 'Hafen Kuwait',
      'KWKWI_AIR': 'Flughafen Kuwait',
      'OMSLL': 'Hafen Salalah',
      'OMSLL_AIR': 'Flughafen Salalah',
      'BHBAH': 'Hafen Bahrain',
      'BHBAH_AIR': 'Flughafen Bahrain',
      'ILASH': 'Hafen Ashdod',
      'ILTLV': 'Flughafen Tel Aviv Ben Gurion',
      'EGALY': 'Hafen Alexandria',
      'EGCAI': 'Flughafen Kairo',
      'ZADUR': 'Hafen Durban',
      'ZACPT': 'Hafen Kapstadt',
      'ZAJNB': 'Flughafen Johannesburg OR Tambo',
      'MACAS': 'Hafen Casablanca',
      'MATAN': 'Hafen Tanger Med',
      'MACMN': 'Flughafen Casablanca Mohammed V',
      'NGLOS': 'Hafen Lagos',
      'NGLOS_AIR': 'Flughafen Lagos',
      'GHTEM': 'Hafen Tema',
      'GHACC': 'Flughafen Accra',
      'CIABJ': 'Hafen Abidjan',
      'CIABJ_AIR': 'Flughafen Abidjan',
      'KEMBA': 'Hafen Mombasa',
      'KENBO': 'Flughafen Nairobi Jomo Kenyatta',
      'TZDAR': 'Hafen Dar es Salaam',
      'TZDAR_AIR': 'Flughafen Dar es Salaam',
      'DZALG': 'Hafen Algier',
      'DZALG_AIR': 'Flughafen Algier',
      'TNRAD': 'Hafen Radès',
      'TNTUN': 'Flughafen Tunis-Karthago',
      // Cameroon ports
      'CMDLA': 'Hafen von Douala',
      'CMDLA_AIR': 'Flughafen Douala',
      'CMNSM': 'Flughafen Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Ostchina',
      'South China': 'Südchina',
      'North China': 'Nordchina',
      'West China': 'Westchina',
      'Southwest China': 'Südwestchina',
      'Northwest China': 'Nordwestchina',
      'Central China': 'Zentralchina'
    },
    // Dynamic translations by mode
    searchPort: 'Hafen suchen...',
    searchAirport: 'Flughafen suchen...',
    searchRailTerminal: 'Bahnterminal suchen...',
    selectPort: 'Abholhafen auswählen',
    selectAirport: 'Abholflughafen auswählen', 
    selectRailTerminal: 'Abhol-Bahnterminal auswählen',
    portDescriptionDynamic: 'Wählen Sie den spezifischen Hafen für die Abholung',
    airportDescriptionDynamic: 'Wählen Sie den spezifischen Flughafen für die Abholung',
    railTerminalDescriptionDynamic: 'Wählen Sie das spezifische Bahnterminal für die Abholung',
    // Step 5 translations
    step5Title: 'Erzählen Sie uns von Ihren Waren',
    goodsValueDeclaration: 'Warenwert & Deklaration',
    goodsValueDescription: 'Geben Sie den Handelswert für Zollanmeldung und Versicherungszwecke an',
    commercialValue: 'Handelswert der Waren',
    goodsValueHelp: 'Dieser Wert wird für Zollanmeldung und Versicherungsberechnungen verwendet',
    personalOrHazardous: 'Persönliche Gegenstände oder enthält gefährliche/beschränkte Materialien',
    personalHazardousHelp: 'Aktivieren Sie dies, wenn Sie persönliche Gegenstände oder Waren versenden, die besondere Behandlung erfordern',
    shipmentReadiness: 'Sendungsbereitschaft',
    shipmentTimingDescription: 'Helfen Sie uns, Ihren Sendungsplan zu planen und genaue Preise anzubieten',
    goodsReadyQuestion: 'Wann werden Ihre Waren abholbereit sein?',
    readyNow: '✅ Jetzt bereit - Waren sind zur sofortigen Abholung verfügbar',
    readyIn1Week: '📅 Innerhalb 1 Woche - derzeit in Vorbereitung',
    readyIn2Weeks: '📅 Innerhalb 2 Wochen - Produktion läuft',
    readyIn1Month: '📅 Innerhalb 1 Monat - Vorausplanung',
    dateNotSet: '❓ Datum noch nicht bestimmt',
    timingHelp: 'Genaue Zeitplanung hilft uns, die wettbewerbsfähigsten Preise anzubieten',
    additionalDetails: 'Zusätzliche Details (Optional)',
    additionalDetailsDescription: 'Geben Sie besondere Anforderungen oder zusätzliche Informationen an',
    goodsDescription: 'Kurze Warenbeschreibung (optional)',
    goodsDescriptionPlaceholder: 'z.B. Elektronik, Möbel, Kleidung, Maschinen...',
    goodsDescriptionHelp: 'Hilft uns, ordnungsgemäße Handhabung und Dokumentation sicherzustellen',
    specialRequirements: 'Besondere Handhabungsanforderungen (optional)',
    noSpecialRequirements: 'Keine besonderen Anforderungen',
    fragileGoods: '🔸 Zerbrechliche Waren - vorsichtig behandeln',
    temperatureControlled: '🌡️ Temperaturkontrolliert',
    urgentTimeSensitive: '⚡ Dringend/zeitkritisch',
    highValueInsurance: '🛡️ Hochwertige Versicherung erforderlich',
    otherSpecify: '📝 Andere (bitte in Bemerkungen angeben)',
    rateValidityNotice: 'Hinweis zur Preisvalidität:',
    rateValidityText: 'Angebotene Preise gelten bis zum auf jedem Angebot angegebenen Verfallsdatum. Wenn Ihre Waren bis zu diesem Datum nicht abholbereit sind, können sich die Preise basierend auf aktuellen Marktbedingungen ändern.',
    selectOption: 'Eine Option auswählen',
    // Step 6 translations
    step6Title: 'Kontaktdaten',
    personalInformation: 'Persönliche Informationen',
    personalInfoDescription: 'Sagen Sie uns, wer Sie sind',
    firstName: 'Vorname',
    firstNamePlaceholder: 'Geben Sie Ihren Vornamen ein',
    lastName: 'Nachname',
    lastNamePlaceholder: 'Geben Sie Ihren Nachnamen ein',
    businessInformation: 'Geschäftsinformationen',
    businessInfoDescription: 'Erzählen Sie uns von Ihrem Unternehmen',
    companyName: 'Firmenname',
    companyNamePlaceholder: 'Geben Sie Ihren Firmennamen ein',
    shippingExperience: 'Versanderfahrung',
    selectExperience: 'Wählen Sie Ihr Erfahrungslevel',
    firstTimeShipper: 'Erster Versand',
    upTo10Times: 'Gelegentlicher Versand',
    moreThan10Times: 'Erfahrener Versender',
    regularShipper: 'Regelmäßiger Versender',
    contactInformation: 'Kontaktinformationen',
    contactInfoDescription: 'Wie können wir Sie erreichen?',
    emailAddress: 'E-Mail-Adresse',
    emailPlaceholder: 'Geben Sie Ihre E-Mail-Adresse ein',
    emailHelp: 'Wir senden Ihr Angebot und Updates an diese E-Mail',
    phoneNumber: 'Telefonnummer',
    phonePlaceholder: 'Geben Sie Ihre Telefonnummer ein',
    phoneHelp: 'Für dringende Updates und Klarstellungen',
    additionalNotes: 'Zusätzliche Notizen',
    additionalNotesDescription: 'Gibt es noch etwas, was wir wissen sollten?',
    remarks: 'Besondere Bemerkungen',
    remarksPlaceholder: 'Spezielle Anweisungen, Anforderungen oder Fragen...',
    remarksHelp: 'Helfen Sie uns, Sie besser zu bedienen mit zusätzlichem Kontext',
    readyToSubmit: 'Bereit für Ihr Angebot!',
    submitDescription: 'Klicken Sie unten auf "Mein Angebot erhalten", um Ihre Anfrage zu senden. Wir antworten innerhalb von 24 Stunden.',
          getMyQuote: 'Mein Angebot Erhalten',
      securityBadge: 'Sicher und DSGVO-konform',
      // Customer type selection
      customerTypeQuestion: 'Versenden Sie als Privatperson oder für ein Unternehmen?',
      customerTypeDescription: 'Dies hilft uns, die relevantesten Informationsfelder bereitzustellen',
      individualCustomer: 'Privatperson',
      individualDescription: 'Privatversand oder Privatkunde',
      companyCustomer: 'Unternehmen',
      companyDescription: 'Geschäftsversand oder gewerbliche Einrichtung',
      // New statistics section
      impactInNumbers: 'Unser Einfluss in Zahlen',
    impactDescription: 'Exzellenz in China liefern mit bewiesenen Ergebnissen und vertrauensvollem Service',
    satisfiedCustomers: 'Zufriedene Kunden',
    customerSatisfaction: 'Kundenzufriedenheit',
    teamMembers: 'Teammitglieder',
    oceanVolume: 'TEU Seefrachtvolumen',
          officesInChina: 'Büros in China',
      cfsFacilities: 'M² CFS-Anlagen',
    // Contact information
    needHelp: 'Benötigen Sie Hilfe?',
    community: 'Unsere Community',
    contactEmail: 'E-Mail',
    businessHours: '9-18 Uhr (China-Zeit)',
    // Additional system messages
    errorSubmission: 'Beim Übermitteln Ihres Angebots ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    noTestLeads: 'Derzeit sind keine Test-Leads geladen.',
    pleaseSpecifyInRemarks: 'bitte in den Anmerkungen angeben',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'Anfrage-Bestätigung',
      confirmationTitle: 'Angebotsanfrage Bestätigt',
      confirmationSubtitle: 'Ihre Anfrage wurde erfolgreich übermittelt',
      referenceNumber: 'Referenznummer',
      yourRequest: 'Ihre Anfragezusammenfassung',
      shipmentDetails: 'Sendungsdetails',
      fromTo: 'Von {origin} nach {destination}',
      mode: 'Modus',
      contactDetails: 'Kontaktdaten',
      nextSteps: 'Nächste Schritte',
      step1: 'Anfrage erhalten',
      step1Time: 'Jetzt',
      step2: 'Analyse & Angebot',
      step2Time: 'Innerhalb von 4 Geschäftsstunden',
      step3: 'Kommerzieller Kontakt',
      step3Time: 'Innerhalb von 24 Stunden',
      step4: 'Detailliertes Angebot',
      step4Time: 'Innerhalb von 48 Stunden',
      aboutSino: 'Über SINO Shipping & FS International',
      aboutSubtitle: 'Ihre Anfrage ist in Expertenhänden',
      sinoDescription: 'SINO Shipping, 2018 von französischen Unternehmern gegründet, wurde 2021 Teil von FS International. Diese Partnerschaft verbindet westlichen kundenorientierten Ansatz mit tiefgreifender chinesischer lokaler Expertise.',
      fsDescription: 'FS International, gegründet in Hong Kong im September 1989, ist einer der vertrauenswürdigsten Namen in der globalen Logistik und Transport in der Region.',
      ourExpertise: 'Unsere Expertise',
      expertise1: 'See-, Luft-, Bahn- & multimodaler Transport',
      expertise2: 'E-Commerce-Lösungen (Amazon FBA, Dropshipping)',
      expertise3: 'Beschaffung & Qualitätskontrolle',
      expertise4: 'Vollständige Logistikdienstleistungen',
      keyNumbers: 'Schlüsselzahlen',
      number1: '15.000+ aktive Nutzer',
      number2: '1.000+ monatliche Angebote',
      number3: '50+ Partnerländer',
      number4: 'Seit 1989',
      globalNetwork: 'Globales Netzwerk',
      networkDescription: 'Strategische Büros in wichtigen Logistikhubs:',
      chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
      hkOffice: 'Hong Kong: 1. Stock, Block C, Sea View Estate, 8 Watson Road, North Point',
      email: 'E-Mail',
      actions: 'Schnellaktionen',
      newRequest: 'Weitere Anfrage stellen',
      ourServices: 'Unsere Dienstleistungen anzeigen',
      subscribe: 'Updates abonnieren',
      websites: 'Unsere Websites',

      thankYouTitle: 'Vielen Dank für Ihr Vertrauen!',
      thankYouMessage: 'Ihre Anfrage wird von unseren internationalen Transportexperten mit größter Sorgfalt bearbeitet.',
      shipment: 'Sendung',
      shipments: 'Sendungen',
      // Step 4 translations
      step4Title: 'Was versenden Sie?',
      managingShipments: 'Verwalten von {count} Sendung{plural}',
      configureShipments: 'Konfigurieren Sie jede Sendung einzeln oder fügen Sie mehrere Sendungen für komplexe Bestellungen hinzu',
      addShipment: 'Sendung hinzufügen',
      validating: 'Validierung...',
      active: 'Aktiv',
      shipmentsCount: 'Sendungen ({count})',
      addNewShipment: 'Neue Sendung hinzufügen',
      duplicateShipment: 'Diese Sendung duplizieren',
      removeShipment: 'Diese Sendung entfernen',
      consolidatedSummary: 'Konsolidierte Zusammenfassung',
      totalVolume: 'Gesamtvolumen',
      totalWeight: 'Gesamtgewicht',
      totalShipments: 'Sendungen',
      totalContainers: 'Container',
      chooseShippingType: 'Wählen Sie Ihren Versandtyp',
      shipmentXofY: 'Sendung {current} von {total}',
      selectPackagingMethod: 'Wählen Sie, wie Ihre Waren für den Versand verpackt sind',
      forThisSpecificShipment: 'für diese spezifische Sendung',
      looseCargo: 'Stückgut',
      looseCargoDesc: 'Paletten, Kartons oder Einzelstücke',
      fullContainer: 'Vollcontainer',
      fullContainerDesc: 'Kompletter Container (FCL)',
      imNotSure: 'Ich bin mir nicht sicher',
      teamWillHelp: 'Unser Team hilft Ihnen bei der Auswahl der besten Option',
      looseCargoFeedback: 'Perfekt für gemischte Waren, kleine bis mittlere Mengen oder wenn Sie flexible Verpackung benötigen',
      containerFeedback: 'Ausgezeichnete Wahl für große Volumen, komplette Produktlinien oder wenn Sie genug Waren haben, um einen Container zu füllen',
      unsureFeedback: 'Keine Sorge! Unser erfahrenes Team führt Sie durch den Prozess und empfiehlt die beste Versandlösung für Ihre spezifischen Bedürfnisse. Wir kümmern uns um alle technischen Details.',
      whatHappensNext: 'Was passiert als nächstes:',
      expertsContact: 'Unsere Versandexperten kontaktieren Sie innerhalb von 24 Stunden',
      discussRequirements: 'Wir besprechen Ihre Frachtdetails und Anforderungen',
      personalizedRecommendations: 'Sie erhalten personalisierte Empfehlungen und Preise',
  
      describeLooseCargo: 'Beschreiben Sie Ihr Stückgut',
      configureContainer: 'Konfigurieren Sie Ihren Container',
      provideDimensionsWeight: 'Geben Sie Abmessungen und Gewichtsdetails für genaue Preisgestaltung an',
      selectContainerType: 'Wählen Sie Containertyp und -menge für Ihre Sendung',
      calculateByUnit: 'Nach Stücktyp berechnen',
      calculateByTotal: 'Nach Gesamtsendung berechnen',
      packageType: 'Verpackungsart',
      pallets: 'Paletten',
      boxesCrates: 'Kartons/Kisten',
      numberOfUnits: 'Anzahl Stück',
      palletType: 'Palettentyp',
      nonSpecified: 'Nicht spezifiziert',
      euroPallet: 'Europalette (120x80 cm)',
      standardPallet: 'Standardpalette (120x100 cm)',
      customSize: 'Benutzerdefinierte Größe',
      dimensionsPerUnit: 'Abmessungen (L×B×H pro Stück)',
      weightPerUnit: 'Gewicht (Pro Stück)',
      required: 'Erforderlich',
      containerInfoBanner: 'Wählen Sie den Containertyp und die Menge, die am besten zu Ihrem Frachtvolumen passt.',
      unitInfoBanner: 'Geben Sie Details zu jedem einzelnen Artikel oder jeder Palette für genaue Berechnung an.',
      totalInfoBanner: 'Das Angeben von Gesamtsendungszahlen kann weniger präzise sein. Ungenaue oder überdimensionierte Abmessungen können zu zusätzlichen Gebühren führen.',
      totalDescription: 'Geben Sie die Gesamtabmessungen und das Gewicht Ihrer Sendung ein.',
      containerType: 'Containertyp',
      numberOfContainers: 'Anzahl Container',
      overweightContainer: 'Übergewichtiger Container (>25 Tonnen)',
      container20: "20' Standard (33 CBM)",
      container40: "40' Standard (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
  },
  es: {
    // Header
    mainTitle: 'Cotización de Envío desde China',
    mainSubtitle: 'Obtenga una cotización rápida y confiable para su envío desde China',
    // Timeline steps
    timelineDestination: 'Destino',
    timelineMode: 'Modo',
    timelineOrigin: 'Origen',
    timelineCargo: 'Carga',
    timelineGoodsDetails: 'Detalles de Mercancías',
    timelineContact: 'Contacto',
    // Navigation
    stepCounter: 'Paso',
    next: 'Siguiente',
    previous: 'Anterior',
    trustBadge: 'Confiado por 55,000+ importadores | Respuesta < 24h | 100% Gratis',
    // Common
    searchCountry: 'Buscar un país...',
    noCountryResults: 'No se encontraron países. Intente otra búsqueda.',
    mostUsed: 'Más utilizados',
    // Step 1 translations
    step1Title: '¿A dónde envía?',
    destinationCity: 'Ciudad de destino',
    destinationZipCode: 'Código postal de destino',
    clearCountry: 'Borrar país seleccionado',
    clearPort: 'Borrar puerto seleccionado',
    // Location types
    factoryWarehouse: 'Fábrica/Almacén',
    portAirport: 'Puerto/Aeropuerto',
    port: 'Puerto',
    airport: 'Aeropuerto', 
    railTerminal: 'Terminal ferroviario',
    seaPort: 'Puerto marítimo',
    volume: 'Volumen',
    businessAddress: 'Dirección comercial',
    residentialAddress: 'Dirección residencial',
    chooseLocationDescription: 'Elija su lugar de recogida',
    // Step 2 translations
    step2Title: 'Modo de envío preferido',
    seaFreight: 'Transporte Marítimo',
    seaFreightDesc: 'Económico, 30-45 días',
    railFreight: 'Transporte Ferroviario',
    railFreightDesc: 'Rentable, 15-25 días',
    airFreight: 'Transporte Aéreo',
    airFreightDesc: 'Rápido, 7-10 días',
    express: 'Express',
    expressDesc: 'Más rápido, 3-5 días',
    unsureShipping: 'Aún no estoy seguro',
    unsureShippingDesc: 'Deja que los expertos ayuden',
    unsureShippingBenefits: 'Orientación profesional',
    unsureShippingFeedback: '¡Excelente elección! Recomendaremos la mejor opción de envío para tus necesidades específicas',
    beginnerSectionTitle: 'Para principiantes',
    beginnerSectionDesc: 'Deja que nuestros expertos te aconsejen gratis',
    separatorText: 'O elige tú mismo',
    unsureAboutChoice: '¿No estás seguro de tu elección?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Elija su método de envío preferido',
    shippingMethodDescription: 'Los diferentes modos de envío ofrecen varios compromisos entre costo, velocidad y confiabilidad.',
    railAvailableForDestination: 'El transporte ferroviario está disponible para su destino.',
    seaFreightBenefits: 'Ideal para envíos grandes y pesados',
    railFreightBenefits: 'Opción ecológica',
    airFreightBenefits: 'Ideal para envíos urgentes',
    expressBenefits: 'Servicio puerta a puerta',
    seaFeedback: 'Excelente opción para envío económico de grandes volúmenes',
    railFeedback: 'Excelente equilibrio entre costo y velocidad con beneficios ambientales',
    airFeedback: 'Perfecto para carga sensible al tiempo o de alto valor',
    expressFeedback: 'Ideal para envíos urgentes pequeños a medianos con seguimiento completo',
    // Beginner-friendly enhancements
    businessDescription: 'Dirección de empresa, edificio de oficinas',
    residentialDescription: 'Casa, apartamento, dirección personal',
    factoryDescription: 'Fábrica, centro de distribución, almacén',
    portDescription: 'Directo al puerto/aeropuerto',
    helpChooseLocation: '¿No estás seguro? Elige Empresa/Oficina para envíos profesionales o Residencial para entregas personales',
    startTyping: 'Comience a escribir para buscar...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Seleccione su país de destino',
    searchCountryDescription: 'Busque el país donde desea enviar sus mercancías',
    addressTypeQuestion: '¿Qué tipo de dirección es su destino?',
    selectDestinationLocationType: 'Por favor seleccione un tipo de ubicación de destino',
    selectDestinationPort: 'Seleccionar puerto de destino',
    selectDestinationPortDescription: 'Elija el puerto o aeropuerto específico para la entrega',
    searchPortsIn: 'Buscar puertos en',
    searchDestinationPorts: 'Buscar puertos de destino',
    enterDestinationDetails: 'Ingrese detalles del destino',
    // Mensajes de validación
    validationShippingType: 'Por favor seleccione un tipo de envío',
    validationPackageType: 'Por favor seleccione un tipo de embalaje',
    validationDimensionsNonSpecified: 'Por favor ingrese todas las dimensiones (L, A, Al) para el palet no especificado',
    validationPalletHeight: 'Por favor ingrese la altura del palet',
    validationBoxDimensions: 'Por favor ingrese las dimensiones de las cajas/cajones',
    validationWeightPerUnit: 'Por favor ingrese el peso por unidad',
    validationTotalVolume: 'Por favor ingrese el volumen total',
    validationTotalWeight: 'Por favor ingrese el peso total',
    validationContainerType: 'Por favor seleccione un tipo de contenedor',
    validationDestinationCountry: 'Por favor seleccione un país de destino',
    validationDestinationLocationType: 'Por favor seleccione un tipo de ubicación de destino',
    validationDestinationCity: 'Por favor ingrese una ciudad de destino',
    validationDestinationZip: 'Por favor ingrese un código postal de destino',
    validationShippingMode: 'Por favor seleccione un modo de envío',
    validationPickupLocationType: 'Por favor seleccione un tipo de ubicación de recogida',
    validationOriginPort: 'Por favor seleccione un origen',
    validationPickupCity: 'Por favor ingrese una ciudad de recogida',
    validationPickupZip: 'Por favor ingrese un código postal de recogida',
    validationGoodsValue: 'Por favor ingrese el valor de los bienes',
    validationReadyDate: 'Por favor seleccione cuándo estarán listos sus bienes',
    validationShipperType: 'Por favor seleccione si es una persona individual o empresa',
    validationFirstName: 'Por favor ingrese su nombre',
    validationLastName: 'Por favor ingrese su apellido',
    validationCompanyName: 'Por favor ingrese el nombre de su empresa',
    validationShipperRole: 'Por favor seleccione su tipo de remitente',
    validationEmail: 'Por favor proporcione una dirección de correo electrónico válida',
    noCommitmentRequired: '¡No se requiere compromiso - solo orientación experta!',
    cityPostalDescription: 'Proporcione la ciudad y código postal para envío preciso',
    popular: 'Popular',
    otherCountries: 'Otros países',
    // Step 3 translations
    step3Title: 'Seleccionar ubicación de recogida en China',
    selectPickupLocationType: 'Seleccione su tipo de ubicación de recogida',
    pickupLocationDescription: 'Elija dónde debemos recoger sus mercancías en China',
    enterPickupDetails: 'Ingrese detalles de recogida',
    pickupCityPostalDescription: 'Proporcione la ciudad y código postal de recogida en China',
    searchPortTerminal: 'Buscar puerto/terminal/aeropuerto...',
    selectPortTerminal: 'Seleccionar puerto/terminal/aeropuerto de recogida',
    portTerminalDescription: 'Elija el puerto, terminal o aeropuerto específico para la recogida',
    pickupCity: 'Ciudad de recogida',
    pickupZipCode: 'Código postal de recogida',
    dontKnowPort: 'No lo sé',
    dontKnowPortDescription: 'No estoy seguro de qué puerto/terminal elegir',
    dontKnowPortFeedback: '¡No hay problema! Te ayudaremos a elegir el mejor puerto/terminal para tu envío.',
    perfectPortFeedback: '¡Perfecto! Recogeremos desde',
    cityPickupFeedback: '¡Perfecto! Organizaremos la recogida desde {city}, China',
    annualVolume: 'Volumen anual',
    // Port translations
    ports: {
      // China pickup ports
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Aeropuerto Capital de Beijing',
      'PVG': 'Aeropuerto Pudong de Shanghai',
      'CAN': 'Aeropuerto Baiyun de Guangzhou',
      'CTU': 'Aeropuerto Shuangliu de Chengdu',
      'KMG': 'Aeropuerto Changshui de Kunming',
      'XIY': 'Aeropuerto Xianyang de Xi\'an',
      'HGH': 'Aeropuerto Xiaoshan de Hangzhou',
      'NKG': 'Aeropuerto Lukou de Nanjing',
      'ZIH': 'Terminal ferroviaria de Zhengzhou',
      'CQN': 'Terminal ferroviaria de Chongqing',
      'WUH': 'Terminal ferroviaria de Wuhan',
      'CDU': 'Terminal ferroviaria de Chengdu',
      // Destination ports - Europe
      'FRMRS': 'Puerto de Marsella-Fos',
      'FRLEH': 'Puerto de Le Havre',
      'FRCDG': 'Aeropuerto Charles de Gaulle',
      'FRORY': 'Aeropuerto París-Orly',
      'FRLYO': 'Aeropuerto Lyon-Saint Exupéry',
      'DEHAM': 'Puerto de Hamburgo',
      'DEBRE': 'Puerto de Bremen',
      'DEFRA': 'Aeropuerto de Fráncfort',
      'DEMUC': 'Aeropuerto de Múnich',
      'DEHAM_RAIL': 'Terminal ferroviaria de Hamburgo',
      'GBFXT': 'Puerto de Felixstowe',
      'GBSOU': 'Puerto de Southampton',
      'GBLHR': 'Aeropuerto de Londres Heathrow',
      'GBLGW': 'Aeropuerto de Londres Gatwick',
      'GBMAN': 'Aeropuerto de Manchester',
      'NLRTM': 'Puerto de Róterdam',
      'NLAMS': 'Aeropuerto de Ámsterdam Schiphol',
      'BEANR': 'Puerto de Amberes',
      'BEBRU': 'Aeropuerto de Bruselas',
      'BELGG': 'Aeropuerto de Lieja',
      'ITGOA': 'Puerto de Génova',
      'ITLSP': 'Puerto de La Spezia',
      'ITMXP': 'Aeropuerto de Milán Malpensa',
      'ITFCO': 'Aeropuerto de Roma Fiumicino',
      'ESALG': 'Puerto de Algeciras',
      'ESVAL': 'Puerto de Valencia',
      'ESMAD': 'Aeropuerto de Madrid-Barajas',
      'ESBCN': 'Aeropuerto de Barcelona',
      'PTLIS': 'Puerto de Lisboa',
      'PTLEX': 'Puerto de Leixões (Oporto)',
      'PTLIS_AIR': 'Aeropuerto de Lisboa',
      'PLGDN': 'Puerto de Gdansk',
      'PLGDY': 'Puerto de Gdynia',
      'PLWAW': 'Aeropuerto Chopin de Varsovia',
      'GRPIR': 'Puerto del Pireo',
      'GRTHE': 'Puerto de Tesalónica',
      'GRATH': 'Aeropuerto de Atenas',
      'TRMER': 'Puerto de Mersin',
      'TRIST': 'Puerto de Estambul',
      'TRIST_AIR': 'Aeropuerto de Estambul',
      'NOOSL': 'Puerto de Oslo',
      'NOOSLO': 'Aeropuerto de Oslo Gardermoen',
      'SEGOT': 'Puerto de Gotemburgo',
      'SESTO': 'Puerto de Estocolmo',
      'SEARN': 'Aeropuerto Arlanda de Estocolmo',
      'DKAAR': 'Puerto de Aarhus',
      'DKCPH': 'Aeropuerto de Copenhague',
      'FIHEN': 'Puerto de Helsinki',
      'FIHEL': 'Aeropuerto Helsinki-Vantaa',
      'EETLL': 'Puerto de Tallín',
      'EETLL_AIR': 'Aeropuerto de Tallín',
      'LVRIX': 'Puerto de Riga',
      'LVRIX_AIR': 'Aeropuerto de Riga',
      'LTKLA': 'Puerto de Klaipeda',
      'LTVNO': 'Aeropuerto de Vilnius',
      'CZPRG': 'Aeropuerto de Praga',
      'CZPRG_RAIL': 'Terminal ferroviaria de Praga',
      'SKBTS': 'Aeropuerto de Bratislava',
      'SKBTS_RAIL': 'Terminal ferroviaria de Bratislava',
      'HUBUD': 'Aeropuerto de Budapest',
      'HUBUD_RAIL': 'Terminal ferroviaria de Budapest',
      'ROCND': 'Puerto de Constanza',
      'ROBBU': 'Aeropuerto de Bucarest',
      'BGVAR': 'Puerto de Varna',
      'BGSOF': 'Aeropuerto de Sofía',
      'HRRIU': 'Puerto de Rijeka',
      'HRZAG': 'Aeropuerto de Zagreb',
      'SIKOP': 'Puerto de Koper',
      'SILJB': 'Aeropuerto de Liubliana',
      'ATVIE': 'Aeropuerto de Viena',
      'ATVIE_RAIL': 'Terminal ferroviaria de Viena',
      'CHZUR': 'Aeropuerto de Zúrich',
      'CHBAS_RAIL': 'Terminal ferroviaria de Basilea',
      'IEDUB': 'Puerto de Dublín',
      'IEDUB_AIR': 'Aeropuerto de Dublín',
      'ISKEF': 'Aeropuerto de Reikiavik',
      'RULED': 'Puerto de San Petersburgo',
      'RUNVO': 'Puerto de Novorossiysk',
      'RUSVO': 'Aeropuerto Sheremetyevo de Moscú',
      'RUMOW_RAIL': 'Terminal ferroviaria de Moscú',
      'UAODE': 'Puerto de Odesa',
      'UAKBP': 'Aeropuerto Boryspil de Kiev',
      'BYMSQ': 'Aeropuerto de Minsk',
      'BYMSQ_RAIL': 'Terminal ferroviaria de Minsk',
      // Americas
      'USLAX': 'Puerto de Los Ángeles',
      'USLGB': 'Puerto de Long Beach',
      'USNYC': 'Puerto de Nueva York/Nueva Jersey',
      'USSAV': 'Puerto de Savannah',
      'USJFK': 'Aeropuerto JFK Nueva York',
      'USLAX_AIR': 'Aeropuerto LAX Los Ángeles',
      'USMIA': 'Aeropuerto de Miami',
      'USORD': 'Aeropuerto Chicago O\'Hare',
      'CAVAN': 'Puerto de Vancouver',
      'CAHAL': 'Puerto de Halifax',
      'CAYYZ': 'Aeropuerto Pearson de Toronto',
      'CAVAN_AIR': 'Aeropuerto de Vancouver',
      'MXVER': 'Puerto de Veracruz',
      'MXMEX': 'Aeropuerto de Ciudad de México',
      'BRSAN': 'Puerto de Santos',
      'BRRIG': 'Puerto de Rio Grande',
      'BRGRU': 'Aeropuerto Guarulhos de São Paulo',
      'BRGIG': 'Aeropuerto Galeão de Río de Janeiro',
      'ARBUE': 'Puerto de Buenos Aires',
      'AREZE': 'Aeropuerto Ezeiza de Buenos Aires',
      'CLVAP': 'Puerto de Valparaíso',
      'CLSAN': 'Puerto de San Antonio',
      'CLSCL': 'Aeropuerto de Santiago',
      'PECAL': 'Puerto del Callao',
      'PELIM': 'Aeropuerto Jorge Chávez de Lima',
      'COCAR': 'Puerto de Cartagena',
      'COBOG': 'Aeropuerto El Dorado de Bogotá',
      'ECGYE': 'Puerto de Guayaquil',
      'ECUIO': 'Aeropuerto de Quito',
      // Asia-Pacific
      'CNSHA': 'Puerto de Shanghai',
      'CNSZX': 'Puerto de Shenzhen',
      'CNPVG': 'Aeropuerto Pudong de Shanghai',
      'CNPEK': 'Aeropuerto Capital de Beijing',
      'JPTYO': 'Puerto de Tokio',
      'JPYOK': 'Puerto de Yokohama',
      'JPNRT': 'Aeropuerto Narita de Tokio',
      'JPKIX': 'Aeropuerto Kansai de Osaka',
      'KRPUS': 'Puerto de Busan',
      'KRICN': 'Aeropuerto Incheon de Seúl',
      'TWKAO': 'Puerto de Kaohsiung',
      'TWTPE': 'Aeropuerto Taoyuan de Taipéi',
      'HKHKG': 'Puerto de Hong Kong',
      'HKHKG_AIR': 'Aeropuerto de Hong Kong',
      'SGSIN': 'Puerto de Singapur',
      'SGSIN_AIR': 'Aeropuerto Changi de Singapur',
      'MYPKG': 'Puerto Klang',
      'MYKUL': 'Aeropuerto de Kuala Lumpur',
      'THLCH': 'Puerto de Laem Chabang',
      'THBKK': 'Aeropuerto Suvarnabhumi de Bangkok',
      'VNHPH': 'Puerto de Hai Phong',
      'VNSGN': 'Puerto de Ciudad Ho Chi Minh',
      'VNSGN_AIR': 'Aeropuerto de Ciudad Ho Chi Minh',
      'PHMNL': 'Puerto de Manila',
      'PHMNL_AIR': 'Aeropuerto de Manila',
      'IDJKT': 'Puerto de Yakarta (Tanjung Priok)',
      'IDCGK': 'Aeropuerto Soekarno-Hatta de Yakarta',
      'INJNP': 'Puerto Jawaharlal Nehru',
      'INMAA': 'Puerto de Chennai',
      'INBOM': 'Aeropuerto de Bombay',
      'INDEL': 'Aeropuerto de Delhi',
      'LKCMB': 'Puerto de Colombo',
      'LKCMB_AIR': 'Aeropuerto de Colombo',
      'AUSYD': 'Puerto de Sídney',
      'AUMEL': 'Puerto de Melbourne',
      'AUSYD_AIR': 'Aeropuerto de Sídney',
      'AUMEL_AIR': 'Aeropuerto de Melbourne',
      'NZAKL': 'Puerto de Auckland',
      'NZAKL_AIR': 'Aeropuerto de Auckland',
      // Middle East & Africa
      'AEJEA': 'Puerto Jebel Ali (Dubái)',
      'AEDXB': 'Aeropuerto de Dubái',
      'AEAUH': 'Aeropuerto de Abu Dabi',
      'SAJED': 'Puerto Rey Abdulaziz (Dammam)',
      'SARRH': 'Aeropuerto de Riad',
      'QADOH': 'Puerto de Doha',
      'QADOH_AIR': 'Aeropuerto Hamad de Doha',
      'KWKWI': 'Puerto de Kuwait',
      'KWKWI_AIR': 'Aeropuerto de Kuwait',
      'OMSLL': 'Puerto de Salalah',
      'OMSLL_AIR': 'Aeropuerto de Salalah',
      'BHBAH': 'Puerto de Bahréin',
      'BHBAH_AIR': 'Aeropuerto de Bahréin',
      'ILASH': 'Puerto de Ashdod',
      'ILTLV': 'Aeropuerto Ben Gurion de Tel Aviv',
      'EGALY': 'Puerto de Alejandría',
      'EGCAI': 'Aeropuerto de El Cairo',
      'ZADUR': 'Puerto de Durban',
      'ZACPT': 'Puerto de Ciudad del Cabo',
      'ZAJNB': 'Aeropuerto OR Tambo de Johannesburgo',
      'MACAS': 'Puerto de Casablanca',
      'MATAN': 'Puerto Tánger Med',
      'MACMN': 'Aeropuerto Mohammed V de Casablanca',
      'NGLOS': 'Puerto de Lagos',
      'NGLOS_AIR': 'Aeropuerto de Lagos',
      'GHTEM': 'Puerto de Tema',
      'GHACC': 'Aeropuerto de Accra',
      'CIABJ': 'Puerto de Abiyán',
      'CIABJ_AIR': 'Aeropuerto de Abiyán',
      'KEMBA': 'Puerto de Mombasa',
      'KENBO': 'Aeropuerto Jomo Kenyatta de Nairobi',
      'TZDAR': 'Puerto de Dar es Salaam',
      'TZDAR_AIR': 'Aeropuerto de Dar es Salaam',
      'DZALG': 'Puerto de Argel',
      'DZALG_AIR': 'Aeropuerto de Argel',
      'TNRAD': 'Puerto de Radès',
      'TNTUN': 'Aeropuerto Túnez-Cartago',
      // Cameroon ports
      'CMDLA': 'Puerto de Douala',
      'CMDLA_AIR': 'Aeropuerto de Douala',
      'CMNSM': 'Aeropuerto de Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Este de China',
      'South China': 'Sur de China',
      'North China': 'Norte de China',
      'West China': 'Oeste de China',
      'Southwest China': 'Suroeste de China',
      'Northwest China': 'Noroeste de China',
      'Central China': 'Centro de China'
    },
    // Dynamic translations by mode
    searchPort: 'Buscar puerto...',
    searchAirport: 'Buscar aeropuerto...',
    searchRailTerminal: 'Buscar terminal ferroviario...',
    selectPort: 'Seleccionar puerto de recogida', 
    selectAirport: 'Seleccionar aeropuerto de recogida', 
    selectRailTerminal: 'Seleccionar terminal ferroviario de recogida',
    portDescriptionDynamic: 'Elija el puerto específico para la recogida',
    airportDescriptionDynamic: 'Elija el aeropuerto específico para la recogida',
    railTerminalDescriptionDynamic: 'Elija el terminal ferroviario específico para la recogida',
    // Step 5 translations
    step5Title: 'Cuéntanos sobre tus mercancías',
    goodsValueDeclaration: 'Valor y Declaración de Mercancías',
    goodsValueDescription: 'Proporcione el valor comercial para declaración aduanera y propósitos de seguro',
    commercialValue: 'Valor comercial de las mercancías',
    goodsValueHelp: 'Este valor se utiliza para declaración aduanera y cálculos de seguro',
    personalOrHazardous: 'Efectos personales o contiene materiales peligrosos/restringidos',
    personalHazardousHelp: 'Marque esto si envía pertenencias personales o mercancías que requieren manejo especial',
    shipmentReadiness: 'Preparación del Envío',
    shipmentTimingDescription: 'Ayúdanos a planificar el cronograma de tu envío y proporcionar tarifas precisas',
    goodsReadyQuestion: '¿Cuándo estarán listas tus mercancías para recogida?',
    readyNow: '✅ Listo ahora - mercancías disponibles para recogida inmediata',
    readyIn1Week: '📅 En 1 semana - actualmente preparando',
    readyIn2Weeks: '📅 En 2 semanas - producción en progreso',
    readyIn1Month: '📅 En 1 mes - planificando con anticipación',
    dateNotSet: '❓ Fecha aún no determinada',
    timingHelp: 'Un cronograma preciso nos ayuda a proporcionar las tarifas más competitivas',
    // Step 4 translations
    step4Title: '¿Qué está enviando?',
    managingShipments: 'Gestionando {count} Envío{plural}',
    configureShipments: 'Configure cada envío individualmente o agregue múltiples envíos para pedidos complejos',
    addShipment: 'Agregar Envío',
    validating: 'Validando...',
    active: 'Activo',
    shipmentsCount: 'Envíos ({count})',
    addNewShipment: 'Agregar Nuevo Envío',
    duplicateShipment: 'Duplicar Este Envío',
    removeShipment: 'Eliminar Este Envío',
    consolidatedSummary: 'Resumen Consolidado',
    totalVolume: 'Volumen Total',
    totalWeight: 'Peso Total',
    totalShipments: 'Envíos',
    totalContainers: 'Contenedores',
    chooseShippingType: 'Elija su tipo de envío',
    shipmentXofY: 'Envío {current} de {total}',
    selectPackagingMethod: 'Seleccione cómo se empaquetan sus mercancías para el envío',
    forThisSpecificShipment: 'Para este envío específico',
    looseCargo: 'Carga Suelta',
    looseCargoDesc: 'Paletas, cajas o artículos individuales',
    fullContainer: 'Contenedor Completo',
    fullContainerDesc: 'Contenedor completo (FCL)',
    imNotSure: 'No estoy seguro',
    teamWillHelp: 'Nuestro equipo te ayudará a elegir la mejor opción',
    looseCargoFeedback: 'Perfecto para mercancías mixtas, cantidades pequeñas a medianas, o cuando necesita embalaje flexible',
    containerFeedback: 'Excelente opción para grandes volúmenes, líneas de productos completas, o cuando tiene suficientes mercancías para llenar un contenedor',
    unsureFeedback: '¡No se preocupe! Nuestro equipo experimentado lo guiará a través del proceso y recomendará la mejor solución de envío para sus necesidades específicas. Nos encargamos de todos los detalles técnicos.',
    whatHappensNext: 'Qué sucede después:',
    expertsContact: 'Nuestros expertos en envío se comunican con usted dentro de 24 horas',
    discussRequirements: 'Discutimos los detalles de su carga y requisitos',
    personalizedRecommendations: 'Recibe recomendaciones personalizadas y precios',

    describeLooseCargo: 'Describe su carga suelta',
    configureContainer: 'Configura tu contenedor',
    provideDimensionsWeight: 'Proporcione dimensiones y detalles de peso para precios precisos',
    selectContainerType: 'Seleccione tipo y cantidad de contenedor para su envío',
    calculateByUnit: 'Calcular por tipo de unidad',
    calculateByTotal: 'Calcular por envío total',
    packageType: 'Tipo de paquete',
    pallets: 'Paletas',
    boxesCrates: 'Cajas/Cajones',
    numberOfUnits: 'Número de unidades',
    palletType: 'Tipo de paleta',
    nonSpecified: 'No especificado',
    euroPallet: 'Europaleta (120x80 cm)',
    standardPallet: 'Paleta estándar (120x100 cm)',
    customSize: 'Tamaño personalizado',
    dimensionsPerUnit: 'Dimensiones (L×A×Al por unidad)',
    weightPerUnit: 'Peso (Por unidad)',
    required: 'Requerido',
    containerInfoBanner: 'Seleccione el tipo y cantidad de contenedor que mejor se ajuste a su volumen de carga.',
    unitInfoBanner: 'Proporcione detalles sobre cada artículo individual o paleta para cálculo preciso.',
    totalInfoBanner: 'Proporcionar números de envío total puede ser menos preciso. Dimensiones inexactas o sobredimensionadas pueden resultar en cargos adicionales.',
    totalDescription: 'Ingrese las dimensiones totales y el peso de su envío.',
    containerType: 'Tipo de contenedor',
    numberOfContainers: 'Número de contenedores',
    overweightContainer: 'Contenedor con sobrepeso (>25 toneladas)',
    container20: "20' Estándar (33 CBM)",
    container40: "40' Estándar (67 CBM)",
    container40HC: "40' High Cube (76 CBM)",
    container45HC: "45' High Cube (86 CBM)",
    additionalDetails: 'Detalles Adicionales (Opcional)',
    additionalDetailsDescription: 'Proporcione cualquier requisito especial o información adicional',
    goodsDescription: 'Breve descripción de mercancías (opcional)',
    goodsDescriptionPlaceholder: 'ej. Electrónicos, Muebles, Ropa, Maquinaria...',
    goodsDescriptionHelp: 'Nos ayuda a asegurar el manejo y documentación adecuados',
    specialRequirements: 'Requisitos de manejo especial (opcional)',
    noSpecialRequirements: 'Sin requisitos especiales',
    fragileGoods: '🔸 Mercancías frágiles - manejar con cuidado',
    temperatureControlled: '🌡️ Control de temperatura',
    urgentTimeSensitive: '⚡ Urgente/sensible al tiempo',
    highValueInsurance: '🛡️ Seguro de alto valor requerido',
    otherSpecify: '📝 Otro (especificar en comentarios)',
    rateValidityNotice: 'Aviso de Validez de Tarifas:',
          rateValidityText: 'Las tarifas cotizadas son válidas hasta la fecha de vencimiento mostrada en cada cotización. Si sus mercancías no están listas para recogida en esta fecha, las tarifas pueden estar sujetas a cambios basados en las condiciones actuales del mercado.',
      selectOption: 'Seleccionar una opción',
      // Step 6 translations
      step6Title: 'Detalles de contacto',
      personalInformation: 'Información Personal',
      personalInfoDescription: 'Díganos quién es usted',
      firstName: 'Nombre',
      firstNamePlaceholder: 'Ingrese su nombre',
      lastName: 'Apellido',
      lastNamePlaceholder: 'Ingrese su apellido',
      businessInformation: 'Información Empresarial',
      businessInfoDescription: 'Háblenos de su empresa',
      companyName: 'Nombre de la Empresa',
      companyNamePlaceholder: 'Ingrese el nombre de su empresa',
      shippingExperience: 'Experiencia de Envío',
      selectExperience: 'Seleccione su nivel de experiencia',
      firstTimeShipper: 'Primer envío',
      upTo10Times: 'Envíos ocasionales',
      moreThan10Times: 'Experiencia confirmada',
      regularShipper: 'Envíos regulares',
      contactInformation: 'Información de Contacto',
      contactInfoDescription: '¿Cómo podemos contactarlo?',
      emailAddress: 'Dirección de Correo Electrónico',
      emailPlaceholder: 'Ingrese su dirección de correo electrónico',
      emailHelp: 'Enviaremos su cotización y actualizaciones a este correo',
      phoneNumber: 'Número de Teléfono',
      phonePlaceholder: 'Ingrese su número de teléfono',
      phoneHelp: 'Para actualizaciones urgentes y aclaraciones',
      additionalNotes: 'Notas Adicionales',
      additionalNotesDescription: '¿Hay algo más que debamos saber?',
      remarks: 'Observaciones Especiales',
      remarksPlaceholder: 'Instrucciones especiales, requisitos o preguntas...',
      remarksHelp: 'Ayúdanos a servirle mejor con contexto adicional',
      readyToSubmit: '¡Listo para obtener su cotización!',
      submitDescription: 'Haga clic en "Obtener Mi Cotización" a continuación para enviar su solicitud. Responderemos en 24 horas.',
      securityBadge: 'Seguro y conforme con GDPR',
      // Customer type selection
      customerTypeQuestion: '¿Está enviando como particular o para una empresa?',
      customerTypeDescription: 'Esto nos ayuda a proporcionar los campos de información más relevantes',
      individualCustomer: 'Particular',
      individualDescription: 'Envío personal o cliente privado',
      companyCustomer: 'Empresa',
      companyDescription: 'Envío comercial o entidad empresarial',
      // New statistics section
      impactInNumbers: 'Nuestro Impacto en Números',
      impactDescription: 'Ofreciendo excelencia en China con resultados probados y servicio confiable',
      satisfiedCustomers: 'Clientes Satisfechos',
      customerSatisfaction: 'Satisfacción del Cliente',
      teamMembers: 'Miembros del Equipo',
      oceanVolume: 'Volumen Oceánico TEU',
      officesInChina: 'Oficinas en China',
      cfsFacilities: 'Instalaciones CFS M²',
    // Additional system messages
    errorSubmission: 'Ocurrió un error al enviar su cotización. Por favor, inténtelo de nuevo.',
    noTestLeads: 'No hay leads de prueba cargados en este momento.',
    pleaseSpecifyInRemarks: 'por favor especifique en los comentarios',
      // Confirmation page
      confirmationMainTitle: 'Confirmación de Solicitud',
      confirmationTitle: 'Solicitud de Cotización Confirmada',
      confirmationSubtitle: 'Su solicitud ha sido enviada exitosamente',
      referenceNumber: 'Número de Referencia',
      yourRequest: 'Resumen de Su Solicitud',
      shipmentDetails: 'Detalles del Envío',
      fromTo: 'De {origin} a {destination}',
      mode: 'Modo',
      contactDetails: 'Detalles de Contacto',
      nextSteps: 'Próximos Pasos',
      step1: 'Solicitud recibida',
      step1Time: 'Ahora',
      step2: 'Análisis y cotización',
      step2Time: 'En 4 horas laborales',
      step3: 'Contacto comercial',
      step3Time: 'En 24 horas',
      step4: 'Cotización detallada',
      step4Time: 'En 48 horas',
      aboutSino: 'Acerca de SINO Shipping & FS International',
      aboutSubtitle: 'Su solicitud está en manos expertas',
      sinoDescription: 'SINO Shipping, lanzado en 2018 por emprendedores franceses, se convirtió en parte de FS International en 2021. Esta asociación combina el enfoque occidental centrado en el cliente con profunda experiencia local china.',
      fsDescription: 'FS International, fundada en Hong Kong en septiembre de 1989, es uno de los nombres más confiables en logística global y transporte en la región.',
      ourExpertise: 'Nuestra Experiencia',
      expertise1: 'Transporte marítimo, aéreo, ferroviario y multimodal',
      expertise2: 'Soluciones de comercio electrónico (Amazon FBA, dropshipping)',
      expertise3: 'Abastecimiento y control de calidad',
      expertise4: 'Servicios logísticos completos',
      keyNumbers: 'Números Clave',
      number1: '15,000+ usuarios activos',
      number2: '1,000+ cotizaciones mensuales',
      number3: '50+ países socios',
      number4: 'Desde 1989',
      globalNetwork: 'Red Global',
      networkDescription: 'Oficinas estratégicas en centros logísticos clave:',
      chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
      hkOffice: 'Hong Kong: Piso 1, Bloque C, Sea View Estate, 8 Watson Road, North Point',
      needHelp: '¿Necesita Ayuda?',
    community: 'Nuestra comunidad',
      contactEmail: 'Correo electrónico',
      businessHours: '9am-6pm (Hora de China)',
      actions: 'Acciones Rápidas',
      newRequest: 'Hacer otra solicitud',
      ourServices: 'Ver nuestros servicios',
      subscribe: 'Suscribirse a actualizaciones',
      websites: 'Nuestros Sitios Web',
      thankYouTitle: '¡Gracias por su confianza!',
      thankYouMessage: 'Su solicitud será manejada con el máximo cuidado por nuestros expertos en transporte internacional.',
      getMyQuote: 'Obtener Mi Cotización',
      shipment: 'envío',
      shipments: 'envíos',
  },
  it: {
    // Header
    mainTitle: 'Preventivo di Spedizione dalla Cina',
    mainSubtitle: 'Ottieni un preventivo veloce e affidabile per la tua spedizione dalla Cina',
    // Timeline steps
    timelineDestination: 'Destinazione',
    timelineMode: 'Modalità',
    timelineOrigin: 'Origine',
    timelineCargo: 'Carico',
    timelineGoodsDetails: 'Dettagli Merci',
    timelineContact: 'Contatto',
    // Navigation
    stepCounter: 'Passaggio',
    next: 'Avanti',
    previous: 'Indietro',
    trustBadge: 'Affidato da 55.000+ importatori | Risposta < 24h | 100% Gratuito',
    // Common
    searchCountry: 'Cerca un paese...',
    noCountryResults: 'Nessun paese trovato. Prova una ricerca diversa.',
    mostUsed: 'Più utilizzati',
    // Step 1 translations
    step1Title: 'Dove spedisci?',
    destinationCity: 'Città di destinazione',
    destinationZipCode: 'Codice postale di destinazione',
    clearCountry: 'Cancella paese selezionato',
    clearPort: 'Cancella porto selezionato',
    // Location types
    factoryWarehouse: 'Fabbrica/Magazzino',
    portAirport: 'Porto/Aeroporto',
    port: 'Porto',
    airport: 'Aeroporto', 
    railTerminal: 'Terminal ferroviario',
    seaPort: 'Porto marittimo',
    volume: 'Volume',
    businessAddress: 'Indirizzo commerciale',
    residentialAddress: 'Indirizzo residenziale',
    chooseLocationDescription: 'Scegli il tuo luogo di ritiro',
    // Step 2 translations
    step2Title: 'Modalità di spedizione preferita',
    seaFreight: 'Trasporto Marittimo',
    seaFreightDesc: 'Economico, 30-45 giorni',
    railFreight: 'Trasporto Ferroviario',
    railFreightDesc: 'Conveniente, 15-25 giorni',
    airFreight: 'Trasporto Aereo',
    airFreightDesc: 'Veloce, 7-10 giorni',
    express: 'Express',
    expressDesc: 'Più veloce, 3-5 giorni',
    unsureShipping: 'Non sono ancora sicuro',
    unsureShippingDesc: 'Lascia che gli esperti ti aiutino',
    unsureShippingBenefits: 'Consulenza professionale',
    unsureShippingFeedback: 'Ottima scelta! Raccomanderemo la migliore opzione di spedizione per le tue esigenze specifiche',
    beginnerSectionTitle: 'Per principianti',
    beginnerSectionDesc: 'Lascia che i nostri esperti ti consiglino gratuitamente',
    separatorText: 'O scegli tu stesso',
    unsureAboutChoice: 'Non sei sicuro della tua scelta?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Confronta le opzioni disponibili',
    shippingMethodDescription: 'Le diverse modalità di spedizione offrono vari compromessi tra costo, velocità e affidabilità.',
    railAvailableForDestination: 'Il trasporto ferroviario è disponibile per la tua destinazione.',
    seaFreightBenefits: 'Ideale per spedizioni grandi e pesanti',
    railFreightBenefits: 'Opzione eco-friendly',
    airFreightBenefits: 'Ideale per spedizioni urgenti',
    expressBenefits: 'Servizio porta a porta',
    seaFeedback: 'Ottima scelta per spedizioni economiche di grandi volumi',
    railFeedback: 'Eccellente equilibrio tra costo e velocità con benefici ambientali',
    airFeedback: 'Perfetto per merci sensibili al tempo o di alto valore',
    expressFeedback: 'Ideale per spedizioni urgenti piccole-medie con tracciamento completo',
    // Beginner-friendly enhancements
    businessDescription: 'Indirizzo aziendale, palazzo uffici',
    residentialDescription: 'Casa, appartamento, indirizzo personale',
    factoryDescription: 'Fabbrica, centro distribuzione, magazzino',
    portDescription: 'Diretto al porto/aeroporto',
    helpChooseLocation: 'Non sicuro? Scegli Aziendale/Ufficio per spedizioni professionali o Residenziale per consegne personali',
    startTyping: 'Inizia a digitare per cercare...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Seleziona il tuo paese di destinazione',
    searchCountryDescription: 'Cerca il paese dove vuoi spedire le tue merci',
    addressTypeQuestion: 'Che tipo di indirizzo è la tua destinazione?',
    selectDestinationLocationType: 'Per favore seleziona un tipo di ubicazione di destinazione',
    selectDestinationPort: 'Seleziona porto di destinazione',
    selectDestinationPortDescription: 'Scegli il porto o aeroporto specifico per la consegna',
    searchPortsIn: 'Cerca porti in',
    searchDestinationPorts: 'Cerca porti di destinazione',
    enterDestinationDetails: 'Inserisci dettagli destinazione',
    // Messaggi di validazione
    validationShippingType: 'Per favore seleziona un tipo di spedizione',
    validationPackageType: 'Per favore seleziona un tipo di imballaggio',
    validationDimensionsNonSpecified: 'Per favore inserisci tutte le dimensioni (L, L, A) per il pallet non specificato',
    validationPalletHeight: 'Per favore inserisci l\'altezza del pallet',
    validationBoxDimensions: 'Per favore inserisci le dimensioni delle scatole/casse',
    validationWeightPerUnit: 'Per favore inserisci il peso per unità',
    validationTotalVolume: 'Per favore inserisci il volume totale',
    validationTotalWeight: 'Per favore inserisci il peso totale',
    validationContainerType: 'Per favore seleziona un tipo di container',
    validationDestinationCountry: 'Per favore seleziona un paese di destinazione',
    validationDestinationLocationType: 'Per favore seleziona un tipo di ubicazione di destinazione',
    validationDestinationCity: 'Per favore inserisci una città di destinazione',
    validationDestinationZip: 'Per favore inserisci un codice postale di destinazione',
    validationShippingMode: 'Per favore seleziona una modalità di spedizione',
    validationPickupLocationType: 'Per favore seleziona un tipo di ubicazione di ritiro',
    validationOriginPort: 'Per favore seleziona un\'origine',
    validationPickupCity: 'Per favore inserisci una città di ritiro',
    validationPickupZip: 'Per favore inserisci un codice postale di ritiro',
    validationGoodsValue: 'Per favore inserisci il valore delle merci',
    validationReadyDate: 'Per favore seleziona quando le tue merci saranno pronte',
    validationShipperType: 'Per favore seleziona se sei un individuo o un\'azienda',
    validationFirstName: 'Per favore inserisci il tuo nome',
    validationLastName: 'Per favore inserisci il tuo cognome',
    validationCompanyName: 'Per favore inserisci il nome della tua azienda',
    validationShipperRole: 'Per favore seleziona il tuo tipo di spedizioniere',
    validationEmail: 'Per favore fornisci un indirizzo email valido',
    noCommitmentRequired: 'Nessun impegno richiesto - solo consulenza esperta!',
    cityPostalDescription: 'Fornisci città e codice postale per spedizione accurata',
    popular: 'Popolare',
    otherCountries: 'Altri paesi',
    // Step 3 translations
    step3Title: 'Seleziona luogo di ritiro in Cina',
    selectPickupLocationType: 'Seleziona il tuo tipo di luogo di ritiro',
    pickupLocationDescription: 'Scegli dove dovremmo ritirare le tue merci in Cina',
    enterPickupDetails: 'Inserisci dettagli di ritiro',
    pickupCityPostalDescription: 'Fornisci la città e il codice postale di ritiro in Cina',
    searchPortTerminal: 'Cerca porto/terminal/aeroporto...',
    selectPortTerminal: 'Seleziona porto/terminal/aeroporto di ritiro',
    portTerminalDescription: 'Scegli il porto, terminal o aeroporto specifico per il ritiro',
    pickupCity: 'Città di ritiro',
    pickupZipCode: 'Codice postale di ritiro',
    dontKnowPort: 'Non lo so',
    dontKnowPortDescription: 'Non sono sicuro di quale porto/terminal scegliere',
    dontKnowPortFeedback: 'Nessun problema! Ti aiuteremo a scegliere il miglior porto/terminal per la tua spedizione.',
    perfectPortFeedback: 'Perfetto! Ritireremo da',
    cityPickupFeedback: 'Perfetto! Organizzeremo il ritiro da {city}, Cina',
    annualVolume: 'Volume annuale',
    // Port translations
    ports: {
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Aeroporto Capital di Pechino',
      'PVG': 'Aeroporto Pudong di Shanghai',
      'CAN': 'Aeroporto Baiyun di Guangzhou',
      'CTU': 'Aeroporto Shuangliu di Chengdu',
      'KMG': 'Aeroporto Changshui di Kunming',
      'XIY': 'Aeroporto Xianyang di Xi\'an',
      'HGH': 'Aeroporto Xiaoshan di Hangzhou',
      'NKG': 'Aeroporto Lukou di Nanjing',
      'ZIH': 'Terminal ferroviario di Zhengzhou',
      'CQN': 'Terminal ferroviario di Chongqing',
      'WUH': 'Terminal ferroviario di Wuhan',
      'CDU': 'Terminal ferroviario di Chengdu',
      // Cameroon ports
      'CMDLA': 'Porto di Douala',
      'CMDLA_AIR': 'Aeroporto di Douala',
      'CMNSM': 'Aeroporto di Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Cina orientale',
      'South China': 'Cina meridionale',
      'North China': 'Cina settentrionale',
      'West China': 'Cina occidentale',
      'Southwest China': 'Cina sud-occidentale',
      'Northwest China': 'Cina nord-occidentale',
      'Central China': 'Cina centrale'
    },
    // Dynamic translations by mode
    searchPort: 'Cerca porto...',
    searchAirport: 'Cerca aeroporto...',
    searchRailTerminal: 'Cerca terminal ferroviario...',
    selectPort: 'Seleziona porto di ritiro',
    selectAirport: 'Seleziona aeroporto di ritiro', 
    selectRailTerminal: 'Seleziona terminal ferroviario di ritiro',
    portDescriptionDynamic: 'Scegli il porto specifico per il ritiro',
    airportDescriptionDynamic: 'Scegli l\'aeroporto specifico per il ritiro',
    railTerminalDescriptionDynamic: 'Scegli il terminal ferroviario specifico per il ritiro',
    // Step 5 translations
    step5Title: 'Parlaci delle tue merci',
    goodsValueDeclaration: 'Valore e Dichiarazione Merci',
    goodsValueDescription: 'Fornisci il valore commerciale per la dichiarazione doganale e scopi assicurativi',
    commercialValue: 'Valore commerciale delle merci',
    goodsValueHelp: 'Questo valore è utilizzato per la dichiarazione doganale e calcoli assicurativi',
    personalOrHazardous: 'Effetti personali o contiene materiali pericolosi/limitati',
    personalHazardousHelp: 'Seleziona questo se spedisci beni personali o merci che richiedono gestione speciale',
    shipmentReadiness: 'Preparazione Spedizione',
    shipmentTimingDescription: 'Aiutaci a pianificare la tempistica della tua spedizione e fornire tariffe accurate',
    goodsReadyQuestion: 'Quando saranno pronte le tue merci per il ritiro?',
    readyNow: '✅ Pronto ora - merci disponibili per ritiro immediato',
    readyIn1Week: '📅 Entro 1 settimana - attualmente in preparazione',
    readyIn2Weeks: '📅 Entro 2 settimane - produzione in corso',
    readyIn1Month: '📅 Entro 1 mese - pianificazione anticipata',
    dateNotSet: '❓ Data non ancora determinata',
    timingHelp: 'Una tempistica accurata ci aiuta a fornire le tariffe più competitive',
    additionalDetails: 'Dettagli Aggiuntivi (Opzionale)',
    additionalDetailsDescription: 'Fornisci eventuali requisiti speciali o informazioni aggiuntive',
    goodsDescription: 'Breve descrizione delle merci (opzionale)',
    goodsDescriptionPlaceholder: 'es. Elettronica, Mobili, Abbigliamento, Macchinari...',
    goodsDescriptionHelp: 'Ci aiuta ad assicurare gestione e documentazione appropriate',
    specialRequirements: 'Requisiti di gestione speciale (opzionale)',
    noSpecialRequirements: 'Nessun requisito speciale',
    fragileGoods: '🔸 Merci fragili - maneggiare con cura',
    temperatureControlled: '🌡️ Controllo temperatura',
    urgentTimeSensitive: '⚡ Urgente/sensibile al tempo',
    highValueInsurance: '🛡️ Assicurazione alto valore richiesta',
    otherSpecify: '📝 Altro (specificare nei commenti)',
    rateValidityNotice: 'Avviso Validità Tariffe:',
    rateValidityText: 'Le tariffe quotate sono valide fino alla data di scadenza mostrata su ogni preventivo. Se le tue merci non sono pronte per il ritiro entro questa data, le tariffe potrebbero essere soggette a modifiche basate sulle condizioni attuali del mercato.',
    // New statistics section
    impactInNumbers: 'Il Nostro Impatto in Numeri',
    impactDescription: 'Offrendo eccellenza in Cina con risultati comprovati e servizio affidabile',
    satisfiedCustomers: 'Clienti Soddisfatti',
    customerSatisfaction: 'Soddisfazione del Cliente',
    teamMembers: 'Membri del Team',
    oceanVolume: 'Volume Marittimo TEU',
          officesInChina: 'Uffici in Cina',
      cfsFacilities: 'M² Strutture CFS',
    // Additional system messages
    errorSubmission: 'Si è verificato un errore durante l\'invio del preventivo. Riprova.',
    noTestLeads: 'Nessun lead di test caricato al momento.',
    pleaseSpecifyInRemarks: 'si prega di specificare nelle osservazioni',
    // Step 6 translations
    step6Title: 'Dettagli di contatto',
    personalInformation: 'Informazioni Personali',
    personalInfoDescription: 'Dicci chi sei',
    firstName: 'Nome',
    firstNamePlaceholder: 'Inserisci il tuo nome',
    lastName: 'Cognome',
    lastNamePlaceholder: 'Inserisci il tuo cognome',
    businessInformation: 'Informazioni Aziendali',
    businessInfoDescription: 'Parlaci della tua azienda',
    companyName: 'Nome Azienda',
    companyNamePlaceholder: 'Inserisci il nome della tua azienda',
    shippingExperience: 'Esperienza di Spedizione',
    selectExperience: 'Seleziona il tuo livello di esperienza',
    firstTimeShipper: 'Prima spedizione',
    upTo10Times: 'Spedizioni occasionali',
    moreThan10Times: 'Esperienza consolidata',
    regularShipper: 'Spedizioni regolari',
    contactInformation: 'Informazioni di Contatto',
    contactInfoDescription: 'Come possiamo contattarti?',
    emailAddress: 'Indirizzo email',
    emailPlaceholder: 'Inserisci il tuo indirizzo email',
    emailHelp: 'Invieremo il tuo preventivo e gli aggiornamenti a questa email',
    phoneNumber: 'Numero di Telefono',
    phonePlaceholder: 'Inserisci il tuo numero di telefono',
    phoneHelp: 'Per aggiornamenti urgenti e chiarimenti',
    additionalNotes: 'Note Aggiuntive',
    additionalNotesDescription: 'C\'è qualcos\'altro che dovremmo sapere?',
    remarks: 'Osservazioni Speciali',
    remarksPlaceholder: 'Istruzioni speciali, requisiti o domande...',
    remarksHelp: 'Aiutaci a servirti meglio con contesto aggiuntivo',
    readyToSubmit: 'Pronto per ottenere il tuo preventivo!',
    submitDescription: 'Clicca "Ottieni il Mio Preventivo" qui sotto per inviare la tua richiesta. Risponderemo entro 24 ore.',
    getMyQuote: 'Ottieni il Mio Preventivo',
    securityBadge: 'Sicuro e conforme GDPR',
    // Customer type selection
    customerTypeQuestion: 'Stai spedendo come privato o per un\'azienda?',
    customerTypeDescription: 'Questo ci aiuta a fornire i campi informativi più rilevanti',
    individualCustomer: 'Privato',
    individualDescription: 'Spedizione personale o cliente privato',
    companyCustomer: 'Azienda',
    companyDescription: 'Spedizione aziendale o entità commerciale',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'Conferma della Richiesta',
      confirmationTitle: 'Richiesta di Preventivo Confermata',
      confirmationSubtitle: 'La vostra richiesta è stata inviata con successo',
      referenceNumber: 'Numero di Riferimento',
      yourRequest: 'Riepilogo della Vostra Richiesta',
      shipmentDetails: 'Dettagli della Spedizione',
      fromTo: 'Da {origin} a {destination}',
      mode: 'Modalità',
      contactDetails: 'Dettagli di Contatto',
      nextSteps: 'Prossimi Passi',
      step1: 'Richiesta ricevuta',
      step1Time: 'Ora',
      step2: 'Analisi e preventivo',
      step2Time: 'Entro 4 ore lavorative',
      step3: 'Contatto commerciale',
      step3Time: 'Entro 24 ore',
      step4: 'Preventivo dettagliato',
      step4Time: 'Entro 48 ore',
      aboutSino: 'Su SINO Shipping & FS International',
      aboutSubtitle: 'La vostra richiesta è in mani esperte',
      sinoDescription: 'SINO Shipping, lanciata nel 2018 da imprenditori francesi, è diventata parte di FS International nel 2021. Questa partnership combina l\'approccio occidentale orientato al cliente con la profonda esperienza locale cinese.',
      fsDescription: 'FS International, fondata ad Hong Kong nel settembre 1989, è uno dei nomi più fidati nella logistica globale e nei trasporti nella regione.',
      ourExpertise: 'La Nostra Esperienza',
      expertise1: 'Trasporto marittimo, aereo, ferroviario e multimodale',
      expertise2: 'Soluzioni e-commerce (Amazon FBA, dropshipping)',
      expertise3: 'Sourcing e controllo qualità',
      expertise4: 'Servizi logistici completi',
      keyNumbers: 'Numeri Chiave',
      number1: '15.000+ utenti attivi',
      number2: '1.000+ preventivi mensili',
      number3: '50+ paesi partner',
      number4: 'Dal 1989',
      globalNetwork: 'Rete Globale',
      networkDescription: 'Uffici strategici nei principali hub logistici:',
      chinaOffices: 'Cina: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
      hkOffice: 'Hong Kong: 1° Piano, Blocco C, Sea View Estate, 8 Watson Road, North Point',
      needHelp: 'Serve Aiuto?',
    community: 'La nostra community',
      contactEmail: 'Email',
      available: 'Disponibile',
      businessHours: '9-18 (Ora Cinese)',
      actions: 'Azioni Rapide',
      newRequest: 'Fare un\'altra richiesta',
      ourServices: 'Visualizza i nostri servizi',
      subscribe: 'Iscriviti agli aggiornamenti',
      websites: 'I Nostri Siti Web',

      thankYouTitle: 'Grazie per la vostra fiducia!',
      thankYouMessage: 'La vostra richiesta sarà gestita con la massima cura dai nostri esperti di trasporto internazionale.',
      shipment: 'spedizione',
      shipments: 'spedizioni',
      // Step 4 translations
      step4Title: 'Cosa stai spedendo?',
      managingShipments: 'Gestione di {count} Spedizione{plural}',
      configureShipments: 'Configura ogni spedizione individualmente o aggiungi più spedizioni per ordini complessi',
      addShipment: 'Aggiungi Spedizione',
      validating: 'Convalidando...',
      active: 'Attivo',
      shipmentsCount: 'Spedizioni ({count})',
      addNewShipment: 'Aggiungi Nuova Spedizione',
      duplicateShipment: 'Duplica Questa Spedizione',
      removeShipment: 'Rimuovi Questa Spedizione',
      consolidatedSummary: 'Riepilogo Consolidato',
      totalVolume: 'Volume Totale',
      totalWeight: 'Peso Totale',
      totalShipments: 'Spedizioni',
      totalContainers: 'Container',
      chooseShippingType: 'Scegli il tuo tipo di spedizione',
      shipmentXofY: 'Spedizione {current} di {total}',
      selectPackagingMethod: 'Seleziona come sono confezionate le tue merci per la spedizione',
      forThisSpecificShipment: 'Per questa spedizione specifica',
      looseCargo: 'Carico Sfuso',
      looseCargoDesc: 'Pallet, scatole o articoli individuali',
      fullContainer: 'Container Completo',
      fullContainerDesc: 'Container completo (FCL)',
      imNotSure: 'Non sono sicuro',
      teamWillHelp: 'Il nostro team ti aiuterà a scegliere l\'opzione migliore',
      looseCargoFeedback: 'Perfetto per merci miste, quantità piccole-medie, o quando hai bisogno di un imballaggio flessibile',
      containerFeedback: 'Scelta eccellente per grandi volumi, linee di prodotti complete, o quando hai abbastanza merci per riempire un container',
      unsureFeedback: 'Non preoccuparti! Il nostro team esperto ti guiderà attraverso il processo e raccomanderà la migliore soluzione di spedizione per le tue esigenze specifiche. Ci occupiamo di tutti i dettagli tecnici.',
      whatHappensNext: 'Cosa succede dopo:',
      expertsContact: 'I nostri esperti di spedizione ti contattano entro 24 ore',
      discussRequirements: 'Discutiamo i dettagli del tuo carico e i requisiti',
      personalizedRecommendations: 'Ricevi raccomandazioni personalizzate e prezzi',
  
      describeLooseCargo: 'Descrivi il tuo carico sfuso',
      configureContainer: 'Configura il tuo container',
      provideDimensionsWeight: 'Fornisci dimensioni e dettagli del peso per prezzi accurati',
      selectContainerType: 'Seleziona tipo e quantità del container per la tua spedizione',
      calculateByUnit: 'Calcola per tipo di unità',
      calculateByTotal: 'Calcola per spedizione totale',
      packageType: 'Tipo di pacchetto',
      pallets: 'Pallet',
      boxesCrates: 'Scatole/Casse',
      numberOfUnits: 'Numero di unità',
      palletType: 'Tipo di pallet',
      nonSpecified: 'Non specificato',
      euroPallet: 'Europallet (120x80 cm)',
      standardPallet: 'Pallet standard (120x100 cm)',
      customSize: 'Dimensione personalizzata',
      dimensionsPerUnit: 'Dimensioni (L×L×A per unità)',
      weightPerUnit: 'Peso (Per unità)',
      required: 'Richiesto',
      containerInfoBanner: 'Seleziona il tipo e la quantità di container che meglio si adatta al volume del tuo carico.',
      unitInfoBanner: 'Fornisci dettagli su ogni singolo articolo o pallet per un calcolo accurato.',
      totalInfoBanner: 'Fornire numeri di spedizione totali può essere meno preciso. Dimensioni imprecise o sovradimensionate possono risultare in costi aggiuntivi.',
      totalDescription: 'Inserisci le dimensioni totali e il peso della tua spedizione.',
      containerType: 'Tipo di container',
      numberOfContainers: 'Numero di container',
      overweightContainer: 'Container sovrapeso (>25 tonnellate)',
      container20: "20' Standard (33 CBM)",
      container40: "40' Standard (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
  },
  nl: {
    // Header
    mainTitle: 'Verzendofferte vanuit China',
    mainSubtitle: 'Krijg een snelle, betrouwbare offerte voor uw zending vanuit China',
    // Timeline steps
    timelineDestination: 'Bestemming',
    timelineMode: 'Modus',
    timelineOrigin: 'Oorsprong',
    timelineCargo: 'Vracht',
    timelineGoodsDetails: 'Goederendetails',
    timelineContact: 'Contact',
    // Navigation
    stepCounter: 'Stap',
    next: 'Volgende',
    previous: 'Vorige',
    trustBadge: 'Vertrouwd door 55.000+ importeurs | Reactie < 24u | 100% Gratis',
    // Common
    searchCountry: 'Zoek naar een land...',
    noCountryResults: 'Geen landen gevonden. Probeer een andere zoekopdracht.',
    mostUsed: 'Meest gebruikt',
    // Step 1 translations
    step1Title: 'Waar verzendt u naar?',
    destinationCity: 'Bestemmingsstad',
    destinationZipCode: 'Bestemmingspostcode',
    clearCountry: 'Geselecteerd land wissen',
    clearPort: 'Geselecteerde haven wissen',
    // Location types
    factoryWarehouse: 'Fabriek/Magazijn',
    portAirport: 'Haven/Luchthaven',
    port: 'Haven',
    airport: 'Luchthaven', 
    railTerminal: 'Spoorwegterminal',
    seaPort: 'Zeehaven',
    volume: 'Volume',
    businessAddress: 'Bedrijfsadres',
    residentialAddress: 'Woonadres',
    chooseLocationDescription: 'Kies uw ophaallocatie',
    // Step 2 translations
    step2Title: 'Gewenste verzendmodus',
    seaFreight: 'Zeevracht',
    seaFreightDesc: 'Economisch, 30-45 dagen',
    railFreight: 'Spoorvervoer',
    railFreightDesc: 'Kosteneffectief, 15-25 dagen',
    airFreight: 'Luchtvracht',
    airFreightDesc: 'Snel, 7-10 dagen',
    express: 'Express',
    expressDesc: 'Snelste, 3-5 dagen',
    unsureShipping: 'Ik weet het nog niet zeker',
    unsureShippingDesc: 'Laat de experts helpen',
    unsureShippingBenefits: 'Professionele begeleiding',
    unsureShippingFeedback: 'Uitstekende keuze! We zullen de beste verzendoptie voor uw specifieke behoeften aanbevelen',
    beginnerSectionTitle: 'Voor beginners',
    beginnerSectionDesc: 'Laat onze experts u gratis adviseren',
    separatorText: 'Of kies zelf',
    unsureAboutChoice: 'Niet zeker van uw keuze?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Vergelijk beschikbare opties',
    shippingMethodDescription: 'Verschillende verzendmodi bieden verschillende afwegingen tussen kosten, snelheid en betrouwbaarheid.',
    railAvailableForDestination: 'Spoorvervoer is beschikbaar voor uw bestemming.',
    seaFreightBenefits: 'Ideaal voor grote, zware zendingen',
    railFreightBenefits: 'Milieuvriendelijke optie',
    airFreightBenefits: 'Ideaal voor urgente zendingen',
    expressBenefits: 'Deur-tot-deur service',
    seaFeedback: 'Uitstekende keuze voor kosteneffectieve verzending van grote volumes',
    railFeedback: 'Uitstekende balans tussen kosten en snelheid met milieuvoordelen',
    airFeedback: 'Perfect voor tijdgevoelige of hoogwaardige vracht',
    expressFeedback: 'Ideaal voor urgente, kleine tot middelgrote zendingen met volledige tracking',
    // Beginner-friendly enhancements
    businessDescription: 'Bedrijfsadres, kantoorgebouw',
    residentialDescription: 'Huis, appartement, privéadres',
    factoryDescription: 'Fabriek, distributiecentrum, magazijn',
    portDescription: 'Direct naar haven/luchthaven',
    helpChooseLocation: 'Niet zeker? Kies Bedrijf/Kantoor voor zakelijke zendingen of Woonadres voor persoonlijke leveringen',
    startTyping: 'Begin met typen om te zoeken...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Selecteer uw bestemmingsland',
    searchCountryDescription: 'Zoek het land waar u uw goederen naartoe wilt verzenden',
    addressTypeQuestion: 'Welk type adres is uw bestemming?',
    selectDestinationLocationType: 'Selecteer een bestemmingslocatie type',
    selectDestinationPort: 'Selecteer bestemmingshaven',
    selectDestinationPortDescription: 'Kies de specifieke haven of luchthaven voor levering',
    searchPortsIn: 'Zoek havens in',
    searchDestinationPorts: 'Zoek bestemmingshavens',
    enterDestinationDetails: 'Voer bestemmingsdetails in',
    // Validatieberichten
    validationShippingType: 'Selecteer een verzendtype',
    validationPackageType: 'Selecteer een verpakkingstype',
    validationDimensionsNonSpecified: 'Voer alle afmetingen (L, B, H) in voor de niet-gespecificeerde pallet',
    validationPalletHeight: 'Voer de hoogte van de pallet in',
    validationBoxDimensions: 'Voer de afmetingen van de dozen/kratten in',
    validationWeightPerUnit: 'Voer het gewicht per eenheid in',
    validationTotalVolume: 'Voer het totale volume in',
    validationTotalWeight: 'Voer het totale gewicht in',
    validationContainerType: 'Selecteer een containertype',
    validationDestinationCountry: 'Selecteer een bestemmingsland',
    validationDestinationLocationType: 'Selecteer een bestemmingslocatie type',
    validationDestinationCity: 'Voer een bestemmingsstad in',
    validationDestinationZip: 'Voer een bestemmingspostcode in',
    validationShippingMode: 'Selecteer een verzendmodus',
    validationPickupLocationType: 'Selecteer een ophaallocatie type',
    validationOriginPort: 'Selecteer een oorsprong',
    validationPickupCity: 'Voer een ophaalstad in',
    validationPickupZip: 'Voer een ophaalpostcode in',
    validationGoodsValue: 'Voer de waarde van de goederen in',
    validationReadyDate: 'Selecteer wanneer uw goederen gereed zullen zijn',
    validationShipperType: 'Selecteer of u een particulier of bedrijf bent',
    validationFirstName: 'Voer uw voornaam in',
    validationLastName: 'Voer uw achternaam in',
    validationCompanyName: 'Voer uw bedrijfsnaam in',
    validationShipperRole: 'Selecteer uw verzendertype',
    validationEmail: 'Verstrek een geldig e-mailadres',
    noCommitmentRequired: 'Geen verplichting vereist - alleen deskundige begeleiding!',
    cityPostalDescription: 'Geef stad en postcode voor nauwkeurige verzending',
    popular: 'Populair',
    otherCountries: 'Andere landen',
    // Step 3 translations
    step3Title: 'Selecteer ophaallocatie in China',
    selectPickupLocationType: 'Selecteer uw ophaallocatie type',
    pickupLocationDescription: 'Kies waar we uw goederen in China moeten ophalen',
    enterPickupDetails: 'Voer ophaaldetails in',
    pickupCityPostalDescription: 'Geef de ophaalstad en postcode in China',
    searchPortTerminal: 'Zoek haven/terminal/luchthaven...',
    selectPortTerminal: 'Selecteer ophaalhaven/terminal/luchthaven',
    portTerminalDescription: 'Kies de specifieke haven, terminal of luchthaven voor ophaal',
    pickupCity: 'Ophaalstad',
    pickupZipCode: 'Ophaal postcode',
    dontKnowPort: 'Ik weet het niet',
    dontKnowPortDescription: 'Ik weet niet zeker welke haven/terminal te kiezen',
    dontKnowPortFeedback: 'Geen probleem! We helpen je de beste haven/terminal voor je zending te kiezen.',
    perfectPortFeedback: 'Perfect! We halen op van',
    cityPickupFeedback: 'Geweldig! We regelen ophaal uit {city}, China',
    annualVolume: 'Jaarlijks volume',
    // Port translations
    ports: {
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Beijing Capital Luchthaven',
      'PVG': 'Shanghai Pudong Luchthaven',
      'CAN': 'Guangzhou Baiyun Luchthaven',
      'CTU': 'Chengdu Shuangliu Luchthaven',
      'KMG': 'Kunming Changshui Luchthaven',
      'XIY': 'X\'an Xianyang Luchthaven',
      'HGH': 'Hangzhou Xiaoshan Luchthaven',
      'NKG': 'Nanjing Lukou Luchthaven',
      'ZIH': 'Zhengzhou Spoorwegstation',
      'CQN': 'Chongqing Spoorwegstation',
      'WUH': 'Wuhan Spoorwegstation',
      'CDU': 'Chengdu Spoorwegstation',
      // Cameroon ports
      'CMDLA': 'Haven van Douala',
      'CMDLA_AIR': 'Luchthaven Douala',
      'CMNSM': 'Luchthaven Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Oost-China',
      'South China': 'Zuid-China',
      'North China': 'Noord-China',
      'West China': 'West-China',
      'Southwest China': 'Zuidwest-China',
      'Northwest China': 'Noordwest-China',
      'Central China': 'Centraal-China'
    },
    // Dynamic translations by mode
    searchPort: 'Zoek haven...',
    searchAirport: 'Zoek luchthaven...',
    searchRailTerminal: 'Zoek spoorwegterminal...',
    selectPort: 'Selecteer ophaalhaven',
    selectAirport: 'Selecteer ophaalluchthaven', 
    selectRailTerminal: 'Selecteer ophaal spoorwegterminal',
    portDescriptionDynamic: 'Kies de specifieke haven voor ophaal',
    airportDescriptionDynamic: 'Kies de specifieke luchthaven voor ophaal',
    railTerminalDescriptionDynamic: 'Kies de specifieke spoorwegterminal voor ophaal',
    // Step 5 translations
    step5Title: 'Vertel ons over uw goederen',
    goodsValueDeclaration: 'Goederenwaarde & Aangifte',
    goodsValueDescription: 'Verstrek de commerciële waarde voor douaneaangifte en verzekeringsdoeleinden',
    commercialValue: 'Commerciële waarde van goederen',
    goodsValueHelp: 'Deze waarde wordt gebruikt voor douaneaangifte en verzekeringsberekeningen',
    personalOrHazardous: 'Persoonlijke bezittingen of bevat gevaarlijke/beperkte materialen',
    personalHazardousHelp: 'Vink dit aan als u persoonlijke bezittingen verzendt of goederen die speciale behandeling vereisen',
    shipmentReadiness: 'Zendingsbereidheid',
    shipmentTimingDescription: 'Help ons uw zendingstijdlijn te plannen en nauwkeurige tarieven te verstrekken',
    goodsReadyQuestion: 'Wanneer zijn uw goederen klaar voor ophaal?',
    readyNow: '✅ Nu klaar - goederen zijn beschikbaar voor onmiddellijke ophaal',
    readyIn1Week: '📅 Binnen 1 week - momenteel aan het voorbereiden',
    readyIn2Weeks: '📅 Binnen 2 weken - productie in uitvoering',
    readyIn1Month: '📅 Binnen 1 maand - vooruitplannen',
    dateNotSet: '❓ Datum nog niet bepaald',
    timingHelp: 'Nauwkeurige timing helpt ons de meest concurrerende tarieven te verstrekken',
    additionalDetails: 'Aanvullende Details (Optioneel)',
    additionalDetailsDescription: 'Verstrek eventuele speciale vereisten of aanvullende informatie',
    goodsDescription: 'Korte beschrijving van goederen (optioneel)',
    goodsDescriptionPlaceholder: 'bijv. Elektronica, Meubels, Kleding, Machines...',
    goodsDescriptionHelp: 'Helpt ons juiste behandeling en documentatie te waarborgen',
    specialRequirements: 'Speciale behandelingsvereisten (optioneel)',
    noSpecialRequirements: 'Geen speciale vereisten',
    fragileGoods: '🔸 Breekbare goederen - voorzichtig behandelen',
    temperatureControlled: '🌡️ Temperatuurgecontroleerd',
    urgentTimeSensitive: '⚡ Urgent/tijdgevoelig',
    highValueInsurance: '🛡️ Hoogwaardige verzekering vereist',
    otherSpecify: '📝 Andere (gelieve te specificeren in opmerkingen)',
    rateValidityNotice: 'Tariefgeldigheid Melding:',
    rateValidityText: 'Geoffreerde tarieven zijn geldig tot de vervaldatum getoond op elke offerte. Als uw goederen niet klaar zijn voor ophaal vóór deze datum, kunnen tarieven onderhevig zijn aan wijziging op basis van huidige marktomstandigheden.',
    selectOption: 'Selecteer een optie',
    // New statistics section
    impactInNumbers: 'Onze Impact in Cijfers',
    impactDescription: 'Excellentie leveren in China met bewezen resultaten en betrouwbare service',
    satisfiedCustomers: 'Tevreden Klanten',
    customerSatisfaction: 'Klanttevredenheid',
    teamMembers: 'Teamleden',
    oceanVolume: 'TEU Zeevracht Volume',
          officesInChina: 'Kantoren in China',
      cfsFacilities: 'M² CFS Faciliteiten',
    // Additional system messages
    errorSubmission: 'Er is een fout opgetreden bij het verzenden van uw offerte. Probeer het opnieuw.',
    noTestLeads: 'Geen test leads geladen op dit moment.',
    pleaseSpecifyInRemarks: 'gelieve te specificeren in opmerkingen',
    // Step 6 translations
    step6Title: 'Contactgegevens',
    personalInformation: 'Persoonlijke Informatie',
    personalInfoDescription: 'Vertel ons wie u bent',
    firstName: 'Voornaam',
    firstNamePlaceholder: 'Voer uw voornaam in',
    lastName: 'Achternaam',
    lastNamePlaceholder: 'Voer uw achternaam in',
    businessInformation: 'Bedrijfsinformatie',
    businessInfoDescription: 'Vertel ons over uw bedrijf',
    companyName: 'Bedrijfsnaam',
    companyNamePlaceholder: 'Voer uw bedrijfsnaam in',
    shippingExperience: 'Verzendervaring',
    selectExperience: 'Selecteer uw ervaringsniveau',
    firstTimeShipper: 'Eerste verzending',
    upTo10Times: 'Incidentele verzendingen',
    moreThan10Times: 'Ervaren verzender',
    regularShipper: 'Regelmatige verzender',
    contactInformation: 'Contactinformatie',
    contactInfoDescription: 'Hoe kunnen we u bereiken?',
    emailAddress: 'E-mailadres',
    emailPlaceholder: 'Voer uw e-mailadres in',
    emailHelp: 'We sturen uw offerte en updates naar deze e-mail',
    phoneNumber: 'Telefoonnummer',
    phonePlaceholder: 'Voer uw telefoonnummer in',
    phoneHelp: 'Voor urgente updates en verduidelijkingen',
    additionalNotes: 'Aanvullende Opmerkingen',
    additionalNotesDescription: 'Is er nog iets anders dat we moeten weten?',
    remarks: 'Speciale Opmerkingen',
    remarksPlaceholder: 'Speciale instructies, vereisten of vragen...',
    remarksHelp: 'Help ons u beter van dienst te zijn met extra context',
    readyToSubmit: 'Klaar om uw offerte te krijgen!',
    submitDescription: 'Klik op "Ontvang Mijn Offerte" hieronder om uw verzoek in te dienen. We reageren binnen 24 uur.',
    getMyQuote: 'Ontvang Mijn Offerte',
    securityBadge: 'Veilig en AVG-conform',
    // Customer type selection
    customerTypeQuestion: 'Verzendt u als particulier of voor een bedrijf?',
    customerTypeDescription: 'Dit helpt ons de meest relevante informatievelden te bieden',
    individualCustomer: 'Particulier',
    individualDescription: 'Persoonlijke zending of privéklant',
    companyCustomer: 'Bedrijf',
    companyDescription: 'Zakelijke zending of commerciële entiteit',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'Bevestiging van Verzoek',
      confirmationTitle: 'Offerteaanvraag Bevestigd',
      confirmationSubtitle: 'Uw aanvraag is succesvol verzonden',
      referenceNumber: 'Referentienummer',
      yourRequest: 'Samenvatting van Uw Aanvraag',
      shipmentDetails: 'Zendingdetails',
      fromTo: 'Van {origin} naar {destination}',
      mode: 'Vervoerswijze',
      contactDetails: 'Contactgegevens',
      nextSteps: 'Volgende Stappen',
      step1: 'Aanvraag ontvangen',
      step1Time: 'Nu',
      step2: 'Analyse en offerte',
      step2Time: 'Binnen 4 werkuren',
      step3: 'Commercieel contact',
      step3Time: 'Binnen 24 uur',
      step4: 'Gedetailleerde offerte',
      step4Time: 'Binnen 48 uur',
      aboutSino: 'Over SINO Shipping & FS International',
      aboutSubtitle: 'Uw aanvraag wordt afgehandeld door experts',
      sinoDescription: 'SINO Shipping werd opgericht in 2018 door Franse ondernemers en werd in 2021 onderdeel van FS International. Deze samenwerking combineert een westerse klantgerichte benadering met diepgaande lokale Chinese expertise.',
      fsDescription: 'FS International werd opgericht in september 1989 in Hong Kong en is een van de meest vertrouwde merken voor wereldwijde logistiek en transport in de regio.',
      ourExpertise: 'Onze Expertise',
      expertise1: 'Zeevracht en luchtvracht vanuit alle belangrijke Chinese havens',
      expertise2: 'Spoorvervoer naar Europa en Rusland',
      expertise3: 'Multimodaal transport en laatste kilometer levering',
      expertise4: 'Douaneafhandeling en compliance consulting',
      keyNumbers: 'Onze Impact in Cijfers',
      keyNumbersSubtitle: 'Bewezen resultaten en betrouwbare service in China',
      number1: '15.000+ actieve gebruikers',
      number2: '1.000+ offertes per maand',
      number3: '98% klanttevredenheid',
      number4: '100+ teamleden',
      globalNetwork: 'Wereldwijd Netwerk',
      networkDescription: 'Met strategische kantoren in China en Hong Kong zijn we ideaal gepositioneerd om uw zendingen efficiënt af te handelen.',
      chinaOffices: 'China Kantoren: Shenzhen, Shanghai, Qingdao, Ningbo',
      hkOffice: 'Hong Kong Hoofdkantoor: Tsim Sha Tsui',
      needHelp: 'Hulp Nodig?',
    community: 'Onze community',
      contactEmail: 'E-mail',
      available: 'Beschikbaar',
      businessHours: '9-18 uur (Chinese tijd)',
      actions: 'Snelle Acties',
      newRequest: 'Nieuwe Aanvraag Indienen',
      viewServices: 'Bekijk Onze Services',
      subscribeUpdates: 'Abonneer op Updates',
      websites: 'Onze Websites',
      thankYouTitle: 'Dank u voor uw vertrouwen!',
      thankYouMessage: 'Uw verzoek wordt met de grootste zorg behandeld door onze internationale transportexperts.',
      shipment: 'zending',
      shipments: 'zendingen',
      // Step 4 translations
      step4Title: 'Wat verzendt u?',
      managingShipments: 'Beheer van {count} Zending{plural}',
      configureShipments: 'Configureer elke zending afzonderlijk of voeg meerdere zendingen toe voor complexe bestellingen',
      addShipment: 'Zending Toevoegen',
      validating: 'Valideren...',
      active: 'Actief',
      shipmentsCount: 'Zendingen ({count})',
      addNewShipment: 'Nieuwe Zending Toevoegen',
      duplicateShipment: 'Deze Zending Dupliceren',
      removeShipment: 'Deze Zending Verwijderen',
      consolidatedSummary: 'Geconsolideerde Samenvatting',
      totalVolume: 'Totaal Volume',
      totalWeight: 'Totaal Gewicht',
      totalShipments: 'Zendingen',
      totalContainers: 'Containers',
      chooseShippingType: 'Kies uw verzendtype',
      shipmentXofY: 'Zending {current} van {total}',
      selectPackagingMethod: 'Selecteer hoe uw goederen verpakt zijn voor verzending',
      forThisSpecificShipment: 'Voor deze specifieke zending',
      looseCargo: 'Losse Vracht',
      looseCargoDesc: 'Pallets, dozen of individuele items',
      fullContainer: 'Volledige Container',
      fullContainerDesc: 'Volledige container (FCL)',
      imNotSure: 'Ik ben niet zeker',
      teamWillHelp: 'Ons team helpt u de beste optie te kiezen',
      looseCargoFeedback: 'Perfect voor gemengde goederen, kleine tot middelgrote hoeveelheden, of wanneer u flexibele verpakking nodig heeft',
      containerFeedback: 'Uitstekende keuze voor grote volumes, complete productlijnen, of wanneer u genoeg goederen heeft om een container te vullen',
      unsureFeedback: 'Geen zorgen! Ons ervaren team begeleidt u door het proces en beveelt de beste verzendoplossing aan voor uw specifieke behoeften. Wij zorgen voor alle technische details.',
      whatHappensNext: 'Wat gebeurt er hierna:',
      expertsContact: 'Onze verzendexperts nemen binnen 24 uur contact met u op',
      discussRequirements: 'We bespreken uw vrachtdetails en vereisten',
      personalizedRecommendations: 'U ontvangt gepersonaliseerde aanbevelingen en prijzen',

      describeLooseCargo: 'Beschrijf uw losse vracht',
      configureContainer: 'Configureer uw container',
      provideDimensionsWeight: 'Geef afmetingen en gewichtdetails voor nauwkeurige prijsstelling',
      selectContainerType: 'Selecteer containertype en hoeveelheid voor uw zending',
      calculateByUnit: 'Berekenen per eenheidstype',
      calculateByTotal: 'Berekenen per totale zending',
      packageType: 'Pakkettype',
      pallets: 'Pallets',
      boxesCrates: 'Dozen/Kisten',
      numberOfUnits: 'Aantal eenheden',
      palletType: 'Pallettype',
      nonSpecified: 'Niet gespecificeerd',
      euroPallet: 'Europallet (120x80 cm)',
      standardPallet: 'Standaard pallet (120x100 cm)',
      customSize: 'Aangepaste grootte',
      dimensionsPerUnit: 'Afmetingen (L×B×H per eenheid)',
      weightPerUnit: 'Gewicht (Per eenheid)',
      required: 'Vereist',
      containerInfoBanner: 'Selecteer het containertype en de hoeveelheid die het beste past bij uw vrachtvolume.',
      unitInfoBanner: 'Geef details over elk individueel item of pallet voor nauwkeurige berekening.',
      totalInfoBanner: 'Het verstrekken van totale zendingsnummers kan minder nauwkeurig zijn. Onnauwkeurige of oversized afmetingen kunnen resulteren in extra kosten.',
      totalDescription: 'Voer de totale afmetingen en het gewicht van uw zending in.',
      containerType: 'Containertype',
      numberOfContainers: 'Aantal containers',
      overweightContainer: 'Overgewicht container (>25 ton)',
      container20: "20' Standaard (33 CBM)",
      container40: "40' Standaard (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
  },
  ar: {
    emailHelp: 'سنرسل عرض السعر والتحديثات إلى هذا البريد الإلكتروني',
    // Header
    mainTitle: 'عرض أسعار الشحن من الصين',
    mainSubtitle: 'احصل على عرض أسعار سريع وموثوق لشحنتك من الصين',
    // Timeline steps
    timelineDestination: 'الوجهة',
    timelineMode: 'الطريقة',
    timelineOrigin: 'المنشأ',
    timelineCargo: 'البضائع',
    timelineGoodsDetails: 'تفاصيل البضائع',
    timelineContact: 'التواصل',
    // Navigation
    stepCounter: 'خطوة',
    next: 'التالي',
    previous: 'السابق',
    trustBadge: 'موثوق من قبل 55,000+ مستورد | الرد خلال 24 ساعة | 100% مجاني',
    // Common
    searchCountry: 'البحث عن دولة...',
    noCountryResults: 'لم يتم العثور على دول. جرب بحثاً آخر.',
    mostUsed: 'الأكثر استخداماً',
    // Step 1 translations
    step1Title: 'إلى أين تشحن؟',
    destinationCity: 'مدينة الوجهة',
    destinationZipCode: 'الرمز البريدي للوجهة',
    clearCountry: 'مسح الدولة المحددة',
    clearPort: 'مسح الميناء المحدد',
    // Location types
    factoryWarehouse: 'مصنع/مستودع',
    portAirport: 'ميناء/مطار',
    port: 'ميناء',
    airport: 'مطار', 
    railTerminal: 'محطة السكك الحديدية',
    seaPort: 'ميناء بحري',
    volume: 'الحجم',
    businessAddress: 'عنوان العمل',
    residentialAddress: 'عنوان سكني',
    chooseLocationDescription: 'اختر موقع الاستلام',
    // Step 2 translations
    step2Title: 'طريقة الشحن المفضلة',
    seaFreight: 'النقل البحري',
    seaFreightDesc: 'اقتصادي، 30-45 يوماً',
    railFreight: 'النقل بالسكك الحديدية',
    railFreightDesc: 'فعال من حيث التكلفة، 15-25 يوماً',
    airFreight: 'النقل الجوي',
    airFreightDesc: 'سريع، 7-10 أيام',
    express: 'إكسبريس',
    expressDesc: 'الأسرع، 3-5 أيام',
    unsureShipping: 'لست متأكداً بعد',
    unsureShippingDesc: 'دع الخبراء يساعدونك',
    unsureShippingBenefits: 'إرشاد مهني',
    unsureShippingFeedback: 'خيار ممتاز! سنوصي بأفضل خيار شحن لاحتياجاتك المحددة',
    beginnerSectionTitle: 'للمبتدئين',
    beginnerSectionDesc: 'دع خبراؤنا ينصحونك مجاناً',
    separatorText: 'أو اختر بنفسك',
    unsureAboutChoice: 'غير متأكد من اختيارك؟',
    // Step 2 Enhanced
    chooseShippingMethod: 'قارن الخيارات المتاحة',
    shippingMethodDescription: 'تقدم أنماط الشحن المختلفة مقايضات متنوعة بين التكلفة والسرعة والموثوقية.',
    railAvailableForDestination: 'النقل بالسكك الحديدية متوفر لوجهتك.',
    seaFreightBenefits: 'الأفضل للشحنات الكبيرة والثقيلة',
    railFreightBenefits: 'خيار صديق للبيئة',
    airFreightBenefits: 'مثالي للشحنات العاجلة',
    expressBenefits: 'خدمة من الباب إلى الباب',
    seaFeedback: 'خيار ممتاز للشحن الاقتصادي للحجوم الكبيرة',
    railFeedback: 'توازن ممتاز بين التكلفة والسرعة مع فوائد بيئية',
    airFeedback: 'مثالي للبضائع الحساسة للوقت أو عالية القيمة',
    expressFeedback: 'الأفضل للشحنات العاجلة الصغيرة إلى المتوسطة مع التتبع الكامل',
    // Beginner-friendly enhancements
    businessDescription: 'عنوان الشركة، مبنى مكاتب',
    residentialDescription: 'منزل، شقة، عنوان شخصي',
    factoryDescription: 'مصنع، مركز توزيع، مستودع',
    portDescription: 'مباشرة إلى الميناء/المطار',
    helpChooseLocation: 'غير متأكد؟ اختر الأعمال/المكتب للشحنات المهنية أو السكني للتوصيل الشخصي',
    startTyping: 'ابدأ الكتابة للبحث...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'اختر بلد الوجهة',
    searchCountryDescription: 'ابحث عن البلد الذي تريد شحن بضائعك إليه',
    addressTypeQuestion: 'ما نوع العنوان الذي هو وجهتك؟',
    selectDestinationLocationType: 'يرجى اختيار نوع موقع الوجهة',
    selectDestinationPort: 'اختر ميناء الوجهة',
    selectDestinationPortDescription: 'اختر الميناء أو المطار المحدد للتسليم',
    searchPortsIn: 'البحث عن الموانئ في',
    searchDestinationPorts: 'البحث عن موانئ الوجهة',
    enterDestinationDetails: 'أدخل تفاصيل الوجهة',
    // رسائل التحقق
    validationShippingType: 'يرجى اختيار نوع الشحن',
    validationPackageType: 'يرجى اختيار نوع التعبئة',
    validationDimensionsNonSpecified: 'يرجى إدخال جميع الأبعاد (ط، ع، ا) للطبقة غير المحددة',
    validationPalletHeight: 'يرجى إدخال ارتفاع الطبقة',
    validationBoxDimensions: 'يرجى إدخال أبعاد الصناديق/الصناديق الخشبية',
    validationWeightPerUnit: 'يرجى إدخال الوزن لكل وحدة',
    validationTotalVolume: 'يرجى إدخال الحجم الإجمالي',
    validationTotalWeight: 'يرجى إدخال الوزن الإجمالي',
    validationContainerType: 'يرجى اختيار نوع الحاوية',
    validationDestinationCountry: 'يرجى اختيار بلد الوجهة',
    validationDestinationLocationType: 'يرجى اختيار نوع موقع الوجهة',
    validationDestinationCity: 'يرجى إدخال مدينة الوجهة',
    validationDestinationZip: 'يرجى إدخال الرمز البريدي للوجهة',
    validationShippingMode: 'يرجى اختيار وضع الشحن',
    validationPickupLocationType: 'يرجى اختيار نوع موقع الاستلام',
    validationOriginPort: 'يرجى اختيار المنشأ',
    validationPickupCity: 'يرجى إدخال مدينة الاستلام',
    validationPickupZip: 'يرجى إدخال الرمز البريدي للاستلام',
    validationGoodsValue: 'يرجى إدخال قيمة البضائع',
    validationReadyDate: 'يرجى اختيار متى ستكون بضائعك جاهزة',
    validationShipperType: 'يرجى اختيار ما إذا كنت فردًا أم شركة',
    validationFirstName: 'يرجى إدخال اسمك الأول',
    validationLastName: 'يرجى إدخال اسم العائلة',
    validationCompanyName: 'يرجى إدخال اسم شركتك',
    validationShipperRole: 'يرجى اختيار نوع الشاحن الخاص بك',
    validationEmail: 'يرجى تقديم عنوان بريد إلكتروني صحيح',
    noCommitmentRequired: 'لا يلزم أي التزام - فقط إرشادات الخبراء!',
    cityPostalDescription: 'قدم المدينة والرمز البريدي للشحن الدقيق',
    popular: 'شائع',
    otherCountries: 'بلدان أخرى',
    // Step 3 translations
    step3Title: 'اختر موقع الاستلام في الصين',
    selectPickupLocationType: 'اختر نوع موقع الاستلام',
    pickupLocationDescription: 'اختر أين يجب أن نجمع بضائعك في الصين',
    enterPickupDetails: 'أدخل تفاصيل الاستلام',
    pickupCityPostalDescription: 'قدم مدينة والرمز البريدي للاستلام في الصين',
    searchPortTerminal: 'البحث عن ميناء/محطة/مطار...',
    selectPortTerminal: 'اختر ميناء/محطة/مطار الاستلام',
    portTerminalDescription: 'اختر الميناء أو المحطة أو المطار المحدد للاستلام',
    pickupCity: 'مدينة الاستلام',
    pickupZipCode: 'الرمز البريدي للاستلام',
    dontKnowPort: 'لا أعرف',
    dontKnowPortDescription: 'لست متأكداً من الميناء/المحطة التي يجب اختيارها',
    dontKnowPortFeedback: 'لا مشكلة! سنساعدك في اختيار أفضل ميناء/محطة لشحنتك.',
    perfectPortFeedback: 'ممتاز! سنقوم بالتحصيل من',
    cityPickupFeedback: 'رائع! سنرتب الاستلام من {city}، الصين',
    annualVolume: 'الحجم السنوي',
    // Port translations
    ports: {
      'SHA': 'شانغهاي',
      'SZX': 'شنتشن',
      'NGB': 'نينغبو-تشوشان',
      'GZH': 'قوانغتشو',
      'QIN': 'تشينغداو',
      'TJN': 'تيانجين',
      'XMN': 'شيامن',
      'DLN': 'داليان',
      'YTN': 'يانتيان',
      'LYG': 'ليانيونغانغ',
      'PEK': 'مطار بكين العاصمة',
      'PVG': 'مطار شانغهاي بودونغ',
      'CAN': 'مطار قوانغتشو بايون',
      'CTU': 'مطار تشنغدو شوانغليو',
      'KMG': 'مطار كونمينغ تشانغشوي',
      'XIY': 'مطار شيان شيانيانغ',
      'HGH': 'مطار هانغتشو شياوشان',
      'NKG': 'مطار نانجينغ لوكو',
      'ZIH': 'محطة قطار تشنغتشو',
      'CQN': 'محطة قطار تشونغتشينغ',
      'WUH': 'محطة قطار ووهان',
      'CDU': 'محطة قطار تشنغدو',
      // Cameroon ports
      'CMDLA': 'ميناء دوالا',
      'CMDLA_AIR': 'مطار دوالا',
      'CMNSM': 'مطار ياوندي'
    },
    // Region translations
    regions: {
      'East China': 'شرق الصين',
      'South China': 'جنوب الصين',
      'North China': 'شمال الصين',
      'West China': 'غرب الصين',
      'Southwest China': 'جنوب غرب الصين',
      'Northwest China': 'شمال غرب الصين',
      'Central China': 'وسط الصين'
    },
    // Dynamic translations by mode
    searchPort: 'البحث عن ميناء...',
    searchAirport: 'البحث عن مطار...',
    searchRailTerminal: 'البحث عن محطة سكك حديدية...',
    selectPort: 'اختر ميناء الاستلام',
    selectAirport: 'اختر مطار الاستلام', 
    selectRailTerminal: 'اختر محطة السكك الحديدية للاستلام',
    portDescriptionDynamic: 'اختر الميناء المحدد للاستلام',
    airportDescriptionDynamic: 'اختر المطار المحدد للاستلام',
    railTerminalDescriptionDynamic: 'اختر محطة السكك الحديدية المحددة للاستلام',
    // Step 5 translations
    step5Title: 'أخبرنا عن بضائعك',
    goodsValueDeclaration: 'قيمة البضائع والإقرار',
    goodsValueDescription: 'قدم القيمة التجارية للإقرار الجمركي وأغراض التأمين',
    commercialValue: 'القيمة التجارية للبضائع',
    goodsValueHelp: 'هذه القيمة تُستخدم للإقرار الجمركي وحسابات التأمين',
    personalOrHazardous: 'مواد شخصية أو تحتوي على مواد خطرة/مقيدة',
    personalHazardousHelp: 'حدد هذا إذا كنت تشحن أشياء شخصية أو بضائع تتطلب معالجة خاصة',
    shipmentReadiness: 'جاهزية الشحنة',
    shipmentTimingDescription: 'ساعدنا في تخطيط الجدول الزمني لشحنتك وتقديم أسعار دقيقة',
    goodsReadyQuestion: 'متى ستكون بضائعك جاهزة للاستلام؟',
    readyNow: '✅ جاهز الآن - البضائع متاحة للاستلام الفوري',
    readyIn1Week: '📅 خلال أسبوع واحد - نقوم بالتجهيز حالياً',
    readyIn2Weeks: '📅 خلال أسبوعين - الإنتاج قيد التقدم',
    readyIn1Month: '📅 خلال شهر واحد - التخطيط المسبق',
    dateNotSet: '❓ التاريخ لم يُحدد بعد',
    timingHelp: 'التوقيت الدقيق يساعدنا في تقديم أكثر الأسعار تنافسية',
    additionalDetails: 'تفاصيل إضافية (اختياري)',
    additionalDetailsDescription: 'قدم أي متطلبات خاصة أو معلومات إضافية',
    goodsDescription: 'وصف مختصر للبضائع (اختياري)',
    goodsDescriptionPlaceholder: 'مثال: إلكترونيات، أثاث، ملابس، آلات...',
    goodsDescriptionHelp: 'يساعدنا على ضمان المعالجة والتوثيق الصحيحين',
    specialRequirements: 'متطلبات المعالجة الخاصة (اختياري)',
    noSpecialRequirements: 'لا توجد متطلبات خاصة',
    fragileGoods: '🔸 بضائع قابلة للكسر - التعامل بحذر',
    temperatureControlled: '🌡️ مُتحكم في درجة الحرارة',
    urgentTimeSensitive: '⚡ عاجل/حساس للوقت',
    highValueInsurance: '🛡️ تأمين عالي القيمة مطلوب',
    otherSpecify: '📝 أخرى (يرجى التحديد في الملاحظات)',
    rateValidityNotice: 'إشعار صلاحية الأسعار:',
    rateValidityText: 'الأسعار المُقدمة صالحة حتى تاريخ انتهاء الصلاحية المُبين في كل عرض أسعار. إذا لم تكن بضائعك جاهزة للاستلام بحلول هذا التاريخ، فقد تخضع الأسعار للتغيير بناءً على ظروف السوق الحالية.',
    selectOption: 'اختر خياراً',
    // New statistics section
    impactInNumbers: 'تأثيرنا بالأرقام',
    impactDescription: 'تقديم التميز في الصين مع نتائج مثبتة وخدمة موثوقة',
    satisfiedCustomers: 'عملاء راضون',
    customerSatisfaction: 'رضا العملاء',
    teamMembers: 'أعضاء الفريق',
    oceanVolume: 'حجم الشحن البحري TEU',
          officesInChina: 'مكاتب في الصين',
      cfsFacilities: 'مرافق CFS بالمتر المربع',
    // Additional system messages
    errorSubmission: 'حدث خطأ أثناء إرسال عرض الأسعار الخاص بك. يرجى المحاولة مرة أخرى.',
    noTestLeads: 'لا توجد عملاء محتملون تجريبيون محملون في الوقت الحالي.',
    pleaseSpecifyInRemarks: 'يرجى التحديد في الملاحظات',
    // Step 6 translations
    step6Title: 'تفاصيل الاتصال',
    personalInformation: 'المعلومات الشخصية',
    personalInfoDescription: 'أخبرنا من أنت',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'أدخل اسمك الأول',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'أدخل اسم عائلتك',
    businessInformation: 'معلومات الشركة',
    businessInfoDescription: 'أخبرنا عن شركتك',
    companyName: 'اسم الشركة',
    companyNamePlaceholder: 'أدخل اسم شركتك',
    shippingExperience: 'خبرة الشحن',
    selectExperience: 'اختر مستوى خبرتك',
    firstTimeShipper: 'أول شحنة',
    upTo10Times: 'شحنات عرضية',
    moreThan10Times: 'خبرة مؤكدة',
    regularShipper: 'شحنات منتظمة',
    contactInformation: 'معلومات الاتصال',
    contactInfoDescription: 'كيف يمكننا الوصول إليك؟',
    emailAddress: 'عنوان البريد الإلكتروني',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    phonePlaceholder: 'أدخل رقم هاتفك',
    phoneHelp: 'للتحديثات العاجلة والتوضيحات',
    additionalNotes: 'ملاحظات إضافية',
    additionalNotesDescription: 'هل هناك شيء آخر يجب أن نعرفه؟',
    remarks: 'ملاحظات خاصة',
    remarksPlaceholder: 'تعليمات خاصة أو متطلبات أو أسئلة...',
    remarksHelp: 'ساعدنا في خدمتك بشكل أفضل بسياق إضافي',
    readyToSubmit: 'جاهز للحصول على عرض السعر!',
    submitDescription: 'انقر على "احصل على عرض السعر" أدناه لإرسال طلبك. سنرد خلال 24 ساعة.',
    getMyQuote: 'احصل على عرض السعر',
    securityBadge: 'آمن ومتوافق مع GDPR',
    // Customer type selection
    customerTypeQuestion: 'هل تشحن كفرد أم لشركة؟',
    customerTypeDescription: 'هذا يساعدنا في توفير حقول المعلومات الأكثر صلة',
    individualCustomer: 'فرد',
    individualDescription: 'شحنة شخصية أو عميل خاص',
    companyCustomer: 'شركة',
    companyDescription: 'شحنة تجارية أو كيان تجاري',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'تأكيد الطلب',
      confirmationTitle: 'تأكيد طلب عرض السعر',
      confirmationSubtitle: 'تم إرسال طلبكم بنجاح',
      referenceNumber: 'رقم المرجع',
      yourRequest: 'ملخص طلبكم',
      shipmentDetails: 'تفاصيل الشحنة',
      fromTo: 'من {origin} إلى {destination}',
      mode: 'طريقة النقل',
      contactDetails: 'تفاصيل الاتصال',
      nextSteps: 'الخطوات التالية',
      step1: 'تم استلام الطلب',
      step1Time: 'الآن',
      step2: 'التحليل وعرض السعر',
      step2Time: 'خلال 4 ساعات عمل',
      step3: 'التواصل التجاري',
      step3Time: 'خلال 24 ساعة',
      step4: 'عرض السعر المفصل',
      step4Time: 'خلال 48 ساعة',
      aboutSino: 'حول SINO Shipping & FS International',
      aboutSubtitle: 'يتم التعامل مع طلبكم من قبل خبراء',
      sinoDescription: 'تأسست SINO Shipping في عام 2018 من قبل رواد أعمال فرنسيين وأصبحت جزءاً من FS International في عام 2021. هذا التعاون يجمع بين النهج الغربي المتمحور حول العميل والخبرة الصينية المحلية العميقة.',
      fsDescription: 'تأسست FS International في سبتمبر 1989 في هونغ كونغ، وهي واحدة من أكثر العلامات التجارية الموثوقة للخدمات اللوجستية والنقل العالمي في المنطقة.',
      ourExpertise: 'خبرتنا',
      expertise1: 'الشحن البحري والجوي من جميع الموانئ الصينية الرئيسية',
      expertise2: 'النقل بالسكك الحديدية إلى أوروبا وروسيا',
      expertise3: 'النقل متعدد الوسائط والتوصيل للميل الأخير',
      expertise4: 'التخليص الجمركي والاستشارات القانونية',
      keyNumbers: 'تأثيرنا بالأرقام',
      keyNumbersSubtitle: 'نتائج مثبتة وخدمة موثوقة في الصين',
      number1: '15,000+ مستخدم نشط',
      number2: '1,000+ عرض سعر شهرياً',
      number3: '98% رضا العملاء',
      number4: '100+ عضو في الفريق',
      globalNetwork: 'الشبكة العالمية',
      networkDescription: 'مع مكاتب استراتيجية في الصين وهونغ كونغ، نحن في موقع مثالي للتعامل مع شحناتكم بكفاءة.',
      chinaOffices: 'مكاتب الصين: شنتشن، شنغهاي، تشينغداو، نينغبو',
      hkOffice: 'المكتب الرئيسي في هونغ كونغ: تسيم شا تسوي',
      needHelp: 'تحتاجون مساعدة؟',
    community: 'مجتمعنا',
      contactEmail: 'البريد الإلكتروني',
      businessHours: '9 صباحاً - 6 مساءً (توقيت الصين)',
      actions: 'إجراءات سريعة',
      newRequest: 'تقديم طلب جديد',
      viewServices: 'عرض خدماتنا',
      subscribeUpdates: 'الاشتراك في التحديثات',
      websites: 'مواقعنا الإلكترونية',
      thankYouTitle: 'شكراً لثقتكم!',
      thankYouMessage: 'سيتم التعامل مع طلبكم بأقصى درجات العناية من قبل خبراء النقل الدولي لدينا.',
      shipment: 'شحنة',
      shipments: 'شحنات',
      // Step 4 translations
      step4Title: 'ماذا تشحن؟',
      managingShipments: 'إدارة {count} شحنة{plural}',
      configureShipments: 'قم بتكوين كل شحنة بشكل فردي أو أضف عدة شحنات للطلبات المعقدة',
      addShipment: 'إضافة شحنة',
      validating: 'التحقق...',
      active: 'نشط',
      shipmentsCount: 'الشحنات ({count})',
      addNewShipment: 'إضافة شحنة جديدة',
      duplicateShipment: 'تكرار هذه الشحنة',
      removeShipment: 'إزالة هذه الشحنة',
      consolidatedSummary: 'ملخص مجمع',
      totalVolume: 'الحجم الإجمالي',
      totalWeight: 'الوزن الإجمالي',
      totalShipments: 'الشحنات',
      totalContainers: 'الحاويات',
      chooseShippingType: 'اختر نوع الشحن الخاص بك',
      shipmentXofY: 'شحنة {current} من {total}',
      selectPackagingMethod: 'اختر كيفية تعبئة بضائعك للشحن',
      forThisSpecificShipment: 'لهذه الشحنة المحددة',
      looseCargo: 'بضائع سائبة',
      looseCargoDesc: 'منصات أو صناديق أو عناصر فردية',
      fullContainer: 'حاوية كاملة',
      fullContainerDesc: 'حاوية كاملة (FCL)',
      imNotSure: 'لست متأكداً',
      teamWillHelp: 'سيساعدك فريقنا في اختيار الخيار الأفضل',
      unsureFeedback: 'لا تقلق! سيرشدك فريقنا ذو الخبرة خلال العملية ويوصي بأفضل حل نقل لاحتياجاتك المحددة. سنتولى جميع التفاصيل التقنية.',
      whatHappensNext: 'ما سيحدث بعد ذلك:',
      expertsContact: 'سيتواصل معك خبراء النقل لدينا خلال 24 ساعة',
      discussRequirements: 'سنناقش تفاصيل بضائعك ومتطلباتك',
      personalizedRecommendations: 'ستحصل على توصيات وأسعار مخصصة',
      describeLooseCargo: 'صف بضائعك السائبة',
      configureContainer: 'اكوّن حاويتك',
      provideDimensionsWeight: 'قدم تفاصيل الأبعاد والوزن للحصول على تسعير دقيق',
      selectContainerType: 'اختر نوع الحاوية والكمية لشحنتك',
      calculateByUnit: 'حساب حسب نوع الوحدة',
      calculateByTotal: 'حساب حسب إجمالي الشحنة',
      packageType: 'نوع التعبئة',
      pallets: 'منصات',
      boxesCrates: 'صناديق/صناديق خشبية',
      numberOfUnits: 'عدد الوحدات',
      palletType: 'نوع المنصة',
      nonSpecified: 'غير محدد',
      euroPallet: 'منصة أوروبية (120×80 سم)',
      standardPallet: 'منصة قياسية (120×100 سم)',
      customSize: 'حجم مخصص',
      dimensionsPerUnit: 'الأبعاد (لكل وحدة الطول×العرض×الارتفاع)',
      weightPerUnit: 'الوزن (لكل وحدة)',
      required: 'مطلوب',
      containerInfoBanner: 'اختر نوع الحاوية والكمية الأنسب لحجم بضائعك.',
      unitInfoBanner: 'قدم تفاصيل دقيقة لكل عنصر فردي أو منصة للحصول على حساب دقيق.',
      totalInfoBanner: 'قد يكون تقديم أرقام الشحنة الإجمالية أقل دقة. قد تؤدي الأبعاد غير الدقيقة أو كبيرة الحجم إلى تكاليف إضافية.',
      totalDescription: 'أدخل الأبعاد والوزن الإجمالي لشحنتك.',
      containerType: 'نوع الحاوية',
      numberOfContainers: 'عدد الحاويات',
      overweightContainer: 'حاوية زائدة الوزن (>25 طن)',
      container20: "20' قياسية (33 متر مكعب)",
      container40: "40' قياسية (67 متر مكعب)",
      container40HC: "40' عالية المكعب (76 متر مكعب)",
      container45HC: "45' عالية المكعب (86 متر مكعب)",
      // Additional shipment summary translations
      shipmentTitle: 'شحنة',
      setupPending: 'الإعداد معلق...',
      addAnotherShipment: 'إضافة شحنة أخرى',
      items: 'عناصر',
      each: 'كل',
      totalCalculation: 'الحساب الإجمالي',
      overweight: 'زائد الوزن',
  },
  pt: {
    // Header
    mainTitle: 'Cotação de Frete da China',
    mainSubtitle: 'Obtenha uma cotação rápida e confiável para seu frete da China',
    // Timeline steps
    timelineDestination: 'Destino',
    timelineMode: 'Modo',
    timelineOrigin: 'Origem',
    timelineCargo: 'Carga',
    timelineGoodsDetails: 'Detalhes das Mercadorias',
    timelineContact: 'Contato',
    // Navigation
    stepCounter: 'Passo',
    next: 'Próximo',
    previous: 'Anterior',
    trustBadge: 'Confiado por 55.000+ importadores | Resposta < 24h | 100% Grátis',
    // Common
    searchCountry: 'Pesquisar um país...',
    noCountryResults: 'Nenhum país encontrado. Tente uma pesquisa diferente.',
    mostUsed: 'Mais usados',
    // Step 1 translations
    step1Title: 'Para onde você envia?',
    destinationCity: 'Cidade de destino',
    destinationZipCode: 'CEP de destino',
    clearCountry: 'Limpar país selecionado',
    clearPort: 'Limpar porto selecionado',
    // Location types
    factoryWarehouse: 'Fábrica/Armazém',
    portAirport: 'Porto/Aeroporto',
    port: 'Porto',
    airport: 'Aeroporto', 
    railTerminal: 'Terminal ferroviário',
    seaPort: 'Porto marítimo',
    volume: 'Volume',
    businessAddress: 'Endereço comercial',
    residentialAddress: 'Endereço residencial',
    chooseLocationDescription: 'Escolha seu local de coleta',
    // Step 2 translations
    step2Title: 'Modo de frete preferido',
    seaFreight: 'Frete Marítimo',
    seaFreightDesc: 'Econômico, 30-45 dias',
    railFreight: 'Frete Ferroviário',
    railFreightDesc: 'Custo-efetivo, 15-25 dias',
    airFreight: 'Frete Aéreo',
    airFreightDesc: 'Rápido, 7-10 dias',
    express: 'Express',
    expressDesc: 'Mais rápido, 3-5 dias',
    unsureShipping: 'Ainda não tenho certeza',
    unsureShippingDesc: 'Deixe os especialistas ajudarem',
    unsureShippingBenefits: 'Orientação profissional',
    unsureShippingFeedback: 'Excelente escolha! Recomendaremos a melhor opção de frete para suas necessidades específicas',
    beginnerSectionTitle: 'Para iniciantes',
    beginnerSectionDesc: 'Deixe nossos especialistas aconselhá-lo gratuitamente',
    separatorText: 'Ou escolha você mesmo',
    unsureAboutChoice: 'Não tem certeza da sua escolha?',
    // Step 2 Enhanced
    chooseShippingMethod: 'Compare as opções disponíveis',
    shippingMethodDescription: 'Diferentes modos de frete oferecem várias compensações entre custo, velocidade e confiabilidade.',
    railAvailableForDestination: 'Frete ferroviário está disponível para seu destino.',
    seaFreightBenefits: 'Ideal para remessas grandes e pesadas',
    railFreightBenefits: 'Opção ecológica',
    airFreightBenefits: 'Ideal para remessas urgentes',
    expressBenefits: 'Serviço porta a porta',
    seaFeedback: 'Ótima escolha para frete econômico de grandes volumes',
    railFeedback: 'Excelente equilíbrio entre custo e velocidade com benefícios ambientais',
    airFeedback: 'Perfeito para carga sensível ao tempo ou de alto valor',
    expressFeedback: 'Ideal para remessas urgentes pequenas a médias com rastreamento completo',
    // Beginner-friendly enhancements
    businessDescription: 'Endereço comercial, prédio de escritórios',
    residentialDescription: 'Casa, apartamento, endereço pessoal',
    factoryDescription: 'Fábrica, centro de distribuição, armazém',
    portDescription: 'Direto ao porto/aeroporto',
    helpChooseLocation: 'Não tem certeza? Escolha Empresa/Escritório para remessas profissionais ou Residencial para entregas pessoais',
    startTyping: 'Comece a digitar para pesquisar...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Selecione seu país de destino',
    searchCountryDescription: 'Procure o país para onde deseja enviar suas mercadorias',
    addressTypeQuestion: 'Que tipo de endereço é seu destino?',
    selectDestinationLocationType: 'Por favor, selecione um tipo de localização de destino',
    selectDestinationPort: 'Selecionar porto de destino',
    selectDestinationPortDescription: 'Escolha o porto ou aeroporto específico para entrega',
    searchPortsIn: 'Pesquisar portos em',
    searchDestinationPorts: 'Pesquisar portos de destino',
    enterDestinationDetails: 'Digite detalhes do destino',
    // Mensagens de validação
    validationShippingType: 'Por favor, selecione um tipo de envio',
    validationPackageType: 'Por favor, selecione um tipo de embalagem',
    validationDimensionsNonSpecified: 'Por favor, insira todas as dimensões (C, L, A) para o pallet não especificado',
    validationPalletHeight: 'Por favor, insira a altura do pallet',
    validationBoxDimensions: 'Por favor, insira as dimensões das caixas/engradados',
    validationWeightPerUnit: 'Por favor, insira o peso por unidade',
    validationTotalVolume: 'Por favor, insira o volume total',
    validationTotalWeight: 'Por favor, insira o peso total',
    validationContainerType: 'Por favor, selecione um tipo de contêiner',
    validationDestinationCountry: 'Por favor, selecione um país de destino',
    validationDestinationLocationType: 'Por favor, selecione um tipo de localização de destino',
    validationDestinationCity: 'Por favor, insira uma cidade de destino',
    validationDestinationZip: 'Por favor, insira um código postal de destino',
    validationShippingMode: 'Por favor, selecione um modo de envio',
    validationPickupLocationType: 'Por favor, selecione um tipo de localização de coleta',
    validationOriginPort: 'Por favor, selecione uma origem',
    validationPickupCity: 'Por favor, insira uma cidade de coleta',
    validationPickupZip: 'Por favor, insira um código postal de coleta',
    validationGoodsValue: 'Por favor, insira o valor dos bens',
    validationReadyDate: 'Por favor, selecione quando seus bens estarão prontos',
    validationShipperType: 'Por favor, selecione se você é um indivíduo ou empresa',
    validationFirstName: 'Por favor, insira seu primeiro nome',
    validationLastName: 'Por favor, insira seu sobrenome',
    validationCompanyName: 'Por favor, insira o nome da sua empresa',
    validationShipperRole: 'Por favor, selecione seu tipo de remetente',
    validationEmail: 'Por favor, forneça um endereço de email válido',
    noCommitmentRequired: 'Nenhum compromisso necessário - apenas orientação especializada!',
    cityPostalDescription: 'Forneça cidade e código postal para envio preciso',
    popular: 'Popular',
    otherCountries: 'Outros países',
    // Step 3 translations
    step3Title: 'Selecionar local de coleta na China',
    selectPickupLocationType: 'Selecione seu tipo de local de coleta',
    pickupLocationDescription: 'Escolha onde devemos coletar suas mercadorias na China',
    enterPickupDetails: 'Digite detalhes de coleta',
    pickupCityPostalDescription: 'Forneça a cidade e código postal de coleta na China',
    searchPortTerminal: 'Buscar porto/terminal/aeroporto...',
    selectPortTerminal: 'Selecionar porto/terminal/aeroporto de coleta',
    portTerminalDescription: 'Escolha o porto, terminal ou aeroporto específico para coleta',
    pickupCity: 'Cidade de coleta',
    pickupZipCode: 'Código postal de coleta',
    dontKnowPort: 'Não sei',
    dontKnowPortDescription: 'Não tenho certeza de qual porto/terminal escolher',
    dontKnowPortFeedback: 'Sem problema! Vamos ajudá-lo a escolher o melhor porto/terminal para seu frete.',
    perfectPortFeedback: 'Perfeito! Vamos coletar de',
    cityPickupFeedback: 'Perfeito! Vamos organizar a coleta de {city}, China',
    annualVolume: 'Volume anual',
    // Port translations
    ports: {
      'SHA': 'Shanghai',
      'SZX': 'Shenzhen',
      'NGB': 'Ningbo-Zhoushan',
      'GZH': 'Guangzhou',
      'QIN': 'Qingdao',
      'TJN': 'Tianjin',
      'XMN': 'Xiamen',
      'DLN': 'Dalian',
      'YTN': 'Yantian',
      'LYG': 'Lianyungang',
      'PEK': 'Aeroporto Capital de Pequim',
      'PVG': 'Aeroporto Pudong de Shanghai',
      'CAN': 'Aeroporto Baiyun de Guangzhou',
      'CTU': 'Aeroporto Shuangliu de Chengdu',
      'KMG': 'Aeroporto Changshui de Kunming',
      'XIY': 'Aeroporto Xianyang de Xi\'an',
      'HGH': 'Aeroporto Xiaoshan de Hangzhou',
      'NKG': 'Aeroporto Lukou de Nanjing',
      'ZIH': 'Terminal ferroviário de Zhengzhou',
      'CQN': 'Terminal ferroviário de Chongqing',
      'WUH': 'Terminal ferroviário de Wuhan',
      'CDU': 'Terminal ferroviário de Chengdu',
      // Cameroon ports
      'CMDLA': 'Porto de Douala',
      'CMDLA_AIR': 'Aeroporto de Douala',
      'CMNSM': 'Aeroporto de Yaoundé'
    },
    // Region translations
    regions: {
      'East China': 'Leste da China',
      'South China': 'Sul da China',
      'North China': 'Norte da China',
      'West China': 'Oeste da China',
      'Southwest China': 'Sudoeste da China',
      'Northwest China': 'Noroeste da China',
      'Central China': 'Centro da China'
    },
    // Dynamic translations by mode
    searchPort: 'Buscar porto...',
    searchAirport: 'Buscar aeroporto...',
    searchRailTerminal: 'Buscar terminal ferroviário...',
    selectPort: 'Selecionar porto de coleta',
    selectAirport: 'Selecionar aeroporto de coleta', 
    selectRailTerminal: 'Selecionar terminal ferroviário de coleta',
    portDescriptionDynamic: 'Escolha o porto específico para coleta',
    airportDescriptionDynamic: 'Escolha o aeroporto específico para coleta',
    railTerminalDescriptionDynamic: 'Escolha o terminal ferroviário específico para coleta',
    // Step 5 translations
    step5Title: 'Conte-nos sobre suas mercadorias',
    goodsValueDeclaration: 'Valor das Mercadorias & Declaração',
    goodsValueDescription: 'Forneça o valor comercial para declaração aduaneira e fins de seguro',
    commercialValue: 'Valor comercial das mercadorias',
    goodsValueHelp: 'Este valor é usado para declaração aduaneira e cálculos de seguro',
    personalOrHazardous: 'Efeitos pessoais ou contém materiais perigosos/restritos',
    personalHazardousHelp: 'Marque isso se estiver enviando pertences pessoais ou mercadorias que exigem manuseio especial',
    shipmentReadiness: 'Prontidão da Remessa',
    shipmentTimingDescription: 'Ajude-nos a planejar a cronologia da sua remessa e fornecer tarifas precisas',
    goodsReadyQuestion: 'Quando suas mercadorias estarão prontas para coleta?',
    readyNow: '✅ Pronto agora - mercadorias disponíveis para coleta imediata',
    readyIn1Week: '📅 Dentro de 1 semana - atualmente preparando',
    readyIn2Weeks: '📅 Dentro de 2 semanas - produção em andamento',
    readyIn1Month: '📅 Dentro de 1 mês - planejamento antecipado',
    dateNotSet: '❓ Data ainda não determinada',
    timingHelp: 'Cronometria precisa nos ajuda a fornecer as tarifas mais competitivas',
    additionalDetails: 'Detalhes Adicionais (Opcional)',
    additionalDetailsDescription: 'Forneça quaisquer requisitos especiais ou informações adicionais',
    goodsDescription: 'Breve descrição das mercadorias (opcional)',
    goodsDescriptionPlaceholder: 'ex. Eletrônicos, Móveis, Roupas, Máquinas...',
    goodsDescriptionHelp: 'Nos ajuda a garantir manuseio e documentação adequados',
    specialRequirements: 'Requisitos de manuseio especial (opcional)',
    noSpecialRequirements: 'Sem requisitos especiais',
    fragileGoods: '🔸 Mercadorias frágeis - manuseie com cuidado',
    temperatureControlled: '🌡️ Controlado por temperatura',
    urgentTimeSensitive: '⚡ Urgente/sensível ao tempo',
    highValueInsurance: '🛡️ Seguro de alto valor necessário',
    otherSpecify: '📝 Outro (favor especificar nos comentários)',
    rateValidityNotice: 'Aviso de Validade de Tarifas:',
    rateValidityText: 'As tarifas cotadas são válidas até a data de expiração mostrada em cada cotação. Se suas mercadorias não estiverem prontas para coleta até esta data, as tarifas podem estar sujeitas a alterações com base nas condições atuais do mercado.',
    selectOption: 'Selecionar uma opção',
    // New statistics section
    impactInNumbers: 'Nosso Impacto em Números',
    impactDescription: 'Entregando excelência na China com resultados comprovados e serviço confiável',
    satisfiedCustomers: 'Clientes Satisfeitos',
    customerSatisfaction: 'Satisfação do Cliente',
    teamMembers: 'Membros da Equipe',
    oceanVolume: 'Volume Marítimo TEU',
          officesInChina: 'Escritórios na China',
      cfsFacilities: 'M² Instalações CFS',
    // Additional system messages
    errorSubmission: 'Ocorreu um erro ao enviar sua cotação. Tente novamente.',
    noTestLeads: 'Nenhum lead de teste carregado no momento.',
    pleaseSpecifyInRemarks: 'por favor especifique nas observações',
    // Step 6 translations
    step6Title: 'Detalhes de contato',
    personalInformation: 'Informações Pessoais',
    personalInfoDescription: 'Nos conte quem você é',
    firstName: 'Nome',
    firstNamePlaceholder: 'Digite seu nome',
    lastName: 'Sobrenome',
    lastNamePlaceholder: 'Digite seu sobrenome',
    businessInformation: 'Informações da Empresa',
    businessInfoDescription: 'Nos conte sobre sua empresa',
    companyName: 'Nome da Empresa',
    companyNamePlaceholder: 'Digite o nome da sua empresa',
    shippingExperience: 'Experiência de Envio',
    selectExperience: 'Selecione seu nível de experiência',
    firstTimeShipper: 'Primeira remessa',
    upTo10Times: 'Remessas ocasionais',
    moreThan10Times: 'Experiência confirmada',
    regularShipper: 'Remessas regulares',
    contactInformation: 'Informações de Contato',
    contactInfoDescription: 'Como podemos entrar em contato com você?',
    emailAddress: 'Endereço de e-mail',
    emailPlaceholder: 'Digite seu endereço de email',
    emailHelp: 'Enviaremos sua cotação e atualizações para este email',
    phoneNumber: 'Número de Telefone',
    phonePlaceholder: 'Digite seu número de telefone',
    phoneHelp: 'Para atualizações urgentes e esclarecimentos',
    additionalNotes: 'Notas Adicionais',
    additionalNotesDescription: 'Há mais alguma coisa que devemos saber?',
    remarks: 'Observações Especiais',
    remarksPlaceholder: 'Instruções especiais, requisitos ou perguntas...',
    remarksHelp: 'Nos ajude a atendê-lo melhor com contexto adicional',
    readyToSubmit: 'Pronto para obter sua cotação!',
    submitDescription: 'Clique em "Obter Minha Cotação" abaixo para enviar sua solicitação. Responderemos em 24 horas.',
    securityBadge: 'Seguro e compatível com GDPR',
    // Customer type selection
    customerTypeQuestion: 'Você está enviando como indivíduo ou para uma empresa?',
    customerTypeDescription: 'Isso nos ajuda a fornecer os campos de informação mais relevantes',
    individualCustomer: 'Indivíduo',
    individualDescription: 'Envio pessoal ou cliente privado',
    companyCustomer: 'Empresa',
    companyDescription: 'Envio comercial ou entidade empresarial',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'Confirmação de Solicitação',
      confirmationTitle: 'Solicitação de Cotação Confirmada',
      confirmationSubtitle: 'Sua solicitação foi enviada com sucesso',
      referenceNumber: 'Número de Referência',
      yourRequest: 'Resumo da Sua Solicitação',
      shipmentDetails: 'Detalhes da Remessa',
      fromTo: 'De {origin} para {destination}',
      mode: 'Modalidade',
      contactDetails: 'Detalhes de Contato',
      nextSteps: 'Próximos Passos',
      step1: 'Solicitação recebida',
      step1Time: 'Agora',
      step2: 'Análise e cotação',
      step2Time: 'Em 4 horas úteis',
      step3: 'Contato comercial',
      step3Time: 'Em 24 horas',
      step4: 'Cotação detalhada',
      step4Time: 'Em 48 horas',
      aboutSino: 'Sobre a SINO Shipping & FS International',
      aboutSubtitle: 'Sua solicitação é tratada por especialistas',
      sinoDescription: 'A SINO Shipping foi fundada em 2018 por empreendedores franceses e tornou-se parte da FS International em 2021. Esta colaboração combina uma abordagem ocidental centrada no cliente com profunda expertise local chinesa.',
      fsDescription: 'A FS International foi fundada em setembro de 1989 em Hong Kong, sendo uma das marcas mais confiáveis para logística global e transporte na região.',
      ourExpertise: 'Nossa Expertise',
      expertise1: 'Frete marítimo e aéreo de todos os principais portos chineses',
      expertise2: 'Transporte ferroviário para Europa e Rússia',
      expertise3: 'Transporte multimodal e entrega última milha',
      expertise4: 'Desembaraço aduaneiro e consultoria de compliance',
      keyNumbers: 'Nosso Impacto em Números',
      keyNumbersSubtitle: 'Resultados comprovados e serviço confiável na China',
      number1: '15.000+ usuários ativos',
      number2: '1.000+ cotações por mês',
      number3: '98% satisfação do cliente',
      number4: '100+ membros da equipe',
      globalNetwork: 'Rede Global',
      networkDescription: 'Com escritórios estratégicos na China e Hong Kong, estamos idealmente posicionados para atender suas remessas com eficiência.',
      chinaOffices: 'Escritórios na China: Shenzhen, Shanghai, Qingdao, Ningbo',
      hkOffice: 'Sede em Hong Kong: Tsim Sha Tsui',
      needHelp: 'Precisa de Ajuda?',
    community: 'Nossa comunidade',
      contactEmail: 'E-mail',
      businessHours: '9h-18h (Horário da China)',
      actions: 'Ações Rápidas',
      newRequest: 'Enviar Nova Solicitação',
      viewServices: 'Ver Nossos Serviços',
      subscribeUpdates: 'Assinar Atualizações',
      websites: 'Nossos Sites',
      thankYouTitle: 'Obrigado pela sua confiança!',
      thankYouMessage: 'Sua solicitação será tratada com o máximo cuidado por nossos especialistas em transporte internacional.',
      shipment: 'remessa',
      shipments: 'remessas',
      // Step 4 translations
      step4Title: 'O que você está enviando?',
      managingShipments: 'Gerenciando {count} Remessa{plural}',
      configureShipments: 'Configure cada remessa individualmente ou adicione múltiplas remessas para pedidos complexos',
      addShipment: 'Adicionar Remessa',
      validating: 'Validando...',
      active: 'Ativo',
      shipmentsCount: 'Remessas ({count})',
      addNewShipment: 'Adicionar nova remessa',
      duplicateShipment: 'Duplicar esta remessa',
      removeShipment: 'Remover esta remessa',
      consolidatedSummary: 'Resumo Consolidado',
      totalVolume: 'Volume Total',
      totalWeight: 'Peso Total',
      totalShipments: 'Remessas',
      totalContainers: 'Contêineres',
      chooseShippingType: 'Escolha seu tipo de envio',
      shipmentXofY: 'Remessa {current} de {total}',
      selectPackagingMethod: 'Selecione como suas mercadorias são embaladas para envio',
      forThisSpecificShipment: 'para esta remessa específica',
      looseCargo: 'Carga Solta',
      looseCargoDesc: 'Paletes, caixas ou itens individuais',
      fullContainer: 'Contêiner Completo',
      fullContainerDesc: 'Contêiner completo (FCL)',
      imNotSure: 'Não tenho certeza',
      teamWillHelp: 'Nossa equipe ajudará você a escolher a melhor opção',
      unsureFeedback: 'Não se preocupe! Nossa equipe experiente o guiará através do processo e recomendará a melhor solução de transporte para suas necessidades específicas. Cuidaremos de todos os detalhes técnicos.',
      whatHappensNext: 'O que acontece a seguir:',
      expertsContact: 'Nossos especialistas em transporte entrarão em contato em 24 horas',
      discussRequirements: 'Discutiremos os detalhes e requisitos de suas mercadorias',
      personalizedRecommendations: 'Você receberá recomendações personalizadas e preços',
      describeLooseCargo: 'Descreva sua carga solta',
      configureContainer: 'Configure seu contêiner',
      provideDimensionsWeight: 'Forneça detalhes de dimensões e peso para preços precisos',
      selectContainerType: 'Selecione o tipo e quantidade de contêiner para seu frete',
      calculateByUnit: 'Calcular por tipo de unidade',
      calculateByTotal: 'Calcular por total do frete',
      packageType: 'Tipo de embalagem',
      pallets: 'Paletes',
      boxesCrates: 'Caixas/Engradados',
      numberOfUnits: 'Número de unidades',
      palletType: 'Tipo de palete',
      nonSpecified: 'Não especificado',
      euroPallet: 'Palete Europeu (120x80 cm)',
      standardPallet: 'Palete Padrão (120x100 cm)',
      customSize: 'Tamanho personalizado',
      dimensionsPerUnit: 'Dimensões (por unidade L×W×H)',
      weightPerUnit: 'Peso (por unidade)',
      required: 'Obrigatório',
      containerInfoBanner: 'Escolha o tipo e quantidade de contêiner mais adequados para o volume de suas mercadorias.',
      unitInfoBanner: 'Forneça detalhes precisos para cada item individual ou palete para cálculo preciso.',
      totalInfoBanner: 'Fornecer números totais de remessa pode ser menos preciso. Dimensões imprecisas ou grandes podem resultar em custos adicionais.',
      totalDescription: 'Digite as dimensões e peso total de sua remessa.',
      containerType: 'Tipo de contêiner',
      numberOfContainers: 'Número de contêineres',
      overweightContainer: 'Contêiner com excesso de peso (>25 toneladas)',
      container20: "20' Padrão (33 CBM)",
      container40: "40' Padrão (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Remessa',
      setupPending: 'Configuração pendente...',
      addAnotherShipment: 'Adicionar Outra Remessa',
      items: 'Itens',
      each: 'cada',
      totalCalculation: 'Cálculo total',
      overweight: 'Excesso de peso',

  },
  tr: {
    // Header
    mainTitle: 'Çin\'den Kargo Teklifi',
    mainSubtitle: 'Çin\'den kargonuz için hızlı ve güvenilir bir teklif alın',
    // Timeline steps
    timelineDestination: 'Hedef',
    timelineMode: 'Mod',
    timelineOrigin: 'Köken',
    timelineCargo: 'Kargo',
    timelineGoodsDetails: 'Mal Detayları',
    timelineContact: 'İletişim',
    // Step 6 translations
    step6Title: 'İletişim bilgileri',
    customerTypeQuestion: 'Bireysel olarak mı yoksa bir şirket için mi gönderim yapıyorsunuz?',
    customerTypeDescription: 'Bu, en uygun bilgi alanlarını sunmamıza yardımcı olur',
    individualCustomer: 'Bireysel',
    individualDescription: 'Kişisel gönderi veya bireysel müşteri',
    companyCustomer: 'Şirket',
    companyDescription: 'Ticari gönderi veya kurumsal işletme',
    personalInformation: 'Kişisel Bilgiler',
    personalInfoDescription: 'Bize kim olduğunuzu söyleyin',
    firstName: 'Ad',
    firstNamePlaceholder: 'Adınızı girin',
    lastName: 'Soyad',
    lastNamePlaceholder: 'Soyadınızı girin',
    shippingExperience: 'Gönderim Deneyimi',
    selectExperience: 'Deneyim seviyenizi seçin',
    firstTimeShipper: 'İlk uluslararası gönderi',
    upTo10Times: 'Ara sıra gönderici',
    moreThan10Times: 'Deneyimli gönderici',
    regularShipper: 'Düzenli gönderici',
    businessInformation: 'Şirket Bilgileri',
    businessInfoDescription: 'Şirketiniz hakkında bilgi verin',
    companyName: 'Şirket Adı',
    companyNamePlaceholder: 'Şirket adınızı girin',
    contactInformation: 'İletişim Bilgileri',
    contactInfoDescription: 'Size nasıl ulaşabiliriz?',
    emailAddress: 'E-posta Adresi',
    emailPlaceholder: 'your.email@company.com',
    emailHelp: 'Teklifinizi ve güncellemeleri bu adrese göndereceğiz',
    phoneNumber: 'Telefon Numarası',
    phonePlaceholder: 'Telefon numaranız',
    phoneHelp: 'Acil güncellemeler ve netleştirmeler için',
    additionalNotes: 'Ek Notlar',
    additionalNotesDescription: 'Bilmemiz gereken başka bir şey var mı?',
    remarks: 'Özel Notlar',
    remarksPlaceholder: 'Herhangi bir özel talimat, gereksinim veya soru...',
    remarksHelp: 'Ek bağlam, size daha iyi yardımcı olmamıza yardımcı olur',
    readyToSubmit: 'Teklifinizi almaya hazırsınız!',
    submitDescription: 'Talebinizi göndermek için aşağıdaki "Teklifimi Al" düğmesine tıklayın. 24 saat içinde yanıt vereceğiz.',
    securityBadge: 'Güvenli ve GDPR uyumlu',
    // Navigation
    stepCounter: 'Adım',
    next: 'Sonraki',
    previous: 'Önceki',
    trustBadge: '55.000+ ithalatçı tarafından güvenilen | Yanıt < 24s | %100 Ücretsiz',
    // Common
    searchCountry: 'Ülke arayın...',
    noCountryResults: 'Ülke bulunamadı. Farklı bir arama deneyin.',
    mostUsed: 'En çok kullanılan',
    // Step 1 translations
    step1Title: 'Nereye gönderiyorsunuz?',
    destinationCity: 'Hedef şehir',
    destinationZipCode: 'Hedef posta kodu',
    clearCountry: 'Seçili ülkeyi temizle',
    clearPort: 'Seçili limanı temizle',
    // Location types
    factoryWarehouse: 'Fabrika/Depo',
    portAirport: 'Liman/Havaalanı',
    port: 'Liman',
    airport: 'Havaalanı', 
    railTerminal: 'Demiryolu terminali',
    seaPort: 'Deniz Limanı',
    volume: 'Hacim',
    businessAddress: 'İş adresi',
    residentialAddress: 'Konut adresi',
    chooseLocationDescription: 'Teslim alma yerinizi seçin',
    // Step 2 translations
    step2Title: 'Tercih edilen nakliye modu',
    seaFreight: 'Deniz Nakliyesi',
    seaFreightDesc: 'Ekonomik, 30-45 gün',
    railFreight: 'Demiryolu Nakliyesi',
    railFreightDesc: 'Uygun maliyetli, 15-25 gün',
    airFreight: 'Hava Nakliyesi',
    airFreightDesc: 'Hızlı, 7-10 gün',
          express: 'Ekspres',
      expressDesc: 'En hızlı, 3-5 gün',
      unsureShipping: 'Henüz emin değilim',
      unsureShippingDesc: 'Uzmanların yardım etmesine izin verin',
      unsureShippingBenefits: 'Profesyonel rehberlik',
      unsureShippingFeedback: 'Mükemmel seçim! Özel ihtiyaçlarınız için en iyi nakliye seçeneğini önereceğiz',
      beginnerSectionTitle: 'Yeni başlayanlar için',
      beginnerSectionDesc: 'Uzmanlarımızın size ücretsiz tavsiye vermesine izin verin',
      separatorText: 'Veya kendiniz seçin',
      unsureAboutChoice: 'Seçiminizden emin değil misiniz?',
      // Step 2 Enhanced
      chooseShippingMethod: 'Mevcut seçenekleri karşılaştır',
      shippingMethodDescription: 'Farklı nakliye modları maliyet, hız ve güvenilirlik arasında çeşitli değiş tokuşlar sunar.',
      railAvailableForDestination: 'Hedefiniz için demiryolu nakliyesi mevcut.',
      seaFreightBenefits: 'Büyük, ağır gönderiler için ideal',
      railFreightBenefits: 'Çevre dostu seçenek',
      airFreightBenefits: 'Acil gönderiler için ideal',
      expressBenefits: 'Kapıdan kapıya hizmet',
      seaFeedback: 'Büyük hacimlerde ekonomik nakliye için harika seçim',
      railFeedback: 'Çevresel faydalarla maliyet ve hız arasında mükemmel denge',
      airFeedback: 'Zamana duyarlı veya yüksek değerli kargo için mükemmel',
      expressFeedback: 'Tam takipli küçük ila orta acil gönderiler için ideal',
      // Beginner-friendly enhancements
      businessDescription: 'İş adresi, ofis binası',
      residentialDescription: 'Ev, daire, kişisel adres',
      factoryDescription: 'Fabrika, dağıtım merkezi, depo',
      portDescription: 'Doğrudan liman/havaalanına',
      helpChooseLocation: 'Emin değil misiniz? Ticari gönderiler için İş/Ofis veya kişisel teslimatlar için Konut seçin',
      startTyping: 'Aramak için yazmaya başlayın...',
      // Step 1 Progressive Disclosure
      selectDestinationCountry: 'Hedef ülkenizi seçin',
      searchCountryDescription: 'Mallarınızı göndermek istediğiniz ülkeyi arayın',
      addressTypeQuestion: 'Hedefiniz ne tür bir adres?',
    selectDestinationLocationType: 'Lütfen bir hedef konum türü seçin',
    selectDestinationPort: 'Hedef limanını seçin',
    selectDestinationPortDescription: 'Teslimat için belirli limanı veya havaalanını seçin',
    searchPortsIn: 'Limanları ara',
    searchDestinationPorts: 'Hedef limanları ara',
      enterDestinationDetails: 'Hedef detaylarını girin',
    // Doğrulama mesajları
    validationShippingType: 'Lütfen bir kargo türü seçin',
    validationPackageType: 'Lütfen bir ambalaj türü seçin',
    validationDimensionsNonSpecified: 'Lütfen belirtilmemiş palet için tüm boyutları (U, G, Y) girin',
    validationPalletHeight: 'Lütfen paletin yüksekliğini girin',
    validationBoxDimensions: 'Lütfen kutuların/sandıkların boyutlarını girin',
    validationWeightPerUnit: 'Lütfen birim başına ağırlığı girin',
    validationTotalVolume: 'Lütfen toplam hacmi girin',
    validationTotalWeight: 'Lütfen toplam ağırlığı girin',
    validationContainerType: 'Lütfen bir konteyner türü seçin',
    validationDestinationCountry: 'Lütfen bir hedef ülke seçin',
    validationDestinationLocationType: 'Lütfen bir hedef konum türü seçin',
    validationDestinationCity: 'Lütfen bir hedef şehir girin',
    validationDestinationZip: 'Lütfen bir hedef posta kodu girin',
    validationShippingMode: 'Lütfen bir kargo modu seçin',
    validationPickupLocationType: 'Lütfen bir alım konum türü seçin',
    validationOriginPort: 'Lütfen bir başlangıç noktası seçin',
    validationPickupCity: 'Lütfen bir alım şehri girin',
    validationPickupZip: 'Lütfen bir alım posta kodu girin',
    validationGoodsValue: 'Lütfen malların değerini girin',
    validationReadyDate: 'Lütfen mallarınızın ne zaman hazır olacağını seçin',
    validationShipperType: 'Lütfen birey mi yoksa şirket mi olduğunuzu seçin',
    validationFirstName: 'Lütfen adınızı girin',
    validationLastName: 'Lütfen soyadınızı girin',
    validationCompanyName: 'Lütfen şirket adınızı girin',
    validationShipperRole: 'Lütfen gönderici türünüzü seçin',
    validationEmail: 'Lütfen geçerli bir e-posta adresi sağlayın',
    noCommitmentRequired: 'Hiçbir taahhüt gerekmez - sadece uzman rehberliği!',
      cityPostalDescription: 'Kesin nakliye için şehir ve posta kodu belirtin',
      popular: 'Popüler',
      otherCountries: 'Diğer ülkeler',
      // Step 3 translations
      step3Title: 'Çin\'de teslim alma yerini seçin',
      selectPickupLocationType: 'Teslim alma yeri türünüzü seçin',
      pickupLocationDescription: 'Çin\'de mallarınızı nereden alacağımızı seçin',
      enterPickupDetails: 'Teslim alma detaylarını girin',
      pickupCityPostalDescription: 'Çin\'de teslim alma şehri ve posta kodunu belirtin',
      searchPortTerminal: 'Liman/terminal/havaalanı ara...',
      selectPortTerminal: 'Teslim alma limanı/terminali/havaalanını seçin',
      portTerminalDescription: 'Teslim alma için özel liman, terminal veya havaalanı seçin',
      pickupCity: 'Teslim alma şehri',
      pickupZipCode: 'Teslim alma posta kodu',
      dontKnowPort: 'Bilmiyorum',
      dontKnowPortDescription: 'Hangi liman/terminali seçeceğimden emin değilim',
      dontKnowPortFeedback: 'Sorun değil! Kargonuz için en iyi liman/terminali seçmenizde yardımcı olacağız.',
      perfectPortFeedback: 'Mükemmel! Şuradan alacağız:',
      cityPickupFeedback: 'Mükemmel! {city}, Çin\'den teslim alma organize edeceğiz',
      annualVolume: 'Yıllık hacim',
      // Port translations
      ports: {
        'SHA': 'Şangay',
        'SZX': 'Shenzhen',
        'NGB': 'Ningbo-Zhoushan',
        'GZH': 'Guangzhou',
        'QIN': 'Qingdao',
        'TJN': 'Tianjin',
        'XMN': 'Xiamen',
        'DLN': 'Dalian',
        'YTN': 'Yantian',
        'LYG': 'Lianyungang',
        'PEK': 'Pekin Başkent Havaalanı',
        'PVG': 'Şangay Pudong Havaalanı',
        'CAN': 'Guangzhou Baiyun Havaalanı',
        'CTU': 'Chengdu Shuangliu Havaalanı',
        'KMG': 'Kunming Changshui Havaalanı',
        'XIY': 'Xi\'an Xianyang Havaalanı',
        'HGH': 'Hangzhou Xiaoshan Havaalanı',
        'NKG': 'Nanjing Lukou Havaalanı',
        'ZIH': 'Zhengzhou Demiryolu Terminali',
        'CQN': 'Chongqing Demiryolu Terminali',
        'WUH': 'Wuhan Demiryolu Terminali',
        'CDU': 'Chengdu Demiryolu Terminali',
        // Cameroon ports
        'CMDLA': 'Douala Limanı',
        'CMDLA_AIR': 'Douala Havalimanı',
        'CMNSM': 'Yaoundé Havalimanı'
      },
      // Region translations
      regions: {
        'East China': 'Doğu Çin',
        'South China': 'Güney Çin',
        'North China': 'Kuzey Çin',
        'West China': 'Batı Çin',
        'Southwest China': 'Güneybatı Çin',
        'Northwest China': 'Kuzeybatı Çin',
        'Central China': 'Orta Çin'
      },
      // Dynamic translations by mode
      searchPort: 'Liman ara...',
      searchAirport: 'Havaalanı ara...',
      searchRailTerminal: 'Demiryolu terminali ara...',
      selectPort: 'Teslim alma limanı seçin',
      selectAirport: 'Teslim alma havaalanı seçin', 
      selectRailTerminal: 'Teslim alma demiryolu terminali seçin',
      portDescriptionDynamic: 'Teslim alma için özel liman seçin',
      airportDescriptionDynamic: 'Teslim alma için özel havaalanı seçin',
      railTerminalDescriptionDynamic: 'Teslim alma için özel demiryolu terminali seçin',
      // Step 5 translations
      step5Title: 'Mallarınız hakkında bilgi verin',
      goodsValueDeclaration: 'Mal Değeri ve Beyanı',
      goodsValueDescription: 'Gümrük beyanı ve sigorta amaçları için ticari değeri belirtin',
      commercialValue: 'Malların ticari değeri',
      goodsValueHelp: 'Bu değer gümrük beyanı ve sigorta hesaplamaları için kullanılır',
      personalOrHazardous: 'Kişisel eşyalar veya tehlikeli/kısıtlı malzemeler içerir',
      personalHazardousHelp: 'Kişisel eşya gönderiyor veya özel elleçleme gerektiren mallar varsa işaretleyin',
      shipmentReadiness: 'Gönderi Hazırlığı',
      shipmentTimingDescription: 'Gönderi zaman çizelgenizi planlamamıza ve doğru fiyatlar sunmamıza yardımcı olun',
      goodsReadyQuestion: 'Mallarınız ne zaman teslim almaya hazır olacak?',
      readyNow: '✅ Şimdi hazır - mallar anında teslim alınabilir',
      readyIn1Week: '📅 1 hafta içinde - şu anda hazırlanıyor',
      readyIn2Weeks: '📅 2 hafta içinde - üretim devam ediyor',
      readyIn1Month: '📅 1 ay içinde - önceden planlama',
      dateNotSet: '❓ Tarih henüz belirlenmedi',
      timingHelp: 'Doğru zamanlama en rekabetçi fiyatları sunmamıza yardımcı olur',
      additionalDetails: 'Ek Detaylar (İsteğe bağlı)',
      additionalDetailsDescription: 'Özel gereksinimler veya ek bilgiler belirtin',
      goodsDescription: 'Malların kısa açıklaması (isteğe bağlı)',
      goodsDescriptionPlaceholder: 'örn. Elektronik, Mobilya, Giyim, Makine...',
      goodsDescriptionHelp: 'Uygun elleçleme ve belgeleme sağlamamıza yardımcı olur',
      specialRequirements: 'Özel elleçleme gereksinimleri (isteğe bağlı)',
      noSpecialRequirements: 'Özel gereksinim yok',
      fragileGoods: '🔸 Kırılgan mallar - dikkatli elleçleme',
      temperatureControlled: '🌡️ Sıcaklık kontrollü',
      urgentTimeSensitive: '⚡ Acil/zamana duyarlı',
      highValueInsurance: '🛡️ Yüksek değerli sigorta gerekli',
      otherSpecify: '📝 Diğer (lütfen açıklamalarda belirtin)',
      rateValidityNotice: 'Fiyat Geçerlilik Bildirimi:',
      rateValidityText: 'Verilen fiyatlar her teklifte gösterilen son kullanma tarihine kadar geçerlidir. Mallarınız bu tarihe kadar teslim alınmaya hazır değilse, mevcut piyasa koşullarına göre fiyatlar değişebilir.',
    selectOption: 'Bir seçenek seçin',
      // New statistics section
      impactInNumbers: 'Rakamlarla Etkimiz',
      impactDescription: 'Kanıtlanmış sonuçlar ve güvenilir hizmetle Çin\'de mükemmellik sunuyoruz',
      satisfiedCustomers: 'Memnun Müşteriler',
      customerSatisfaction: 'Müşteri Memnuniyeti',
      teamMembers: 'Takım Üyeleri',
      oceanVolume: 'TEU Deniz Hacmi',
      officesInChina: 'Çin\'deki Ofisler',
      cfsFacilities: 'M² CFS Tesisleri',
    // Additional system messages
    errorSubmission: 'Teklifinizi gönderirken bir hata oluştu. Lütfen tekrar deneyin.',
    noTestLeads: 'Şu anda yüklenmiş test müşteri adayı yok.',
    pleaseSpecifyInRemarks: 'lütfen açıklamalarda belirtin',
    // Step 6 translations
    shippingExperienceDescription: 'Size daha iyi yardımcı olmamız için deneyim seviyenizi belirtin',
    shippingFrequency: 'Ne sıklıkla nakliye yapıyorsunuz?',
    firstTime: 'İlk kez',
    occasionally: 'Ara sıra',
    regularly: 'Düzenli olarak',
    role: 'Rol',
    roleDescription: 'Hangi sıfatla gönderim yapıyorsunuz?',
    businessOwner: 'İşletme sahibi',
    purchasingManager: 'Satın alma müdürü',
    logisticsManager: 'Lojistik müdürü',
    salesRepresentative: 'Satış temsilcisi',
    privateIndividual: 'Özel kişi',
    phoneNumberPlaceholder: 'Telefon numaranızı girin',
    // Additional confirmation page items
    // Confirmation page
    confirmationMainTitle: 'Talep Onayı',
      confirmationTitle: 'Teklif Talebi Onaylandı',
      confirmationSubtitle: 'Talebiniz başarıyla gönderildi',
      referenceNumber: 'Referans Numarası',
      yourRequest: 'Talebinizin Özeti',
      shipmentDetails: 'Gönderi Detayları',
      fromTo: '{origin}\'den {destination}\'ye',
      mode: 'Taşıma Şekli',
      contactDetails: 'İletişim Bilgileri',
      nextSteps: 'Sonraki Adımlar',
      step1: 'Talep alındı',
      step1Time: 'Şimdi',
      step2: 'Analiz ve teklif',
      step2Time: '4 iş saati içinde',
      step3: 'Ticari iletişim',
      step3Time: '24 saat içinde',
      step4: 'Detaylı teklif',
      step4Time: '48 saat içinde',
      aboutSino: 'SINO Shipping & FS International Hakkında',
      aboutSubtitle: 'Talebiniz uzmanlar tarafından işleniyor',
      sinoDescription: 'SINO Shipping 2018 yılında Fransız girişimciler tarafından kuruldu ve 2021\'de FS International\'ın bir parçası oldu. Bu işbirliği, müşteri odaklı Batılı yaklaşımı derin yerel Çin uzmanlığı ile birleştiriyor.',
      fsDescription: 'FS International, Eylül 1989\'da Hong Kong\'da kuruldu ve bölgede küresel lojistik ve taşımacılık için en güvenilir markalardan biri.',
      ourExpertise: 'Uzmanlığımız',
      expertise1: 'Tüm büyük Çin limanlarından deniz ve hava taşımacılığı',
      expertise2: 'Avrupa ve Rusya\'ya demiryolu taşımacılığı',
      expertise3: 'Multimodal taşıma ve son mil teslimat',
      expertise4: 'Gümrük işlemleri ve uyumluluk danışmanlığı',
      keyNumbers: 'Rakamlarla Etkimiz',
      keyNumbersSubtitle: 'Çin\'de kanıtlanmış sonuçlar ve güvenilir hizmet',
      number1: '15.000+ aktif kullanıcı',
      number2: 'Ayda 1.000+ teklif',
      number3: '%98 müşteri memnuniyeti',
      number4: '100+ takım üyesi',
      globalNetwork: 'Küresel Ağ',
      networkDescription: 'Çin ve Hong Kong\'daki stratejik ofislerimizle, gönderilerinizi verimli şekilde ele almak için ideal konumdayız.',
      chinaOffices: 'Çin Ofisleri: Shenzhen, Shanghai, Qingdao, Ningbo',
      hkOffice: 'Hong Kong Merkez Ofis: Tsim Sha Tsui',
      needHelp: 'Yardıma İhtiyacınız Var?',
      email: 'E-posta',
      available: 'Müsait',
      actions: 'Hızlı İşlemler',
      newRequest: 'Yeni Talep Gönder',
      viewServices: 'Hizmetlerimizi Görüntüle',
      subscribeUpdates: 'Güncellemelere Abone Ol',
      websites: 'Web Sitelerimiz',
      thankYouTitle: 'Güveniniz için teşekkürler!',
      thankYouMessage: 'Talebiniz uluslararası nakliye uzmanlarımız tarafından en büyük özenle işlenecektir.',
      shipment: 'gönderi',
      shipments: 'gönderiler',
      // Step 4 translations
      step4Title: 'Neyi gönderiyorsunuz?',
      managingShipments: '{count} Gönderi{plural} Yönetimi',
      configureShipments: 'Her gönderiyi ayrı ayrı yapılandırın veya karmaşık siparişler için birden fazla gönderi ekleyin',
      addShipment: 'Gönderi Ekle',
      validating: 'Doğrulama...',
      active: 'Aktif',
      shipmentsCount: 'Gönderiler ({count})',
      addNewShipment: 'Yeni gönderi ekle',
      duplicateShipment: 'Bu gönderiyi kopyala',
      removeShipment: 'Bu gönderiyi kaldır',
      consolidatedSummary: 'Konsolide Özet',
      totalVolume: 'Toplam Hacim',
      totalWeight: 'Toplam Ağırlık',
      totalShipments: 'Gönderiler',
      totalContainers: 'Konteynerler',
      chooseShippingType: 'Nakliye türünü seçin',
      shipmentXofY: 'Gönderi {current} / {total}',
      selectPackagingMethod: 'Mallarınızın nakliye için nasıl paketlendiğini seçin',
      forThisSpecificShipment: 'bu özel gönderi için',
      looseCargo: 'Gevşek Kargo',
      looseCargoDesc: 'Paletler, kutular veya bireysel öğeler',
      fullContainer: 'Tam Konteyner',
      fullContainerDesc: 'Tam konteyner (FCL)',
      imNotSure: 'Emin değilim',
      teamWillHelp: 'Ekibimiz en iyi seçeneği seçmenize yardımcı olacak',
      unsureFeedback: 'Endişelenmeyin! Deneyimli ekibimiz süreç boyunca size rehberlik edecek ve özel ihtiyaçlarınız için en iyi nakliye çözümünü önerecek. Tüm teknik detayları hallederiz.',
      whatHappensNext: 'Bundan sonra ne olacak:',
      expertsContact: 'Nakliye uzmanlarımız 24 saat içinde iletişime geçecek',
      discussRequirements: 'Mal detaylarınızı ve gereksinimlerinizi tartışacağız',
      personalizedRecommendations: 'Kişiselleştirilmiş öneriler ve fiyatlandırma alacaksınız',
      describeLooseCargo: 'Gevşek kargonuzu tanımlayın',
      configureContainer: 'Konteynerinizi yapılandırın',
      provideDimensionsWeight: 'Doğru fiyatlandırma için boyut ve ağırlık detayları sağlayın',
      selectContainerType: 'Kargonuz için konteyner türü ve miktarını seçin',
      calculateByUnit: 'Birim türüne göre hesapla',
      calculateByTotal: 'Toplam kargoya göre hesapla',
      packageType: 'Paket türü',
      pallets: 'Paletler',
      boxesCrates: 'Kutular/Kasalar',
      numberOfUnits: 'Birim sayısı',
      palletType: 'Palet türü',
      nonSpecified: 'Belirtilmemiş',
      euroPallet: 'Avrupa Paleti (120x80 cm)',
      standardPallet: 'Standart Palet (120x100 cm)',
      customSize: 'Özel boyut',
      dimensionsPerUnit: 'Boyutlar (birim başına U×G×Y)',
      weightPerUnit: 'Ağırlık (birim başına)',
      required: 'Gerekli',
      containerInfoBanner: 'Mal hacminiz için en uygun konteyner türü ve miktarını seçin.',
      unitInfoBanner: 'Doğru hesaplama için her bir öğe veya palet için kesin detaylar sağlayın.',
      totalInfoBanner: 'Toplam gönderi numaraları sağlamak daha az kesin olabilir. Yanlış veya büyük boyutlar ek maliyetlere neden olabilir.',
      totalDescription: 'Gönderinizin toplam boyutları ve ağırlığını girin.',
      containerType: 'Konteyner türü',
      numberOfContainers: 'Konteyner sayısı',
      overweightContainer: 'Aşırı ağırlık konteyneri (>25 ton)',
      container20: "20' Standart (33 CBM)",
      container40: "40' Standart (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Gönderi',
      setupPending: 'Kurulum bekliyor...',
      addAnotherShipment: 'Başka Gönderi Ekle',
      items: 'Öğeler',
      each: 'her',
      totalCalculation: 'Toplam hesaplama',
      overweight: 'Aşırı ağırlık',
      getMyQuote: 'Teklifimi Al',
  },
  ru: {
    // Header
    mainTitle: 'Расчёт стоимости доставки из Китая',
    mainSubtitle: 'Получите быстрый и надёжный расчёт стоимости вашей доставки из Китая',
    // Timeline steps
    timelineDestination: 'Назначение',
    timelineMode: 'Режим',
    timelineOrigin: 'Происхождение',
    timelineCargo: 'Груз',
    timelineGoodsDetails: 'Детали товара',
    timelineContact: 'Контакт',
    // Navigation
    stepCounter: 'Шаг',
    next: 'Далее',
    previous: 'Назад',
    trustBadge: 'Доверяют 55 000+ импортёров | Ответ < 24ч | 100% Бесплатно',
    // Common
    searchCountry: 'Поиск страны...',
    noCountryResults: 'Страны не найдены. Попробуйте другой поиск.',
    mostUsed: 'Наиболее используемые',
    // Step 1 translations
    step1Title: 'Куда вы отправляете?',
    destinationCity: 'Город назначения',
    destinationZipCode: 'Почтовый индекс назначения',
    clearCountry: 'Очистить выбранную страну',
    clearPort: 'Очистить выбранный порт',
    // Location types
    factoryWarehouse: 'Завод/Склад',
    portAirport: 'Порт/Аэропорт',
    port: 'Порт',
    airport: 'Аэропорт', 
    railTerminal: 'Железнодорожный терминал',
    seaPort: 'Морской порт',
    volume: 'Объём',
    businessAddress: 'Деловой адрес',
    residentialAddress: 'Жилой адрес',
    chooseLocationDescription: 'Выберите место получения груза',
    // Step 2 translations
    step2Title: 'Предпочтительный способ доставки',
    chooseShippingMethod: 'Сравните доступные варианты',
    shippingMethodDescription: 'Различные способы доставки предлагают разные компромиссы между стоимостью, скоростью и надёжностью.',
    railAvailableForDestination: 'Железнодорожная доставка доступна для вашего направления.',
    seaFreightBenefits: 'Идеально для крупных, тяжёлых грузов',
    railFreightBenefits: 'Экологичный вариант',
    airFreightBenefits: 'Идеально для срочных отправлений',
    expressBenefits: 'Услуга от двери до двери',
    seaFeedback: 'Отличный выбор для экономичной доставки больших объёмов',
    railFeedback: 'Превосходный баланс стоимости и скорости с экологическими преимуществами',
    airFeedback: 'Идеально для срочных или ценных грузов',
    expressFeedback: 'Лучшее для срочных малых и средних отправлений с полным отслеживанием',
    seaFreight: 'Морская перевозка',
    seaFreightDesc: 'Экономичный, 30-45 дней',
    railFreight: 'Железнодорожная перевозка',
    railFreightDesc: 'Выгодный, 15-25 дней',
    airFreight: 'Авиаперевозка',
    airFreightDesc: 'Быстрый, 7-10 дней',
    express: 'Экспресс',
    expressDesc: 'Самый быстрый, 3-5 дней',
    // Beginner-friendly enhancements
    businessDescription: 'Деловой адрес, офисное здание',
    residentialDescription: 'Дом, квартира, личный адрес',
    factoryDescription: 'Завод, распределительный центр, склад',
    portDescription: 'Прямо в порт/аэропорт',
    helpChooseLocation: 'Не уверены? Выберите Бизнес/Офис для деловых отправлений или Жилой для личных доставок',
    startTyping: 'Начните печатать для поиска...',
    // Step 1 Progressive Disclosure
    selectDestinationCountry: 'Выберите страну назначения',
    searchCountryDescription: 'Найдите страну, куда хотите отправить товары',
    addressTypeQuestion: 'Какой тип адреса ваше назначение?',
    selectDestinationLocationType: 'Пожалуйста, выберите тип места назначения',
    selectDestinationPort: 'Выберите порт назначения',
    selectDestinationPortDescription: 'Выберите конкретный порт или аэропорт для доставки',
    searchPortsIn: 'Искать порты в',
    searchDestinationPorts: 'Искать порты назначения',
    enterDestinationDetails: 'Введите детали назначения',
    // Сообщения валидации
    validationShippingType: 'Пожалуйста, выберите тип доставки',
    validationPackageType: 'Пожалуйста, выберите тип упаковки',
    validationDimensionsNonSpecified: 'Пожалуйста, введите все размеры (Д, Ш, В) для неуказанного поддона',
    validationPalletHeight: 'Пожалуйста, введите высоту поддона',
    validationBoxDimensions: 'Пожалуйста, введите размеры коробок/ящиков',
    validationWeightPerUnit: 'Пожалуйста, введите вес за единицу',
    validationTotalVolume: 'Пожалуйста, введите общий объем',
    validationTotalWeight: 'Пожалуйста, введите общий вес',
    validationContainerType: 'Пожалуйста, выберите тип контейнера',
    validationDestinationCountry: 'Пожалуйста, выберите страну назначения',
    validationDestinationLocationType: 'Пожалуйста, выберите тип места назначения',
    validationDestinationCity: 'Пожалуйста, введите город назначения',
    validationDestinationZip: 'Пожалуйста, введите почтовый индекс назначения',
    validationShippingMode: 'Пожалуйста, выберите режим доставки',
    validationPickupLocationType: 'Пожалуйста, выберите тип места забора',
    validationOriginPort: 'Пожалуйста, выберите происхождение',
    validationPickupCity: 'Пожалуйста, введите город забора',
    validationPickupZip: 'Пожалуйста, введите почтовый индекс забора',
    validationGoodsValue: 'Пожалуйста, введите стоимость товаров',
    validationReadyDate: 'Пожалуйста, выберите, когда ваши товары будут готовы',
    validationShipperType: 'Пожалуйста, выберите, являетесь ли вы физическим лицом или компанией',
    validationFirstName: 'Пожалуйста, введите ваше имя',
    validationLastName: 'Пожалуйста, введите вашу фамилию',
    validationCompanyName: 'Пожалуйста, введите название вашей компании',
    validationShipperRole: getText('validationShipperRole', userLang),
    validationEmail: getText('validationEmail', userLang),
    noCommitmentRequired: getText('noCommitmentRequired', userLang),
    cityPostalDescription: getText('cityPostalDescription', userLang),
    popular: getText('popular', userLang),
    otherCountries: getText('otherCountries', userLang),
    // Step 3 translations
    step3Title: getText('step3Title', userLang),
    selectPickupLocationType: getText('selectPickupLocationType', userLang),
    pickupLocationDescription: getText('pickupLocationDescription', userLang),
    enterPickupDetails: getText('enterPickupDetails', userLang),
    pickupCityPostalDescription: getText('pickupCityPostalDescription', userLang),
    searchPortTerminal: getText('searchPortTerminal', userLang),
    selectPortTerminal: getText('selectPortTerminal', userLang),
    portTerminalDescription: getText('portTerminalDescription', userLang),
    pickupCity: getText('pickupCity', userLang),
    pickupZipCode: getText('pickupZipCode', userLang),
    dontKnowPort: getText('dontKnowPort', userLang),
    dontKnowPortDescription: getText('dontKnowPortDescription', userLang),
    dontKnowPortFeedback: getText('dontKnowPortFeedback', userLang),
    perfectPortFeedback: getText('perfectPortFeedback', userLang),
    cityPickupFeedback: getText('cityPickupFeedback', userLang),
    annualVolume: getText('annualVolume', userLang),
    // Port translations
    ports: {
      'SHA': getText('ports.SHA', userLang),
      'SZX': getText('ports.SZX', userLang),
      'NGB': getText('ports.NGB', userLang),
      'GZH': getText('ports.GZH', userLang),
      'QIN': getText('ports.QIN', userLang),
      'TJN': getText('ports.TJN', userLang),
      'XMN': getText('ports.XMN', userLang),
      'DLN': getText('ports.DLN', userLang),
      'YTN': getText('ports.YTN', userLang),
      'LYG': getText('ports.LYG', userLang),
      'PEK': getText('ports.PEK', userLang),
      'PVG': getText('ports.PVG', userLang),
      'CAN': getText('ports.CAN', userLang),
      'CTU': getText('ports.CTU', userLang),
      'KMG': getText('ports.KMG', userLang),
      'XIY': getText('ports.XIY', userLang),
      'HGH': getText('ports.HGH', userLang),
      'NKG': getText('ports.NKG', userLang),
      'ZIH': getText('ports.ZIH', userLang),
      'CQN': getText('ports.CQN', userLang),
      'WUH': getText('ports.WUH', userLang),
      'CDU': getText('ports.CDU', userLang),
      // Cameroon ports
      'CMDLA': getText('ports.CMDLA', userLang),
      'CMDLA_AIR': getText('ports.CMDLA_AIR', userLang),
      'CMNSM': getText('ports.CMNSM', userLang)
    },
    // Region translations
    regions: {
      'East China': getText('regions.East China', userLang),
      'South China': getText('regions.South China', userLang),
      'North China': getText('regions.North China', userLang),
      'West China': getText('regions.West China', userLang),
      'Southwest China': getText('regions.Southwest China', userLang),
      'Northwest China': getText('regions.Northwest China', userLang),
      'Central China': getText('regions.Central China', userLang)
    },
    // Dynamic translations by mode
    searchPort: getText('searchPort', userLang),
    searchAirport: getText('searchAirport', userLang),
    searchRailTerminal: getText('searchRailTerminal', userLang),
    selectPort: getText('selectPort', userLang),
    selectAirport: getText('selectAirport', userLang),
    selectRailTerminal: getText('selectRailTerminal', userLang),
    portDescriptionDynamic: getText('portDescriptionDynamic', userLang),
    airportDescriptionDynamic: getText('airportDescriptionDynamic', userLang),
    railTerminalDescriptionDynamic: getText('railTerminalDescriptionDynamic', userLang),
    // Step 5 translations
    step5Title: getText('step5Title', userLang),
    goodsValueDeclaration: getText('goodsValueDeclaration', userLang),
    goodsValueDescription: getText('goodsValueDescription', userLang),
    commercialValue: getText('commercialValue', userLang),
    goodsValueHelp: getText('goodsValueHelp', userLang),
    personalOrHazardous: getText('personalOrHazardous', userLang),
    personalHazardousHelp: getText('personalHazardousHelp', userLang),
    shipmentReadiness: getText('shipmentReadiness', userLang),
    shipmentTimingDescription: getText('shipmentTimingDescription', userLang),
    goodsReadyQuestion: getText('goodsReadyQuestion', userLang),
    readyNow: getText('readyNow', userLang),
    readyIn1Week: getText('readyIn1Week', userLang),
    readyIn2Weeks: getText('readyIn2Weeks', userLang),
    readyIn1Month: getText('readyIn1Month', userLang),
    dateNotSet: getText('dateNotSet', userLang),
    timingHelp: getText('timingHelp', userLang),
    additionalDetails: getText('additionalDetails', userLang),
    additionalDetailsDescription: getText('additionalDetailsDescription', userLang),
    goodsDescription: getText('goodsDescription', userLang),
    goodsDescriptionPlaceholder: getText('goodsDescriptionPlaceholder', userLang),
    goodsDescriptionHelp: getText('goodsDescriptionHelp', userLang),
    specialRequirements: getText('specialRequirements', userLang),
    noSpecialRequirements: getText('noSpecialRequirements', userLang),
    fragileGoods: getText('fragileGoods', userLang),
    temperatureControlled: getText('temperatureControlled', userLang),
    urgentTimeSensitive: getText('urgentTimeSensitive', userLang),
    highValueInsurance: getText('highValueInsurance', userLang),
    otherSpecify: getText('otherSpecify', userLang),
    rateValidityNotice: getText('rateValidityNotice', userLang),
    rateValidityText: getText('rateValidityText', userLang),
    unsureShipping: getText('unsureShipping', userLang),
    unsureShippingDesc: getText('unsureShippingDesc', userLang),
    unsureShippingBenefits: getText('unsureShippingBenefits', userLang),
    unsureShippingFeedback: getText('unsureShippingFeedback', userLang),
    beginnerSectionTitle: getText('beginnerSectionTitle', userLang),
    beginnerSectionDesc: getText('beginnerSectionDesc', userLang),
    separatorText: getText('separatorText', userLang),
    unsureAboutChoice: getText('unsureAboutChoice', userLang),
    selectOption: getText('selectOption', userLang),
    // New statistics section
    impactInNumbers: getText('impactInNumbers', userLang),
    impactDescription: getText('impactDescription', userLang),
    satisfiedCustomers: getText('satisfiedCustomers', userLang),
    customerSatisfaction: getText('customerSatisfaction', userLang),
    teamMembers: getText('teamMembers', userLang),
    oceanVolume: getText('oceanVolume', userLang),
    officesInChina: getText('officesInChina', userLang),
    cfsFacilities: getText('cfsFacilities', userLang),
    // Additional system messages
    errorSubmission: getText('errorSubmission', userLang),
    noTestLeads: getText('noTestLeads', userLang),
    pleaseSpecifyInRemarks: getText('pleaseSpecifyInRemarks', userLang),
    // Step 6 translations
    step6Title: getText('step6Title', userLang),
    personalInformation: getText('personalInformation', userLang),
    personalInfoDescription: getText('personalInfoDescription', userLang),
    firstName: getText('firstName', userLang),
    firstNamePlaceholder: getText('firstNamePlaceholder', userLang),
    lastName: getText('lastName', userLang),
    lastNamePlaceholder: getText('lastNamePlaceholder', userLang),
    businessInformation: getText('businessInformation', userLang),
    businessInfoDescription: getText('businessInfoDescription', userLang),
    companyName: getText('companyName', userLang),
    companyNamePlaceholder: getText('companyNamePlaceholder', userLang),
    shippingExperience: getText('shippingExperience', userLang),
    shippingExperienceDescription: getText('shippingExperienceDescription', userLang),
    shippingFrequency: getText('shippingFrequency', userLang),
    firstTime: getText('firstTime', userLang),
    occasionally: getText('occasionally', userLang),
    regularly: getText('regularly', userLang),
    role: getText('role', userLang),
    roleDescription: getText('roleDescription', userLang),
    businessOwner: getText('businessOwner', userLang),
    purchasingManager: getText('purchasingManager', userLang),
    logisticsManager: getText('logisticsManager', userLang),
    salesRepresentative: getText('salesRepresentative', userLang),
    privateIndividual: getText('privateIndividual', userLang),
    selectExperience: getText('selectExperience', userLang),
    firstTimeShipper: getText('firstTimeShipper', userLang),
    upTo10Times: getText('upTo10Times', userLang),
    moreThan10Times: getText('moreThan10Times', userLang),
    regularShipper: getText('regularShipper', userLang),
    contactInformation: getText('contactInformation', userLang),
    contactInfoDescription: getText('contactInfoDescription', userLang),
    emailAddress: getText('emailAddress', userLang),
    emailPlaceholder: getText('emailPlaceholder', userLang),
    emailHelp: getText('emailHelp', userLang),
    phoneNumber: getText('phoneNumber', userLang),
    phoneNumberPlaceholder: getText('phoneNumberPlaceholder', userLang),
    phoneHelp: getText('phoneHelp', userLang),
    additionalNotes: getText('additionalNotes', userLang),
    additionalNotesDescription: getText('additionalNotesDescription', userLang),
    remarks: getText('remarks', userLang),
    remarksPlaceholder: getText('remarksPlaceholder', userLang),
    remarksHelp: getText('remarksHelp', userLang),
    readyToSubmit: getText('readyToSubmit', userLang),
    submitDescription: getText('submitDescription', userLang),
    getMyQuote: getText('getMyQuote', userLang),
    securityBadge: getText('securityBadge', userLang),
    // Customer type selection
    customerTypeQuestion: getText('customerTypeQuestion', userLang),
    customerTypeDescription: getText('customerTypeDescription', userLang),
    individualCustomer: getText('individualCustomer', userLang),
    individualDescription: getText('individualDescription', userLang),
    companyCustomer: getText('companyCustomer', userLang),
    companyDescription: getText('companyDescription', userLang),
      // Additional confirmation page items
      // Confirmation page
    confirmationMainTitle: getText('confirmationMainTitle', userLang),
    confirmationTitle: getText('confirmationTitle', userLang),
    confirmationSubtitle: getText('confirmationSubtitle', userLang),
    referenceNumber: getText('referenceNumber', userLang),
    yourRequest: getText('yourRequest', userLang),
    shipmentDetails: getText('shipmentDetails', userLang),
    fromTo: getText('fromTo', userLang),
    mode: getText('mode', userLang),
    contactDetails: getText('contactDetails', userLang),
    nextSteps: getText('nextSteps', userLang),
    step1: getText('step1', userLang),
    step1Time: getText('step1Time', userLang),
    step2: getText('step2', userLang),
    step2Time: getText('step2Time', userLang),
    step3: getText('step3', userLang),
    step3Time: getText('step3Time', userLang),
    step4: getText('step4', userLang),
    step4Time: getText('step4Time', userLang),
    aboutSino: getText('aboutSino', userLang),
    aboutSubtitle: getText('aboutSubtitle', userLang),
    sinoDescription: getText('sinoDescription', userLang),
    fsDescription: getText('fsDescription', userLang),
    ourExpertise: getText('ourExpertise', userLang),
    expertise1: getText('expertise1', userLang),
    expertise2: getText('expertise2', userLang),
    expertise3: getText('expertise3', userLang),
    expertise4: getText('expertise4', userLang),
    keyNumbers: getText('keyNumbers', userLang),
    keyNumbersSubtitle: getText('keyNumbersSubtitle', userLang),
    number1: getText('number1', userLang),
    number2: getText('number2', userLang),
    number3: getText('number3', userLang),
    number4: getText('number4', userLang),
    globalNetwork: getText('globalNetwork', userLang),
    networkDescription: getText('networkDescription', userLang),
    chinaOffices: getText('chinaOffices', userLang),
    hkOffice: getText('hkOffice', userLang),
    needHelp: getText('needHelp', userLang),
    email: getText('email', userLang),
    available: getText('available', userLang),
    actions: getText('actions', userLang),
    newRequest: getText('newRequest', userLang),
    viewServices: getText('viewServices', userLang),
    subscribeUpdates: getText('subscribeUpdates', userLang),
    websites: getText('websites', userLang),
    thankYouTitle: getText('thankYouTitle', userLang),
    thankYouMessage: getText('thankYouMessage', userLang),
    shipment: getText('shipment', userLang),
    shipments: getText('shipments', userLang),
      // Step 4 translations
    step4Title: getText('step4Title', userLang),
    managingShipments: getText('managingShipments', userLang),
    configureShipments: getText('configureShipments', userLang),
    addShipment: getText('addShipment', userLang),
    validating: getText('validating', userLang),
    active: getText('active', userLang),
    shipmentsCount: getText('shipmentsCount', userLang),
    addNewShipment: getText('addNewShipment', userLang),
    duplicateShipment: getText('duplicateShipment', userLang),
    removeShipment: getText('removeShipment', userLang),
    consolidatedSummary: getText('consolidatedSummary', userLang),
    totalVolume: getText('totalVolume', userLang),
    totalWeight: getText('totalWeight', userLang),
    totalShipments: getText('totalShipments', userLang),
    totalContainers: getText('totalContainers', userLang),
    chooseShippingType: getText('chooseShippingType', userLang),
    shipmentXofY: getText('shipmentXofY', userLang),
    selectPackagingMethod: getText('selectPackagingMethod', userLang),
    forThisSpecificShipment: getText('forThisSpecificShipment', userLang),
    looseCargo: getText('looseCargo', userLang),
    looseCargoDesc: getText('looseCargoDesc', userLang),
    fullContainer: getText('fullContainer', userLang),
    fullContainerDesc: getText('fullContainerDesc', userLang),
    imNotSure: getText('imNotSure', userLang),
    teamWillHelp: getText('teamWillHelp', userLang),
    unsureFeedback: getText('unsureFeedback', userLang),
    whatHappensNext: getText('whatHappensNext', userLang),
    expertsContact: getText('expertsContact', userLang),
    discussRequirements: getText('discussRequirements', userLang),
    personalizedRecommendations: getText('personalizedRecommendations', userLang),
    describeLooseCargo: getText('describeLooseCargo', userLang),
    configureContainer: getText('configureContainer', userLang),
    provideDimensionsWeight: getText('provideDimensionsWeight', userLang),
    selectContainerType: getText('selectContainerType', userLang),
    calculateByUnit: getText('calculateByUnit', userLang),
    calculateByTotal: getText('calculateByTotal', userLang),
    packageType: getText('packageType', userLang),
    pallets: getText('pallets', userLang),
    boxesCrates: getText('boxesCrates', userLang),
    numberOfUnits: getText('numberOfUnits', userLang),
    palletType: getText('palletType', userLang),
    nonSpecified: getText('nonSpecified', userLang),
    euroPallet: getText('euroPallet', userLang),
    standardPallet: getText('standardPallet', userLang),
    customSize: getText('customSize', userLang),
    dimensionsPerUnit: getText('dimensionsPerUnit', userLang),
    weightPerUnit: getText('weightPerUnit', userLang),
    required: getText('required', userLang),
    containerInfoBanner: getText('containerInfoBanner', userLang),
    unitInfoBanner: getText('unitInfoBanner', userLang),
    totalInfoBanner: getText('totalInfoBanner', userLang),
    totalDescription: getText('totalDescription', userLang),
    containerType: getText('containerType', userLang),
    numberOfContainers: getText('numberOfContainers', userLang),
    overweightContainer: getText('overweightContainer', userLang),
    container20: getText('container20', userLang),
    container40: getText('container40', userLang),
    container40HC: getText('container40HC', userLang),
    container45HC: getText('container45HC', userLang),
      // Additional shipment summary translations
    shipmentTitle: getText('shipmentTitle', userLang),
    setupPending: getText('setupPending', userLang),
    addAnotherShipment: getText('addAnotherShipment', userLang),
    items: getText('items', userLang),
    each: getText('each', userLang),
    totalCalculation: getText('totalCalculation', userLang),
    overweight: getText('overweight', userLang),
  },
};
/* const EXPERIENCE_OPTIONS = [
  { 
    code: 'first-time', 
    icon: '🌟',
    descriptions: {
      en: 'first international shipment',
      fr: 'première expérience internationale',
      zh: '首次国际运输',
      de: 'erste internationale Sendung',
      es: 'primer envío internacional',
      it: 'prima spedizione internazionale',
      nl: 'eerste internationale zending',
      ar: 'أول شحنة دولية',
      pt: 'primeira remessa internacional',
      tr: 'ilk uluslararası gönderi',
      ru: 'первая международная отправка'
    }
  },
  { 
    code: 'up-to-10x', 
    icon: '📦',
    descriptions: {
      en: 'limited experience',
      fr: 'expérience limitée',
      zh: '经验有限',
      de: 'begrenzte Erfahrung',
      es: 'experiencia limitada',
      it: 'esperienza limitata',
      nl: 'beperkte ervaring',
      ar: 'خبرة محدودة',
      pt: 'experiência limitada',
      tr: 'sınırlı deneyim',
      ru: 'ограниченный опыт'
    }
  },
  { 
    code: 'more-than-10x', 
    icon: '🚀',
    descriptions: {
      en: 'experienced shipper',
      fr: 'expérience confirmée',
      zh: '经验丰富',
      de: 'erfahrener Versender',
      es: 'experiencia confirmada',
      it: 'esperienza consolidata',
      nl: 'ervaren verzender',
      ar: 'خبرة مؤكدة',
      pt: 'experiência confirmada',
      tr: 'deneyimli gönderici',
      ru: 'подтвержденный опыт'
    }
  },
  { 
    code: 'regular', 
    icon: '⭐',
    descriptions: {
      en: 'regular shipper',
      fr: 'expéditions régulières',
      zh: '定期发货',
      de: 'regelmäßige Sendungen',
      es: 'envíos regulares',
      it: 'spedizioni regolari',
      nl: 'regelmatige verzendingen',
      ar: 'شحنات منتظمة',
      pt: 'remessas regulares',
      tr: 'düzenli gönderiler',
      ru: 'регулярные отправки'
    }
  }
]; */

const QuoteForm: React.FC = () => {
  const [submissionId, setSubmissionId] = useState('');
  const { message: toastMessage, showToast } = useToast(3000);
  const {
    currentStep,
    setCurrentStep,
    userLang,
    setUserLang,
    formData,
    setFormData,
    setFieldValid,
    nextStep,
    prevStep,
    activeLoadIndex,
    setActiveLoadIndex,
    // destPortSearch: destPortSearchCtx,
    // setPhonePrefixSearch,
    // setDestPortSearch: setDestPortSearchCtx,
    setIsDestPortListVisible,
    // getTranslatedPortNameLocal
  } = useQuoteForm();
  // Use context-provided UI states instead of local duplicates
  // const destPortSearch = destPortSearchCtx; // not used locally
  // const [phonePrefixSearch, setPhonePrefixSearch] = useState('');
  // const [selectedLocationType, setSelectedLocationType] = useState('');
  const [isCountryListVisible, setIsCountryListVisible] = useState(false);
  // Local port list visibility removed; destination list visibility comes from context
  // const [isDestPortListVisible, setIsDestPortListVisible] = useState(false);
  // const [isPhonePrefixListVisible, setIsPhonePrefixListVisible] = useState(false);

  // Step 5 custom dropdown states moved into StepGoodsDetails

  // Step 6 custom dropdown states
  // const [experienceSearch, setExperienceSearch] = useState('');
  // const [isExperienceListVisible, setIsExperienceListVisible] = useState(false);
  // Step 4 simple/advanced toggle
  // removed: advanced cargo UI now handled in StepFreight

  // Customer type state
  // const [customerType, setCustomerType] = useState<'individual' | 'company' | ''>('');

  const countryListRef = useRef<HTMLDivElement>(null);
  const destPortListRef = useRef<HTMLDivElement>(null); // For destination port list
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Refs for custom dropdowns
  // Step 5 refs moved into StepGoodsDetails
  // const experienceListRef = useRef<HTMLDivElement>(null);

  interface LoadDetails {
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
  }

  // Using formData and fieldValid from context - no local state needed

  // removed: populateTestData (debug-only function)

  // Cargo Step States - these will now reflect the active load
  const [shippingType, setShippingType] = useState<LoadDetails['shippingType']>('');

  // Dropdown states
  const [isPalletTypeOpen, setIsPalletTypeOpen] = useState(false);
  const [isDimensionUnitOpen, setIsDimensionUnitOpen] = useState(false);
  const [isWeightUnitOpen, setIsWeightUnitOpen] = useState(false);
  const [isTotalVolumeUnitOpen, setIsTotalVolumeUnitOpen] = useState(false);
  const [isTotalWeightUnitOpen, setIsTotalWeightUnitOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsPalletTypeOpen(false);
      setIsDimensionUnitOpen(false);
      setIsWeightUnitOpen(false);
      setIsTotalVolumeUnitOpen(false);
      setIsTotalWeightUnitOpen(false);
    };

    if (
      isPalletTypeOpen ||
      isDimensionUnitOpen ||
      isWeightUnitOpen ||
      isTotalVolumeUnitOpen ||
      isTotalWeightUnitOpen
    ) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [
    isPalletTypeOpen,
    isDimensionUnitOpen,
    isWeightUnitOpen,
    isTotalVolumeUnitOpen,
    isTotalWeightUnitOpen,
  ]);
  const [calculationType, setCalculationType] = useState<LoadDetails['calculationType']>(
    initialLoadDetails.calculationType
  );
  const [packageType, setPackageType] = useState<LoadDetails['packageType']>(
    initialLoadDetails.packageType
  );
  const [numberOfUnits, setNumberOfUnits] = useState<LoadDetails['numberOfUnits']>(
    initialLoadDetails.numberOfUnits
  );
  const [palletType, setPalletType] = useState<LoadDetails['palletType']>(
    initialLoadDetails.palletType
  );
  const [dimensions, setDimensions] = useState<LoadDetails['dimensions']>(
    initialLoadDetails.dimensions
  );
  const [dimensionUnit, setDimensionUnit] = useState<LoadDetails['dimensionUnit']>(
    initialLoadDetails.dimensionUnit
  );
  const [weightPerUnit, setWeightPerUnit] = useState<LoadDetails['weightPerUnit']>(
    initialLoadDetails.weightPerUnit
  );
  const [weightUnit, setWeightUnit] = useState<LoadDetails['weightUnit']>(
    initialLoadDetails.weightUnit
  );
  const [totalVolume, setTotalVolume] = useState<LoadDetails['totalVolume']>(
    initialLoadDetails.totalVolume
  );
  const [totalVolumeUnit, setTotalVolumeUnit] = useState<LoadDetails['totalVolumeUnit']>(
    initialLoadDetails.totalVolumeUnit
  );
  const [totalWeight, setTotalWeight] = useState<LoadDetails['totalWeight']>(
    initialLoadDetails.totalWeight
  );
  const [totalWeightUnit, setTotalWeightUnit] = useState<LoadDetails['totalWeightUnit']>(
    initialLoadDetails.totalWeightUnit
  );
  const [containerType, setContainerType] = useState<LoadDetails['containerType']>(
    initialLoadDetails.containerType
  );
  const [isOverweight, setIsOverweight] = useState<LoadDetails['isOverweight']>(
    initialLoadDetails.isOverweight
  );

  // Language state is now managed in QuoteFormContext.tsx

  const standardPalletTypes = ['EUR1', 'EUR2', 'US_STANDARD'];

  const languageOptions = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'it', label: '🇮🇹 Italiano' },
    { value: 'nl', label: '🇳🇱 Nederlands' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'ar', label: '🇸🇦 العربية' },
    { value: 'pt', label: '🇵🇹 Português' },
    { value: 'tr', label: '🇹🇷 Türkçe' },
    { value: 'ru', label: '🇷🇺 Русский' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryListRef.current &&
        !countryListRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsCountryListVisible(false);
      }

      // Origin port list removed; origin selection handled within StepOrigin

      if (destPortListRef.current && !destPortListRef.current.contains(event.target as Node)) {
        setIsDestPortListVisible(false);
      }

      // Phone prefix dropdown now handled inside StepContact

      // Step 5 custom dropdowns moved inside StepGoodsDetails

      // Step 6 custom dropdowns
      // Experience dropdown handled in StepContact
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsDestPortListVisible]);

  // Auto-positioning logic for dropdowns to prevent overflow
  useEffect(() => {
    const adjustDropdownPosition = (
      dropdown: HTMLElement | null,
      inputElement: HTMLElement | null
    ) => {
      if (!dropdown || !inputElement) return;

      const inputRect = inputElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 300; // Maximum height from CSS

      // Calculate available space
      const spaceBelow = viewportHeight - inputRect.bottom - 20; // 20px padding
      const spaceAbove = inputRect.top - 20; // 20px padding
      const spaceRight = viewportWidth - inputRect.left;
      const spaceLeft = inputRect.right;

      // Reset classes
      dropdown.classList.remove('show-above', 'adjust-right', 'adjust-left');

      // Vertical positioning - show above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        dropdown.classList.add('show-above');
      }

      // Horizontal positioning - adjust if dropdown would overflow
      if (spaceRight < 300) {
        // Minimum dropdown width
        dropdown.classList.add('adjust-right');
      } else if (spaceLeft < 300) {
        dropdown.classList.add('adjust-left');
      }

      // Set CSS custom property for dynamic max-height calculation
      dropdown.style.setProperty('--dropdown-top', `${inputRect.bottom}px`);
    };

    // Adjust all visible dropdowns
    if (isCountryListVisible && countryListRef.current && searchInputRef.current) {
      adjustDropdownPosition(countryListRef.current, searchInputRef.current);
    }

    // Origin port list removed; no positioning needed

    // Phone prefix dropdown handled inside StepContact

    // Step 5 dropdown positioning handled within StepGoodsDetails

    // Experience dropdown handled in StepContact

    // Re-adjust on scroll or resize
    const handleResize = () => {
      if (isCountryListVisible && countryListRef.current && searchInputRef.current) {
        adjustDropdownPosition(countryListRef.current, searchInputRef.current);
      }
      // Origin port list removed; no positioning needed
      // Phone prefix dropdown handled inside StepContact
      // Step 5 dropdown positioning handled within StepGoodsDetails
      // Experience dropdown handled in StepContact
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isCountryListVisible]);

  const isLoadDataValid = (load: LoadDetails, loadIndex: number): boolean => {
    const loadNumber = loadIndex + 1;

    // First check if shipping type is selected
    if (!load.shippingType) {
      showToast(`Shipment ${loadNumber}: ${getText('validationShippingType', userLang)}`);
      return false;
    }

    // If user selected "unsure", no validation needed - they'll get assistance
    if (load.shippingType === 'unsure') {
      return true;
    }

    if (load.shippingType === 'loose') {
      if (load.calculationType === 'unit') {
        if (!load.packageType) {
          showToast(`Shipment ${loadNumber}: ${getText('validationPackageType', userLang)}`);
          return false;
        }
        if (load.packageType === 'pallets') {
          if (load.palletType === 'non_specified') {
            if (!load.dimensions.length || !load.dimensions.width || !load.dimensions.height) {
              showToast(
                `Shipment ${loadNumber}: ${getText('validationDimensionsNonSpecified', userLang)}`
              );
              return false;
            }
          } else if (standardPalletTypes.includes(load.palletType)) {
            if (!load.dimensions.height) {
              showToast(`Shipment ${loadNumber}: ${getText('validationPalletHeight', userLang)}`);
              return false;
            }
          }
        } else if (load.packageType === 'boxes') {
          if (!load.dimensions.length || !load.dimensions.width || !load.dimensions.height) {
            showToast(`Shipment ${loadNumber}: ${getText('validationBoxDimensions', userLang)}`);
            return false;
          }
        }
        if (!load.weightPerUnit) {
          showToast(`Shipment ${loadNumber}: ${getText('validationWeightPerUnit', userLang)}`);
          return false;
        }
        if (!load.numberOfUnits || load.numberOfUnits < 1) {
          showToast(`Shipment ${loadNumber}: Please specify the number of units (minimum 1)`);
          return false;
        }
      } else {
        // calculationType === 'total'
        // New rule: at least one of totalVolume or totalWeight must be provided
        if (!load.totalVolume && !load.totalWeight) {
          const msg =
            getText('validationAtLeastOneOfVolumeOrWeight', userLang) ||
            'Please provide total volume or total weight';
          showToast(`Shipment ${loadNumber}: ${msg}`);
          return false;
        }
      }
    } else {
      // shippingType === 'container'
      if (!load.containerType) {
        showToast(`Shipment ${loadNumber}: ${getText('validationContainerType', userLang)}`);
        return false;
      }
    }
    return true;
  };

  // Effect to populate individual cargo states when activeLoadIndex changes or loads array is reset
  useEffect(() => {
    const currentLoad = formData.loads[activeLoadIndex];
    if (currentLoad) {
      setShippingType(currentLoad.shippingType);
      setCalculationType(currentLoad.calculationType);
      setPackageType(currentLoad.packageType);
      setNumberOfUnits(currentLoad.numberOfUnits);
      setPalletType(currentLoad.palletType);
      setDimensions(currentLoad.dimensions);
      setDimensionUnit(currentLoad.dimensionUnit);
      setWeightPerUnit(currentLoad.weightPerUnit);
      setWeightUnit(currentLoad.weightUnit);
      setTotalVolume(currentLoad.totalVolume);
      setTotalVolumeUnit(currentLoad.totalVolumeUnit);
      setTotalWeight(currentLoad.totalWeight);
      setTotalWeightUnit(currentLoad.totalWeightUnit);
      setContainerType(currentLoad.containerType);
      setIsOverweight(currentLoad.isOverweight);
    }
  }, [activeLoadIndex, formData.loads]);

  // Centralized function to sync current individual load states to the formData.loads array
  const syncCurrentLoadToArray = (): LoadDetails => {
    const currentLoadFromStates: LoadDetails = {
      shippingType,
      calculationType,
      packageType,
      numberOfUnits,
      palletType,
      dimensions,
      dimensionUnit,
      weightPerUnit,
      weightUnit,
      totalVolume,
      totalVolumeUnit,
      totalWeight,
      totalWeightUnit,
      containerType,
      isOverweight,
    };

    // Update the array with current individual states
    setFormData((prevFormData) => {
      if (activeLoadIndex < 0 || activeLoadIndex >= prevFormData.loads.length) {
        return prevFormData;
      }

      const updatedLoads = prevFormData.loads.map((load, idx) =>
        idx === activeLoadIndex ? currentLoadFromStates : load
      );

      return { ...prevFormData, loads: updatedLoads };
    });

    return currentLoadFromStates;
  };

  const validateField = (name: string, value: string): boolean => {
    let isValid = true;
    switch (name) {
      case 'country':
        isValid = value.trim() !== '';
        break;
      case 'origin':
        isValid = value.trim() !== '';
        break;
      case 'mode':
        isValid = value !== '';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'city':
        // City must contain letters/numbers/spaces and be at least 2 characters (international support)
        isValid = /^[\p{L}\p{N}\s'.,()-]{2,}$/u.test(value.trim());
        break;
      case 'zipCode':
        // Zip code must be at least 2 digits and contain only numbers
        isValid = /^\d{2,}$/.test(value.trim());
        break;
      case 'destCity':
        // Destination city must contain letters/numbers/spaces and be at least 2 characters (international support)
        isValid = /^[\p{L}\p{N}\s'.,()-]{2,}$/u.test(value.trim());
        break;
      case 'destZipCode':
        // Destination zip code must be at least 2 digits and contain only numbers
        isValid = /^\d{2,}$/.test(value.trim());
        break;
      case 'firstName':
        isValid = value.trim().length >= 1;
        break;
      case 'lastName':
        isValid = value.trim().length >= 1;
        break;
      case 'companyName':
        isValid = value.trim().length >= 1;
        break;
      case 'shipperType':
        isValid = value !== '';
        break;
      case 'goodsValue':
        isValid = value.trim() !== '' && parseFloat(value) > 0;
        break;
      case 'destLocationType':
        isValid = value !== '';
        break;
      case 'locationType':
        isValid = value !== '';
        break;
      default:
        return true; // Assume valid or handled elsewhere
    }
    setFieldValid((prev) => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.country) {
          showToast(getText('validationDestinationCountry', userLang));
          setFieldValid((prev) => ({ ...prev, country: false }));
          return false;
        }
        if (!formData.destLocationType) {
          showToast(getText('validationDestinationLocationType', userLang));
          setFieldValid((prev) => ({ ...prev, destLocationType: false }));
          return false;
        }
        if (formData.destLocationType) {
          if (formData.destLocationType === 'port') {
            // For port destinations, validate that a destination port is selected
            if (!formData.destPort) {
              showToast(
                getText('validationDestinationPort', userLang) || 'Please select a destination port'
              );
              setFieldValid((prev) => ({ ...prev, destPort: false }));
              return false;
            }
          } else {
            // For non-port destinations, validate city and zip code
            if (!formData.destCity || !validateField('destCity', formData.destCity)) {
              showToast(getText('validationDestinationCity', userLang));
              setFieldValid((prev) => ({ ...prev, destCity: false }));
              return false;
            }
            if (!formData.destZipCode || !validateField('destZipCode', formData.destZipCode)) {
              showToast(getText('validationDestinationZip', userLang));
              setFieldValid((prev) => ({ ...prev, destZipCode: false }));
              return false;
            }
          }
        }
        setFieldValid((prev) => ({
          ...prev,
          country: true,
          destLocationType: true,
          destCity:
            formData.destLocationType && formData.destLocationType !== 'port'
              ? !!formData.destCity
              : null,
          destZipCode:
            formData.destLocationType && formData.destLocationType !== 'port'
              ? !!formData.destZipCode
              : null,
          destPort: formData.destLocationType === 'port' ? !!formData.destPort : null,
        }));
        break;
      case 2:
        if (!formData.mode) {
          showToast(getText('validationShippingMode', userLang));
          setFieldValid((prev) => ({ ...prev, mode: false }));
          return false;
        }
        setFieldValid((prev) => ({ ...prev, mode: true }));
        break;
      case 3:
        // 1. Check if an origin location type is selected
        if (!formData.locationType) {
          showToast(getText('validationPickupLocationType', userLang));
          setFieldValid((prev) => ({ ...prev, locationType: false }));
          return false;
        }

        // 2. Validate based on the selected location type
        if (formData.locationType === 'port') {
          if (!formData.origin) {
            showToast(getText('validationOriginPort', userLang));
            setFieldValid((prev) => ({ ...prev, origin: false }));
            return false;
          }
        } else if (['factory', 'business', 'residential'].includes(formData.locationType)) {
          if (!formData.city) {
            showToast(getText('validationPickupCity', userLang));
            setFieldValid((prev) => ({ ...prev, city: false }));
            return false;
          }
          if (!formData.zipCode) {
            showToast(getText('validationPickupZip', userLang));
            setFieldValid((prev) => ({ ...prev, zipCode: false }));
            return false;
          }
        }

        // If all checks for step 3 passed
        setFieldValid((prev) => ({
          ...prev,
          locationType: true,
          origin: formData.locationType === 'port' ? !!formData.origin : null, // Valid if port and origin selected, null otherwise
          city: ['factory', 'business', 'residential'].includes(formData.locationType)
            ? !!formData.city
            : null,
          zipCode: ['factory', 'business', 'residential'].includes(formData.locationType)
            ? !!formData.zipCode
            : null,
        }));
        break;
      case 4:
        // Validation for step 4 - Cargo Details
        // First, sync current active load to ensure latest data is in the array
        syncCurrentLoadToArray();

        // Now validate all loads with up-to-date data
        for (let i = 0; i < formData.loads.length; i++) {
          if (!isLoadDataValid(formData.loads[i], i)) {
            setActiveLoadIndex(i); // Switch to the invalid load
            return false; // Stop validation if any load is invalid
          }
        }
        break;
      case 5: // New Step 5: Goods Details
        // Check if all sub-steps are completed
        if (!formData.goodsValue) {
          showToast(getText('validationGoodsValue', userLang));
          setFieldValid((prev) => ({ ...prev, goodsValue: false }));
          return false;
        }
        if (!formData.areGoodsReady) {
          showToast(getText('validationReadyDate', userLang));
          return false;
        }
        // Sub-step 3 is optional, so no validation needed
        setFieldValid((prev) => ({ ...prev, goodsValue: true }));
        break;
      case 6: // Step 6: Contact
        if (!formData.customerType) {
          showToast(getText('validationShipperType', userLang));
          return false;
        }
        if (!formData.firstName) {
          showToast(getText('validationFirstName', userLang));
          setFieldValid((prev) => ({ ...prev, firstName: false }));
          return false;
        }
        if (!formData.lastName) {
          showToast(getText('validationLastName', userLang));
          setFieldValid((prev) => ({ ...prev, lastName: false }));
          return false;
        }
        // Only require company name if customer type is 'company'
        if (formData.customerType === 'company' && !formData.companyName) {
          showToast(getText('validationCompanyName', userLang));
          setFieldValid((prev) => ({ ...prev, companyName: false }));
          return false;
        }
        if (!formData.shipperType) {
          showToast(getText('validationShipperRole', userLang));
          setFieldValid((prev) => ({ ...prev, shipperType: false }));
          return false;
        }
        if (!formData.email || !validateField('email', formData.email)) {
          showToast(getText('validationEmail', userLang));
          setFieldValid((prev) => ({ ...prev, email: false }));
          return false;
        }
        // If all checks for step 6 passed
        setFieldValid((prev) => ({
          ...prev,
          firstName: true,
          lastName: true,
          companyName: formData.customerType === 'company' ? !!formData.companyName : true,
          shipperType: true,
          email: true,
        }));
        break;
    }
    return true;
  };

  // Using nextStep and prevStep from context
  // Handle Enter key to proceed to next step
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only proceed if Enter key is pressed
      if (event.key !== 'Enter') return;

      // Don't trigger if user is in a textarea or if any dropdown is open
      const target = event.target as HTMLElement;
      const isInTextarea = target.tagName === 'TEXTAREA';
      const isInInput = target.tagName === 'INPUT';
      const anyDropdownOpen = isCountryListVisible; // other dropdowns handled within their steps

      // Don't trigger if any dropdown is open or if user is typing in textarea
      if (anyDropdownOpen || isInTextarea) return;

      // Don't trigger if we're on the final confirmation step
      if (currentStep === 7) return;

      // For input fields, allow normal Enter behavior (form submission) but prevent our custom handler
      if (isInInput) {
        // If it's the last step with a submit button, let the form handle it
        if (currentStep === 6) return;
        // Otherwise prevent default and trigger next step
        event.preventDefault();
      }

      // Trigger next step or submit
      if (currentStep < 6) {
        nextStep();
      } else if (currentStep === 6) {
        // On step 6, trigger form submission
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, nextStep, isCountryListVisible]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Allow any immediately preceding state updates (e.g., customer type click) to flush before validation
    await Promise.resolve();
    if (validateStep(currentStep)) {
      const makeWebhookUrl = 'https://hook.eu1.make.com/8afhony6fmk7pgxavn969atkmq0xrm1s';

      // Use proxy URLs in development, direct URLs in production
      const isDevelopment = import.meta.env.DEV;
      const n8nTestWebhookUrl = isDevelopment
        ? '/api/n8n-test'
        : 'https://n8n.srv783609.hstgr.cloud/webhook-test/228cb671-34ad-4e2e-95ab-95d830d875df';
      const n8nProdWebhookUrl = isDevelopment
        ? '/api/n8n-prod'
        : 'https://n8n.srv783609.hstgr.cloud/webhook/228cb671-34ad-4e2e-95ab-95d830d875df';

      // 1. Sync and prepare the data from current active load states
      const activeLoadSubmitData = syncCurrentLoadToArray();

      // 2. Prepare the base formData for the payload
      const payloadBase = { ...formData };

      // Convert country code to name for the main payload data
      const countryObj = COUNTRIES.find((c) => c.code === formData.country);
      if (countryObj) {
        payloadBase.country = countryObj.name; // Country name for the payload field
      }

      // Convert origin port/airport code to name
      const allPortsAndAirports = [...SEA_PORTS, ...AIRPORTS, ...RAIL_TERMINALS];
      const originObj = allPortsAndAirports.find((p) => p.code === formData.origin);
      if (originObj) {
        payloadBase.origin = originObj.name;
      }

      // 3. Process the loads array to clean container data and use latest active load data
      const processedLoads = formData.loads.map((loadInState, idx) => {
        // Use the most up-to-date data for the active load, others from formData.loads
        const currentLoadDetailsToProcess =
          idx === activeLoadIndex ? activeLoadSubmitData : { ...loadInState };

        if (currentLoadDetailsToProcess.shippingType === 'container') {
          return {
            shippingType: 'container',
            numberOfUnits: currentLoadDetailsToProcess.numberOfUnits,
            containerType: currentLoadDetailsToProcess.containerType,
            isOverweight: currentLoadDetailsToProcess.isOverweight,
            // Set fields not applicable to containers to empty or default initial values
            calculationType: '',
            packageType: '',
            palletType: '',
            dimensions: { length: '', width: '', height: '' },
            dimensionUnit: initialLoadDetails.dimensionUnit,
            weightPerUnit: '',
            weightUnit: initialLoadDetails.weightUnit,
            totalVolume: '',
            totalVolumeUnit: initialLoadDetails.totalVolumeUnit,
            totalWeight: '',
            totalWeightUnit: initialLoadDetails.totalWeightUnit,
          };
        }
        // If it's loose cargo, return it as is (it contains the correct fields)
        return currentLoadDetailsToProcess;
      });

      // 4. Add submission metadata and finalize payload
      const now = new Date();
      // Get date and time parts for Hong Kong timezone
      // 'en-CA' locale for YYYY-MM-DD format
      const datePartHKT = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' });
      // 'en-GB' locale for HH:MM:SS format (24-hour)
      const timePartHKT = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Hong_Kong',
        hourCycle: 'h23',
      });

      const submissionTimestampHKT = `${datePartHKT}T${timePartHKT}+08:00`; // Hong Kong is UTC+8

      // Use formData.country (the code) for the ID, if available, otherwise an empty string or placeholder
      const countryCodeForId = formData.country || 'N/A';
      const submissionId = `form-${countryCodeForId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const finalPayload = {
        submissionId: submissionId,
        timestamp: submissionTimestampHKT, // Utiliser le timestamp HKT
        ...payloadBase, // Spread the rest of the form data (country here will be the name)
        loads: processedLoads, // Add the processed loads
      };

      try {
        const promises = [
          fetch(n8nTestWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload),
          }),
          fetch(n8nProdWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload),
          }),
          fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload),
          }),
        ];

        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
          const url = [n8nTestWebhookUrl, n8nProdWebhookUrl, makeWebhookUrl][index];
          if (result.status === 'fulfilled') {
            console.log(`Webhook to ${url} succeeded.`, result.value);
          } else {
            console.error(`Webhook to ${url} failed.`, result.reason);
          }
        });

        const makeResult = results[2];
        if (
          makeResult.status === 'rejected' ||
          (makeResult.status === 'fulfilled' && !makeResult.value.ok)
        ) {
          const errorReason =
            makeResult.status === 'rejected' ? makeResult.reason : await makeResult.value.text();
          const errorStatus = makeResult.status === 'fulfilled' ? makeResult.value.status : 'N/A';

          console.error('Main webhook (make.com) failed:', errorStatus, errorReason);
          showToast(`Error: Main quote submission failed. Status: ${errorStatus}.`);
          return;
        }

        // Set submission data and go to confirmation page
        setSubmissionId(submissionId);
        setCurrentStep(7);

        // Don't reset form data immediately - user might want to see the summary
        // We'll reset when they start a new request

        // Form is kept intact for confirmation page display
        // User can start a new request from the confirmation page
      } catch (error) {
        console.error('An unexpected error occurred during submission:', error);
        showToast(getText('errorSubmission', userLang));
      }
    }
  };

  return (
    <div className="quote-form-container hover-lift">
      <div className="form-header">
        <h1 className="form-title bg-clip-text text-transparent bg-gradient-to-r from-[#001C38] to-[#D6DF20] animate-fade-in">
          {currentStep === 7
            ? getText('confirmationMainTitle', userLang)
            : getText('mainTitle', userLang)}
        </h1>
        <p className="form-subtitle text-[#001C38]/70 animate-slide-in">
          {currentStep === 7
            ? getText('confirmationSubtitle', userLang)
            : getText('mainSubtitle', userLang)}
        </p>

        {/* Sélecteur de langue avec CustomDropdown */}
        <div className="language-selector-header">
          <CustomDropdown
            value={userLang}
            onChange={(value) => setUserLang(value as typeof userLang)}
            options={languageOptions}
            placeholder="Select language"
          />
        </div>
      </div>

      {/* Hide Timeline on confirmation page */}
      {currentStep !== 7 && (
        <Timeline
          currentStep={currentStep}
          totalSteps={6}
          translations={{
            timelineDestination: getText('timelineDestination', userLang),
            timelineMode: getText('timelineMode', userLang),
            timelineOrigin: getText('timelineOrigin', userLang),
            timelineCargo: getText('timelineCargo', userLang),
            timelineGoodsDetails: getText('timelineGoodsDetails', userLang),
            timelineContact: getText('timelineContact', userLang),
            stepCounter: getText('stepCounter', userLang),
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="quote-form">
        <StepDestination />
        <StepMode />
        <StepOrigin />
        <StepFreight />
        <StepGoodsDetails />
        <StepContact />
        {currentStep !== 7 && (
          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary glassmorphism"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <ChevronLeft size={16} />
                {getText('previous', userLang)}
              </button>
            )}
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary glassmorphism"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {getText('next', userLang)}
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success glassmorphism"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {getText('getMyQuote', userLang)}
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </form>

      {/* Step 7: Confirmation Page */}
      <StepConfirmation
        submissionId={submissionId}
        setSubmissionId={setSubmissionId}
        showToast={showToast}
      />

      <div className="trust-badge glassmorphism">
        <span>💡 {getText('trustBadge', userLang)}</span>
      </div>

      <Toast message={toastMessage} isVisible={!!toastMessage} />
    </div>
  );
};

export default QuoteForm;
