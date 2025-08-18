export interface TestLead {
  country: string;
  origin: string;
  mode: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  locationType: string;
  city: string;
  zipCode: string;
  destLocationType: string;
  destCity: string;
  destZipCode: string;
  destPort?: string;
  firstName: string;
  lastName: string;
  companyName: string;
  shipperType: string;
  loads: Array<{
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
  }>; // Aligné sur formData.loads
  goodsValue: string;
  goodsCurrency: string;
  isPersonalOrHazardous: boolean;
  areGoodsReady: string;
  remarks: string;
}

// Tableau dans lequel nous ajouterons les leads réels au fur et à mesure de la discussion.
export const TEST_LEADS: TestLead[] = [];

TEST_LEADS.push({
  country: 'ZA', // South Africa
  origin: 'PVG', // Shanghai Pudong (approx. pour Wenzhou Air)
  mode: 'Air',
  email: 'millastoto@gmail.com',
  phone: '617586398',
  phoneCountryCode: '+27',
  locationType: 'port', // expédition via aéroport/port
  city: '',
  zipCode: '',
  destLocationType: 'residential',
  destCity: 'Paarl',
  destZipCode: '7626',
  firstName: 'Milla',
  lastName: 'Stoto',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'unit',
      packageType: 'boxes',
      numberOfUnits: 1,
      palletType: 'non_specified',
      dimensions: { length: '75', width: '35', height: '35' },
      dimensionUnit: 'CM',
      weightPerUnit: '10',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'I want to ship a 10 kg moving box (75x35x35 cm) containing sneakers and clothes',
});

TEST_LEADS.push({
  country: 'IE', // Ireland destination
  origin: 'CAN', // Guangzhou Baiyun Airport (proche de Dongguan)
  mode: 'Air',
  email: 'kjnetworks@outlook.com',
  phone: '871234567',
  phoneCountryCode: '+353',
  locationType: 'factory',
  city: 'Dongguan',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Askeaton',
  destZipCode: '',
  firstName: 'John',
  lastName: "O'Connor",
  companyName: 'KJ Networks',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'unit',
      packageType: 'boxes',
      numberOfUnits: 1,
      palletType: 'non_specified',
      dimensions: { length: '83', width: '67', height: '119' },
      dimensionUnit: 'CM',
      weightPerUnit: '210',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Crate size 830x670x1190 mm containing Pure Resistive Load Bank',
});

TEST_LEADS.push({
  country: 'AU', // Australia
  origin: 'GZH', // Guangzhou Sea Port (proche de Chaozhou)
  mode: 'Sea',
  email: 'pip@goldsmithcreative.com.au',
  phone: '410534054',
  phoneCountryCode: '+61',
  locationType: 'factory',
  city: 'Chaozhou',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Terry Hills',
  destZipCode: '2084',
  firstName: 'Pip',
  lastName: 'Goldsmith',
  companyName: 'The Palms Nursery',
  shipperType: 'up-to-10x',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '55',
      totalVolumeUnit: 'CBM',
      totalWeight: '16500',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'We currently use an existing shipping agent but are looking for cheaper prices',
});

TEST_LEADS.push({
  country: 'SG', // Singapore
  origin: 'DLN', // Dalian Sea Port
  mode: 'Sea',
  email: 'corporate@twangbs.com',
  phone: '84846538',
  phoneCountryCode: '+65',
  locationType: 'port',
  city: 'Dalian',
  zipCode: '',
  destLocationType: 'port',
  destCity: 'Singapore',
  destZipCode: '',
  firstName: 'Tina',
  lastName: 'Wang',
  companyName: 'Nictar Singapore Pte Ltd',
  shipperType: 'up-to-10x',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '3',
      totalVolumeUnit: 'CBM',
      totalWeight: '200',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Frozen Sea Cucumber, Dry sea cucumber. Please contact via email',
});

TEST_LEADS.push({
  country: 'MW', // Malawi
  origin: 'XMN', // Xiamen Sea Port (proche de Fuzhou)
  mode: 'Sea',
  email: 'gkarim.uk@gmail.com',
  phone: '7941580166',
  phoneCountryCode: '+44',
  locationType: 'factory',
  city: 'Fuzhou',
  zipCode: '',
  destLocationType: 'business',
  destCity: '',
  destZipCode: '',
  firstName: 'Gibraan',
  lastName: 'Karim',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'container',
      calculationType: 'unit',
      packageType: '',
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
      containerType: "40'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks:
    'We need a quote for 40 ft container collection to place of loading and to the port. Contact me on WhatsApp or WeChat',
});

TEST_LEADS.push({
  country: 'CA', // Canada
  origin: 'HGH', // Hangzhou Xiaoshan Airport (proche de Yiwu)
  mode: 'Air',
  email: 'zenithtrading.ca@gmail.com',
  phone: '',
  phoneCountryCode: '+1',
  locationType: 'factory',
  city: 'Yiwu',
  zipCode: '',
  destLocationType: 'business',
  destCity: '',
  destZipCode: '',
  firstName: 'Vashtie',
  lastName: 'K',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '30',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Shipping quote request for backpacks',
});

TEST_LEADS.push({
  country: 'CL', // Chile
  origin: 'GZH', // Guangzhou Sea Port
  mode: 'Sea',
  email: 'grgii.txm@gmail.com',
  phone: '964123088',
  phoneCountryCode: '+56',
  locationType: 'factory',
  city: 'Guangzhou',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Santiago',
  destZipCode: '',
  firstName: 'EMILIYA',
  lastName: 'KOVALKOVA',
  companyName: 'IMPORTACIONES E INVERSIONS EMPEKO SPA',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '750',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: '10 boxes + 1 box (E-Bikes + Batteries). EXW shipment; contact via WhatsApp/WeChat',
});

TEST_LEADS.push({
  country: 'CA', // Canada
  origin: 'CAN', // Guangzhou Baiyun Airport
  mode: 'Air',
  email: 'dzalialexan@yahoo.fr',
  phone: '13130661330',
  phoneCountryCode: '+86',
  locationType: 'factory',
  city: 'Guangzhou',
  zipCode: '',
  destLocationType: 'business',
  destCity: '',
  destZipCode: '',
  firstName: 'Alexan',
  lastName: 'Dzali',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '2',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks:
    'Questions: How long will it take? Where should we send the goods? Door to door? Customs payment in Canada? (Fake hair in bags)',
});

TEST_LEADS.push({
  country: 'AR', // Argentina
  origin: 'SHA', // Shanghai Port (approx. for Wuhu)
  mode: 'Sea',
  email: 'gemei_ar@163.com',
  phone: '',
  phoneCountryCode: '+86',
  locationType: 'factory',
  city: 'Wuhu',
  zipCode: '',
  destLocationType: 'business',
  destCity: '',
  destZipCode: '',
  firstName: 'Mariel',
  lastName: 'Gomez',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '3',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Planning to send clothes, shoes, electronics (~3 kg) to Argentina; may scale up later',
});

TEST_LEADS.push({
  country: 'IN', // India
  origin: 'SHA', // Shanghai Port
  mode: 'Sea',
  email: 'harshith0355@gmail.com',
  phone: '8971170765',
  phoneCountryCode: '+91',
  locationType: 'factory',
  city: 'Nanchang',
  zipCode: '330038',
  destLocationType: 'business',
  destCity: 'Bangalore',
  destZipCode: '560019',
  firstName: 'Harshith',
  lastName: 'SM',
  companyName: 'Mediculous',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '0.047',
      totalVolumeUnit: 'CBM',
      totalWeight: '15',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Need quote for stainless steel instruments; include lead time and route',
});

TEST_LEADS.push({
  country: 'AU', // Australia
  origin: 'XMN', // Xiamen Sea Port
  mode: 'Sea',
  email: 'dileemill@gmail.com',
  phone: '',
  phoneCountryCode: '+61',
  locationType: 'factory',
  city: 'Quanzhou',
  zipCode: '36200',
  destLocationType: 'business',
  destCity: 'Delacombe',
  destZipCode: '3356',
  firstName: 'Diane',
  lastName: 'Milledge',
  companyName: 'J & D Premium Products P/L',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '26',
      totalVolumeUnit: 'CBM',
      totalWeight: '1630',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '9000',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Polyester Mesh shipment, CFR terms',
});

TEST_LEADS.push({
  country: 'FR', // France
  origin: 'NGB', // Ningbo-Zhoushan Port (near Hangzhou)
  mode: 'Sea',
  email: 'mouha14@hotmail.fr',
  phone: '769930943',
  phoneCountryCode: '+33',
  locationType: 'factory',
  city: 'Hangzhou',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Marseille',
  destZipCode: '',
  firstName: 'Hassan',
  lastName: 'Ben',
  companyName: 'Boul.ange',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '1',
      totalVolumeUnit: 'CBM',
      totalWeight: '90',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Climatisation equipment, CIF terms; modes Sea/Air possible',
});

TEST_LEADS.push({
  country: 'IN', // India
  origin: 'NGB', // Ningbo-Zhoushan Port (Zhejiang)
  mode: 'Sea',
  email: 'ashifshamim0786@gmail.com',
  phone: '966537994482',
  phoneCountryCode: '+966',
  locationType: 'factory',
  city: '',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Bokaro',
  destZipCode: '829116',
  firstName: 'Ashif',
  lastName: 'Shamim',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '20',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Ceramic mugs (20 kg) from Zhejiang to India; seeking freight forwarder',
});

TEST_LEADS.push({
  country: 'CH', // Switzerland
  origin: 'NGB', // Ningbo-Zhoushan Port (near Yiwu)
  mode: 'Sea',
  email: 'pillwein@gmail.com',
  phone: '',
  phoneCountryCode: '+41',
  locationType: 'factory',
  city: 'Yiwu',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Cointrin',
  destZipCode: '1216',
  firstName: 'Emanuel',
  lastName: 'Pillwein',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '1',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Plastic items pickup at warehouse; modes railway/sea/air',
});

TEST_LEADS.push({
  country: 'SD', // Sudan
  origin: 'SZX', // Shenzhen Bao'an / Yantian
  mode: 'Air',
  email: 'kmabas@hotmail.com',
  phone: '547040533',
  phoneCountryCode: '+966',
  locationType: 'factory',
  city: 'Shenzhen',
  zipCode: '',
  destLocationType: 'port',
  destCity: 'Port Sudan',
  destZipCode: '',
  firstName: 'Kamaleldin',
  lastName: 'Ibnouf',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '0.05',
      totalVolumeUnit: 'CBM',
      totalWeight: '11',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Solar inverter; asking minimum kg/cbm requirements',
});

TEST_LEADS.push({
  country: 'SA', // Saudi Arabia
  origin: 'SHA', // Shanghai Port (transhipment for Chongqing)
  mode: 'Sea',
  email: 'akrmsa@outlook.com',
  phone: '596705010',
  phoneCountryCode: '+966',
  locationType: 'factory',
  city: 'Chongqing',
  zipCode: '',
  destLocationType: 'port',
  destCity: 'Dammam',
  destZipCode: '',
  firstName: 'Akram',
  lastName: 'Alahmadi',
  companyName: 'HOME',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '',
      totalVolumeUnit: 'CBM',
      totalWeight: '1300',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Shipping Corolla sedan 2024 from Chongqing to Jeddah/Dammam',
});

TEST_LEADS.push({
  country: 'GH', // Ghana
  origin: 'GZH', // Guangzhou Sea Port (Foshan region)
  mode: 'Sea',
  email: 'vicandybdbd@gmail.com',
  phone: '260756725',
  phoneCountryCode: '+233',
  locationType: 'factory',
  city: 'Foshan',
  zipCode: '',
  destLocationType: 'business',
  destCity: 'Bekwai',
  destZipCode: '',
  firstName: 'Davis',
  lastName: 'Boadi',
  companyName: '',
  shipperType: 'first-time',
  loads: [
    {
      shippingType: 'loose',
      calculationType: 'total',
      packageType: 'boxes',
      numberOfUnits: 0,
      palletType: 'non_specified',
      dimensions: { length: '', width: '', height: '' },
      dimensionUnit: 'CM',
      weightPerUnit: '',
      weightUnit: 'KG',
      totalVolume: '4.7',
      totalVolumeUnit: 'CBM',
      totalWeight: '1290',
      totalWeightUnit: 'KG',
      containerType: "20'",
      isOverweight: false,
    },
  ],
  goodsValue: '',
  goodsCurrency: 'USD',
  isPersonalOrHazardous: false,
  areGoodsReady: 'yes',
  remarks: 'Tricycle shipment DAT to Ghana',
});
