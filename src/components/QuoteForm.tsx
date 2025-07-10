import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Truck, Ship, Plane, TrainFront, CheckCircle, Search, MapPin, Building2, Home, Warehouse, PackageCheck, Minus, Plus, Info, XCircle, PackageOpen, Container, Package, Copy, BarChart3, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Timeline from './Timeline';
import FormStep from './FormStep';
import Toast from './Toast';
import { COUNTRIES } from '../data/countries';
import { TEST_LEADS } from '../data/testLeads';

const LOCATION_TYPES = [
  { id: 'factory', name: 'Factory/Warehouse', icon: Warehouse },
  { id: 'port', name: 'Port/Airport', icon: Ship },
  { id: 'business', name: 'Business address', icon: Building2 },
  { id: 'residential', name: 'Residential address', icon: Home }
];

// Helper function to get translated location type name
const getLocationTypeName = (typeId: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode?: string) => {
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
};

// Helper function to get translated location type description
const getLocationTypeDescription = (typeId: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  switch (typeId) {
    case 'business': return translations.businessDescription || 'Company address, office building';
    case 'residential': return translations.residentialDescription || 'House, apartment, personal address';
    case 'factory': return translations.factoryDescription || 'Factory, distribution center, warehouse';
    case 'port': return translations.portDescription || 'Direct to port/airport pickup';
    default: return '';
  }
};

// Helper function to get translated port/airport/terminal name
const getTranslatedPortName = (port: any, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  
  // Check if we have a translation for this specific port
  if (translations.ports && translations.ports[port.code]) {
    return translations.ports[port.code];
  }
  
  // Fallback to original name
  return port.name;
};

// Helper function to get translated region name
const getTranslatedRegionName = (region: string, userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  
  // Check if we have a translation for this region
  if (translations.regions && translations.regions[region]) {
    return translations.regions[region];
  }
  
  // Fallback to original region name
  return region;
};

// Helper function to get dynamic search placeholder text based on shipping mode
const getDynamicSearchText = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode: string) => {
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
};

// Helper function to get dynamic selection title text based on shipping mode
const getDynamicSelectText = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru', mode: string) => {
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
};

// Helper function to get simplified generic description
const getLocationDescription = (userLang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  const translations = I18N_TEXT[userLang] as any;
  return translations.chooseLocationDescription || 'Choose your pickup location';
};

const SEA_PORTS = [
  { code: 'SHA', name: 'Shanghai', region: 'East China', type: 'sea', volume: '47M TEU', flag: '🚢' },
  { code: 'SZX', name: 'Shenzhen', region: 'South China', type: 'sea', volume: '28M TEU', flag: '🚢' },
  { code: 'NGB', name: 'Ningbo-Zhoushan', region: 'East China', type: 'sea', volume: '31M TEU', flag: '🚢' },
  { code: 'GZH', name: 'Guangzhou', region: 'South China', type: 'sea', volume: '24M TEU', flag: '🚢' },
  { code: 'QIN', name: 'Qingdao', region: 'North China', type: 'sea', volume: '23M TEU', flag: '🚢' },
  { code: 'TJN', name: 'Tianjin', region: 'North China', type: 'sea', volume: '20M TEU', flag: '🚢' },
  { code: 'XMN', name: 'Xiamen', region: 'South China', type: 'sea', volume: '12M TEU', flag: '🚢' },
  { code: 'DLN', name: 'Dalian', region: 'North China', type: 'sea', volume: '10M TEU', flag: '🚢' },
  { code: 'YTN', name: 'Yantian', region: 'South China', type: 'sea', volume: '14M TEU', flag: '🚢' },
  { code: 'LYG', name: 'Lianyungang', region: 'East China', type: 'sea', volume: '8M TEU', flag: '🚢' }
].sort((a, b) => a.name.localeCompare(b.name));

const AIRPORTS = [
  { code: 'PEK', name: 'Beijing Capital', region: 'North China', type: 'air', volume: '2M tons', flag: '✈️' },
  { code: 'PVG', name: 'Shanghai Pudong', region: 'East China', type: 'air', volume: '3.6M tons', flag: '✈️' },
  { code: 'CAN', name: 'Guangzhou Baiyun', region: 'South China', type: 'air', volume: '1.9M tons', flag: '✈️' },
  { code: 'SZX', name: 'Shenzhen Bao\'an', region: 'South China', type: 'air', volume: '1.4M tons', flag: '✈️' },
  { code: 'CTU', name: 'Chengdu Shuangliu', region: 'West China', type: 'air', volume: '1M tons', flag: '✈️' },
  { code: 'SHA', name: 'Shanghai Hongqiao', region: 'East China', type: 'air', volume: '0.8M tons', flag: '✈️' },
  { code: 'KMG', name: 'Kunming Changshui', region: 'Southwest China', type: 'air', volume: '0.7M tons', flag: '✈️' },
  { code: 'XIY', name: "Xi'an Xianyang", region: 'Northwest China', type: 'air', volume: '0.6M tons', flag: '✈️' },
  { code: 'HGH', name: 'Hangzhou Xiaoshan', region: 'East China', type: 'air', volume: '0.5M tons', flag: '✈️' },
  { code: 'NKG', name: 'Nanjing Lukou', region: 'East China', type: 'air', volume: '0.4M tons', flag: '✈️' }
].sort((a, b) => a.name.localeCompare(b.name));

// Rail terminals (for rail freight shipments)
const RAIL_TERMINALS = [
  { code: 'ZIH', name: 'Zhengzhou Rail Terminal', region: 'Central China', type: 'rail', volume: '250 000+ TEU', flag: '🚂' },
  { code: 'CQN', name: 'Chongqing Rail Terminal', region: 'Southwest China', type: 'rail', volume: '450 000+ TEU', flag: '🚂' },
  { code: 'XIY', name: "Xi'an Rail Terminal", region: 'Northwest China', type: 'rail', volume: '570 000+ TEU', flag: '🚂' },
  { code: 'WUH', name: 'Wuhan Rail Terminal', region: 'Central China', type: 'rail', volume: '200 000 TEU', flag: '🚂' },
  { code: 'CDU', name: 'Chengdu Rail Terminal', region: 'Southwest China', type: 'rail', volume: '500 000+ TEU', flag: '🚂' },
].sort((a, b) => a.name.localeCompare(b.name));



// Countries accessible via rail freight from China (ISO codes)
const RAIL_FREIGHT_COUNTRIES = [
  'AT','BE','BG','CH','CZ','DE','DK','EE','ES','FI','FR','GB','HU','IT','LT','LV','NL','NO','PL','PT','RO','SE','SI','SK','UA','RU','BY','KZ','MN'
];

// Prioritized countries by language - countries that are most relevant to speakers of each language
const PRIORITY_COUNTRIES_BY_LANG: Record<string, string[]> = {
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
};

// ===== CUSTOM DROPDOWN COMPONENT =====
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; }>;
  placeholder?: string;
  compact?: boolean;
  unitSelector?: boolean;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  compact = false,
  unitSelector = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Auto-position dropdown
  useEffect(() => {
    if (isOpen && listRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const listElement = listRef.current;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Reset classes
      listElement.classList.remove('show-above', 'adjust-left', 'adjust-right');

      // Check if should show above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        listElement.classList.add('show-above');
      }

      // Check horizontal position
      const listWidth = 200; // approximate dropdown width
      const triggerLeft = triggerRect.left;
      const triggerRight = triggerRect.right;
      const viewportWidth = window.innerWidth;

      if (triggerRight + listWidth > viewportWidth) {
        listElement.classList.add('adjust-right');
      } else if (triggerLeft < 0) {
        listElement.classList.add('adjust-left');
      }
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const dropdownClasses = [
    'custom-dropdown',
    compact ? 'compact' : '',
    unitSelector ? 'unit-selector' : '',
    disabled ? 'disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <div ref={dropdownRef} className={dropdownClasses}>
      <button
        ref={triggerRef}
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-dropdown-text">{displayText}</span>
        <ChevronDown size={16} className="custom-dropdown-icon" />
      </button>
      
      <div
        ref={listRef}
        className={`custom-dropdown-list ${isOpen ? 'show' : ''}`}
        role="listbox"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
            role="option"
            aria-selected={value === option.value}
          >
            <span className="custom-dropdown-option-text">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple text dictionary for i18n (extend as needed)
const I18N_TEXT = {
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
      'CDU': 'Chengdu Rail Terminal'
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
    whatsappLine: 'WhatsApp line',
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
      'CDU': 'Terminal ferroviaire de Chengdu'
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
    whatsappLine: 'Ligne WhatsApp',
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
    unsureShipping: "我还不确定",
    unsureShippingDesc: '让专家帮助您',
    unsureShippingBenefits: '专业指导',
    unsureShippingFeedback: "很好的选择！我们将为您的具体需求推荐最佳的运输方案",
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
    dontKnowPort: "我不知道",
    dontKnowPortDescription: "我不确定选择哪个港口/码头",
    dontKnowPortFeedback: "没问题！我们会帮您选择最合适的港口/码头。",
    perfectPortFeedback: "完美！我们将从以下地点取货：",
    cityPickupFeedback: "太好了！我们将安排从中国{city}取货",
    annualVolume: "年吞吐量",
    // Port translations
    ports: {
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
      'CDU': '成都铁路枢纽'
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
    whatsappLine: 'WhatsApp 联系方式',
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
      // Additional shipment summary translations
      shipmentTitle: '货运',
      setupPending: '设置待处理...',
      addAnotherShipment: '添加另一个货运',
      items: '项目',
      each: '每个',
      totalCalculation: '总计算',
      overweight: '超重',
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
    unsureShipping: "Ich bin mir noch nicht sicher",
    unsureShippingDesc: 'Lassen Sie die Experten helfen',
    unsureShippingBenefits: 'Professionelle Beratung',
    unsureShippingFeedback: "Ausgezeichnete Wahl! Wir empfehlen die beste Versandoption für Ihre spezifischen Bedürfnisse",
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
    dontKnowPort: "Ich weiß nicht",
    dontKnowPortDescription: "Ich bin mir nicht sicher, welchen Hafen/Terminal ich wählen soll",
    dontKnowPortFeedback: "Kein Problem! Wir helfen Ihnen bei der Auswahl des besten Hafens/Terminals für Ihre Sendung.",
    perfectPortFeedback: "Perfekt! Wir holen ab von",
    cityPickupFeedback: "Großartig! Wir arrangieren die Abholung von {city}, China",
    annualVolume: "Jahresvolumen",
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
      'CDU': 'Bahnhof Chengdu'
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
    whatsappLine: 'WhatsApp-Leitung',
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
      // Additional shipment summary translations
      shipmentTitle: 'Sendung',
      setupPending: 'Einrichtung ausstehend...',
      addAnotherShipment: 'Weitere Sendung hinzufügen',
      items: 'Artikel',
      each: 'jeweils',
      totalCalculation: 'Gesamtberechnung',
      overweight: 'Übergewicht',
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
    unsureShipping: "Aún no estoy seguro",
    unsureShippingDesc: 'Deja que los expertos ayuden',
    unsureShippingBenefits: 'Orientación profesional',
    unsureShippingFeedback: "¡Excelente elección! Recomendaremos la mejor opción de envío para tus necesidades específicas",
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
    dontKnowPort: "No lo sé",
    dontKnowPortDescription: "No estoy seguro de qué puerto/terminal elegir",
    dontKnowPortFeedback: "¡No hay problema! Te ayudaremos a elegir el mejor puerto/terminal para tu envío.",
    perfectPortFeedback: "¡Perfecto! Recogeremos desde",
    cityPickupFeedback: "¡Perfecto! Organizaremos la recogida desde {city}, China",
    annualVolume: "Volumen anual",
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
      'CDU': 'Terminal ferroviaria de Chengdu'
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
      whatsappLine: 'Línea WhatsApp',
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
      // Additional shipment summary translations
      shipmentTitle: 'Envío',
      setupPending: 'Configuración pendiente...',
      addAnotherShipment: 'Agregar Otro Envío',
      items: 'Artículos',
      each: 'cada uno',
      totalCalculation: 'Cálculo total',
      overweight: 'Sobrepeso',
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
    dontKnowPort: "Non lo so",
    dontKnowPortDescription: "Non sono sicuro di quale porto/terminal scegliere",
    dontKnowPortFeedback: "Nessun problema! Ti aiuteremo a scegliere il miglior porto/terminal per la tua spedizione.",
    perfectPortFeedback: "Perfetto! Ritireremo da",
    cityPickupFeedback: "Perfetto! Organizzeremo il ritiro da {city}, Cina",
    annualVolume: "Volume annuale",
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
      'CDU': 'Terminal ferroviario di Chengdu'
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
      whatsappLine: 'Linea WhatsApp',
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
      // Additional shipment summary translations
      shipmentTitle: 'Spedizione',
      setupPending: 'Configurazione in attesa...',
      addAnotherShipment: 'Aggiungi Altra Spedizione',
      items: 'Articoli',
      each: 'ciascuno',
      totalCalculation: 'Calcolo totale',
      overweight: 'Sovrappeso',
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
    dontKnowPort: "Ik weet het niet",
    dontKnowPortDescription: "Ik weet niet zeker welke haven/terminal te kiezen",
    dontKnowPortFeedback: "Geen probleem! We helpen je de beste haven/terminal voor je zending te kiezen.",
    perfectPortFeedback: "Perfect! We halen op van",
    cityPickupFeedback: "Geweldig! We regelen ophaal uit {city}, China",
    annualVolume: "Jaarlijks volume",
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
      'XIY': 'Xi\'an Xianyang Luchthaven',
      'HGH': 'Hangzhou Xiaoshan Luchthaven',
      'NKG': 'Nanjing Lukou Luchthaven',
      'ZIH': 'Zhengzhou Spoorwegstation',
      'CQN': 'Chongqing Spoorwegstation',
      'WUH': 'Wuhan Spoorwegstation',
      'CDU': 'Chengdu Spoorwegstation'
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
      whatsappLine: 'WhatsApp lijn',
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
      // Additional shipment summary translations
      shipmentTitle: 'Zending',
      setupPending: 'Setup in behandeling...',
      addAnotherShipment: 'Voeg Nog Een Zending Toe',
      items: 'Items',
      each: 'elk',
      totalCalculation: 'Totale berekening',
      overweight: 'Overgewicht',
  },
  ar: {
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
    dontKnowPort: "لا أعرف",
    dontKnowPortDescription: "لست متأكداً من الميناء/المحطة التي يجب اختيارها",
    dontKnowPortFeedback: "لا مشكلة! سنساعدك في اختيار أفضل ميناء/محطة لشحنتك.",
    perfectPortFeedback: "ممتاز! سنقوم بالتحصيل من",
    cityPickupFeedback: "رائع! سنرتب الاستلام من {city}، الصين",
    annualVolume: "الحجم السنوي",
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
      'CDU': 'محطة قطار تشنغدو'
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
      whatsappLine: 'خط الواتساب',
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
      managingShipments: 'إدارة {count} شحنة',
      configureShipments: 'قم بتكوين كل شحنة على حدة أو أضف شحنات متعددة للطلبات المعقدة',
      addShipment: 'إضافة شحنة',
      validating: 'جاري التحقق...',
      active: 'نشط',
      shipmentsCount: 'الشحنات ({count})',
      addNewShipment: 'إضافة شحنة جديدة',
      duplicateShipment: 'نسخ هذه الشحنة',
      removeShipment: 'إزالة هذه الشحنة',
      consolidatedSummary: 'الملخص المدمج',
      totalVolume: 'الحجم الإجمالي',
      totalWeight: 'الوزن الإجمالي',
      totalShipments: 'الشحنات',
      totalContainers: 'الحاويات',
      chooseShippingType: 'اختر نوع الشحن',
      shipmentXofY: 'الشحنة {current} من {total}',
      selectPackagingMethod: 'اختر كيفية تعبئة بضائعك للشحن',
      forThisSpecificShipment: 'لهذه الشحنة المحددة',
      looseCargo: 'البضائع السائبة',
      looseCargoDesc: 'منصات، صناديق أو عناصر فردية',
      fullContainer: 'حاوية كاملة',
      fullContainerDesc: 'حاوية كاملة (FCL)',
      imNotSure: 'لست متأكد',
      teamWillHelp: 'فريقنا سيساعدك في اختيار أفضل خيار',
      looseCargoFeedback: 'مثالي للبضائع المختلطة، الكميات الصغيرة إلى المتوسطة، أو عندما تحتاج لتعبئة مرنة',
      containerFeedback: 'خيار ممتاز للأحجام الكبيرة، خطوط الإنتاج الكاملة، أو عندما يكون لديك بضائع كافية لملء حاوية',
      unsureFeedback: 'لا تقلق! فريقنا ذو الخبرة سيرشدك خلال العملية وسيوصي بأفضل حل شحن لاحتياجاتك المحددة. نحن نتولى جميع التفاصيل التقنية.',
      whatHappensNext: 'ما يحدث بعد ذلك:',
      expertsContact: 'خبراء الشحن لدينا يتصلون بك خلال 24 ساعة',
      discussRequirements: 'نناقش تفاصيل شحنتك ومتطلباتك',
      personalizedRecommendations: 'تحصل على توصيات وأسعار مخصصة',

      describeLooseCargo: 'صف البضائع السائبة',
      configureContainer: 'قم بتكوين حاويتك',
      provideDimensionsWeight: 'قدم الأبعاد وتفاصيل الوزن للتسعير الدقيق',
      selectContainerType: 'اختر نوع وكمية الحاوية لشحنتك',
      calculateByUnit: 'احسب حسب نوع الوحدة',
      calculateByTotal: 'احسب حسب إجمالي الشحنة',
      packageType: 'نوع الحزمة',
      pallets: 'المنصات',
      boxesCrates: 'الصناديق/الحاويات',
      numberOfUnits: 'عدد الوحدات',
      palletType: 'نوع المنصة',
      nonSpecified: 'غير محدد',
      euroPallet: 'منصة أوروبية (120x80 سم)',
      standardPallet: 'منصة قياسية (120x100 سم)',
      customSize: 'حجم مخصص',
      dimensionsPerUnit: 'الأبعاد (الطول×العرض×الارتفاع لكل وحدة)',
      weightPerUnit: 'الوزن (لكل وحدة)',
      required: 'مطلوب',
      containerInfoBanner: 'اختر نوع وكمية الحاوية التي تناسب حجم شحنتك بشكل أفضل.',
      unitInfoBanner: 'قدم تفاصيل حول كل عنصر فردي أو منصة للحساب الدقيق.',
      totalInfoBanner: 'توفير أرقام الشحنة الإجمالية قد يكون أقل دقة. الأبعاد غير الدقيقة أو كبيرة الحجم قد تؤدي إلى رسوم إضافية.',
      totalDescription: 'أدخل الأبعاد الإجمالية ووزن شحنتك.',
      containerType: 'نوع الحاوية',
      numberOfContainers: 'عدد الحاويات',
      overweightContainer: 'حاوية زائدة الوزن (>25 طن)',
      container20: "20' قياسي (33 متر مكعب)",
      container40: "40' قياسي (67 متر مكعب)",
      container40HC: "40' عالي المكعب (76 متر مكعب)",
      container45HC: "45' عالي المكعب (86 متر مكعب)",
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
    dontKnowPort: "Não sei",
    dontKnowPortDescription: "Não tenho certeza de qual porto/terminal escolher",
    dontKnowPortFeedback: "Sem problema! Vamos ajudá-lo a escolher o melhor porto/terminal para seu frete.",
    perfectPortFeedback: "Perfeito! Vamos coletar de",
    cityPickupFeedback: "Perfeito! Vamos organizar a coleta de {city}, China",
    annualVolume: "Volume anual",
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
      'CDU': 'Terminal ferroviário de Chengdu'
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
      whatsappLine: "Linha WhatsApp",
      contactEmail: "E-mail",
      businessHours: "9h-18h (Horário da China)",
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
      addNewShipment: 'Adicionar Nova Remessa',
      duplicateShipment: 'Duplicar Esta Remessa',
      removeShipment: 'Remover Esta Remessa',
      consolidatedSummary: 'Resumo Consolidado',
      totalVolume: 'Volume Total',
      totalWeight: 'Peso Total',
      totalShipments: 'Remessas',
      totalContainers: 'Contêineres',
      chooseShippingType: 'Escolha seu tipo de envio',
      shipmentXofY: 'Remessa {current} de {total}',
      selectPackagingMethod: 'Selecione como suas mercadorias estão embaladas para envio',
      forThisSpecificShipment: 'Para esta remessa específica',
      looseCargo: 'Carga Solta',
      looseCargoDesc: 'Paletes, caixas ou itens individuais',
      fullContainer: 'Contêiner Completo',
      fullContainerDesc: 'Contêiner completo (FCL)',
      imNotSure: 'Não tenho certeza',
      teamWillHelp: 'Nossa equipe ajudará você a escolher a melhor opção',
      looseCargoFeedback: 'Perfeito para mercadorias mistas, quantidades pequenas a médias, ou quando você precisa de embalagem flexível',
      containerFeedback: 'Excelente escolha para grandes volumes, linhas de produtos completas, ou quando você tem mercadorias suficientes para encher um contêiner',
      unsureFeedback: 'Não se preocupe! Nossa equipe experiente o guiará através do processo e recomendará a melhor solução de envio para suas necessidades específicas. Cuidamos de todos os detalhes técnicos.',
      whatHappensNext: 'O que acontece a seguir:',
      expertsContact: 'Nossos especialistas em envio entram em contato em até 24 horas',
      discussRequirements: 'Discutimos os detalhes e requisitos da sua carga',
      personalizedRecommendations: 'Você recebe recomendações e preços personalizados',
  
      describeLooseCargo: 'Descreva sua carga solta',
      configureContainer: 'Configure seu contêiner',
      provideDimensionsWeight: 'Forneça dimensões e detalhes de peso para preços precisos',
      selectContainerType: 'Selecione tipo e quantidade de contêiner para sua remessa',
      calculateByUnit: 'Calcular por tipo de unidade',
      calculateByTotal: 'Calcular por remessa total',
      packageType: 'Tipo de pacote',
      pallets: 'Paletes',
      boxesCrates: 'Caixas/Engradados',
      numberOfUnits: 'Número de unidades',
      palletType: 'Tipo de palete',
      nonSpecified: 'Não especificado',
      euroPallet: 'Europalete (120x80 cm)',
      standardPallet: 'Palete padrão (120x100 cm)',
      customSize: 'Tamanho personalizado',
      dimensionsPerUnit: 'Dimensões (C×L×A por unidade)',
      weightPerUnit: 'Peso (Por unidade)',
      required: 'Obrigatório',
      containerInfoBanner: 'Selecione o tipo e quantidade de contêiner que melhor se adequa ao seu volume de carga.',
      unitInfoBanner: 'Forneça detalhes sobre cada item individual ou palete para cálculo preciso.',
      totalInfoBanner: 'Fornecer números totais de remessa pode ser menos preciso. Dimensões imprecisas ou oversized podem resultar em taxas adicionais.',
      totalDescription: 'Digite as dimensões totais e o peso da sua remessa.',
      containerType: 'Tipo de contêiner',
      numberOfContainers: 'Número de contêineres',
      overweightContainer: 'Contêiner com excesso de peso (>25 ton)',
      container20: "20' Padrão (33 CBM)",
      container40: "40' Padrão (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Envio',
      setupPending: 'Configuração pendente...',
      addAnotherShipment: 'Adicionar Outro Envio',
      items: 'Itens',
      each: 'cada',
      totalCalculation: 'Cálculo total',
      overweight: 'Sobrepeso',
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
      portTerminalDescription: 'Teslim alma için özel liman, terminal veya havaalanını seçin',
      pickupCity: 'Teslim alma şehri',
      pickupZipCode: 'Teslim alma posta kodu',
      dontKnowPort: "Bilmiyorum",
      dontKnowPortDescription: "Hangi liman/terminali seçeceğimden emin değilim",
      dontKnowPortFeedback: "Sorun değil! Kargonuz için en iyi liman/terminali seçmenizde yardımcı olacağız.",
      perfectPortFeedback: "Mükemmel! Şuradan alacağız:",
      cityPickupFeedback: "Mükemmel! {city}, Çin'den teslim alma organize edeceğiz",
      annualVolume: "Yıllık hacim",
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
        'CDU': 'Chengdu Demiryolu Terminali'
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
      step4Title: 'Ne gönderiyorsunuz?',
      managingShipments: '{count} Gönderi{plural} Yönetimi',
      configureShipments: 'Her gönderiyi ayrı ayrı yapılandırın veya karmaşık siparişler için birden fazla gönderi ekleyin',
      addShipment: 'Gönderi Ekle',
      validating: 'Doğrulanıyor...',
      active: 'Aktif',
      shipmentsCount: 'Gönderiler ({count})',
      addNewShipment: 'Yeni Gönderi Ekle',
      duplicateShipment: 'Bu Gönderiyi Çoğalt',
      removeShipment: 'Bu Gönderiyi Kaldır',
      consolidatedSummary: 'Konsolide Özet',
      totalVolume: 'Toplam Hacim',
      totalWeight: 'Toplam Ağırlık',
      totalShipments: 'Gönderiler',
      totalContainers: 'Konteynerler',
      chooseShippingType: 'Gönderi türünüzü seçin',
      shipmentXofY: 'Gönderi {current} / {total}',
      selectPackagingMethod: 'Mallarınızın gönderi için nasıl paketlendiğini seçin',
      forThisSpecificShipment: 'Bu özel gönderi için',
      looseCargo: 'Dökme Kargo',
      looseCargoDesc: 'Paletler, kutular veya bireysel öğeler',
      fullContainer: 'Tam Konteyner',
      fullContainerDesc: 'Tam konteyner (FCL)',
      imNotSure: 'Emin değilim',
      teamWillHelp: 'Ekibimiz en iyi seçeneği seçmenizde yardımcı olacak',
      looseCargoFeedback: 'Karışık mallar, küçük ila orta miktarlar veya esnek paketlemeye ihtiyaç duyduğunuzda mükemmel',
      containerFeedback: 'Büyük hacimler, eksiksiz ürün hatları veya konteyner doldurmaya yetecek kadar malınız olduğunda mükemmel seçim',
      unsureFeedback: 'Endişelenmeyin! Deneyimli ekibimiz süreç boyunca size rehberlik edecek ve özel ihtiyaçlarınız için en iyi gönderi çözümünü önerecek. Tüm teknik detayları biz hallederiz.',
      whatHappensNext: 'Sırada ne oluyor:',
      expertsContact: 'Gönderi uzmanlarımız 24 saat içinde sizinle iletişime geçer',
      discussRequirements: 'Kargo detaylarınızı ve gereksinimlerinizi tartışırız',
      personalizedRecommendations: 'Kişiselleştirilmiş öneriler ve fiyatlar alırsınız',

      describeLooseCargo: 'Dökme kargonuzu açıklayın',
      configureContainer: 'Konteynerinizi yapılandırın',
      provideDimensionsWeight: 'Doğru fiyatlandırma için boyutlar ve ağırlık detayları sağlayın',
      selectContainerType: 'Gönderiniz için konteyner türü ve miktarını seçin',
      calculateByUnit: 'Birim türüne göre hesapla',
      calculateByTotal: 'Toplam gönderiye göre hesapla',
      packageType: 'Paket türü',
      pallets: 'Paletler',
      boxesCrates: 'Kutular/Sandıklar',
      numberOfUnits: 'Birim sayısı',
      palletType: 'Palet türü',
      nonSpecified: 'Belirtilmemiş',
      euroPallet: 'Europalet (120x80 cm)',
      standardPallet: 'Standart palet (120x100 cm)',
      customSize: 'Özel boyut',
      dimensionsPerUnit: 'Boyutlar (U×G×Y birim başına)',
      weightPerUnit: 'Ağırlık (Birim başına)',
      required: 'Gerekli',
      containerInfoBanner: 'Kargo hacminize en uygun konteyner türü ve miktarını seçin.',
      unitInfoBanner: 'Doğru hesaplama için her bir öğe veya palet hakkında detay verin.',
      totalInfoBanner: 'Toplam gönderi sayıları sağlamak daha az doğru olabilir. Yanlış veya büyük boyutlu ölçüler ek ücretlere neden olabilir.',
      totalDescription: 'Gönderinizin toplam boyutlarını ve ağırlığını girin.',
      containerType: 'Konteyner türü',
      numberOfContainers: 'Konteyner sayısı',
      overweightContainer: 'Ağır konteyner (>25 ton)',
      container20: "20' Standart (33 CBM)",
      container40: "40' Standart (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Gönderi',
      setupPending: 'Kurulum bekliyor...',
      addAnotherShipment: 'Başka Gönderi Ekle',
      items: 'Öğeler',
      each: 'her biri',
      totalCalculation: 'Toplam hesaplama',
      overweight: 'Fazla ağırlık',
    // Step 6 translations
    selectExperience: 'Deneyim seviyenizi seçin',
    firstTimeShipper: 'İlk gönderi',
    upTo10Times: 'Ara sıra gönderi',
    moreThan10Times: 'Deneyimli gönderici',
    regularShipper: 'Düzenli gönderi',
    contactInformation: 'İletişim Bilgileri',
    contactInfoDescription: 'Size nasıl ulaşabiliriz?',
    emailHelp: 'Teklifinizi ve güncellemeleri bu e-postaya göndereceğiz',
    phonePlaceholder: 'Telefon numaranızı girin',
    phoneHelp: 'Acil güncellemeler ve açıklamalar için',
    additionalNotes: 'Ek Notlar',
    additionalNotesDescription: 'Bilmemiz gereken başka bir şey var mı?',
    remarks: 'Özel Açıklamalar',
    remarksPlaceholder: 'Özel talimatlar, gereksinimler veya sorular...',
    remarksHelp: 'Ek bağlamla size daha iyi hizmet vermemize yardımcı olun',
    readyToSubmit: 'Teklifinizi almaya hazır!',
    submitDescription: 'Talebinizi göndermek için aşağıdaki "Teklifimi Al" butonuna tıklayın. 24 saat içinde yanıt vereceğiz.',
    securityBadge: 'Güvenli ve GDPR uyumlu',
    // Customer type selection
    customerTypeQuestion: 'Birey olarak mı yoksa şirket için mi gönderiyorsunuz?',
    customerTypeDescription: 'Bu, en ilgili bilgi alanlarını sağlamamıza yardımcı olur',
    individualCustomer: 'Birey',
    individualDescription: 'Kişisel gönderi veya özel müşteri',
    companyCustomer: 'Şirket',
    companyDescription: 'Ticari gönderi veya iş kuruluşu',
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
    validationShipperRole: 'Пожалуйста, выберите ваш тип отправителя',
    validationEmail: 'Пожалуйста, предоставьте действительный адрес электронной почты',
    noCommitmentRequired: 'Никаких обязательств не требуется - только экспертное руководство!',
    cityPostalDescription: 'Укажите город и почтовый индекс для точной доставки',
    popular: 'Популярный',
    otherCountries: 'Другие страны',
    // Step 3 translations
    step3Title: 'Выберите место забора в Китае',
    selectPickupLocationType: 'Выберите тип места забора',
    pickupLocationDescription: 'Выберите, где мы должны забрать ваши товары в Китае',
    enterPickupDetails: 'Введите детали забора',
    pickupCityPostalDescription: 'Укажите город и почтовый индекс забора в Китае',
    searchPortTerminal: 'Поиск порта/терминала/аэропорта...',
    selectPortTerminal: 'Выберите порт/терминал/аэропорт забора',
    portTerminalDescription: 'Выберите конкретный порт, терминал или аэропорт для забора',
    pickupCity: 'Город забора',
    pickupZipCode: 'Почтовый индекс забора',
    dontKnowPort: "Не знаю",
    dontKnowPortDescription: "Не уверен, какой порт/терминал выбрать",
    dontKnowPortFeedback: "Не проблема! Мы поможем вам выбрать лучший порт/терминал для вашего груза.",
    perfectPortFeedback: "Отлично! Мы заберём из",
    cityPickupFeedback: "Отлично! Мы организуем забор из {city}, Китай",
    annualVolume: "Годовой объём",
    // Port translations
    ports: {
      'SHA': 'Шанхай',
      'SZX': 'Шэньчжэнь',
      'NGB': 'Нинбо-Чжоушань',
      'GZH': 'Гуанчжоу',
      'QIN': 'Циндао',
      'TJN': 'Тяньцзинь',
      'XMN': 'Сямэнь',
      'DLN': 'Далянь',
      'YTN': 'Яньтянь',
      'LYG': 'Ляньюньган',
      'PEK': 'Аэропорт Пекин Столичный',
      'PVG': 'Аэропорт Шанхай Пудун',
      'CAN': 'Аэропорт Гуанчжоу Байюнь',
      'CTU': 'Аэропорт Чэнду Шуанлю',
      'KMG': 'Аэропорт Куньмин Чаншуй',
      'XIY': 'Аэропорт Сиань Сяньян',
      'HGH': 'Аэропорт Ханчжоу Сяошань',
      'NKG': 'Аэропорт Нанкин Лукоу',
      'ZIH': 'Железнодорожный терминал Чжэнчжоу',
      'CQN': 'Железнодорожный терминал Чунцин',
      'WUH': 'Железнодорожный терминал Ухань',
      'CDU': 'Железнодорожный терминал Чэнду'
    },
    // Region translations
    regions: {
      'East China': 'Восточный Китай',
      'South China': 'Южный Китай',
      'North China': 'Северный Китай',
      'West China': 'Западный Китай',
      'Southwest China': 'Юго-западный Китай',
      'Northwest China': 'Северо-западный Китай',
      'Central China': 'Центральный Китай'
    },
    // Dynamic translations by mode
    searchPort: 'Поиск порта...',
    searchAirport: 'Поиск аэропорта...',
    searchRailTerminal: 'Поиск железнодорожного терминала...',
    selectPort: 'Выберите порт забора',
    selectAirport: 'Выберите аэропорт забора', 
    selectRailTerminal: 'Выберите железнодорожный терминал забора',
    portDescriptionDynamic: 'Выберите конкретный порт для забора',
    airportDescriptionDynamic: 'Выберите конкретный аэропорт для забора',
    railTerminalDescriptionDynamic: 'Выберите конкретный железнодорожный терминал для забора',
    // Step 5 translations
    step5Title: 'Расскажите нам о ваших товарах',
    goodsValueDeclaration: 'Стоимость Товаров и Декларация',
    goodsValueDescription: 'Предоставьте коммерческую стоимость для таможенной декларации и целей страхования',
    commercialValue: 'Коммерческая стоимость товаров',
    goodsValueHelp: 'Эта стоимость используется для таможенной декларации и расчётов страхования',
    personalOrHazardous: 'Личные вещи или содержит опасные/ограниченные материалы',
    personalHazardousHelp: 'Отметьте это, если отправляете личные вещи или товары, требующие специального обращения',
    shipmentReadiness: 'Готовность Отправления',
    shipmentTimingDescription: 'Помогите нам спланировать график вашего отправления и предоставить точные тарифы',
    goodsReadyQuestion: 'Когда ваши товары будут готовы к забору?',
    readyNow: '✅ Готов сейчас - товары доступны для немедленного забора',
    readyIn1Week: '📅 В течение 1 недели - сейчас готовим',
    readyIn2Weeks: '📅 В течение 2 недель - производство в процессе',
    readyIn1Month: '📅 В течение 1 месяца - планируем заранее',
    dateNotSet: '❓ Дата ещё не определена',
    timingHelp: 'Точное время помогает нам предоставить наиболее конкурентные тарифы',
    additionalDetails: 'Дополнительные Детали (Необязательно)',
    additionalDetailsDescription: 'Предоставьте любые специальные требования или дополнительную информацию',
    goodsDescription: 'Краткое описание товаров (необязательно)',
    goodsDescriptionPlaceholder: 'например, Электроника, Мебель, Одежда, Машинное оборудование...',
    goodsDescriptionHelp: 'Помогает нам обеспечить правильное обращение и документооборот',
    specialRequirements: 'Специальные требования к обращению (необязательно)',
    noSpecialRequirements: 'Нет специальных требований',
    fragileGoods: '🔸 Хрупкие товары - осторожное обращение',
    temperatureControlled: '🌡️ Температурный контроль',
    urgentTimeSensitive: '⚡ Срочно/чувствительно ко времени',
    highValueInsurance: '🛡️ Необходимо страхование высокой стоимости',
    otherSpecify: '📝 Другое (пожалуйста, укажите в примечаниях)',
    rateValidityNotice: 'Уведомление о Действительности Тарифов:',
    rateValidityText: 'Указанные тарифы действительны до даты истечения, указанной в каждом предложении. Если ваши товары не будут готовы к забору к этой дате, тарифы могут быть изменены в зависимости от текущих рыночных условий.',
    unsureShipping: "Я ещё не уверен",
    unsureShippingDesc: 'Пусть эксперты помогут',
    unsureShippingBenefits: 'Профессиональное руководство',
    unsureShippingFeedback: "Отличный выбор! Мы порекомендуем лучший вариант доставки для ваших конкретных потребностей",
    beginnerSectionTitle: 'Для новичков',
    beginnerSectionDesc: 'Получите бесплатные советы от наших экспертов',
    separatorText: 'Или выберите сами',
    unsureAboutChoice: 'Не уверены в своём выборе?',
    selectOption: 'Выберите опцию',
    // New statistics section
    impactInNumbers: 'Наше Влияние в Цифрах',
    impactDescription: 'Обеспечиваем превосходство в Китае с проверенными результатами и надёжным сервисом',
    satisfiedCustomers: 'Довольных Клиентов',
    customerSatisfaction: 'Удовлетворённость Клиентов',
    teamMembers: 'Члены Команды',
    oceanVolume: 'Объём Морских Перевозок TEU',
          officesInChina: 'Офисы в Китае',
      cfsFacilities: 'М² Объекты CFS',
    // Additional system messages
    errorSubmission: 'Произошла ошибка при отправке вашего предложения. Пожалуйста, попробуйте еще раз.',
    noTestLeads: 'В настоящее время тестовые лиды не загружены.',
    pleaseSpecifyInRemarks: 'пожалуйста, укажите в примечаниях',
    // Step 6 translations
    step6Title: 'Контактные данные',
    personalInformation: 'Личная Информация',
    personalInfoDescription: 'Расскажите нам, кто вы',
    firstName: 'Имя',
    firstNamePlaceholder: 'Введите ваше имя',
    lastName: 'Фамилия',
    lastNamePlaceholder: 'Введите вашу фамилию',
    businessInformation: 'Информация о Бизнесе',
    businessInfoDescription: 'Расскажите нам о вашей компании',
    companyName: 'Название Компании',
    companyNamePlaceholder: 'Введите название вашей компании',
    shippingExperience: 'Опыт Доставки',
    shippingExperienceDescription: 'Укажите ваш уровень опыта, чтобы мы могли лучше вам помочь',
    shippingFrequency: 'Как часто вы отправляете грузы?',
    firstTime: 'Первый раз',
    occasionally: 'Иногда',
    regularly: 'Регулярно',
    role: 'Роль',
    roleDescription: 'В каком качестве вы отправляете грузы?',
    businessOwner: 'Владелец бизнеса',
    purchasingManager: 'Менеджер по закупкам',
    logisticsManager: 'Менеджер по логистике',
    salesRepresentative: 'Торговый представитель',
    privateIndividual: 'Частное лицо',
    selectExperience: 'Выберите ваш уровень опыта',
    firstTimeShipper: 'Первая отправка',
    upTo10Times: 'Случайные отправки',
    moreThan10Times: 'Подтвержденный опыт',
          regularShipper: 'Регулярные отправки',
    contactInformation: 'Контактная Информация',
    contactInfoDescription: 'Как мы можем с вами связаться?',
    emailAddress: 'Адрес Электронной Почты',
    emailPlaceholder: 'Введите ваш адрес электронной почты',
    emailHelp: 'Мы отправим ваше предложение и обновления на этот email',
    phoneNumber: 'Номер Телефона',
    phoneNumberPlaceholder: 'Введите ваш номер телефона',
    phoneHelp: 'Для срочных обновлений и уточнений',
    additionalNotes: 'Дополнительные Примечания',
    additionalNotesDescription: 'Есть ли что-то ещё, что нам следует знать?',
    remarks: 'Специальные Замечания',
    remarksPlaceholder: 'Специальные инструкции, требования или вопросы...',
    remarksHelp: 'Помогите нам лучше обслуживать вас с дополнительным контекстом',
    readyToSubmit: 'Готовы получить ваше предложение!',
    submitDescription: 'Нажмите "Получить Моё Предложение" ниже, чтобы отправить ваш запрос. Мы ответим в течение 24 часов.',
    getMyQuote: 'Получить Моё Предложение',
    securityBadge: 'Безопасно и соответствует GDPR',
    // Customer type selection
    customerTypeQuestion: 'Отправляете ли вы как частное лицо или для компании?',
    customerTypeDescription: 'Это помогает нам предоставить наиболее релевантные информационные поля',
    individualCustomer: 'Частное лицо',
    individualDescription: 'Личная отправка или частный клиент',
    companyCustomer: 'Компания',
    companyDescription: 'Коммерческая отправка или бизнес-единица',
      // Additional confirmation page items
      // Confirmation page
      confirmationMainTitle: 'Подтверждение Заявки',
      confirmationTitle: 'Запрос на Расчёт Стоимости Подтверждён',
      confirmationSubtitle: 'Ваш запрос был успешно отправлен',
      referenceNumber: 'Номер Заявки',
      yourRequest: 'Краткое Описание Вашего Запроса',
      shipmentDetails: 'Детали Груза',
      fromTo: 'Из {origin} в {destination}',
      mode: 'Способ Доставки',
      contactDetails: 'Контактные Данные',
      nextSteps: 'Следующие Шаги',
      step1: 'Запрос получен',
      step1Time: 'Сейчас',
      step2: 'Анализ и расчёт',
      step2Time: 'В течение 4 рабочих часов',
      step3: 'Коммерческое обращение',
      step3Time: 'В течение 24 часов',
      step4: 'Детальный расчёт',
      step4Time: 'В течение 48 часов',
      aboutSino: 'О SINO Shipping & FS International',
      aboutSubtitle: 'Ваш запрос обрабатывается экспертами',
      sinoDescription: 'SINO Shipping была основана в 2018 году французскими предпринимателями и стала частью FS International в 2021 году. Это сотрудничество объединяет западный клиентоориентированный подход с глубокой местной китайской экспертизой.',
      fsDescription: 'FS International была основана в сентябре 1989 года в Гонконге и является одним из самых надёжных брендов глобальной логистики и транспорта в регионе.',
      ourExpertise: 'Наша Экспертиза',
      expertise1: 'Морские и авиаперевозки из всех крупных китайских портов',
      expertise2: 'Железнодорожные перевозки в Европу и Россию',
      expertise3: 'Мультимодальные перевозки и доставка последней мили',
      expertise4: 'Таможенное оформление и консультации по соответствию',
      keyNumbers: 'Наше Влияние в Цифрах',
      keyNumbersSubtitle: 'Проверенные результаты и надёжный сервис в Китае',
      number1: '15 000+ активных пользователей',
      number2: '1 000+ расчётов в месяц',
      number3: '98% удовлетворённость клиентов',
      number4: '100+ членов команды',
      globalNetwork: 'Глобальная Сеть',
      networkDescription: 'Со стратегическими офисами в Китае и Гонконге мы идеально позиционированы для эффективной обработки ваших грузов.',
      chinaOffices: 'Офисы в Китае: Шэньчжэнь, Шанхай, Циндао, Нинбо',
      hkOffice: 'Головной офис в Гонконге: Цим Ша Цуй',
      needHelp: 'Нужна Помощь?',
      email: 'Электронная Почта',
      available: 'Доступно',
      actions: 'Быстрые Действия',
      newRequest: 'Отправить Новый Запрос',
      viewServices: 'Посмотреть Наши Услуги',
      subscribeUpdates: 'Подписаться на Обновления',
      websites: 'Наши Веб-сайты',
      thankYouTitle: 'Спасибо за ваше доверие!',
      thankYouMessage: 'Ваш запрос будет обработан с максимальной заботой нашими экспертами по международным перевозкам.',
      shipment: 'отправление',
      shipments: 'отправления',
      // Step 4 translations
      step4Title: 'Что вы отправляете?',
      managingShipments: 'Управление {count} Отправлением{plural}',
      configureShipments: 'Настройте каждое отправление индивидуально или добавьте несколько отправлений для сложных заказов',
      addShipment: 'Добавить Отправление',
      validating: 'Проверка...',
      active: 'Активный',
      shipmentsCount: 'Отправления ({count})',
      addNewShipment: 'Добавить Новое Отправление',
      duplicateShipment: 'Дублировать Это Отправление',
      removeShipment: 'Удалить Это Отправление',
      consolidatedSummary: 'Сводный Отчёт',
      totalVolume: 'Общий Объём',
      totalWeight: 'Общий Вес',
      totalShipments: 'Отправления',
      totalContainers: 'Контейнеры',
      chooseShippingType: 'Выберите тип отправки',
      shipmentXofY: 'Отправление {current} из {total}',
      selectPackagingMethod: 'Выберите, как упакованы ваши товары для отправки',
      forThisSpecificShipment: 'Для этого конкретного отправления',
      looseCargo: 'Насыпной Груз',
      looseCargoDesc: 'Поддоны, коробки или отдельные предметы',
      fullContainer: 'Полный Контейнер',
      fullContainerDesc: 'Полный контейнер (FCL)',
      imNotSure: 'Я не уверен',
      teamWillHelp: 'Наша команда поможет вам выбрать лучший вариант',
      looseCargoFeedback: 'Идеально для смешанных товаров, небольших и средних количеств, или когда нужна гибкая упаковка',
      containerFeedback: 'Отличный выбор для больших объёмов, полных продуктовых линеек, или когда у вас достаточно товаров для заполнения контейнера',
      unsureFeedback: 'Не волнуйтесь! Наша опытная команда проведёт вас через процесс и порекомендует лучшее решение для доставки ваших конкретных потребностей. Мы позаботимся о всех технических деталях.',
      whatHappensNext: 'Что происходит дальше:',
      expertsContact: 'Наши эксперты по доставке свяжутся с вами в течение 24 часов',
      discussRequirements: 'Мы обсудим детали и требования вашего груза',
      personalizedRecommendations: 'Вы получите персонализированные рекомендации и цены',
  
      describeLooseCargo: 'Опишите ваш насыпной груз',
      configureContainer: 'Настройте ваш контейнер',
      provideDimensionsWeight: 'Предоставьте размеры и детали веса для точного ценообразования',
      selectContainerType: 'Выберите тип и количество контейнеров для вашего отправления',
      calculateByUnit: 'Рассчитать по типу единицы',
      calculateByTotal: 'Рассчитать по общему отправлению',
      packageType: 'Тип упаковки',
      pallets: 'Поддоны',
      boxesCrates: 'Коробки/Ящики',
      numberOfUnits: 'Количество единиц',
      palletType: 'Тип поддона',
      nonSpecified: 'Не указано',
      euroPallet: 'Европоддон (120x80 см)',
      standardPallet: 'Стандартный поддон (120x100 см)',
      customSize: 'Нестандартный размер',
      dimensionsPerUnit: 'Размеры (Д×Ш×В на единицу)',
      weightPerUnit: 'Вес (На единицу)',
      required: 'Обязательно',
      containerInfoBanner: 'Выберите тип и количество контейнеров, которые лучше всего подходят для объёма вашего груза.',
      unitInfoBanner: 'Предоставьте детали о каждом отдельном предмете или поддоне для точного расчёта.',
      totalInfoBanner: 'Предоставление общих номеров отправления может быть менее точным. Неточные или крупногабаритные размеры могут привести к дополнительным расходам.',
      totalDescription: 'Введите общие размеры и вес вашего отправления.',
      containerType: 'Тип контейнера',
      numberOfContainers: 'Количество контейнеров',
      overweightContainer: 'Перегруженный контейнер (>25 тонн)',
      container20: "20' Стандартный (33 CBM)",
      container40: "40' Стандартный (67 CBM)",
      container40HC: "40' High Cube (76 CBM)",
      container45HC: "45' High Cube (86 CBM)",
      // Additional shipment summary translations
      shipmentTitle: 'Отправление',
      setupPending: 'Настройка в ожидании...',
      addAnotherShipment: 'Добавить Ещё Отправление',
      items: 'Предметы',
      each: 'каждый',
      totalCalculation: 'Общий расчёт',
      overweight: 'Перевес',
  },
};

// Helper function to get text with fallback to English
const getText = (key: string, lang: 'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru') => {
  return (I18N_TEXT[lang] as any)[key] || (I18N_TEXT.en as any)[key] || key;
};


// Experience options with improved translations
const EXPERIENCE_OPTIONS = [
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
];

const QuoteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionId, setSubmissionId] = useState('');
  const [step5SubStep, setStep5SubStep] = useState(1); // Sub-steps for step 5 (1, 2, 3)
  const [toastMessage, setToastMessage] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [debouncedCountrySearch, setDebouncedCountrySearch] = useState(''); // debounced value
  const [portSearch, setPortSearch] = useState('');
  const [phonePrefixSearch, setPhonePrefixSearch] = useState(''); // New state for phone prefix search term
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [selectedDestLocationType, setSelectedDestLocationType] = useState('');
  const [isCountryListVisible, setIsCountryListVisible] = useState(false);
  const [isPortListVisible, setIsPortListVisible] = useState(false);
  const [isPhonePrefixListVisible, setIsPhonePrefixListVisible] = useState(false); // New state for phone prefix list
  
  // Step 5 custom dropdown states
  const [currencySearch, setCurrencySearch] = useState('🇺🇸 USD');
  const [isCurrencyListVisible, setIsCurrencyListVisible] = useState(false);
  const [timingSearch, setTimingSearch] = useState('');
  const [isTimingListVisible, setIsTimingListVisible] = useState(false);
  const [requirementsSearch, setRequirementsSearch] = useState('');
  const [isRequirementsListVisible, setIsRequirementsListVisible] = useState(false);
  
  // Step 6 custom dropdown states
  const [experienceSearch, setExperienceSearch] = useState('');
  const [isExperienceListVisible, setIsExperienceListVisible] = useState(false);

  // Customer type state
  const [customerType, setCustomerType] = useState<'individual' | 'company' | ''>('');
  
  const countryListRef = useRef<HTMLDivElement>(null);
  const portListRef = useRef<HTMLDivElement>(null);
  const phonePrefixListRef = useRef<HTMLDivElement>(null); // New ref for phone prefix list
  const searchInputRef = useRef<HTMLInputElement>(null);
  const portSearchInputRef = useRef<HTMLInputElement>(null);
  const phonePrefixSearchInputRef = useRef<HTMLInputElement>(null); // New ref for phone prefix search input
  
  // Refs for custom dropdowns
  const currencyListRef = useRef<HTMLDivElement>(null);
  const timingListRef = useRef<HTMLDivElement>(null);
  const requirementsListRef = useRef<HTMLDivElement>(null);
  const experienceListRef = useRef<HTMLDivElement>(null);
  
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

  const initialLoadDetails: LoadDetails = {
    shippingType: '',
    calculationType: 'unit',
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
  };

  const [formData, setFormData] = useState({
    country: '',
    origin: '',
    mode: '',
    email: '',
    phone: '',
    phoneCountryCode: '+234', // Default to Nigeria's prefix or choose another default
    locationType: '',
    city: '',
    zipCode: '',
    destLocationType: '',
    destCity: '',
    destZipCode: '',
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
  });
  
  const [fieldValid, setFieldValid] = useState({
    country: null as boolean | null,
    origin: null as boolean | null,
    mode: null as boolean | null,
    email: null as boolean | null,
    phone: null as boolean | null, // Added for phone number validation
    phoneCountryCode: null as boolean | null, // Added for phone country code
    city: null as boolean | null,
    zipCode: null as boolean | null,
    destCity: null as boolean | null,
    destZipCode: null as boolean | null,
    firstName: null as boolean | null,
    lastName: null as boolean | null,
    companyName: null as boolean | null,
    shipperType: null as boolean | null,
    goodsValue: null as boolean | null,
    destLocationType: null as boolean | null,
  });

  // Cargo Step States - these will now reflect the active load
  const [shippingType, setShippingType] = useState<LoadDetails['shippingType']>('');
  const [calculationType, setCalculationType] = useState<LoadDetails['calculationType']>(initialLoadDetails.calculationType);
  const [packageType, setPackageType] = useState<LoadDetails['packageType']>(initialLoadDetails.packageType);
  const [numberOfUnits, setNumberOfUnits] = useState<LoadDetails['numberOfUnits']>(initialLoadDetails.numberOfUnits);
  const [palletType, setPalletType] = useState<LoadDetails['palletType']>(initialLoadDetails.palletType);
  const [dimensions, setDimensions] = useState<LoadDetails['dimensions']>(initialLoadDetails.dimensions);
  const [dimensionUnit, setDimensionUnit] = useState<LoadDetails['dimensionUnit']>(initialLoadDetails.dimensionUnit);
  const [weightPerUnit, setWeightPerUnit] = useState<LoadDetails['weightPerUnit']>(initialLoadDetails.weightPerUnit);
  const [weightUnit, setWeightUnit] = useState<LoadDetails['weightUnit']>(initialLoadDetails.weightUnit);
  const [totalVolume, setTotalVolume] = useState<LoadDetails['totalVolume']>(initialLoadDetails.totalVolume);
  const [totalVolumeUnit, setTotalVolumeUnit] = useState<LoadDetails['totalVolumeUnit']>(initialLoadDetails.totalVolumeUnit);
  const [totalWeight, setTotalWeight] = useState<LoadDetails['totalWeight']>(initialLoadDetails.totalWeight);
  const [totalWeightUnit, setTotalWeightUnit] = useState<LoadDetails['totalWeightUnit']>(initialLoadDetails.totalWeightUnit);
  const [containerType, setContainerType] = useState<LoadDetails['containerType']>(initialLoadDetails.containerType);
  const [isOverweight, setIsOverweight] = useState<LoadDetails['isOverweight']>(initialLoadDetails.isOverweight);

  const [activeLoadIndex, setActiveLoadIndex] = useState(0);
  const [addShipmentLoading, setAddShipmentLoading] = useState(false);

  // Language state - detect from browser language or default to English
  const [userLang, setUserLang] = useState<'en' | 'fr' | 'zh' | 'de' | 'es' | 'it' | 'nl' | 'ar' | 'pt' | 'tr' | 'ru'>(() => {
    const lang = navigator.language || 'en';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('it')) return 'it';
    if (lang.startsWith('nl')) return 'nl';
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('tr')) return 'tr';
    if (lang.startsWith('ru')) return 'ru';
    return 'en';
  });

  const standardPalletTypes = ['EUR1', 'EUR2', 'US_STANDARD'];

  // Dropdown options for Step 4
  const dimensionUnitOptions = [
    { value: 'CM', label: 'CM' },
    { value: 'M', label: 'M' },
    { value: 'IN', label: 'IN' }
  ];

  const weightUnitOptions = [
    { value: 'KG', label: 'KG' },
    { value: 'LB', label: 'LB' },
    { value: 'T', label: 'T' }
  ];

  const totalVolumeUnitOptions = [
    { value: 'CBM', label: 'CBM (m³)' },
    { value: 'CFT', label: 'CFT (ft³)' }
  ];

  const totalWeightUnitOptions = [
    { value: 'KG', label: 'KG' },
    { value: 'LB', label: 'LB' },
    { value: 'T', label: 'T' }
  ];

  const containerTypeOptions = [
    { value: "20'", label: I18N_TEXT[userLang].container20 },
    { value: "40'", label: I18N_TEXT[userLang].container40 },
    { value: "40'HC", label: I18N_TEXT[userLang].container40HC },
    { value: "45'HC", label: I18N_TEXT[userLang].container45HC }
  ];

  const palletTypeOptions = [
    { value: 'non_specified', label: I18N_TEXT[userLang].nonSpecified },
    { value: 'euro', label: I18N_TEXT[userLang].euroPallet },
    { value: 'standard', label: I18N_TEXT[userLang].standardPallet },
    { value: 'custom', label: I18N_TEXT[userLang].customSize }
  ];

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
    { value: 'ru', label: '🇷🇺 Русский' }
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

      if (
        portListRef.current && 
        !portListRef.current.contains(event.target as Node) &&
        portSearchInputRef.current &&
        !portSearchInputRef.current.contains(event.target as Node)
      ) {
        setIsPortListVisible(false);
      }

      if (
        phonePrefixListRef.current &&
        !phonePrefixListRef.current.contains(event.target as Node) &&
        phonePrefixSearchInputRef.current &&
        !phonePrefixSearchInputRef.current.contains(event.target as Node)
      ) {
        setIsPhonePrefixListVisible(false);
      }

      // Step 5 custom dropdowns
      if (currencyListRef.current && !currencyListRef.current.contains(event.target as Node)) {
        setIsCurrencyListVisible(false);
      }
      if (timingListRef.current && !timingListRef.current.contains(event.target as Node)) {
        setIsTimingListVisible(false);
      }
      if (requirementsListRef.current && !requirementsListRef.current.contains(event.target as Node)) {
        setIsRequirementsListVisible(false);
      }
      
      // Step 6 custom dropdowns
      if (experienceListRef.current && !experienceListRef.current.contains(event.target as Node)) {
        setIsExperienceListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-positioning logic for dropdowns to prevent overflow
  useEffect(() => {
    const adjustDropdownPosition = (dropdown: HTMLElement | null, inputElement: HTMLElement | null) => {
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
      if (spaceRight < 300) { // Minimum dropdown width
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
    
    if (isPortListVisible && portListRef.current && portSearchInputRef.current) {
      adjustDropdownPosition(portListRef.current, portSearchInputRef.current);
    }
    
    if (isPhonePrefixListVisible && phonePrefixListRef.current && phonePrefixSearchInputRef.current) {
      adjustDropdownPosition(phonePrefixListRef.current, phonePrefixSearchInputRef.current);
    }

    if (isCurrencyListVisible && currencyListRef.current) {
      const currencyInput = currencyListRef.current.previousElementSibling as HTMLElement;
      adjustDropdownPosition(currencyListRef.current, currencyInput);
    }

    if (isTimingListVisible && timingListRef.current) {
      const timingInput = timingListRef.current.previousElementSibling as HTMLElement;
      adjustDropdownPosition(timingListRef.current, timingInput);
    }

    if (isRequirementsListVisible && requirementsListRef.current) {
      const requirementsInput = requirementsListRef.current.previousElementSibling as HTMLElement;
      adjustDropdownPosition(requirementsListRef.current, requirementsInput);
    }

    if (isExperienceListVisible && experienceListRef.current) {
      const experienceInput = experienceListRef.current.previousElementSibling as HTMLElement;
      adjustDropdownPosition(experienceListRef.current, experienceInput);
    }

    // Re-adjust on scroll or resize
    const handleResize = () => {
      if (isCountryListVisible && countryListRef.current && searchInputRef.current) {
        adjustDropdownPosition(countryListRef.current, searchInputRef.current);
      }
      if (isPortListVisible && portListRef.current && portSearchInputRef.current) {
        adjustDropdownPosition(portListRef.current, portSearchInputRef.current);
      }
      if (isPhonePrefixListVisible && phonePrefixListRef.current && phonePrefixSearchInputRef.current) {
        adjustDropdownPosition(phonePrefixListRef.current, phonePrefixSearchInputRef.current);
      }
      if (isCurrencyListVisible && currencyListRef.current) {
        const currencyInput = currencyListRef.current.previousElementSibling as HTMLElement;
        adjustDropdownPosition(currencyListRef.current, currencyInput);
      }
      if (isTimingListVisible && timingListRef.current) {
        const timingInput = timingListRef.current.previousElementSibling as HTMLElement;
        adjustDropdownPosition(timingListRef.current, timingInput);
      }
      if (isRequirementsListVisible && requirementsListRef.current) {
        const requirementsInput = requirementsListRef.current.previousElementSibling as HTMLElement;
        adjustDropdownPosition(requirementsListRef.current, requirementsInput);
      }
      if (isExperienceListVisible && experienceListRef.current) {
        const experienceInput = experienceListRef.current.previousElementSibling as HTMLElement;
        adjustDropdownPosition(experienceListRef.current, experienceInput);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isCountryListVisible, isPortListVisible, isPhonePrefixListVisible, isCurrencyListVisible, isTimingListVisible, isRequirementsListVisible, isExperienceListVisible]);

  const isLoadDataValid = (load: LoadDetails, loadIndex: number): boolean => {
    const loadNumber = loadIndex + 1;
    
    // First check if shipping type is selected
    if (!load.shippingType) {
      showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationShippingType}`);
      return false;
    }
    
    // If user selected "unsure", no validation needed - they'll get assistance
    if (load.shippingType === 'unsure') {
      return true;
    }
    
    if (load.shippingType === 'loose') {
      if (load.calculationType === 'unit') {
        if (!load.packageType) {
          showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationPackageType}`);
          return false;
        }
        if (load.packageType === 'pallets') {
          if (load.palletType === 'non_specified') {
            if (!load.dimensions.length || !load.dimensions.width || !load.dimensions.height) {
              showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationDimensionsNonSpecified}`);
              return false;
            }
          } else if (standardPalletTypes.includes(load.palletType)) {
            if (!load.dimensions.height) {
              showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationPalletHeight}`);
              return false;
            }
          }
        } else if (load.packageType === 'boxes') {
          if (!load.dimensions.length || !load.dimensions.width || !load.dimensions.height) {
            showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationBoxDimensions}`);
            return false;
          }
        }
        if (!load.weightPerUnit) {
          showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationWeightPerUnit}`);
          return false;
        }
      } else { // calculationType === 'total'
        if (!load.totalVolume) {
          showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationTotalVolume}`);
          return false;
        }
        if (!load.totalWeight) {
          showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationTotalWeight}`);
          return false;
        }
      }
    } else { // shippingType === 'container'
      if (!load.containerType) {
        showToast(`Shipment ${loadNumber}: ${I18N_TEXT[userLang].validationContainerType}`);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Sanitize zip code fields to allow only digits
    let sanitizedValue = value;
    if (name === 'zipCode' || name === 'destZipCode') {
      sanitizedValue = value.replace(/\D/g, ''); // Remove any non-digit characters
    }
    // Sanitize city fields to allow international characters, letters, spaces, hyphens and apostrophes
    if (name === 'city' || name === 'destCity') {
      // Allow Unicode letters, numbers, spaces, hyphens, apostrophes, and common punctuation
      sanitizedValue = value.replace(/[^\p{L}\p{N}\s'.,()-]/gu, '');
    }
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    validateField(name, sanitizedValue);
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
    setFieldValid(prev => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.country) {
          showToast(I18N_TEXT[userLang].validationDestinationCountry);
          setFieldValid(prev => ({ ...prev, country: false }));
          return false;
        }
        if (!formData.destLocationType) {
          showToast(I18N_TEXT[userLang].validationDestinationLocationType);
          setFieldValid(prev => ({ ...prev, destLocationType: false }));
          return false;
        }
        if (formData.destLocationType) {
          if (!formData.destCity) {
            showToast(I18N_TEXT[userLang].validationDestinationCity);
            setFieldValid(prev => ({ ...prev, destCity: false }));
            return false;
          }
          if (!formData.destZipCode) {
            showToast(I18N_TEXT[userLang].validationDestinationZip);
            setFieldValid(prev => ({ ...prev, destZipCode: false }));
            return false;
          }
        }
        setFieldValid(prev => ({ 
          ...prev, 
          country: true, 
          destLocationType: true, 
          destCity: formData.destLocationType ? !!formData.destCity : null, 
          destZipCode: formData.destLocationType ? !!formData.destZipCode : null 
        }));
        break;
      case 2:
        if (!formData.mode) {
          showToast(I18N_TEXT[userLang].validationShippingMode);
          setFieldValid(prev => ({ ...prev, mode: false }));
          return false;
        }
        setFieldValid(prev => ({ ...prev, mode: true }));
        break;
      case 3:
        // 1. Check if an origin location type is selected
        if (!formData.locationType) {
          showToast(I18N_TEXT[userLang].validationPickupLocationType);
          setFieldValid(prev => ({ ...prev, locationType: false }));
          return false;
        }

        // 2. Validate based on the selected location type
        if (formData.locationType === 'port') {
          if (!formData.origin) {
            showToast(I18N_TEXT[userLang].validationOriginPort);
            setFieldValid(prev => ({ ...prev, origin: false }));
            return false;
          }
        } else if (['factory', 'business', 'residential'].includes(formData.locationType)) {
          if (!formData.city) {
            showToast(I18N_TEXT[userLang].validationPickupCity);
            setFieldValid(prev => ({ ...prev, city: false }));
            return false;
          }
          if (!formData.zipCode) {
            showToast(I18N_TEXT[userLang].validationPickupZip);
            setFieldValid(prev => ({ ...prev, zipCode: false }));
            return false;
          }
        }
        
        // If all checks for step 3 passed
        setFieldValid(prev => ({
          ...prev,
          locationType: true,
          origin: formData.locationType === 'port' ? !!formData.origin : null, // Valid if port and origin selected, null otherwise
          city: ['factory', 'business', 'residential'].includes(formData.locationType) ? !!formData.city : null,
          zipCode: ['factory', 'business', 'residential'].includes(formData.locationType) ? !!formData.zipCode : null,
        }));
        break;
      case 4:
        // Validation for step 4 - Cargo Details (now iterates over formData.loads)
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
          showToast(I18N_TEXT[userLang].validationGoodsValue);
          setFieldValid({ ...fieldValid, goodsValue: false });
          return false;
        }
        if (!formData.areGoodsReady) {
          showToast(I18N_TEXT[userLang].validationReadyDate);
          return false;
        }
        // Sub-step 3 is optional, so no validation needed
        setFieldValid({ ...fieldValid, goodsValue: true });
        break;
      case 6: // Existing Step 5 (Contact) is now Step 6
        if (!customerType) {
          showToast(I18N_TEXT[userLang].validationShipperType);
          return false;
        }
        if (!formData.firstName) {
          showToast(I18N_TEXT[userLang].validationFirstName);
          setFieldValid(prev => ({ ...prev, firstName: false }));
          return false;
        }
        if (!formData.lastName) {
          showToast(I18N_TEXT[userLang].validationLastName);
          setFieldValid(prev => ({ ...prev, lastName: false }));
          return false;
        }
        // Only require company name if customer type is 'company'
        if (customerType === 'company' && !formData.companyName) {
          showToast(I18N_TEXT[userLang].validationCompanyName);
          setFieldValid(prev => ({ ...prev, companyName: false }));
          return false;
        }
        if (!formData.shipperType) {
          showToast(I18N_TEXT[userLang].validationShipperRole);
          setFieldValid(prev => ({ ...prev, shipperType: false }));
          return false;
        }
        if (!formData.email || !validateField('email', formData.email)) {
          showToast(I18N_TEXT[userLang].validationEmail);
          setFieldValid(prev => ({ ...prev, email: false }));
          return false;
        }
        // If all checks for step 6 passed
        setFieldValid(prev => ({
          ...prev,
          firstName: true,
          lastName: true,
          companyName: customerType === 'company' ? !!formData.companyName : true,
          shipperType: true,
          email: true
        }));
        break;
    }
    return true;
  };

  const nextStep = () => {
    // If we're on step 5, handle sub-steps
    if (currentStep === 5) {
      if (step5SubStep < 3) {
        // Check if current sub-step is valid before proceeding
        if (validateStep5SubStep(step5SubStep)) {
          setStep5SubStep(prev => prev + 1);
        }
      } else {
        // We're on the last sub-step of step 5, go to step 6
    if (validateStep(currentStep)) {
          setCurrentStep(prev => Math.min(prev + 1, 6));
          setStep5SubStep(1); // Reset sub-step for next time
        }
      }
    } else {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, 6));
        // Reset sub-step when entering step 5
        if (currentStep === 4) {
          setStep5SubStep(1);
        }
      }
    }
  };

  const prevStep = () => {
    // If we're on step 5, handle sub-steps
    if (currentStep === 5) {
      if (step5SubStep > 1) {
        setStep5SubStep(prev => prev - 1);
      } else {
        // We're on the first sub-step of step 5, go back to step 4
    setCurrentStep(prev => Math.max(prev - 1, 1));
      }
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      // If coming back to step 5 from step 6, go to last sub-step
      if (currentStep === 6) {
        setStep5SubStep(3);
      }
    }
  };

  // Validation function for step 5 sub-steps
  const validateStep5SubStep = (subStep: number): boolean => {
    switch (subStep) {
      case 1:
        if (!formData.goodsValue) {
          showToast(I18N_TEXT[userLang].validationGoodsValue);
          setFieldValid({ ...fieldValid, goodsValue: false });
          return false;
        }
        setFieldValid({ ...fieldValid, goodsValue: true });
        return true;
      case 2:
        if (!formData.areGoodsReady) {
          showToast(I18N_TEXT[userLang].validationReadyDate);
          return false;
        }
        return true;
      case 3:
        return true; // Optional fields, always valid
      default:
        return false;
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle Enter key to proceed to next step
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only proceed if Enter key is pressed
      if (event.key !== 'Enter') return;
      
      // Don't trigger if user is in a textarea or if any dropdown is open
      const target = event.target as HTMLElement;
      const isInTextarea = target.tagName === 'TEXTAREA';
      const isInInput = target.tagName === 'INPUT';
      const anyDropdownOpen = isCountryListVisible || isPortListVisible || isPhonePrefixListVisible || 
                             isCurrencyListVisible || isTimingListVisible || isRequirementsListVisible || 
                             isExperienceListVisible;
      
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
  }, [currentStep, nextStep, isCountryListVisible, isPortListVisible, isPhonePrefixListVisible, 
      isCurrencyListVisible, isTimingListVisible, isRequirementsListVisible, isExperienceListVisible]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

      // 1. Prepare the data from current active load states
      let activeLoadSubmitData: LoadDetails = {
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

      // 2. Prepare the base formData for the payload
      let payloadBase = { ...formData };

      // Convert country code to name for the main payload data
      const countryObj = COUNTRIES.find(c => c.code === formData.country);
      if (countryObj) {
        payloadBase.country = countryObj.name; // Country name for the payload field
      }

      // Convert origin port/airport code to name
      const allPortsAndAirports = [...SEA_PORTS, ...AIRPORTS, ...RAIL_TERMINALS];
      const originObj = allPortsAndAirports.find(p => p.code === formData.origin);
      if (originObj) {
        payloadBase.origin = originObj.name;
      }

      // 3. Process the loads array to clean container data and use latest active load data
      const processedLoads = formData.loads.map((loadInState, idx) => {
        // Use the most up-to-date data for the active load, others from formData.loads
        let currentLoadDetailsToProcess = idx === activeLoadIndex ? activeLoadSubmitData : { ...loadInState };

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
      const timePartHKT = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Hong_Kong', hourCycle: 'h23' });
      
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
        if (makeResult.status === 'rejected' || (makeResult.status === 'fulfilled' && !makeResult.value.ok)) {
            const errorReason = makeResult.status === 'rejected' 
                ? makeResult.reason 
                : await makeResult.value.text();
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
        showToast(I18N_TEXT[userLang].errorSubmission);
      }
    }
  };

  const handleModeSelect = (mode: string) => {
    setFormData({
      ...formData,
      mode
    });
    setFieldValid({
      ...fieldValid,
      mode: true
    });
  };

  const handleCountrySelect = (countryCode: string) => {
    const selectedCountryData = COUNTRIES.find(c => c.code === countryCode);

    if (selectedCountryData) {
      setFormData(prevFormData => ({
        ...prevFormData,
        country: selectedCountryData.code,
        // Set phoneCountryCode based on selected destination country, if it exists
        phoneCountryCode: selectedCountryData.phonePrefix || prevFormData.phoneCountryCode 
      }));

      setFieldValid(prevFieldValid => ({
        ...prevFieldValid,
        country: true // Mark country as valid
      }));

      // Update the countrySearch input display (for Step 1)
      setCountrySearch(`${selectedCountryData.flag} ${selectedCountryData.name}`);

      // Update the phonePrefixSearch state (for Step 6 input) to reflect the new prefix
      if (selectedCountryData.phonePrefix) {
        // We need the flag for the prefix display. The selectedCountryData itself has the flag.
        setPhonePrefixSearch(`${selectedCountryData.flag} ${selectedCountryData.phonePrefix}`);
      } else {
        // If the selected destination country has no phonePrefix, 
        // attempt to display the currently set phoneCountryCode (from formData) with its flag, or just the code.
        const currentPhoneCountry = COUNTRIES.find(c => c.phonePrefix === formData.phoneCountryCode);
        if (currentPhoneCountry) {
          setPhonePrefixSearch(`${currentPhoneCountry.flag} ${formData.phoneCountryCode}`);
        } else {
          setPhonePrefixSearch(formData.phoneCountryCode); // Fallback to just the prefix string
        }
      }
    } else {
      // Fallback if countryCode didn't match any country (should ideally not happen with UI selection)
      setFormData(prevFormData => ({
        ...prevFormData,
        country: countryCode // Still set the code, but other fields might be out of sync
      }));
      setFieldValid(prevFieldValid => ({
        ...prevFieldValid,
        country: true // Or false, depending on how strict validation should be here
      }));
      setCountrySearch(''); // Clear search if full country data not found
      // Clear or reset phone prefix search if main country data is missing
      const fallbackCountry = COUNTRIES.find(c => c.phonePrefix === formData.phoneCountryCode);
      if (fallbackCountry) {
        setPhonePrefixSearch(`${fallbackCountry.flag} ${formData.phoneCountryCode}`);
      } else {
        setPhonePrefixSearch(formData.phoneCountryCode);
      }
    }
    setIsCountryListVisible(false); // Hide the country list dropdown

    // If newly selected country does not support rail freight and Rail was selected, reset mode
    if (!RAIL_FREIGHT_COUNTRIES.includes(countryCode) && formData.mode === 'Rail') {
      setFormData(prev => ({ ...prev, mode: '' }));
      setFieldValid(prev => ({ ...prev, mode: null }));
    }

    // --- Update usage count in localStorage ---
    try {
      const key = 'countryUsage';
      const usageRaw = localStorage.getItem(key);
      const usageObj: Record<string, number> = usageRaw ? JSON.parse(usageRaw) : {};
      usageObj[countryCode] = (usageObj[countryCode] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(usageObj));
    } catch (err) { /* ignore quota errors */ }
  };

  const handlePhonePrefixSelect = (prefix: string) => {
    const country = COUNTRIES.find(c => c.phonePrefix === prefix);
    setFormData({
      ...formData,
      phoneCountryCode: prefix
    });
    // Optionally update validation state for phoneCountryCode if needed
    // setFieldValid({ ...fieldValid, phoneCountryCode: true }); 
    setPhonePrefixSearch(country ? `${country.flag} ${prefix}` : prefix);
    setIsPhonePrefixListVisible(false);
  };

  const handlePortSelect = (portCode: string) => {
    if (portCode === 'DONT_KNOW') {
      // Handle "I don't know" option
      setFormData({
        ...formData,
        origin: portCode
      });
      setFieldValid({
        ...fieldValid,
        origin: true
      });
      setPortSearch(`❓ ${I18N_TEXT[userLang].dontKnowPort}`);
      setIsPortListVisible(false);
    } else {
      // Handle regular port selection
      const port = [...SEA_PORTS, ...AIRPORTS, ...RAIL_TERMINALS].find(p => p.code === portCode);
      setFormData({
        ...formData,
        origin: portCode
      });
      setFieldValid({
        ...fieldValid,
        origin: true
      });
      setPortSearch(port ? `${port.flag} ${getTranslatedPortName(port, userLang)}` : '');
      setIsPortListVisible(false);
    }
  };

  // Currency dropdown options
  const CURRENCY_OPTIONS = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' }
  ];

  // Timing dropdown options  
  const TIMING_OPTIONS = [
    { code: 'yes', name: 'Ready now', description: 'goods are available for immediate pickup', icon: '🟢' },
    { code: 'no_in_1_week', name: 'Within 1 week', description: 'currently preparing', icon: '🗓️' },
    { code: 'no_in_2_weeks', name: 'Within 2 weeks', description: 'production in progress', icon: '🗓️' },
    { code: 'no_in_1_month', name: 'Within 1 month', description: 'planning ahead', icon: '🗓️' },
    { code: 'no_date_set', name: 'Date not determined yet', description: '', icon: '❔' }
  ];

  // Special requirements dropdown options
  const REQUIREMENTS_OPTIONS = [
    { code: '', name: 'No special requirements', description: '', icon: '🟢' },
    { code: 'fragile', name: 'Fragile goods', description: 'handle with care', icon: '📦' },
    { code: 'temperature', name: 'Temperature controlled', description: '', icon: '🧊' },
    { code: 'urgent', name: 'Urgent/time-sensitive', description: '', icon: '🚀' },
    { code: 'insurance', name: 'High-value insurance required', description: '', icon: '💎' },
    { code: 'other', name: 'Other', description: I18N_TEXT[userLang].pleaseSpecifyInRemarks, icon: '➕' }
  ];

  // Use the globally defined EXPERIENCE_OPTIONS with full translations

  const handleCurrencySelect = (currencyCode: string) => {
    const currency = CURRENCY_OPTIONS.find(c => c.code === currencyCode);
    setFormData({
      ...formData,
      goodsCurrency: currencyCode
    });
    setCurrencySearch(currency ? `${currency.flag} ${currency.code}` : currencyCode);
    setIsCurrencyListVisible(false);
  };

  const handleTimingSelect = (timingCode: string) => {
    const timing = TIMING_OPTIONS.find(t => t.code === timingCode);
    setFormData({
      ...formData,
      areGoodsReady: timingCode
    });
    
    // Get the proper translated text and clean emojis
    let translatedName = '';
    switch(timingCode) {
      case 'yes':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyNow);
        break;
      case 'no_in_1_week':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Week);
        break;
      case 'no_in_2_weeks':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn2Weeks);
        break;
      case 'no_in_1_month':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Month);
        break;
      case 'no_date_set':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].dateNotSet);
        break;
    }
    
    setTimingSearch(timing ? `${timing.icon}  ${translatedName}` : timingCode);
    setIsTimingListVisible(false);
  };

  // Helper function to clean emoji from text
  const cleanEmojiFromText = (text: string): string => {
    // More comprehensive emoji removal - covers all common emoji ranges and symbols
    return text
      .replace(/^[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Main emoji block
      .replace(/^[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Miscellaneous symbols  
      .replace(/^[\u{2700}-\u{27BF}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Dingbats
      .replace(/^[\u{1F600}-\u{1F64F}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Emoticons
      .replace(/^[\u{1F680}-\u{1F6FF}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Transport symbols
      .replace(/^[\u{1F1E0}-\u{1F1FF}][\u{FE00}-\u{FE0F}]?\s*/u, '') // Flags
      .replace(/^[✅❓⚡🔸🌡️🛡️📝📅]\s*/g, '') // Specific emojis used in the app
      .trim();
  };

  const handleRequirementsSelect = (requirementCode: string) => {
    const requirement = REQUIREMENTS_OPTIONS.find(r => r.code === requirementCode);
    setFormData({
      ...formData,
      specialRequirements: requirementCode
    });
    
    // Get the proper translated text and clean emojis
    let translatedName = '';
    switch(requirementCode) {
      case '':
        translatedName = I18N_TEXT[userLang].noSpecialRequirements;
        break;
      case 'fragile':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].fragileGoods);
        break;
      case 'temperature':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].temperatureControlled);
        break;
      case 'urgent':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].urgentTimeSensitive);
        break;
      case 'insurance':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].highValueInsurance);
        break;
      case 'other':
        translatedName = cleanEmojiFromText(I18N_TEXT[userLang].otherSpecify);
        break;
    }
    
    setRequirementsSearch(requirement ? `${requirement.icon}  ${translatedName}` : I18N_TEXT[userLang].noSpecialRequirements);
    setIsRequirementsListVisible(false);
  };

  const handleExperienceSelect = (experienceCode: string) => {
    const experience = EXPERIENCE_OPTIONS.find(e => e.code === experienceCode);
    setFormData({
      ...formData,
      shipperType: experienceCode
    });
    
    // Get the proper translated text and clean emojis
    let translatedName = '';
    switch(experienceCode) {
      case 'first-time':
        translatedName = (I18N_TEXT[userLang] as any).firstTimeShipper || 'First-time shipper';
        break;
      case 'up-to-10x':
        translatedName = (I18N_TEXT[userLang] as any).upTo10Times || 'Shipped up to 10 times';
        break;
      case 'more-than-10x':
        translatedName = (I18N_TEXT[userLang] as any).moreThan10Times || 'Shipped more than 10 times';
        break;
      case 'regular':
        translatedName = (I18N_TEXT[userLang] as any).regularShipper || 'Regular shipper (monthly)';
        break;
    }
    
    setExperienceSearch(experience ? `${experience.icon}  ${translatedName}` : experienceCode);
    setIsExperienceListVisible(false);
    setFieldValid(prev => ({ ...prev, shipperType: true }));
  };

  // Helper to clear the currently selected destination country (UX improvement)
  const clearCountrySelection = () => {
    // Reset the destination country related fields
    setFormData(prev => ({
      ...prev,
      country: '',
    }));
    setCountrySearch('');
    setSelectedDestLocationType('');
  };

  // Helper to clear the currently selected port (UX improvement)
  const clearPortSelection = () => {
    // Reset the origin port related fields
    setFormData(prev => ({
      ...prev,
      origin: '',
    }));
    setPortSearch('');
    setFieldValid(prev => ({ ...prev, origin: null }));
  };

  const handleLocationTypeSelect = (type: string) => {
    setSelectedLocationType(type);
    setFormData({
      ...formData,
      locationType: type,
      origin: '' // Reset origin when changing location type
    });
    setFieldValid(prev => ({ ...prev, locationType: true }));
  };

  const handleDestLocationTypeSelect = (type: string) => {
    setSelectedDestLocationType(type);
    setFormData({
      ...formData,
      destLocationType: type
    });
    setFieldValid(prev => ({ ...prev, destLocationType: true }));
  };

  const handleAddLoad = async () => {
    setAddShipmentLoading(true);

    // Validate the current active load before adding a new one
    // Construct the current load data from individual states to ensure validation uses the latest UI values
    const currentLoadDataFromStates: LoadDetails = {
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

    if (!isLoadDataValid(currentLoadDataFromStates, activeLoadIndex)) {
      // Show immediate feedback with enhanced toast
      const enhancedMessage = `⚠️ Complete current shipment first: ${toastMessage}`;
      setToastMessage(enhancedMessage);
      
      // Scroll to the validation error area
      setTimeout(() => {
        const errorElement = document.querySelector('.cargo-details-form-section, .loose-cargo-section, .container-details');
        if (errorElement) {
          errorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      
      setAddShipmentLoading(false);
      return; // Stop if current load is invalid
    }

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const newLoad = JSON.parse(JSON.stringify(initialLoadDetails));
    setFormData(prevFormData => {
      const updatedLoads = [...prevFormData.loads, newLoad];
      // Set the new load as active
      setActiveLoadIndex(updatedLoads.length - 1);
      return {
        ...prevFormData,
        loads: updatedLoads
      };
    });

    setAddShipmentLoading(false);
    showToast(`✅ Shipment ${formData.loads.length + 1} added successfully!`);
  };

  const handleSetActiveLoad = (index: number) => {
    // Save the current load before switching
    setFormData(prevFormData => {
      if (activeLoadIndex < 0 || activeLoadIndex >= prevFormData.loads.length) return prevFormData;
      const updatedLoads = prevFormData.loads.map((load, idx) => {
        if (idx === activeLoadIndex) {
          return {
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
        }
        return load;
      });
      return { ...prevFormData, loads: updatedLoads };
    });
    // Change the active load index after saving
    setActiveLoadIndex(index);
  };

  const handleDeleteLoad = (indexToDelete: number) => {
    if (formData.loads.length <= 1) {
      showToast("You must have at least one shipment.");
      return;
    }

    setFormData(prevFormData => {
      const newLoads = prevFormData.loads.filter((_, i) => i !== indexToDelete);
      let newActiveLoadIndex = activeLoadIndex;

      if (activeLoadIndex === indexToDelete) {
        newActiveLoadIndex = Math.max(0, indexToDelete - 1);
      } else if (activeLoadIndex > indexToDelete) {
        newActiveLoadIndex = activeLoadIndex - 1;
      }
      // Ensure newActiveLoadIndex is within bounds of newLoads
      newActiveLoadIndex = Math.min(newLoads.length - 1, newActiveLoadIndex);
      
      // Important: Set activeLoadIndex *after* formData is updated or in the same setState call if possible
      // For simplicity here, we'll update it separately, but it might be better to chain this
      // However, the useEffect that syncs form fields to activeLoadIndex should handle this update.
      setActiveLoadIndex(newActiveLoadIndex);
      return { ...prevFormData, loads: newLoads };
    });
  };

  // Fonction de duplication d'un load
  const handleDuplicateLoad = (indexToDuplicate: number) => {
    if (indexToDuplicate < 0 || indexToDuplicate >= formData.loads.length) return;
    
    const loadToDuplicate = formData.loads[indexToDuplicate];
    const duplicatedLoad = JSON.parse(JSON.stringify(loadToDuplicate));
    
    setFormData(prevFormData => {
      const newLoads = [...prevFormData.loads, duplicatedLoad];
      setActiveLoadIndex(newLoads.length - 1); // Switch to the duplicated load
      return { ...prevFormData, loads: newLoads };
    });
    
    showToast(`Shipment ${indexToDuplicate + 1} duplicated successfully!`);
  };

  // Fonction de consolidation des volumes et poids totaux
  const getConsolidatedTotals = () => {
    let totalVolumeCBM = 0;
    let totalWeightKG = 0;
    let totalContainers = 0;
    let mixedShippingTypes = false;
    const shippingTypes = new Set();

    // Capacités standard des containers en CBM
    const containerCapacities: Record<LoadDetails['containerType'], number> = {
      "20'": 33,
      "40'": 67,
      "40'HC": 76,
      "45'HC": 86
    };

    formData.loads.forEach(load => {
      shippingTypes.add(load.shippingType);
      
      if (load.shippingType === 'loose') {
        if (load.calculationType === 'unit') {
          // Calculate from unit details
          const length = parseFloat(load.dimensions.length) || 0;
          const width = parseFloat(load.dimensions.width) || 0;
          const height = parseFloat(load.dimensions.height) || 0;
          const units = load.numberOfUnits || 0;
          
          if (length && width && height && units) {
            // Convert dimensions to meters
            const factor = load.dimensionUnit === 'CM' ? 0.01 : load.dimensionUnit === 'IN' ? 0.0254 : 1;
            const volumePerUnitCBM = length * width * height * Math.pow(factor, 3);
            totalVolumeCBM += volumePerUnitCBM * units;
          }
          
          // Weight calculation
          const weightPerUnit = parseFloat(load.weightPerUnit) || 0;
          if (weightPerUnit && units) {
            const weightFactor = load.weightUnit === 'LB' ? 0.453592 : load.weightUnit === 'T' ? 1000 : 1;
            totalWeightKG += weightPerUnit * weightFactor * units;
          }
        } else {
          // Calculate from total values
          const totalVolume = parseFloat(load.totalVolume) || 0;
          if (totalVolume) {
            const volumeFactor = load.totalVolumeUnit === 'M3' ? 1 : 1; // CBM = M3
            totalVolumeCBM += totalVolume * volumeFactor;
          }
          
          const totalWeight = parseFloat(load.totalWeight) || 0;
          if (totalWeight) {
            const weightFactor = load.totalWeightUnit === 'LB' ? 0.453592 : load.totalWeightUnit === 'T' ? 1000 : 1;
            totalWeightKG += totalWeight * weightFactor;
          }
        }
      } else if (load.shippingType === 'container') {
        const containerCount = load.numberOfUnits || 0;
        totalContainers += containerCount;
        
        // Add container volume to total
        const containerCapacity = containerCapacities[load.containerType as keyof typeof containerCapacities] || 0;
        totalVolumeCBM += containerCapacity * containerCount;
      }
    });

    mixedShippingTypes = shippingTypes.size > 1;

    return {
      totalVolumeCBM: Math.round(totalVolumeCBM * 100) / 100,
      totalWeightKG: Math.round(totalWeightKG * 100) / 100,
      totalContainers,
      mixedShippingTypes,
      looseCargoLoads: formData.loads.filter(load => load.shippingType === 'loose').length,
      containerLoads: formData.loads.filter(load => load.shippingType === 'container').length,
    };
  };

  // Fonction pour obtenir l'icône du type de cargo
  const getLoadIcon = (load: LoadDetails) => {
    if (load.shippingType === 'unsure') {
      return '🤝';
    } else if (load.shippingType === 'container') {
      return '🚢';
    } else if (load.packageType === 'pallets') {
      return '📦';
    } else if (load.packageType === 'boxes') {
      return '📋';
    }
    return '📦';
  };

  // Fonction pour obtenir le résumé intelligent d'un load
  const getEnhancedLoadSummary = (load: LoadDetails, index: number): { title: string; details: string } => {
    const title = `${I18N_TEXT[userLang].shipmentTitle} ${index + 1}`;
    let details = '';

    if (load.shippingType === 'loose') {
      if (load.calculationType === 'unit') {
        const packageDesc = load.packageType === 'pallets' ? I18N_TEXT[userLang].pallets : 
                           load.packageType === 'boxes' ? I18N_TEXT[userLang].boxesCrates : I18N_TEXT[userLang].items;
        details = `${load.numberOfUnits} ${packageDesc}`;
        
        // Add weight if available
        if (load.weightPerUnit) {
          details += ` • ${load.weightPerUnit}${load.weightUnit} ${I18N_TEXT[userLang].each}`;
        }
      } else {
        details = I18N_TEXT[userLang].totalCalculation;
        if (load.totalVolume) {
          details += ` • ${load.totalVolume}${load.totalVolumeUnit}`;
        }
        if (load.totalWeight) {
          details += ` • ${load.totalWeight}${load.totalWeightUnit}`;
        }
      }
    } else if (load.shippingType === 'container') {
      details = `${load.numberOfUnits} × ${load.containerType}`;
      if (load.isOverweight) {
        details += ` • ${I18N_TEXT[userLang].overweight}`;
      }
    }

    return { title, details: details || I18N_TEXT[userLang].setupPending };
  };

  const getLocationTypes = () => {
    const baseTypes = LOCATION_TYPES.map(type => ({ ...type })); // Deep copy for modification
    const portIndex = baseTypes.findIndex(t => t.id === 'port');

    if (portIndex !== -1) {
      if (formData.mode === 'Sea') {
        baseTypes[portIndex].name = 'Port';
        baseTypes[portIndex].icon = Ship; // Ensure Ship icon for Sea mode
      } else if (formData.mode === 'Air' || formData.mode === 'Express') {
        baseTypes[portIndex].name = 'Airport';
        baseTypes[portIndex].icon = Plane; // Ensure Plane icon for Air/Express modes
      } else if (formData.mode === 'Rail') {
        baseTypes[portIndex].name = 'Rail Terminal';
        baseTypes[portIndex].icon = TrainFront;
      }
      // If formData.mode is empty or another value,
      // it will use the name 'Port/Airport' and icon from the updated LOCATION_TYPES (Ship icon).
    }
    return baseTypes;
  };

  // Helper: remove flag emojis (regional indicator symbols) and trim
  const sanitizeSearch = (input: string) => input
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // remove flag emojis
    .trim()
    .toLowerCase();

  const sanitizedCountrySearch = sanitizeSearch(debouncedCountrySearch);

  // Get priority countries for current language
  const priorityCountryCodes = PRIORITY_COUNTRIES_BY_LANG[userLang] || [];

  const filteredCountries = (() => {
    // First filter all countries based on search
    const searchFiltered = COUNTRIES.filter(country => {
      if (!sanitizedCountrySearch) return true; // if empty search, show all
      return (
        country.name.toLowerCase().includes(sanitizedCountrySearch) ||
        country.code.toLowerCase().includes(sanitizedCountrySearch)
      );
    });

    // If there's a search term, just return the filtered results sorted alphabetically
    if (sanitizedCountrySearch) {
      return searchFiltered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // If no search term, prioritize countries by language
    const priorityCountries = searchFiltered.filter(country => 
      priorityCountryCodes.includes(country.code)
    ).sort((a, b) => a.name.localeCompare(b.name));

    const otherCountries = searchFiltered.filter(country => 
      !priorityCountryCodes.includes(country.code)
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Return priority countries first, then others
    return [...priorityCountries, ...otherCountries];
  })();

  const getFilteredPorts = () => {
    let ports;
    if (formData.mode === 'Sea') {
      ports = SEA_PORTS;
    } else if (formData.mode === 'Rail') {
      ports = RAIL_TERMINALS;
    } else { // Air / Express default
      ports = AIRPORTS;
    }
    
    // Filter ports based on search
    const filteredPorts = ports.filter(port => {
      const translatedName = getTranslatedPortName(port, userLang);
      const translatedRegion = getTranslatedRegionName(port.region, userLang);
      return translatedName.toLowerCase().includes(portSearch.toLowerCase()) ||
             port.name.toLowerCase().includes(portSearch.toLowerCase()) ||
             port.code.toLowerCase().includes(portSearch.toLowerCase()) ||
             translatedRegion.toLowerCase().includes(portSearch.toLowerCase()) ||
             port.region.toLowerCase().includes(portSearch.toLowerCase());
    });
    
    // Add "I don't know" option at the top if search is empty or matches the text
    const dontKnowText = I18N_TEXT[userLang].dontKnowPort;
    const dontKnowOption = {
      code: 'DONT_KNOW',
      name: dontKnowText,
      region: I18N_TEXT[userLang].dontKnowPortDescription,
      type: 'unknown',
      volume: '',
      flag: '❓'
    };
    
    if (!portSearch || dontKnowText.toLowerCase().includes(portSearch.toLowerCase())) {
      return [dontKnowOption, ...filteredPorts];
    }
    
    return filteredPorts;
  };

  // Helper to update a property of the current load
  const updateCurrentLoad = (field: keyof LoadDetails, value: any) => {
    setFormData(prevFormData => {
      const updatedLoads = prevFormData.loads.map((load, idx) => {
        if (idx === activeLoadIndex) {
          return { ...load, [field]: value };
        }
        return load;
      });
      return { ...prevFormData, loads: updatedLoads };
    });
  };



  const handleTestSubmit = () => {
    if (TEST_LEADS.length === 0) {
      showToast(I18N_TEXT[userLang].noTestLeads);
      return;
    }

    const randomIndex = Math.floor(Math.random() * TEST_LEADS.length);
    const nextLead = TEST_LEADS[randomIndex];

    // Injection des données dans le formulaire
    setFormData(nextLead as any); // typage souple le temps de tous les ajustements
    setActiveLoadIndex(0);
    setCurrentStep(6);

    // Mise à jour des états d'affichage (country, port, etc.)
    const selectedCountry = COUNTRIES.find((c) => c.code === nextLead.country);
    if (selectedCountry) {
      setCountrySearch(`${selectedCountry.flag} ${selectedCountry.name}`);
      setPhonePrefixSearch(`${selectedCountry.flag} ${selectedCountry.phonePrefix}`);
    } else {
      setCountrySearch('');
      setPhonePrefixSearch('');
    }

    const originPort = [...SEA_PORTS, ...AIRPORTS, ...RAIL_TERMINALS].find((p) => p.code === nextLead.origin);
    if (originPort) {
      setPortSearch(`${originPort.flag} ${getTranslatedPortName(originPort, userLang)}`);
    } else if (nextLead.origin === 'DONT_KNOW') {
      setPortSearch(`❓ ${I18N_TEXT[userLang].dontKnowPort}`);
    } else {
      setPortSearch('');
    }

    setSelectedLocationType(nextLead.locationType);
    setSelectedDestLocationType(nextLead.destLocationType);
  };

  // Accessibility: highlighted index for keyboard navigation in country list
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState<number>(-1);

  // Reset highlighted index whenever we open/close list or search term changes
  useEffect(() => {
    if (!isCountryListVisible) {
      setHighlightedCountryIndex(-1);
    } else {
      setHighlightedCountryIndex(prev => {
        const withinBounds = prev >= 0 && prev < filteredCountries.length;
        return withinBounds ? prev : 0;
      });
    }
  }, [isCountryListVisible, sanitizedCountrySearch, filteredCountries.length]);

  // Initialize step 5 dropdown displays
  useEffect(() => {
    // Initialize currency display
    if (formData.goodsCurrency) {
      const currency = CURRENCY_OPTIONS.find(c => c.code === formData.goodsCurrency);
      if (currency) {
        setCurrencySearch(`${currency.flag} ${currency.code}`);
      }
    }

    // Initialize timing display
    if (formData.areGoodsReady) {
      const timing = TIMING_OPTIONS.find(t => t.code === formData.areGoodsReady);
      if (timing) {
        let translatedName = '';
        switch(formData.areGoodsReady) {
          case 'yes':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyNow);
            break;
          case 'no_in_1_week':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Week);
            break;
          case 'no_in_2_weeks':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn2Weeks);
            break;
          case 'no_in_1_month':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Month);
            break;
          case 'no_date_set':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].dateNotSet);
            break;
        }
        setTimingSearch(`${timing.icon}  ${translatedName}`);
      }
    }

    // Initialize requirements display
    if (formData.specialRequirements !== undefined) {
      const requirement = REQUIREMENTS_OPTIONS.find(r => r.code === formData.specialRequirements);
      if (requirement) {
        let translatedName = '';
        switch(formData.specialRequirements) {
          case '':
            translatedName = I18N_TEXT[userLang].noSpecialRequirements;
            break;
          case 'fragile':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].fragileGoods);
            break;
          case 'temperature':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].temperatureControlled);
            break;
          case 'urgent':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].urgentTimeSensitive);
            break;
          case 'insurance':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].highValueInsurance);
            break;
          case 'other':
            translatedName = cleanEmojiFromText(I18N_TEXT[userLang].otherSpecify);
            break;
        }
        setRequirementsSearch(`${requirement.icon}  ${translatedName}`);
      }
    }
  }, [formData.goodsCurrency, formData.areGoodsReady, formData.specialRequirements, userLang]);

  // Keyboard navigation for country search
  const handleCountrySearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCountryListVisible && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
      setIsCountryListVisible(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedCountryIndex(prev => {
        const next = prev + 1;
        return next >= filteredCountries.length ? 0 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedCountryIndex(prev => {
        const next = prev - 1;
        return next < 0 ? filteredCountries.length - 1 : next;
      });
    } else if (e.key === 'Enter') {
      if (highlightedCountryIndex >= 0 && highlightedCountryIndex < filteredCountries.length) {
        e.preventDefault();
        const selected = filteredCountries[highlightedCountryIndex];
        if (selected) handleCountrySelect(selected.code);
      }
    } else if (e.key === 'Escape') {
      setIsCountryListVisible(false);
    }
  };

  // Debounce the country search input (200 ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCountrySearch(countrySearch);
    }, 200);

    return () => clearTimeout(handler);
  }, [countrySearch]);

  // scroll highlighted option into view
  useEffect(() => {
    if (!isCountryListVisible) return;
    if (highlightedCountryIndex < 0 || highlightedCountryIndex >= filteredCountries.length) return;
    const optionElem = document.getElementById(`country-option-${filteredCountries[highlightedCountryIndex].code}`);
    if (optionElem && optionElem.scrollIntoView) {
      optionElem.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedCountryIndex, isCountryListVisible, filteredCountries]);





  return (
    <div className="quote-form-container hover-lift">
      <div className="form-header">
        <h1 className="form-title bg-clip-text text-transparent bg-gradient-to-r from-[#001C38] to-[#D6DF20] animate-fade-in">
          {currentStep === 7 ? getText('confirmationMainTitle', userLang) : I18N_TEXT[userLang].mainTitle}
        </h1>
        <p className="form-subtitle text-[#001C38]/70 animate-slide-in">
          {currentStep === 7 ? getText('confirmationSubtitle', userLang) : I18N_TEXT[userLang].mainSubtitle}
        </p>
        
        {/* Sélecteur de langue avec CustomDropdown */}
          <div className="language-selector-header">
            <CustomDropdown
              value={userLang}
              onChange={(value) => setUserLang(value as any)}
              options={languageOptions}
              placeholder="Select language"
            />
          </div>
      </div>
      
      {/* Test Button */}
      <div className="test-button-container">
        <button
          type="button"
          onClick={handleTestSubmit}
          className="btn btn-ghost btn-sm glassmorphism test-btn"
        >
          🚀 Test Submit
        </button>
      </div>

      {/* Hide Timeline on confirmation page */}
      {currentStep !== 7 && (
        <Timeline 
          currentStep={currentStep} 
          totalSteps={6} 
          translations={{
            timelineDestination: I18N_TEXT[userLang].timelineDestination,
            timelineMode: I18N_TEXT[userLang].timelineMode,
            timelineOrigin: I18N_TEXT[userLang].timelineOrigin,
            timelineCargo: I18N_TEXT[userLang].timelineCargo,
            timelineGoodsDetails: I18N_TEXT[userLang].timelineGoodsDetails,
            timelineContact: I18N_TEXT[userLang].timelineContact,
            stepCounter: I18N_TEXT[userLang].stepCounter,
          }}
        />
      )}
      
      <form onSubmit={handleSubmit} className="quote-form">
        <FormStep isVisible={currentStep === 1} stepNumber={1} title={I18N_TEXT[userLang].step1Title} emoji="🌍">
          {/* Country Selection with Progressive Disclosure */}
          <div className="step-1-container">
            
            {/* Phase 1: Country Search */}
            <div className="country-selection-phase">
              <div className="phase-header">
                <h3 className="phase-header-title">
                  <span className={`step-indicator ${formData.country ? 'completed' : ''}`}>1</span>
                  {I18N_TEXT[userLang].selectDestinationCountry}
                </h3>
                <p className="phase-header-subtitle">
                  {I18N_TEXT[userLang].searchCountryDescription}
                </p>
              </div>

              <div className="form-control country-select">
                <div className="search-input-wrapper relative">
                  <Search className="search-icon" size={18} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={I18N_TEXT[userLang].searchCountry}
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setIsCountryListVisible(true);
                    }}
                    onFocus={() => setIsCountryListVisible(true)}
                    onKeyDown={handleCountrySearchKeyDown}
                    role="combobox"
                    aria-expanded={isCountryListVisible}
                    aria-controls="country-listbox"
                    aria-activedescendant={highlightedCountryIndex >= 0 && filteredCountries[highlightedCountryIndex] ? `country-option-${filteredCountries[highlightedCountryIndex].code}` : undefined}
                    className="input glassmorphism search-input"
                  />
                  {formData.country && (
                    <XCircle
                      size={18}
                      className="clear-search-icon clear-button"
                      onClick={clearCountrySelection}
                      aria-label={I18N_TEXT[userLang].clearCountry}
                    />
                  )}
                </div>
                <div 
                  ref={countryListRef}
                  id="country-listbox"
                  role="listbox"
                  aria-expanded={isCountryListVisible}
                  className={`country-list ${isCountryListVisible ? 'show' : ''}`}
                >
                  {filteredCountries.length > 0 ? (
                    (() => {
                      const priorityCountryCodes = PRIORITY_COUNTRIES_BY_LANG[userLang] || [];
                      const priorityCountries = filteredCountries.filter(country => 
                        priorityCountryCodes.includes(country.code)
                      );
                      const otherCountries = filteredCountries.filter(country => 
                        !priorityCountryCodes.includes(country.code)
                      );
                      
                      return (
                        <>
                          {/* Show priority countries section only if no search term and there are priority countries */}
                          {!sanitizedCountrySearch && priorityCountries.length > 0 && (
                            <>
                              <div className="country-section-header" style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: '#f8fafc',
                                borderBottom: '1px solid #e5e7eb',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <span style={{ color: '#10b981' }}>⭐</span>
                                {I18N_TEXT[userLang].popular}
                              </div>
                              {priorityCountries.map((country, index) => (
                                <div
                                  id={`country-option-${country.code}`}
                                  role="option"
                                  aria-selected={highlightedCountryIndex === index}
                                  key={country.code}
                                  className={`country-option ${formData.country === country.code ? 'selected' : ''} ${highlightedCountryIndex === index ? 'highlighted' : ''}`}
                                  onClick={() => handleCountrySelect(country.code)}
                                >
                                  <span className="country-flag">{country.flag}</span>
                                  <span className="country-name">{country.name}</span>
                                  <span className="country-code">{country.code}</span>
                                </div>
                              ))}
                              {otherCountries.length > 0 && (
                                                                 <div className="country-section-header section-header">
                                   {I18N_TEXT[userLang].otherCountries}
                                 </div>
                              )}
                            </>
                          )}
                          
                          {/* Show all other countries or all countries if searching */}
                          {(sanitizedCountrySearch ? filteredCountries : otherCountries).map((country, index) => {
                            const adjustedIndex = !sanitizedCountrySearch ? index + priorityCountries.length : index;
                            return (
                              <div
                                id={`country-option-${country.code}`}
                                role="option"
                                aria-selected={highlightedCountryIndex === adjustedIndex}
                                key={country.code}
                                className={`country-option ${formData.country === country.code ? 'selected' : ''} ${highlightedCountryIndex === adjustedIndex ? 'highlighted' : ''}`}
                                onClick={() => handleCountrySelect(country.code)}
                              >
                                <span className="country-flag">{country.flag}</span>
                                <span className="country-name">{country.name}</span>
                                <span className="country-code">{country.code}</span>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()
                  ) : (
                    countrySearch.trim() && (
                      <div className="no-results">
                        {I18N_TEXT[userLang].noCountryResults}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Phase 2: Location Type Selection (revealed after country selection) */}
            {formData.country && (
              <div 
                className="location-type-phase"
                style={{
                  marginTop: '2rem',
                  opacity: formData.country ? 1 : 0,
                  transform: formData.country ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.4s ease',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '2rem'
                }}
              >
                <div className="phase-header">
                  <h3 className="phase-header-title">
                    <span className={`step-indicator ${selectedDestLocationType ? 'completed' : ''}`}>2</span>
                    {I18N_TEXT[userLang].addressTypeQuestion}
                  </h3>
                  
                  {/* Help hint */}
                  <div className="phase-header-subtitle flex-center flex-gap-sm">
                    <Info size={14} className="info-icon" />
                    <span>{(I18N_TEXT[userLang] as any).helpChooseLocation || 'Not sure? Most beginners choose Business/Office'}</span>
                  </div>
                </div>

                <div className="location-types">
                  {getLocationTypes().map(type => (
                    <div
                      key={type.id}
                      className={`location-type-option ${selectedDestLocationType === type.id ? 'selected' : ''}`}
                      onClick={() => handleDestLocationTypeSelect(type.id)}
                      data-id={type.id}
                    >
                      <type.icon size={24} />
                      <span>{getLocationTypeName(type.id, userLang)}</span>
                      <p className="location-desc">{getLocationTypeDescription(type.id, userLang)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 3: Address Details (revealed after location type selection) */}
            {selectedDestLocationType && (
              <div 
                className="address-details-phase"
                style={{
                  marginTop: '2rem',
                  opacity: selectedDestLocationType ? 1 : 0,
                  transform: selectedDestLocationType ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.4s ease 0.2s',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '2rem'
                }}
              >
                <div className="phase-header">
                  <h3 className="phase-header-title">
                    <span className={`step-indicator ${(formData.destCity && formData.destZipCode) ? 'completed' : ''}`}>3</span>
                    {I18N_TEXT[userLang].enterDestinationDetails}
                  </h3>
                  <p className="phase-header-subtitle">
                    {I18N_TEXT[userLang].cityPostalDescription}
                  </p>
                </div>

                <div className="address-form">
                  <div className="address-details" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div className="form-control">
                      <input
                        type="text"
                        name="destCity"
                        placeholder={I18N_TEXT[userLang].destinationCity}
                        value={formData.destCity}
                        onChange={handleInputChange}
                        className={`input glassmorphism ${fieldValid.destCity === false ? 'input-error' : ''}`}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: formData.destCity ? 'scale(1.02)' : 'scale(1)'
                        }}
                      />
                      {fieldValid.destCity === true && <CheckCircle className="check-icon" />}
                    </div>
                    <div className="form-control">
                      <input
                        type="text"
                        name="destZipCode"
                        placeholder={I18N_TEXT[userLang].destinationZipCode}
                        value={formData.destZipCode}
                        onChange={handleInputChange}
                        className={`input glassmorphism ${fieldValid.destZipCode === false ? 'input-error' : ''}`}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: formData.destZipCode ? 'scale(1.02)' : 'scale(1)'
                        }}
                      />
                      {fieldValid.destZipCode === true && <CheckCircle className="check-icon" />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormStep>

        <FormStep isVisible={currentStep === 2} stepNumber={2} title={I18N_TEXT[userLang].step2Title} emoji="🚢">
          {/* Step 2 Container with Progressive Disclosure */}
          <div className="step-2-container">
            
            {/* Phase 1: Understanding Shipping Options */}
            <div className="shipping-options-guidance-phase">
              <div className="phase-header">
                 <h3 className="phase-header-title">
                   {I18N_TEXT[userLang].chooseShippingMethod}
                 </h3>
                 <p className="phase-header-subtitle">
                   {I18N_TEXT[userLang].shippingMethodDescription} 
                   {RAIL_FREIGHT_COUNTRIES.includes(formData.country) && (
                     <span className="success-text">
                       {' '}{I18N_TEXT[userLang].railAvailableForDestination}
                     </span>
                   )}
                </p>
              </div>
            </div>

                        {/* Phase 2: Mode Selection */}
            <div className="mode-selection-phase">
              
              {/* Traditional shipping options first */}
              <div className={`shipping-modes stagger-children ${RAIL_FREIGHT_COUNTRIES.includes(formData.country) ? 'four-options' : 'three-options'}`}>
                <div 
                  className={`mode-option ${formData.mode === 'Sea' ? 'selected' : ''}`}
                  onClick={() => handleModeSelect('Sea')}
                  data-mode="Sea"
                >
                  <Ship size={24} />
                  <span>{I18N_TEXT[userLang].seaFreight}</span>
                  <p className="mode-desc">{I18N_TEXT[userLang].seaFreightDesc}</p>
                  <div className="mode-additional-info">
                    {I18N_TEXT[userLang].seaFreightBenefits}
                  </div>
                </div>
                
                {/* Rail Freight option appears only if selected destination country supports it */}
                {RAIL_FREIGHT_COUNTRIES.includes(formData.country) && (
                  <div 
                    className={`mode-option ${formData.mode === 'Rail' ? 'selected' : ''}`}
                    onClick={() => handleModeSelect('Rail')}
                    data-mode="Rail"
                  >
                    <TrainFront size={24} />
                    <span>{I18N_TEXT[userLang].railFreight}</span>
                    <p className="mode-desc">{I18N_TEXT[userLang].railFreightDesc}</p>
                    <div className="mode-additional-info">
                      {I18N_TEXT[userLang].railFreightBenefits}
                    </div>
                  </div>
                )}
                
                <div 
                  className={`mode-option ${formData.mode === 'Air' ? 'selected' : ''}`}
                  onClick={() => handleModeSelect('Air')}
                  data-mode="Air"
                >
                  <Plane size={24} />
                  <span>{I18N_TEXT[userLang].airFreight}</span>
                  <p className="mode-desc">{I18N_TEXT[userLang].airFreightDesc}</p>
                  <div className="mode-additional-info">
                    {I18N_TEXT[userLang].airFreightBenefits}
                  </div>
                </div>
                
                <div 
                  className={`mode-option ${formData.mode === 'Express' ? 'selected' : ''}`}
                  onClick={() => handleModeSelect('Express')}
                  data-mode="Express"
                >
                  <Truck size={24} />
                  <span>{I18N_TEXT[userLang].express}</span>
                  <p className="mode-desc">{I18N_TEXT[userLang].expressDesc}</p>
                  <div className="mode-additional-info">
                    {I18N_TEXT[userLang].expressBenefits}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="options-separator-bottom">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  margin: '1.5rem 0 1rem 0',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }}></div>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#9ca3af', 
                    fontWeight: '400',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb'
                  }}>
                                         {(I18N_TEXT[userLang] as any).unsureAboutChoice || 'Unsure about your choice?'}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }}></div>
                </div>
              </div>

              {/* Beginner-friendly option at the bottom */}
              <div className="beginner-option-section-bottom">
                <div 
                  className={`mode-option ${formData.mode === 'Unsure' ? 'selected' : ''}`}
                  onClick={() => handleModeSelect('Unsure')}
                  data-mode="Unsure"
                  style={{
                    transition: 'all 0.3s ease',
                    transform: formData.mode === 'Unsure' ? 'scale(1.05)' : 'scale(1)',
                    background: formData.mode === 'Unsure' 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0.95))' 
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(255, 255, 255, 0.9))',
                    borderColor: formData.mode === 'Unsure' ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                    opacity: formData.mode === 'Unsure' ? 1 : 0.85
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                                      <span>{(I18N_TEXT[userLang] as any).unsureShipping || "I'm not sure yet"}</span>
                    <p className="mode-desc">{(I18N_TEXT[userLang] as any).unsureShippingDesc || 'Let the experts help'}</p>
                  <div className="mode-additional-info" style={{
                    fontSize: '0.75rem',
                    color: '#3b82f6',
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                                          {(I18N_TEXT[userLang] as any).unsureShippingBenefits || 'Professional guidance'}
                  </div>
                </div>
              </div>

              {/* Contextual guidance based on selection */}
              {formData.mode && (
                <div 
                  className="selection-feedback" 
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '12px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    visibility: 'visible'
                  }}>
                    <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#047857', 
                      fontWeight: '600',
                      lineHeight: '1.4',
                      display: 'block'
                    }}>
                      {formData.mode === 'Sea' && I18N_TEXT[userLang].seaFeedback}
                      {formData.mode === 'Rail' && I18N_TEXT[userLang].railFeedback}
                      {formData.mode === 'Air' && I18N_TEXT[userLang].airFeedback}
                      {formData.mode === 'Express' && I18N_TEXT[userLang].expressFeedback}
                      {formData.mode === 'Unsure' && ((I18N_TEXT[userLang] as any).unsureShippingFeedback || "Great choice! We'll recommend the best shipping option for your specific needs")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormStep>

        <FormStep isVisible={currentStep === 3} stepNumber={3} title={I18N_TEXT[userLang].step3Title} emoji="🇨🇳">
          {/* Step 3 Container with Progressive Disclosure */}
          <div className="step-3-container">
            
            {/* Phase 1: Location Type Selection */}
            <div className="location-type-selection-phase">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    backgroundColor: selectedLocationType ? '#10b981' : '#6b7280',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease'
                  }}>1</span>
                  {I18N_TEXT[userLang].selectPickupLocationType}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 1.5rem 0' 
                }}>
                  {I18N_TEXT[userLang].pickupLocationDescription}
                </p>
              </div>

              <div className="location-types">
                {getLocationTypes().map(type => (
                  <div
                    key={type.id}
                    className={`location-type-option ${selectedLocationType === type.id ? 'selected' : ''}`}
                    onClick={() => handleLocationTypeSelect(type.id)}
                    data-id={type.id}
                    style={{
                      transition: 'all 0.3s ease',
                      transform: selectedLocationType === type.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <type.icon size={24} />
                    <span>{getLocationTypeName(type.id, userLang, formData.mode)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2: Location Details (revealed after location type selection) */}
            {selectedLocationType && (
              <div 
                className="location-details-phase"
                style={{
                  marginTop: '2rem',
                  opacity: selectedLocationType ? 1 : 0,
                  transform: selectedLocationType ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.4s ease',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '2rem'
                }}
              >
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: (selectedLocationType === 'port' ? !!formData.origin : !!(formData.city && formData.zipCode)) ? '#10b981' : '#6b7280',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>2</span>
                    {selectedLocationType === 'port' ? getDynamicSelectText(userLang, formData.mode) : I18N_TEXT[userLang].enterPickupDetails}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}                  >
                    {selectedLocationType === 'port' ? getLocationDescription(userLang) : I18N_TEXT[userLang].pickupCityPostalDescription}
                  </p>
                </div>

                <div className="location-details">
                  {selectedLocationType === 'port' ? (
                    <div className="form-control port-select">
                      <div className="search-input-wrapper" style={{ position: 'relative' }}>
                        <MapPin className="search-icon" size={18} />
                        <input
                          ref={portSearchInputRef}
                          type="text"
                          placeholder={getDynamicSearchText(userLang, formData.mode)}
                          value={portSearch}
                          onChange={(e) => {
                            setPortSearch(e.target.value);
                            setIsPortListVisible(true);
                          }}
                          onFocus={() => setIsPortListVisible(true)}
                          className="input glassmorphism search-input"
                          style={{
                            transition: 'all 0.3s ease',
                            transform: formData.origin ? 'scale(1.02)' : 'scale(1)'
                          }}
                        />
                        {formData.origin && (
                          <XCircle
                            size={18}
                            className="clear-search-icon"
                            style={{ cursor: 'pointer', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                            onClick={clearPortSelection}
                            aria-label={I18N_TEXT[userLang].clearPort}
                          />
                        )}
                      </div>
                      <div 
                        ref={portListRef}
                        className={`port-list ${isPortListVisible ? 'show' : ''}`}
                      >
                        {getFilteredPorts().length > 0 ? (
                          getFilteredPorts().map(port => (
                            <div
                              key={port.code}
                              className={`port-option ${formData.origin === port.code ? 'selected' : ''}`}
                              onClick={() => handlePortSelect(port.code)}
                            >
                              <span className="port-icon">{port.flag}</span>
                              <div className="port-info">
                                <span className="port-name">{getTranslatedPortName(port, userLang)}</span>
                                <span className="port-region">{getTranslatedRegionName(port.region, userLang)}</span>
                                {port.volume && <span className="port-volume">{I18N_TEXT[userLang].annualVolume}: {port.volume}</span>}
                              </div>
                              {port.code !== 'DONT_KNOW' && <span className="port-code">{port.code}</span>}
                            </div>
                          ))
                        ) : (
                          <div className="no-results">
                            No {formData.mode === 'Sea' ? 'ports' : formData.mode === 'Rail' ? 'rail terminals' : 'airports'} found. Try a different search.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="address-form">
                      <div className="address-details" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                      }}>
                        <div className="form-control">
                          <input
                            type="text"
                            name="city"
                            placeholder={I18N_TEXT[userLang].pickupCity}
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`input glassmorphism ${fieldValid.city === false ? 'input-error' : ''}`}
                            style={{
                              transition: 'all 0.3s ease',
                              transform: formData.city ? 'scale(1.02)' : 'scale(1)'
                            }}
                          />
                          {fieldValid.city === true && <CheckCircle className="check-icon" />}
                        </div>
                        <div className="form-control">
                          <input
                            type="text"
                            name="zipCode"
                            placeholder={I18N_TEXT[userLang].pickupZipCode}
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`input glassmorphism ${fieldValid.zipCode === false ? 'input-error' : ''}`}
                            style={{
                              transition: 'all 0.3s ease',
                              transform: formData.zipCode ? 'scale(1.02)' : 'scale(1)'
                            }}
                          />
                          {fieldValid.zipCode === true && <CheckCircle className="check-icon" />}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feedback section for user guidance */}
                {((selectedLocationType === 'port' && formData.origin) || 
                  (selectedLocationType !== 'port' && formData.city && formData.zipCode)) && (
                  <div 
                    className="selection-feedback" 
                    style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderRadius: '12px',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                      display: 'block',
                      visibility: 'visible',
                      opacity: '1'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      visibility: 'visible'
                    }}>
                      <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: '#047857', 
                        fontWeight: '600',
                        lineHeight: '1.4',
                        display: 'block'
                      }}>
                                                  {selectedLocationType === 'port' 
                            ? formData.origin === 'DONT_KNOW' 
                              ? I18N_TEXT[userLang].dontKnowPortFeedback
                              : `${I18N_TEXT[userLang].perfectPortFeedback} ${(() => {
                                  const selectedPort = [...SEA_PORTS, ...AIRPORTS, ...RAIL_TERMINALS].find(p => p.code === formData.origin);
                                  return selectedPort ? getTranslatedPortName(selectedPort, userLang) : 'the selected location';
                                })()} `
                            : I18N_TEXT[userLang].cityPickupFeedback.replace('{city}', formData.city || '')
                          }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </FormStep>

        <FormStep isVisible={currentStep === 4} stepNumber={4} title={I18N_TEXT[userLang].step4Title} emoji="📦">
          {/* Step 4 Container with Progressive Disclosure */}
          <div className="step-4-container">
            
            {/* Shipment Management Overview - Always visible */}
            <div className="shipment-overview-section">
              <div className="shipment-overview-header">
                <div className="shipment-overview-content">
                  <div className="shipment-overview-main">
                    <div className="shipment-overview-icon">
                      <Package size={20} />
                    </div>
                    <div className="shipment-overview-text">
                      <h4>{(() => {
                        const count = formData.loads.length;
                        let text = I18N_TEXT[userLang].managingShipments.replace('{count}', count.toString());
                        
                        // Handle pluralization by language
                        if (userLang === 'en' || userLang === 'fr') {
                          text = text.replace('{plural}', count > 1 ? 's' : '');
                        } else if (userLang === 'de') {
                          text = text.replace('Sendung{plural}', count > 1 ? 'Sendungen' : 'Sendung');
                        } else if (userLang === 'es') {
                          text = text.replace('Envío{plural}', count > 1 ? 'Envíos' : 'Envío');
                        } else if (userLang === 'it') {
                          text = text.replace('Spedizione{plural}', count > 1 ? 'Spedizioni' : 'Spedizione');
                        } else if (userLang === 'nl') {
                          text = text.replace('Zending{plural}', count > 1 ? 'Zendingen' : 'Zending');
                        } else if (userLang === 'pt') {
                          text = text.replace('Remessa{plural}', count > 1 ? 'Remessas' : 'Remessa');
                        } else if (userLang === 'tr') {
                          text = text.replace('Gönderi{plural}', count > 1 ? 'Gönderiler' : 'Gönderi');
                        } else if (userLang === 'ru') {
                          text = text.replace('Отправлением{plural}', 
                            count === 1 ? 'Отправлением' : 
                            count >= 2 && count <= 4 ? 'Отправлениями' : 'Отправлениями');
                        } else {
                          // For languages without pluralization (zh, ar), remove {plural}
                          text = text.replace('{plural}', '');
                        }
                        
                        return text;
                      })()}</h4>
                      <p>{I18N_TEXT[userLang].configureShipments}</p>
                    </div>
                  </div>
                  <div className="shipment-overview-actions">
                    {formData.loads.length === 1 && (
                      <button
                        onClick={handleAddLoad}
                        className={`shipment-preview-btn ${addShipmentLoading ? 'loading' : ''}`}
                        title={I18N_TEXT[userLang].addNewShipment}
                        disabled={addShipmentLoading}
                      >
                        {addShipmentLoading ? (
                          <>
                            <div className="loading-spinner" />
                            <span>{I18N_TEXT[userLang].validating}</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>{I18N_TEXT[userLang].addShipment}</span>
                          </>
                        )}
                      </button>
                    )}
                    {formData.loads.length > 1 && (
                      <div className="shipment-counter">
                        <BarChart3 size={16} />
                        <span>{formData.loads.length} {I18N_TEXT[userLang].active}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Load Management Interface - Show for multiple loads */}
            {formData.loads.length > 1 && (
              <div className="enhanced-load-tabs-container">
                <div className="load-tabs-header">
                  <div className="load-tabs-title">
                    <Package size={18} />
                    {I18N_TEXT[userLang].shipmentsCount.replace('{count}', formData.loads.length.toString())}
                  </div>
                  <div className="load-quick-actions">
                    <button
                      onClick={handleAddLoad}
                      className={`load-quick-add-btn ${addShipmentLoading ? 'loading' : ''}`}
                      title={I18N_TEXT[userLang].addNewShipment}
                      disabled={addShipmentLoading}
                    >
                      {addShipmentLoading ? (
                        <div className="loading-spinner-small" />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="load-tabs-navigation">
                  {formData.loads.map((load, index) => {
                    const summary = getEnhancedLoadSummary(load, index);
                    const isActive = index === activeLoadIndex;
                    
                    return (
                      <div
                        key={`enhanced-load-tab-${index}`}
                        className={`enhanced-load-tab ${isActive ? 'active' : ''}`}
                        onClick={() => handleSetActiveLoad(index)}
                      >
                        <div className="load-tab-icon">
                          <span>{getLoadIcon(load)}</span>
                        </div>
                        <div className="load-tab-content">
                          <div className="load-tab-title">{summary.title}</div>
                          <div className="load-tab-summary">{summary.details}</div>
                        </div>
                        <div className="load-tab-actions">
                          <button
                            className="load-tab-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateLoad(index);
                            }}
                            title={I18N_TEXT[userLang].duplicateShipment}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            className="load-tab-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLoad(index);
                            }}
                            title={I18N_TEXT[userLang].removeShipment}
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Consolidated Summary */}
                {(() => {
                  const totals = getConsolidatedTotals();
                  return (
                    <div className="load-total-summary">
                      <div className="load-total-summary-header">
                        <BarChart3 size={18} />
                        <span className="load-total-summary-title">{I18N_TEXT[userLang].consolidatedSummary}</span>
                      </div>
                      <div className="load-total-summary-content">
                        <div className="load-total-summary-item">
                          <div className="load-total-summary-label">{I18N_TEXT[userLang].totalVolume}</div>
                          <div className="load-total-summary-value">{totals.totalVolumeCBM} CBM</div>
                        </div>
                        <div className="load-total-summary-item">
                          <div className="load-total-summary-label">{I18N_TEXT[userLang].totalWeight}</div>
                          <div className="load-total-summary-value">{totals.totalWeightKG} KG</div>
                        </div>
                        <div className="load-total-summary-item">
                          <div className="load-total-summary-label">{I18N_TEXT[userLang].totalShipments}</div>
                          <div className="load-total-summary-value">{formData.loads.length}</div>
                        </div>
                        {totals.totalContainers > 0 && (
                          <div className="load-total-summary-item">
                            <div className="load-total-summary-label">{I18N_TEXT[userLang].totalContainers}</div>
                            <div className="load-total-summary-value">{totals.totalContainers}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {/* Phase 1: Understanding Cargo Types */}
            <div className="cargo-type-guidance-phase">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    backgroundColor: shippingType ? '#10b981' : '#6b7280',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease'
                  }}>1</span>
                  {I18N_TEXT[userLang].chooseShippingType}
                  {formData.loads.length > 1 && (
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      ({I18N_TEXT[userLang].shipmentXofY.replace('{current}', (activeLoadIndex + 1).toString()).replace('{total}', formData.loads.length.toString())})
                    </span>
                  )}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 1.5rem 0' 
                }}>
                  {I18N_TEXT[userLang].selectPackagingMethod}
                  {formData.loads.length > 1 && ` ${I18N_TEXT[userLang].forThisSpecificShipment}`}
                </p>
              </div>

              {/* Shipping Type Selection */}
              <div className="step4-choice-option-group-extended shipping-type-selector mx-auto my-6">
                <div 
                  className={`step4-choice-option ${shippingType === 'loose' ? 'selected' : ''}`}
                  onClick={() => updateCurrentLoad('shippingType', 'loose')}
                  data-choice-theme="loose-cargo"
                >
                  <PackageOpen size={32} />
                  <span>{I18N_TEXT[userLang].looseCargo}</span>
                  <div className="location-desc">{I18N_TEXT[userLang].looseCargoDesc}</div>
                </div>
                <div 
                  className={`step4-choice-option ${shippingType === 'container' ? 'selected' : ''}`}
                  onClick={() => updateCurrentLoad('shippingType', 'container')}
                  data-choice-theme="container"
                >
                  <Container size={32} />
                  <span>{I18N_TEXT[userLang].fullContainer}</span>
                  <div className="location-desc">{I18N_TEXT[userLang].fullContainerDesc}</div>
                </div>
                <div 
                  className={`step4-choice-option ${shippingType === 'unsure' ? 'selected' : ''}`}
                  onClick={() => updateCurrentLoad('shippingType', 'unsure')}
                  data-choice-theme="unsure"
                >
                  <Package size={32} />
                  <span>{I18N_TEXT[userLang].imNotSure}</span>
                  <div className="location-desc">{I18N_TEXT[userLang].teamWillHelp}</div>
                </div>
              </div>

              {/* Feedback for selection */}
              {shippingType && (
                <div 
                  className="selection-feedback" 
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: shippingType === 'loose' ? 'rgba(16, 185, 129, 0.15)' : 
                              shippingType === 'container' ? 'rgba(139, 92, 246, 0.15)' : 
                              'rgba(59, 130, 246, 0.15)',
                    borderRadius: '12px',
                    border: shippingType === 'loose' ? '2px solid rgba(16, 185, 129, 0.3)' : 
                           shippingType === 'container' ? '2px solid rgba(139, 92, 246, 0.3)' : 
                           '2px solid rgba(59, 130, 246, 0.3)',
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    visibility: 'visible'
                  }}>
                    <CheckCircle size={20} style={{ 
                      color: shippingType === 'loose' ? '#10b981' : 
                             shippingType === 'container' ? '#8b5cf6' : 
                             '#3b82f6', 
                      flexShrink: 0 
                    }} />
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: shippingType === 'loose' ? '#047857' : 
                             shippingType === 'container' ? '#581c87' : 
                             '#1e40af', 
                      fontWeight: '600',
                      lineHeight: '1.4',
                      display: 'block'
                    }}>
                      {shippingType === 'loose' 
                        ? I18N_TEXT[userLang].looseCargoFeedback
                        : shippingType === 'container'
                        ? I18N_TEXT[userLang].containerFeedback
                        : I18N_TEXT[userLang].unsureFeedback
                      }
                    </span>
                  </div>
                  {shippingType === 'unsure' && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        📞 <strong>{I18N_TEXT[userLang].whatHappensNext}</strong><br/>
                        • {I18N_TEXT[userLang].expertsContact}<br/>
                        • {I18N_TEXT[userLang].discussRequirements}<br/>
                        • {I18N_TEXT[userLang].personalizedRecommendations}<br/>
                        • {I18N_TEXT[userLang].noCommitmentRequired}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phase 2: Cargo Details (only show when shipping type is selected and not unsure) */}
            {shippingType && shippingType !== 'unsure' && (
              <div className="cargo-details-phase" style={{ marginTop: '2rem' }}>
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: '#6b7280', // Will be updated based on completion
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>2</span>
                    {shippingType === 'loose' ? I18N_TEXT[userLang].describeLooseCargo : I18N_TEXT[userLang].configureContainer}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {shippingType === 'loose' 
                      ? I18N_TEXT[userLang].provideDimensionsWeight
                      : I18N_TEXT[userLang].selectContainerType
                    }
                  </p>
                </div>



                {/* Container for all loads/shipments */}
                <div className="shipments-container space-y-4">
                  {formData.loads.map((_, index) => {
                    const isActive = index === activeLoadIndex;
                    const showFormForThisLoad = isActive;

                    return (
                      <div key={`shipment-panel-${index}`} className={`shipment-panel ${formData.loads.length === 1 ? '' : 'border rounded-lg overflow-hidden'} transition-all duration-300 ease-in-out ${isActive && formData.loads.length > 1 ? 'border-accent shadow-lg' : formData.loads.length > 1 ? 'border-gray-200' : ''}`}>
                        
                        {/* Show form content */}
                        {(formData.loads.length === 1 || showFormForThisLoad) && (
                          <div className={`cargo-details-form-section p-4 md:p-6 ${isActive && formData.loads.length > 1 ? 'active-cargo-details' : ''} ${formData.loads.length === 1 ? 'pt-0' : '' }`}>
                            
                            {/* Loose Cargo Details */}
                            {shippingType === 'loose' && (
                              <div className={`loose-cargo-section rounded-xl ${isActive && formData.loads.length > 1 ? '' : 'bg-white/20 shadow-lg' } p-4 md:p-6`}>
                                <div className="calculation-type-selector flex space-x-4 my-6">
                                  <label className={`radio-label ${calculationType === 'unit' ? 'selected' : ''}`}>
                                    <input 
                                      type="radio" 
                                      name={`calculationType-${index}`}
                                      value="unit" 
                                      checked={calculationType === 'unit'} 
                                      onChange={() => updateCurrentLoad('calculationType', 'unit')} 
                                    /> {I18N_TEXT[userLang].calculateByUnit}
                                  </label>
                                  <label className={`radio-label ${calculationType === 'total' ? 'selected' : ''}`}>
                                    <input 
                                      type="radio" 
                                      name={`calculationType-${index}`}
                                      value="total" 
                                      checked={calculationType === 'total'} 
                                      onChange={() => updateCurrentLoad('calculationType', 'total')} 
                                    /> {I18N_TEXT[userLang].calculateByTotal}
                                  </label>
                                </div>

                                {/* Unit-based calculation */}
                                {calculationType === 'unit' && (
                                  <div className="unit-details sub-section-card">
                                    {/* Info Banner */}
                                    <div className="info-banner">
                                      <Info size={20} />
                                      <span>{I18N_TEXT[userLang].unitInfoBanner}</span>
                                    </div>

                                                                         {/* Package Type and Number of Units - Horizontal Layout */}
                                     <div className="package-selection-row">
                                       <div className="package-type-section">
                                         <label className="label-text">{I18N_TEXT[userLang].packageType}</label>
                                         <div className="button-group-horizontal">
                                           <button 
                                             type="button"
                                             className={`btn-tab-compact ${packageType === 'pallets' ? 'active' : ''}`}
                                             onClick={() => updateCurrentLoad('packageType', 'pallets')}
                                           >
                                             {I18N_TEXT[userLang].pallets}
                                           </button>
                                           <button 
                                             type="button"
                                             className={`btn-tab-compact ${packageType === 'boxes' ? 'active' : ''}`}
                                             onClick={() => updateCurrentLoad('packageType', 'boxes')}
                                           >
                                             {I18N_TEXT[userLang].boxesCrates}
                                           </button>
                                         </div>
                                       </div>

                                       <div className="units-counter-section">
                                         <label className="label-text">{I18N_TEXT[userLang].numberOfUnits}</label>
                                         <div className="input-number-wrapper-compact">
                                           <button 
                                             type="button" 
                                             className="btn-number-control-compact" 
                                             onClick={() => updateCurrentLoad('numberOfUnits', Math.max(1, numberOfUnits - 1))}
                                           >
                                             <Minus size={14} />
                                           </button>
                                           <input 
                                             type="number" 
                                             value={numberOfUnits} 
                                             onChange={(e) => updateCurrentLoad('numberOfUnits', Math.max(1, parseInt(e.target.value) || 1))}
                                             className="input-number-compact" 
                                             min="1"
                                           />
                                           <button 
                                             type="button" 
                                             className="btn-number-control-compact" 
                                             onClick={() => updateCurrentLoad('numberOfUnits', numberOfUnits + 1)}
                                           >
                                             <Plus size={14} />
                                           </button>
                                         </div>
                                       </div>
                                     </div>

                                    {/* Pallet Type (only for pallets) */}
                                    {packageType === 'pallets' && (
                                      <div className="form-control">
                                        <label className="label-text">{I18N_TEXT[userLang].palletType}</label>
                                        <CustomDropdown
                                          value={palletType}
                                          onChange={(value) => updateCurrentLoad('palletType', value)}
                                          options={palletTypeOptions}
                                        />
                                      </div>
                                    )}

                                                                         {/* Dimensions and Weight - Compact Layout */}
                                     <div className="dimensions-weight-compact">
                                       <div className="dimensions-section-compact">
                                         <label className="label-text-compact">{I18N_TEXT[userLang].dimensionsPerUnit}</label>
                                         <div className="dimensions-input-row">
                                           <input 
                                             type="number" 
                                             placeholder="L" 
                                             value={dimensions.length} 
                                             onChange={(e) => updateCurrentLoad('dimensions', { ...dimensions, length: e.target.value })}
                                             className="dimension-input-compact" 
                                           />
                                           <span className="dimension-separator">×</span>
                                           <input 
                                             type="number" 
                                             placeholder="W" 
                                             value={dimensions.width} 
                                             onChange={(e) => updateCurrentLoad('dimensions', { ...dimensions, width: e.target.value })}
                                             className="dimension-input-compact" 
                                           />
                                           <span className="dimension-separator">×</span>
                                           <input 
                                             type="number" 
                                             placeholder="H" 
                                             value={dimensions.height} 
                                             onChange={(e) => updateCurrentLoad('dimensions', { ...dimensions, height: e.target.value })}
                                             className="dimension-input-compact" 
                                           />
                                           <CustomDropdown
                                             value={dimensionUnit}
                                             onChange={(value) => updateCurrentLoad('dimensionUnit', value)}
                                             options={dimensionUnitOptions}
                                             compact={true}
                                             unitSelector={true}
                                           />
                                         </div>
                                         {(!dimensions.length || !dimensions.width || !dimensions.height) && (
                                           <div className="validation-message">{I18N_TEXT[userLang].required}</div>
                                         )}
                                       </div>

                                       <div className="weight-section-compact">
                                         <label className="label-text-compact">{I18N_TEXT[userLang].weightPerUnit}</label>
                                         <div className="weight-input-row">
                                           <input 
                                             type="number" 
                                             placeholder="Weight" 
                                             value={weightPerUnit} 
                                             onChange={(e) => updateCurrentLoad('weightPerUnit', e.target.value)}
                                             className="weight-input-compact" 
                                           />
                                           <CustomDropdown
                                             value={weightUnit}
                                             onChange={(value) => updateCurrentLoad('weightUnit', value)}
                                             options={weightUnitOptions}
                                             compact={true}
                                             unitSelector={true}
                                           />
                                         </div>
                                         {!weightPerUnit && (
                                           <div className="validation-message">{I18N_TEXT[userLang].required}</div>
                                         )}
                                       </div>
                                     </div>
                                  </div>
                                )}

                                                                 {/* Total shipment calculation */}
                                 {calculationType === 'total' && (
                                   <div className="total-shipment-details">
                                     <div className="info-banner-total">
                                       <Info size={20} />
                                       <span>{I18N_TEXT[userLang].totalInfoBanner}</span>
                                     </div>

                                     <div className="total-description">
                                       {I18N_TEXT[userLang].totalDescription}
                                     </div>

                                                                            <div className="total-inputs-row">
                                         <div className="total-volume-section">
                                           <label className="label-text-compact">{I18N_TEXT[userLang].totalVolume}</label>
                                         <div className="total-input-group">
                                           <input 
                                             type="number" 
                                             placeholder="" 
                                             value={totalVolume} 
                                             onChange={(e) => updateCurrentLoad('totalVolume', e.target.value)}
                                             className="total-input-compact" 
                                           />
                                           <CustomDropdown
                                             value={totalVolumeUnit}
                                             onChange={(value) => updateCurrentLoad('totalVolumeUnit', value)}
                                             options={totalVolumeUnitOptions}
                                             compact={true}
                                             unitSelector={true}
                                           />
                                         </div>
                                         {!totalVolume && (
                                           <div className="validation-message">{I18N_TEXT[userLang].required}</div>
                                         )}
                                       </div>

                                       <div className="total-weight-section">
                                         <label className="label-text-compact">{I18N_TEXT[userLang].totalWeight}</label>
                                         <div className="total-input-group">
                                           <input 
                                             type="number" 
                                             placeholder="" 
                                             value={totalWeight} 
                                             onChange={(e) => updateCurrentLoad('totalWeight', e.target.value)}
                                             className="total-input-compact" 
                                           />
                                           <CustomDropdown
                                             value={totalWeightUnit}
                                             onChange={(value) => updateCurrentLoad('totalWeightUnit', value)}
                                             options={totalWeightUnitOptions}
                                             compact={true}
                                             unitSelector={true}
                                           />
                                         </div>
                                         {!totalWeight && (
                                           <div className="validation-message">{I18N_TEXT[userLang].required}</div>
                                         )}
                                       </div>
                                     </div>
                                   </div>
                                 )}
                              </div>
                            )}

                            {/* Container Details */}
                            {shippingType === 'container' && (
                              <div className={`container-details rounded-xl ${isActive && formData.loads.length > 1 ? '' : 'bg-white/20 shadow-lg' } p-4 md:p-6`}>
                                <div className="info-banner">
                                  <Info size={20} />
                                  <span>{I18N_TEXT[userLang].containerInfoBanner}</span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-x-6 mb-6">
                                  <div className="form-control items-center flex-grow mb-6 md:mb-0 md:flex-1">
                                    <label htmlFor={`containerType-${index}`} className="label-text mb-2">{I18N_TEXT[userLang].containerType}</label>
                                    <CustomDropdown
                                      value={containerType}
                                      onChange={(value) => updateCurrentLoad('containerType', value as LoadDetails['containerType'])}
                                      options={containerTypeOptions}
                                    />
                                  </div>

                                  <div className="form-control items-center">
                                    <label className="label-text mb-2">{I18N_TEXT[userLang].numberOfContainers}</label>
                                    <div className="input-number-wrapper">
                                      <button 
                                        type="button" 
                                        className="btn-number-control" 
                                        onClick={() => updateCurrentLoad('numberOfUnits', Math.max(1, numberOfUnits - 1))}
                                      >
                                        <Minus size={16} />
                                      </button>
                                      <input 
                                        type="number" 
                                        value={numberOfUnits} 
                                        onChange={(e) => updateCurrentLoad('numberOfUnits', Math.max(1, parseInt(e.target.value) || 1))}
                                        className="input glassmorphism" 
                                        min="1"
                                      />
                                      <button 
                                        type="button" 
                                        className="btn-number-control" 
                                        onClick={() => updateCurrentLoad('numberOfUnits', numberOfUnits + 1)}
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="form-control">
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={isOverweight}
                                      onChange={(e) => updateCurrentLoad('isOverweight', e.target.checked)}
                                    />
                                                                         <span>{I18N_TEXT[userLang].overweightContainer}</span>
                                  </label>
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </FormStep>

        <FormStep isVisible={currentStep === 5} stepNumber={5} title={I18N_TEXT[userLang].step5Title} emoji="📝">
          {/* Sub-step indicator */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '3rem',
            gap: '0.75rem',
            padding: '1.5rem 0'
          }}>
            {[1, 2, 3].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: step5SubStep >= step 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                  color: step5SubStep >= step ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  backdropFilter: 'blur(16px)',
                  border: step5SubStep >= step ? '2px solid rgba(16, 185, 129, 0.3)' : '2px solid rgba(107, 114, 128, 0.2)',
                  boxShadow: step5SubStep >= step 
                    ? '0 8px 32px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(16, 185, 129, 0.2)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: step5SubStep === step ? 'scale(1.1)' : 'scale(1)',
                  position: 'relative'
                }}>
                  {step5SubStep > step ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : step}
                  {step5SubStep === step && (
                    <div style={{
                      position: 'absolute',
                      inset: '-2px',
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #10b981, #3b82f6, #10b981)',
                      backgroundSize: '400% 400%',
                      animation: 'gradient 2s ease infinite',
                      zIndex: -1
                    }} />
                  )}
                </div>
                {index < 2 && (
                  <div style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    background: step5SubStep > step + 1 
                      ? 'linear-gradient(90deg, #10b981, #059669)' 
                      : 'linear-gradient(90deg, rgba(229, 231, 235, 0.8), rgba(229, 231, 235, 0.4))',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {step5SubStep === step + 1 && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                        animation: 'slide 1.5s ease-in-out infinite'
                      }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sub-step 1: Goods Value and Declaration */}
          {step5SubStep === 1 && (
            <div className="goods-value-phase animate-slide-in">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].goodsValueDeclaration}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 2rem 0',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].goodsValueDescription}
                </p>
              </div>

          <div className="form-control">
                <label htmlFor="goodsValue" className="label-text">{I18N_TEXT[userLang].commercialValue}</label>
                <div className="flex items-center gap-2">
              <input
                type="number"
                name="goodsValue"
                id="goodsValue"
                placeholder="1000"
                value={formData.goodsValue}
                onChange={handleInputChange}
                    className={`input glassmorphism ${fieldValid.goodsValue === false ? 'input-error' : ''} flex-grow`}
                    style={{ 
                      minWidth: '0',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      padding: '0.75rem 1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <div className="currency-select" style={{ minWidth: '120px', margin: 0, position: 'relative' }}>
                    <div className="search-input-wrapper" style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={currencySearch}
                        readOnly
                        onClick={() => setIsCurrencyListVisible(true)}
                        onFocus={() => setIsCurrencyListVisible(true)}
                        className="input glassmorphism search-input"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div 
                      ref={currencyListRef}
                      className={`port-list ${isCurrencyListVisible ? 'show' : ''}`}
                      style={{ zIndex: 1000 }}
                    >
                      {CURRENCY_OPTIONS.map(currency => (
                        <div
                          key={currency.code}
                          className={`port-option ${formData.goodsCurrency === currency.code ? 'selected' : ''}`}
                          onClick={() => handleCurrencySelect(currency.code)}
                        >
                          <span className="port-icon">{currency.flag}</span>
                          <div className="port-info">
                            <span className="port-name">{currency.code}</span>
                            <span className="port-region">{currency.name}</span>
            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {fieldValid.goodsValue === true && <CheckCircle className="check-icon" />}
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  💡 {I18N_TEXT[userLang].goodsValueHelp}
                </div>
          </div>

              {/* Goods Classification */}
          <div className="form-control">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPersonalOrHazardous"
                checked={formData.isPersonalOrHazardous}
                onChange={(e) => setFormData({ ...formData, isPersonalOrHazardous: e.target.checked })}
              />
                  <span>{I18N_TEXT[userLang].personalOrHazardous}</span>
            </label>
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  ⚠️ {I18N_TEXT[userLang].personalHazardousHelp}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 2: Shipment Timing */}
          {step5SubStep === 2 && (
            <div className="shipment-timing-phase animate-slide-in">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].shipmentReadiness}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 2rem 0',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].shipmentTimingDescription}
                </p>
          </div>
          
          <div className="form-control">
                <label htmlFor="areGoodsReady" className="label-text">{I18N_TEXT[userLang].goodsReadyQuestion}</label>
                <div className="timing-select" style={{ position: 'relative' }}>
                  <div className="search-input-wrapper" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={timingSearch || ((I18N_TEXT[userLang] as any).selectOption || 'Select an option...')}
                      readOnly
                      onClick={() => setIsTimingListVisible(true)}
                      onFocus={() => setIsTimingListVisible(true)}
                      className={`input glassmorphism search-input ${!formData.areGoodsReady ? 'input-pending' : ''}`}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div 
                    ref={timingListRef}
                    className={`port-list ${isTimingListVisible ? 'show' : ''}`}
                    style={{ zIndex: 1000 }}
                  >
                    {TIMING_OPTIONS.map(timing => (
                      <div
                        key={timing.code}
                        className={`port-option ${formData.areGoodsReady === timing.code ? 'selected' : ''}`}
                        onClick={() => handleTimingSelect(timing.code)}
                      >
                        <span className="port-icon">{timing.icon}</span>
                        <div className="port-info">
                          <span className="port-name">
                            {timing.code === 'yes' && cleanEmojiFromText(I18N_TEXT[userLang].readyNow)}
                            {timing.code === 'no_in_1_week' && cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Week)}
                            {timing.code === 'no_in_2_weeks' && cleanEmojiFromText(I18N_TEXT[userLang].readyIn2Weeks)}
                            {timing.code === 'no_in_1_month' && cleanEmojiFromText(I18N_TEXT[userLang].readyIn1Month)}
                            {timing.code === 'no_date_set' && cleanEmojiFromText(I18N_TEXT[userLang].dateNotSet)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.areGoodsReady && <CheckCircle className="check-icon" />}
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  ⏰ {I18N_TEXT[userLang].timingHelp}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 3: Additional Information */}
          {step5SubStep === 3 && (
            <div className="additional-info-phase animate-slide-in">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].additionalDetails}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 2rem 0',
                  textAlign: 'center'
                }}>
                  {I18N_TEXT[userLang].additionalDetailsDescription}
                </p>
              </div>

              {/* Goods Description */}
              <div className="form-control">
                <label htmlFor="goodsDescription" className="label-text">{I18N_TEXT[userLang].goodsDescription}</label>
                <input
                  type="text"
                  name="goodsDescription"
                  id="goodsDescription"
                  placeholder={I18N_TEXT[userLang].goodsDescriptionPlaceholder}
                  value={formData.goodsDescription || ''}
              onChange={handleInputChange}
              className="input glassmorphism"
                />
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  💡 {I18N_TEXT[userLang].goodsDescriptionHelp}
                </div>
              </div>

              {/* Special Requirements */}
              <div className="form-control">
                <label htmlFor="specialRequirements" className="label-text">{I18N_TEXT[userLang].specialRequirements}</label>
                <div className="requirements-select" style={{ position: 'relative' }}>
                  <div className="search-input-wrapper" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={requirementsSearch || I18N_TEXT[userLang].noSpecialRequirements}
                      readOnly
                      onClick={() => setIsRequirementsListVisible(true)}
                      onFocus={() => setIsRequirementsListVisible(true)}
                      className="input glassmorphism search-input"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div 
                    ref={requirementsListRef}
                    className={`port-list ${isRequirementsListVisible ? 'show' : ''}`}
                    style={{ zIndex: 1000 }}
                  >
                    {REQUIREMENTS_OPTIONS.map(requirement => (
                      <div
                        key={requirement.code}
                        className={`port-option ${formData.specialRequirements === requirement.code ? 'selected' : ''}`}
                        onClick={() => handleRequirementsSelect(requirement.code)}
                      >
                        <span className="port-icon">{requirement.icon}</span>
                        <div className="port-info">
                          <span className="port-name">
                            {requirement.code === '' && I18N_TEXT[userLang].noSpecialRequirements}
                            {requirement.code === 'fragile' && cleanEmojiFromText(I18N_TEXT[userLang].fragileGoods)}
                            {requirement.code === 'temperature' && cleanEmojiFromText(I18N_TEXT[userLang].temperatureControlled)}
                            {requirement.code === 'urgent' && cleanEmojiFromText(I18N_TEXT[userLang].urgentTimeSensitive)}
                            {requirement.code === 'insurance' && cleanEmojiFromText(I18N_TEXT[userLang].highValueInsurance)}
                            {requirement.code === 'other' && cleanEmojiFromText(I18N_TEXT[userLang].otherSpecify)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
          </div>

              {/* Important Information Banner */}
              <div className="info-banner" style={{ 
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <Info size={20} style={{ color: '#3b82f6', marginTop: '0.1rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                  <strong style={{ color: '#3b82f6' }}>{I18N_TEXT[userLang].rateValidityNotice}</strong>
                  <br />
                  {I18N_TEXT[userLang].rateValidityText}
            </div>
          </div>
            </div>
          )}
        </FormStep>

        <FormStep isVisible={currentStep === 6} stepNumber={6} title={(I18N_TEXT[userLang] as any).step6Title || 'Contact details'} emoji="📱">
          {/* Step 6 Container with Progressive Disclosure */}
          <div className="step-6-container">
            
            {/* Phase 0: Customer Type Selection */}
            <div className="customer-type-phase">
              <div className="phase-header">
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    backgroundColor: customerType ? '#10b981' : '#6b7280',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease'
                  }}>0</span>
                  {getText('customerTypeQuestion', userLang)}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280', 
                  margin: '0 0 1.5rem 0' 
                }}>
                  {getText('customerTypeDescription', userLang)}
                </p>
              </div>

              <div className="customer-type-selection" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div 
                  className={`customer-type-option ${customerType === 'individual' ? 'selected' : ''}`}
                  onClick={() => setCustomerType('individual')}
                  style={{
                    padding: '1.5rem',
                    border: customerType === 'individual' ? '2px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: customerType === 'individual' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem',
                    transform: customerType === 'individual' ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: customerType === 'individual' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>👤</div>
                  <h4 style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>
                    {getText('individualCustomer', userLang)}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                    {getText('individualDescription', userLang)}
                  </p>
                </div>

                <div 
                  className={`customer-type-option ${customerType === 'company' ? 'selected' : ''}`}
                  onClick={() => setCustomerType('company')}
                  style={{
                    padding: '1.5rem',
                    border: customerType === 'company' ? '2px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: customerType === 'company' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem',
                    transform: customerType === 'company' ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: customerType === 'company' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>🏢</div>
                  <h4 style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>
                    {getText('companyCustomer', userLang)}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                    {getText('companyDescription', userLang)}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 1: Personal Information - Only show after customer type selected */}
            {customerType && (
              <div className="personal-info-phase animate-slide-in">
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: (formData.firstName && formData.lastName) ? '#10b981' : '#6b7280',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>1</span>
                    {(I18N_TEXT[userLang] as any).personalInformation || 'Personal Information'}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {(I18N_TEXT[userLang] as any).personalInfoDescription || 'Tell us who you are'}
                  </p>
                </div>

              <div className="personal-details" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
          <div className="form-control">
                                      <label htmlFor="firstName" className="label-text">{getText('firstName', userLang)}</label>
            <input 
              type="text"
              name="firstName"
                    id="firstName"
                    placeholder={getText('firstNamePlaceholder', userLang)}
              value={formData.firstName}
              onChange={handleInputChange}
              className={`input glassmorphism ${fieldValid.firstName === false ? 'input-error' : ''}`}
                    style={{
                      transition: 'all 0.3s ease',
                      transform: formData.firstName ? 'scale(1.02)' : 'scale(1)'
                    }}
            />
            {fieldValid.firstName === true && <CheckCircle className="check-icon" />}
          </div>

          <div className="form-control">
                                      <label htmlFor="lastName" className="label-text">{getText('lastName', userLang)}</label>
            <input 
              type="text"
              name="lastName"
                      id="lastName"
                      placeholder={getText('lastNamePlaceholder', userLang)}
              value={formData.lastName}
              onChange={handleInputChange}
              className={`input glassmorphism ${fieldValid.lastName === false ? 'input-error' : ''}`}
                    style={{
                      transition: 'all 0.3s ease',
                      transform: formData.lastName ? 'scale(1.02)' : 'scale(1)'
                    }}
            />
            {fieldValid.lastName === true && <CheckCircle className="check-icon" />}
          </div>
              </div>
            </div>
            )}  {/* Fermeture de la condition customerType pour la phase 1 */}

            {/* Phase 2: Shipping Experience - Show for all customer types */}
            {(formData.firstName && formData.lastName) && (
              <div className="shipping-experience-phase animate-slide-in">
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: formData.shipperType ? '#10b981' : '#6b7280',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>2</span>
                    {getText('shippingExperience', userLang)}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {getText('selectExperience', userLang)}
                  </p>
                </div>

                <div className="experience-details" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
          <div className="form-control">
                    <label htmlFor="shipperType" className="label-text">{getText('shippingExperience', userLang)}</label>
                    <div className="timing-select" style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={experienceSearch || getText('selectExperience', userLang)}
                        onClick={() => setIsExperienceListVisible(true)}
                        onFocus={() => setIsExperienceListVisible(true)}
                        readOnly
                        className={`input glassmorphism timing-input ${fieldValid.shipperType === false ? 'input-error' : ''}`}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: formData.shipperType ? 'scale(1.02)' : 'scale(1)'
                        }}
                        placeholder={getText('selectExperience', userLang)}
                      />
                      <div 
                        ref={experienceListRef}
                        className={`port-list ${isExperienceListVisible ? 'show' : ''}`}
                        style={{ zIndex: 1000 }}
                      >
                        {EXPERIENCE_OPTIONS.map(experience => (
                          <div
                            key={experience.code}
                            className="port-option"
                            onClick={() => handleExperienceSelect(experience.code)}
                          >
                            <span className="port-icon">{experience.icon}</span>
                            <div className="port-info">
                              <span className="port-name">
                                {experience.code === 'first-time' && getText('firstTimeShipper', userLang)}
                                {experience.code === 'up-to-10x' && getText('upTo10Times', userLang)}
                                {experience.code === 'more-than-10x' && getText('moreThan10Times', userLang)}
                                {experience.code === 'regular' && getText('regularShipper', userLang)}
                              </span>
                              <span className="port-region">{experience.descriptions[userLang] || experience.descriptions.en}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {fieldValid.shipperType === true && <CheckCircle className="check-icon" />}
                  </div>
                </div>
              </div>
            )}

            {/* Phase 3: Business Information - Only show for companies */}
            {(formData.firstName && formData.lastName && formData.shipperType && customerType === 'company') && (
              <div className="business-info-phase animate-slide-in">
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: formData.companyName ? '#10b981' : '#6b7280',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>3</span>
                    {getText('businessInformation', userLang)}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {getText('businessInfoDescription', userLang)}
                  </p>
                </div>

                <div className="business-details" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div className="form-control">
                    <label htmlFor="companyName" className="label-text">{getText('companyName', userLang)}</label>
            <input 
              type="text"
              name="companyName"
                      id="companyName"
                      placeholder={getText('companyNamePlaceholder', userLang)}
              value={formData.companyName}
              onChange={handleInputChange}
              className={`input glassmorphism ${fieldValid.companyName === false ? 'input-error' : ''}`}
                      style={{
                        transition: 'all 0.3s ease',
                        transform: formData.companyName ? 'scale(1.02)' : 'scale(1)'
                      }}
            />
            {fieldValid.companyName === true && <CheckCircle className="check-icon" />}
          </div>


          </div>
              </div>
            )}

            {/* Phase 4: Contact Information */}
            {((customerType === 'individual' && formData.firstName && formData.lastName && formData.shipperType) || 
              (customerType === 'company' && formData.companyName)) && (
              <div className="contact-info-phase animate-slide-in">
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: (formData.email && formData.phone) ? '#10b981' : '#6b7280',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>4</span>
                    {getText('contactInformation', userLang)}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {getText('contactInfoDescription', userLang)}
                  </p>
                </div>

                <div className="contact-details" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
          <div className="form-control">
                    <label htmlFor="email" className="label-text">{getText('emailAddress', userLang)}</label>
            <input 
              type="email" 
              name="email" 
                      id="email"
                      placeholder={getText('emailPlaceholder', userLang)}
              value={formData.email} 
              onChange={handleInputChange}
              className={`input glassmorphism ${fieldValid.email === false ? 'input-error' : ''}`}
                      style={{
                        transition: 'all 0.3s ease',
                        transform: formData.email ? 'scale(1.02)' : 'scale(1)'
                      }}
            />
            {fieldValid.email === true && <CheckCircle className="check-icon" />}
                    <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      📧 {getText('emailHelp', userLang)}
                    </div>
          </div>
          
                  <div className="form-control">
                    <label htmlFor="phone" className="label-text">{getText('phoneNumber', userLang)}</label>
                    <div className="phone-input-wrapper" style={{
                      display: 'grid',
                      gridTemplateColumns: '105px 1fr',
                      gap: '0.5rem'
                    }}>
                      {/* Phone Country Code Selector */}
                      <div className="phone-prefix-select" style={{ position: 'relative' }}>
                        <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type="text"
                            value={phonePrefixSearch}
                                                    onClick={() => setIsPhonePrefixListVisible(true)}
                        onFocus={() => setIsPhonePrefixListVisible(true)}
                            onChange={(e) => setPhonePrefixSearch(e.target.value)}
                            placeholder="+1"
                            ref={phonePrefixSearchInputRef}
                            className="input glassmorphism search-input"
                            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                          />
              </div>
              <div 
                ref={phonePrefixListRef}
                          className={`port-list ${isPhonePrefixListVisible ? 'show' : ''}`}
                          style={{ zIndex: 1000 }}
                        >
                          {COUNTRIES
                            .filter(country => 
                              country.phonePrefix && (
                                country.name.toLowerCase().includes(phonePrefixSearch.toLowerCase()) ||
                                country.phonePrefix.includes(phonePrefixSearch.replace(/[^\d+]/g, ''))
                              )
                            )
                            .slice(0, 10)
                            .map(country => (
                              <div
                                key={country.code}
                                className="port-option"
                                onClick={() => handlePhonePrefixSelect(country.phonePrefix)}
                              >
                                <span className="port-icon">{country.flag}</span>
                                <div className="port-info">
                                  <span className="port-name">{country.phonePrefix}</span>
                                  <span className="port-region">{country.name}</span>
                    </div>
                  </div>
                            ))}
              </div>
            </div>

            <input 
              type="tel" 
              name="phone" 
                        id="phone"
                        placeholder={getText('phonePlaceholder', userLang)}
              value={formData.phone} 
              onChange={handleInputChange}
                        className={`input glassmorphism ${fieldValid.phone === false ? 'input-error' : ''}`}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: formData.phone ? 'scale(1.02)' : 'scale(1)'
                        }}
                      />
                    </div>
                    {fieldValid.phone === true && <CheckCircle className="check-icon" />}
                    <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      📱 {getText('phoneHelp', userLang)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 5: Additional Notes (Optional) */}
            {(formData.email && formData.phone) && (
              <div className="additional-notes-phase animate-slide-in">
                <div className="phase-header">
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: '#10b981',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'background-color 0.3s ease'
                    }}>✓</span>
                    {getText('additionalNotes', userLang)}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    margin: '0 0 1.5rem 0' 
                  }}>
                    {getText('additionalNotesDescription', userLang)}
                  </p>
          </div>
          
          <div className="form-control">
                  <label htmlFor="remarks" className="label-text">{getText('remarks', userLang)}</label>
            <textarea
              name="remarks"
                    id="remarks"
                    placeholder={getText('remarksPlaceholder', userLang)}
                    value={formData.remarks || ''}
              onChange={handleInputChange}
              className="input glassmorphism"
              rows={4}
                    style={{
                      minHeight: '120px',
                      resize: 'vertical',
                      transition: 'all 0.3s ease'
                    }}
            />
                  <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    💬 {getText('remarksHelp', userLang)}
                  </div>
          </div>

                {/* Summary Banner */}
                <div className="contact-summary-banner" style={{ 
                  marginTop: '2rem',
                  padding: '1.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    height: '40px'
                  }}>
                    <CheckCircle size={24} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: '#047857', 
                      margin: '0 0 0.5rem 0' 
                    }}>
                      {getText('readyToSubmit', userLang)}
                    </h4>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: '#065f46', 
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      {getText('submitDescription', userLang)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="security-badge glassmorphism" style={{ 
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <span style={{ fontWeight: '500' }}>{getText('securityBadge', userLang)}</span>
          </div>
        </FormStep>

        {/* Step 7: Confirmation Page */}
        <FormStep isVisible={currentStep === 7} stepNumber={7} title={getText('confirmationTitle', userLang)} emoji="✅" hideStepNumber={true}>
          <div className="confirmation-container" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '2rem',
            padding: '0',
            margin: '2rem 0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            
            {/* Animated Background Elements */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite',
              zIndex: 0
            }}></div>
            
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 4s ease-in-out infinite',
              zIndex: 0
            }}></div>
            
            {/* Main Content */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              
              {/* Hero Section */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                
                {/* Floating Particles */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '10%',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '50%',
                  animation: 'float 3s ease-in-out infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  right: '15%',
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  animation: 'float 4s ease-in-out infinite reverse'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  right: '30%',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  animation: 'float 5s ease-in-out infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: '20%',
                  width: '4px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  animation: 'sparkle 2s ease-in-out infinite'
                }}></div>

                {/* Success Icon with Animation */}
                <div style={{
                  fontSize: '6rem',
                  marginBottom: '1.5rem',
                  animation: 'bounceIn 1s ease-out',
                  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
                }}>
                  🎉
                </div>

                {/* Process Complete Badge */}
                <div style={{
                  display: 'inline-block',
                  padding: '1rem 2.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '2rem',
                  backdropFilter: 'blur(10px)',
                  animation: 'slideInDown 0.8s ease-out 0.3s both',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ✨ {userLang === 'fr' ? 'Processus Terminé avec Succès' : 
                       userLang === 'de' ? 'Vorgang Erfolgreich Abgeschlossen' :
                       userLang === 'es' ? 'Proceso Completado con Éxito' :
                       userLang === 'it' ? 'Processo Completato con Successo' :
                       userLang === 'nl' ? 'Proces Succesvol Voltooid' :
                       userLang === 'ar' ? 'تم إنجاز العملية بنجاح' :
                       userLang === 'pt' ? 'Processo Concluído com Sucesso' :
                       userLang === 'tr' ? 'Süreç Başarıyla Tamamlandı' :
                       userLang === 'ru' ? 'Процесс Успешно Завершён' :
                       userLang === 'zh' ? '流程成功完成' :
                       'Process Successfully Completed'}
                </div>

                <h1 style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800',
                  marginBottom: '1.5rem',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  animation: 'slideInUp 0.8s ease-out 0.1s both',
                  background: 'linear-gradient(45deg, #ffffff 0%, #f0fdf4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {getText('thankYouTitle', userLang)}
                </h1>
                
                <p style={{ 
                  fontSize: '1.3rem', 
                  opacity: '0.95',
                  marginBottom: '2.5rem',
                  maxWidth: '700px',
                  margin: '0 auto 2.5rem auto',
                  lineHeight: '1.7',
                  animation: 'slideInUp 0.8s ease-out 0.2s both',
                  fontWeight: '300'
                }}>
                  {getText('confirmationSubtitle', userLang)}
                </p>

                {/* Reference Number */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  padding: '1.5rem 3rem',
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'inline-block',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  animation: 'slideInUp 0.8s ease-out 0.4s both',
                  minWidth: '300px'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: '0.8', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {getText('referenceNumber', userLang)}
                  </div>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    {submissionId}
                  </div>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="request-summary" style={{
              marginBottom: '2rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
              borderRadius: '1.5rem',
              border: '2px solid rgba(16, 185, 129, 0.1)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              animation: 'slideInUp 0.8s ease-out 0.6s both'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '1.2rem'
                }}>
                  📋
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {getText('yourRequest', userLang)}
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      fontSize: '1rem'
                    }}>
                      🚢
                    </div>
                    <h4 style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                      {getText('shipmentDetails', userLang)}
                    </h4>
                  </div>
                  <div style={{ color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📍</span>
                      <strong>{formData.city || formData.origin}</strong> → <strong>{formData.destCity || formData.country}, {COUNTRIES.find(c => c.code === formData.country)?.name}</strong>
                    </p>
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🚛</span>
                      {getText('mode', userLang)}:&nbsp;<strong>{getText(formData.mode === 'Unsure' ? 'unsureShipping' : formData.mode === 'Sea Freight' ? 'seaFreight' : formData.mode === 'Air Freight' ? 'airFreight' : formData.mode === 'Rail Freight' ? 'railFreight' : formData.mode === 'Express' ? 'express' : 'mode', userLang)}</strong>
                    </p>
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📦</span>
                      <strong>{formData.loads.length}</strong>&nbsp;{formData.loads.length === 1 ? getText('shipment', userLang) : getText('shipments', userLang)}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(59, 130, 246, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      fontSize: '1rem'
                    }}>
                      👤
                    </div>
                    <h4 style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                      {getText('contactDetails', userLang)}
                    </h4>
                  </div>
                  <div style={{ color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>👨‍💼</span>
                      <strong>{formData.firstName} {formData.lastName}</strong>
                    </p>
                    {formData.companyName && (
                      <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🏢</span>
                        <strong>{formData.companyName}</strong>
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📧</span>
                      <strong>{formData.email}</strong>
                    </p>
                    {formData.phone && (
                      <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📱</span>
                        <strong>{formData.phoneCountryCode} {formData.phone}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Timeline */}
            <div className="next-steps" style={{
              marginBottom: '3rem',
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
              borderRadius: '1.5rem',
              border: '2px solid rgba(59, 130, 246, 0.15)',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)',
              animation: 'slideInUp 0.8s ease-out 0.8s both',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '1.5rem',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                }}>
                  ⏱️
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {getText('nextSteps', userLang)}
                </h3>
              </div>
              
              <div style={{ position: 'relative' }}>
                {/* Connecting line */}
                <div style={{
                  position: 'absolute',
                  left: '24px',
                  top: '40px',
                  bottom: '40px',
                  width: '3px',
                  background: 'linear-gradient(to bottom, #10b981 0%, #3b82f6 50%, #94a3b8 100%)',
                  borderRadius: '2px',
                  opacity: 0.3
                }}></div>
                
                <div style={{ display: 'grid', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    transform: 'translateX(0)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontSize: '1.2rem', 
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      border: '3px solid white'
                    }}>✓</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {getText('step1', userLang)}
                      </div>
                      <div style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '500' }}>
                        {getText('step1Time', userLang)}
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    transform: 'translateX(0)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontSize: '1.1rem', 
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                      border: '3px solid white',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}>2</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {getText('step2', userLang)}
                      </div>
                      <div style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: '500' }}>
                        {getText('step2Time', userLang)}
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    opacity: 0.8
                  }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontSize: '1.1rem', 
                      fontWeight: '700',
                      border: '3px solid white'
                    }}>3</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>
                        {getText('step3', userLang)}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                        {getText('step3Time', userLang)}
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    opacity: 0.8
                  }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontSize: '1.1rem', 
                      fontWeight: '700',
                      border: '3px solid white'
                    }}>4</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>
                        {getText('step4', userLang)}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                        {getText('step4Time', userLang)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SINO Shipping & FS International Section */}
            <div className="company-info" style={{
              marginBottom: '2rem',
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 95, 70, 0.05) 100%)',
              borderRadius: '2rem',
              border: '2px solid rgba(16, 185, 129, 0.15)',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.1)',
              animation: 'slideInUp 0.8s ease-out 1s both',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    fontSize: '2rem',
                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
                  }}>
                    🚢
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
                    {getText('aboutSino', userLang)}
                  </h3>
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '1.2rem', 
                  textAlign: 'center', 
                  marginBottom: '3rem',
                  maxWidth: '800px',
                  margin: '0 auto 3rem auto',
                  lineHeight: '1.7',
                  fontWeight: '300'
                }}>
                  {getText('aboutSubtitle', userLang)}
                </p>

              {/* Company Stories */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.75rem' }}>
                  <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.2rem' }}>🇫🇷 SINO Shipping (2018)</h4>
                  <p style={{ color: '#374151', lineHeight: '1.6' }}>
                    {getText('sinoDescription', userLang)}
                  </p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.75rem' }}>
                  <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.2rem' }}>🇭🇰 FS International (1989)</h4>
                  <p style={{ color: '#374151', lineHeight: '1.6' }}>
                    {getText('fsDescription', userLang)}
                  </p>
                </div>
              </div>

              {/* Expertise & Numbers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      🎯
                    </div>
                    <h4 style={{ 
                      color: '#1f2937', 
                      margin: 0,
                      fontSize: '1.3rem',
                      fontWeight: '700'
                    }}>
                      {getText('ourExpertise', userLang)}
                    </h4>
                  </div>
                  
                  <div style={{ 
                    display: 'grid',
                    gap: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        🚢
                      </div>
                      <span style={{ 
                        color: '#374151', 
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {getText('expertise1', userLang)}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        📦
                      </div>
                      <span style={{ 
                        color: '#374151', 
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {getText('expertise2', userLang)}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        🔍
                      </div>
                      <span style={{ 
                        color: '#374151', 
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {getText('expertise3', userLang)}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        📋
                      </div>
                      <span style={{ 
                        color: '#374151', 
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {getText('expertise4', userLang)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.1rem' }}>📊 {getText('impactInNumbers', userLang)}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem' }}>{getText('impactDescription', userLang)}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>55,000+</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('satisfiedCustomers', userLang)}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>4.8/5</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('customerSatisfaction', userLang)}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>400+</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('teamMembers', userLang)}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>140,000+</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('oceanVolume', userLang)}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>8</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('officesInChina', userLang)}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>519,000+</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{getText('cfsFacilities', userLang)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Network */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.75rem' }}>
                <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>🌍 {getText('globalNetwork', userLang)}</h4>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{getText('networkDescription', userLang)}</p>
                <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.6' }}>
                  <p><strong>🇨🇳 {getText('chinaOffices', userLang)}</strong></p>
                  <p><strong>🇭🇰 {getText('hkOffice', userLang)}</strong></p>
                </div>
              </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="contact-support" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>❓ {getText('needHelp', userLang)}</h4>
                <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                  <p>📱 {getText('whatsappLine', userLang)}: <strong>À DÉFINIR</strong></p>
                  <p>📧 {getText('contactEmail', userLang)}: <strong>info@sino-shipping.com</strong></p>
                  <p>⏰ {getText('available', userLang)}: {getText('businessHours', userLang)}</p>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>🔗 {getText('websites', userLang)}</h4>
                <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                  <p>🌐 <strong>sino-shipping.com</strong></p>
                  <p>🌐 <strong>fschina.com</strong></p>
                  <p>🇪🇸 <strong>es.sino-shipping.com</strong></p>
                </div>
                <h4 style={{ color: '#1f2937', marginTop: '1.5rem', marginBottom: '1rem' }}>⚡ {getText('actions', userLang)}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      console.log('Button clicked!'); // Debug log
                      
                      // Complete form reset with smooth animation
                      const resetMessage = userLang === 'fr' ? 'Nouveau formulaire prêt !' :
                                          userLang === 'es' ? '¡Nuevo formulario listo!' :
                                          userLang === 'de' ? 'Neues Formular bereit!' :
                                          userLang === 'it' ? 'Nuovo modulo pronto!' :
                                          userLang === 'nl' ? 'Nieuw formulier klaar!' :
                                          userLang === 'zh' ? '新表单已准备!' :
                                          userLang === 'ar' ? 'استمارة جديدة جاهزة!' :
                                          userLang === 'pt' ? 'Novo formulário pronto!' :
                                          userLang === 'tr' ? 'Yeni form hazır!' :
                                          userLang === 'ru' ? 'Новая форма готова!' :
                                          'New form ready!';

                      try {
                        // Reset main form data
                        setFormData({
                          country: '',
                          origin: '',
                          mode: '',
                          email: '',
                          phone: '',
                          phoneCountryCode: '+234',
                          locationType: '',
                          city: '',
                          zipCode: '',
                          destLocationType: '',
                          destCity: '',
                          destZipCode: '',
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
                        });

                        // Reset field validation states
                        setFieldValid({
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
                          firstName: null,
                          lastName: null,
                          companyName: null,
                          shipperType: null,
                          goodsValue: null,
                          destLocationType: null,
                        });

                        // Reset step and submission states
                        setCurrentStep(1);
                        setSubmissionId('');

                        // Show success toast
                        showToast(resetMessage);
                        
                        console.log('Form reset completed!'); // Debug log
                      } catch (error) {
                        console.error('Error resetting form:', error);
                        showToast('Error resetting form');
                      }
                    }}
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      position: 'relative',
                      zIndex: 1000,
                      pointerEvents: 'auto',
                      userSelect: 'none',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
                    }}
                  >
                    ➕ {getText('newRequest', userLang)}
                  </button>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>🙏 {getText('thankYouTitle', userLang)}</h3>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                {getText('thankYouMessage', userLang)}
              </p>
            </div>

          </div>
        </FormStep>

        {/* Navigation - Hidden on confirmation page */}
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
              {I18N_TEXT[userLang].previous}
            </button>
          )}
          
          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleAddLoad}
              className="btn btn-ghost glassmorphism"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <PackageCheck size={18} />
              {I18N_TEXT[userLang].addAnotherShipment}
            </button>
          )}
          
          {currentStep < 6 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="btn btn-primary glassmorphism"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              {I18N_TEXT[userLang].next}
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
      
      <div className="trust-badge glassmorphism">
        <span>💡 {I18N_TEXT[userLang].trustBadge}</span>
      </div>
      
      <Toast message={toastMessage} isVisible={!!toastMessage} />
    </div>
  );
};

export default QuoteForm;