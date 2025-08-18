export type PortType = 'sea' | 'air' | 'rail';

export interface DestinationPort {
  code: string;
  name: string;
  type: PortType;
  flag: string;
  volume?: string;
  region?: string;
}

// Export shape placeholders to progressively migrate data without breaking imports
export const DESTINATION_PORTS_BY_COUNTRY: Record<string, DestinationPort[]> = {
  FR: [
    // Ports maritimes
    { code: 'FRMRS', name: 'Port de Marseille-Fos', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'FRLEH', name: 'Port du Havre', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'FRDKK', name: 'Port de Dunkerque', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'FRLRT', name: 'Port de La Rochelle', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    {
      code: 'FRNTS',
      name: 'Port de Nantes Saint-Nazaire',
      type: 'sea',
      flag: '🚢',
      volume: '0.2M TEU',
    },
    { code: 'FRBOD', name: 'Port de Bordeaux', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'FRCDG',
      name: 'Aéroport Charles de Gaulle',
      type: 'air',
      flag: '✈️',
      volume: '2.1M tons',
    },
    { code: 'FRORY', name: 'Aéroport Paris-Orly', type: 'air', flag: '✈️', volume: '0.2M tons' },
    {
      code: 'FRLYS',
      name: 'Aéroport Lyon Saint-Exupéry',
      type: 'air',
      flag: '✈️',
      volume: '0.15M tons',
    },
    {
      code: 'FRMRS_AIR',
      name: 'Aéroport Marseille Provence',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    {
      code: 'FRNTE',
      name: "Aéroport Nice Côte d'Azur",
      type: 'air',
      flag: '✈️',
      volume: '0.06M tons',
    },
    {
      code: 'FRTLS',
      name: 'Aéroport Toulouse-Blagnac',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    { code: 'FRPARIS_RAIL', name: 'Gares de Paris', type: 'rail', flag: '🚂', volume: '15M tons' },
    {
      code: 'FRLYON_RAIL',
      name: 'Gare de Lyon Part-Dieu',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'FRMARS_RAIL',
      name: 'Gare de Marseille Saint-Charles',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  DE: [
    // Ports maritimes
    { code: 'DEHAM', name: 'Port of Hamburg', type: 'sea', flag: '🚢', volume: '8.5M TEU' },
    { code: 'DEBRE', name: 'Port of Bremen', type: 'sea', flag: '🚢', volume: '4.6M TEU' },
    { code: 'DEWVN', name: 'Port of Wilhelmshaven', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'DELUB', name: 'Port of Lübeck', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'DEROS', name: 'Port of Rostock', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    { code: 'DEFRA', name: 'Frankfurt Airport', type: 'air', flag: '✈️', volume: '2.0M tons' },
    { code: 'DEMUC', name: 'Munich Airport', type: 'air', flag: '✈️', volume: '0.3M tons' },
    {
      code: 'DEBER',
      name: 'Berlin Brandenburg Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    { code: 'DEDUS', name: 'Düsseldorf Airport', type: 'air', flag: '✈️', volume: '0.18M tons' },
    { code: 'DEHAM_AIR', name: 'Hamburg Airport', type: 'air', flag: '✈️', volume: '0.12M tons' },
    { code: 'DECGN', name: 'Cologne Bonn Airport', type: 'air', flag: '✈️', volume: '0.8M tons' },
    { code: 'DESTR', name: 'Stuttgart Airport', type: 'air', flag: '✈️', volume: '0.06M tons' },
    { code: 'DENUR', name: 'Nuremberg Airport', type: 'air', flag: '✈️', volume: '0.03M tons' },
    // Gares
    {
      code: 'DEBER_RAIL',
      name: 'Berlin Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '12M tons',
    },
    {
      code: 'DEFRA_RAIL',
      name: 'Frankfurt Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '18M tons',
    },
    {
      code: 'DEHAM_RAIL',
      name: 'Hamburg Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '22M tons',
    },
    {
      code: 'DEMUC_RAIL',
      name: 'Munich Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '14M tons',
    },
    {
      code: 'DECGN_RAIL',
      name: 'Cologne Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '16M tons',
    },
  ],
  GB: [
    // Ports maritimes
    { code: 'GBFXT', name: 'Port of Felixstowe', type: 'sea', flag: '🚢', volume: '4.0M TEU' },
    { code: 'GBSOU', name: 'Port of Southampton', type: 'sea', flag: '🚢', volume: '1.9M TEU' },
    { code: 'GBLIV', name: 'Port of Liverpool', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'GBLOND', name: 'Port of London', type: 'sea', flag: '🚢', volume: '2.8M TEU' },
    { code: 'GBIMM', name: 'Port of Immingham', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'GBDOV', name: 'Port of Dover', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'GBLHR',
      name: 'London Heathrow Airport',
      type: 'air',
      flag: '✈️',
      volume: '1.8M tons',
    },
    { code: 'GBLGW', name: 'London Gatwick Airport', type: 'air', flag: '✈️', volume: '0.1M tons' },
    {
      code: 'GBSTN',
      name: 'London Stansted Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'GBLUTON',
      name: 'London Luton Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    { code: 'GBMAN', name: 'Manchester Airport', type: 'air', flag: '✈️', volume: '0.12M tons' },
    { code: 'GBEDI', name: 'Edinburgh Airport', type: 'air', flag: '✈️', volume: '0.04M tons' },
    { code: 'GBBHM', name: 'Birmingham Airport', type: 'air', flag: '✈️', volume: '0.03M tons' },
    // Gares
    {
      code: 'GBLOND_RAIL',
      name: 'London St Pancras International',
      type: 'rail',
      flag: '🚂',
      volume: '25M tons',
    },
    {
      code: 'GBMAN_RAIL',
      name: 'Manchester Piccadilly Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'GBBHM_RAIL',
      name: 'Birmingham New Street Station',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
  ],
  US: [
    // Ports maritimes
    { code: 'USLAX', name: 'Port of Los Angeles', type: 'sea', flag: '🚢', volume: '10.7M TEU' },
    { code: 'USLGB', name: 'Port of Long Beach', type: 'sea', flag: '🚢', volume: '8.1M TEU' },
    {
      code: 'USNYC',
      name: 'Port of New York/New Jersey',
      type: 'sea',
      flag: '🚢',
      volume: '7.8M TEU',
    },
    { code: 'USSAV', name: 'Port of Savannah', type: 'sea', flag: '🚢', volume: '4.6M TEU' },
    { code: 'USSEA', name: 'Port of Seattle', type: 'sea', flag: '🚢', volume: '3.8M TEU' },
    { code: 'USTAC', name: 'Port of Tacoma', type: 'sea', flag: '🚢', volume: '3.4M TEU' },
    { code: 'USHOU', name: 'Port of Houston', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'USMIA', name: 'Port of Miami', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    // Aéroports
    {
      code: 'USLAX_AIR',
      name: 'Los Angeles International Airport (LAX)',
      type: 'air',
      flag: '✈️',
      volume: '2.2M tons',
    },
    {
      code: 'USJFK',
      name: 'John F. Kennedy International Airport (JFK)',
      type: 'air',
      flag: '✈️',
      volume: '1.3M tons',
    },
    {
      code: 'USMEM',
      name: 'Memphis International Airport',
      type: 'air',
      flag: '✈️',
      volume: '4.3M tons',
    },
    {
      code: 'USANC',
      name: 'Anchorage Ted Stevens Airport',
      type: 'air',
      flag: '✈️',
      volume: '3.2M tons',
    },
    {
      code: 'USORD',
      name: "O'Hare International Airport (ORD)",
      type: 'air',
      flag: '✈️',
      volume: '1.8M tons',
    },
    {
      code: 'USMIA_AIR',
      name: 'Miami International Airport',
      type: 'air',
      flag: '✈️',
      volume: '2.3M tons',
    },
    {
      code: 'USDFW',
      name: 'Dallas/Fort Worth International Airport (DFW)',
      type: 'air',
      flag: '✈️',
      volume: '0.8M tons',
    },
    {
      code: 'USATL',
      name: 'Hartsfield-Jackson Atlanta International Airport (ATL)',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
    // Gares
    {
      code: 'USNYC_RAIL',
      name: 'New York Penn Station',
      type: 'rail',
      flag: '🚂',
      volume: '45M tons',
    },
    {
      code: 'USCHI_RAIL',
      name: 'Chicago Union Station',
      type: 'rail',
      flag: '🚂',
      volume: '55M tons',
    },
    {
      code: 'USLAX_RAIL',
      name: 'Los Angeles Union Station',
      type: 'rail',
      flag: '🚂',
      volume: '35M tons',
    },
  ],
  ES: [
    // Ports maritimes
    { code: 'ESALG', name: "Port d'Algésiras", type: 'sea', flag: '🚢', volume: '5.1M TEU' },
    { code: 'ESVLC', name: 'Port de Valence', type: 'sea', flag: '🚢', volume: '5.4M TEU' },
    { code: 'ESBCN', name: 'Port de Barcelone', type: 'sea', flag: '🚢', volume: '3.4M TEU' },
    { code: 'ESBIL', name: 'Port de Bilbao', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'ESLAS', name: 'Port de Las Palmas', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    // Aéroports
    {
      code: 'ESMAD',
      name: 'Aéroport de Madrid-Barajas',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    {
      code: 'ESBCN_AIR',
      name: 'Aéroport de Barcelone-El Prat',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'ESVLC_AIR',
      name: 'Aéroport de Valence',
      type: 'air',
      flag: '✈️',
      volume: '0.03M tons',
    },
    {
      code: 'ESBIL_AIR',
      name: 'Aéroport de Bilbao',
      type: 'air',
      flag: '✈️',
      volume: '0.02M tons',
    },
    // Gares
    {
      code: 'ESMAD_RAIL',
      name: 'Gare de Madrid Atocha',
      type: 'rail',
      flag: '🚂',
      volume: '12M tons',
    },
    {
      code: 'ESBCN_RAIL',
      name: 'Gare de Barcelona Sants',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'ESVLC_RAIL',
      name: 'Gare de Valencia Joaquín Sorolla',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  IT: [
    // Ports maritimes
    { code: 'ITGOA', name: 'Port of Genoa', type: 'sea', flag: '🚢', volume: '2.6M TEU' },
    { code: 'ITLSP', name: 'Port of La Spezia', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'ITLIV', name: 'Port of Livorno', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'ITNAS', name: 'Port of Naples', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'ITVEN', name: 'Port of Venice', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    // Aéroports
    {
      code: 'ITROM',
      name: 'Rome Fiumicino Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.18M tons',
    },
    { code: 'ITMIL', name: 'Milan Malpensa Airport', type: 'air', flag: '✈️', volume: '0.6M tons' },
    {
      code: 'ITVEN_AIR',
      name: 'Venice Marco Polo Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.03M tons',
    },
    { code: 'ITNAS_AIR', name: 'Naples Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'ITROM_RAIL',
      name: 'Roma Termini Station',
      type: 'rail',
      flag: '🚂',
      volume: '9M tons',
    },
    {
      code: 'ITMIL_RAIL',
      name: 'Milano Centrale Station',
      type: 'rail',
      flag: '🚂',
      volume: '15M tons',
    },
    {
      code: 'ITVEN_RAIL',
      name: 'Venezia Santa Lucia Station',
      type: 'rail',
      flag: '🚂',
      volume: '5M tons',
    },
  ],
  NL: [
    // Ports maritimes
    { code: 'NLRTM', name: 'Port of Rotterdam', type: 'sea', flag: '🚢', volume: '14.8M TEU' },
    { code: 'NLAMS', name: 'Port of Amsterdam', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'NLAMS_AIR',
      name: 'Amsterdam Schiphol Airport',
      type: 'air',
      flag: '✈️',
      volume: '1.7M tons',
    },
    { code: 'NLEIN', name: 'Eindhoven Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'NLAMS_RAIL',
      name: 'Amsterdam Centraal Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'NLRTM_RAIL',
      name: 'Rotterdam Centraal Station',
      type: 'rail',
      flag: '🚂',
      volume: '25M tons',
    },
    {
      code: 'NLHAG_RAIL',
      name: 'Den Haag Centraal Station',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  BE: [
    // Ports maritimes
    { code: 'BEANR', name: "Port d'Anvers", type: 'sea', flag: '🚢', volume: '12.0M TEU' },
    { code: 'BEZEE', name: 'Port de Zeebruges', type: 'sea', flag: '🚢', volume: '1.6M TEU' },
    // Aéroports
    {
      code: 'BEBRU',
      name: 'Aéroport de Bruxelles-National',
      type: 'air',
      flag: '✈️',
      volume: '0.8M tons',
    },
    { code: 'BELIE', name: 'Aéroport de Liège', type: 'air', flag: '✈️', volume: '0.9M tons' },
    // Gares
    {
      code: 'BEBRU_RAIL',
      name: 'Gare centrale de Bruxelles',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
    {
      code: 'BEANR_RAIL',
      name: "Gare centrale d'Anvers",
      type: 'rail',
      flag: '🚂',
      volume: '18M tons',
    },
  ],
  CA: [
    // Ports maritimes
    { code: 'CAVAN', name: 'Port de Vancouver', type: 'sea', flag: '🚢', volume: '3.4M TEU' },
    { code: 'CAMON', name: 'Port de Montréal', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'CAHAL', name: 'Port de Halifax', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'CAYVR',
      name: 'Aéroport international de Vancouver',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    {
      code: 'CAYYZ',
      name: 'Aéroport international de Toronto Pearson',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    {
      code: 'CAYMQ',
      name: 'Aéroport international de Montréal Trudeau',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'CAYYC',
      name: 'Aéroport international de Calgary',
      type: 'air',
      flag: '✈️',
      volume: '0.15M tons',
    },
    // Gares
    {
      code: 'CAVAN_RAIL',
      name: 'Gare centrale du Pacifique de Vancouver',
      type: 'rail',
      flag: '🚂',
      volume: '28M tons',
    },
    {
      code: 'CATOR_RAIL',
      name: 'Gare Union de Toronto',
      type: 'rail',
      flag: '🚂',
      volume: '15M tons',
    },
  ],
  AU: [
    // Ports maritimes
    { code: 'AUSYD', name: 'Port de Sydney', type: 'sea', flag: '🚢', volume: '2.6M TEU' },
    { code: 'AUMEL', name: 'Port de Melbourne', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'AUBNE', name: 'Port de Brisbane', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'AUFRE', name: 'Port de Fremantle', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    // Aéroports
    {
      code: 'AUSYD_AIR',
      name: 'Aéroport de Sydney Kingsford Smith',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    {
      code: 'AUMEL_AIR',
      name: 'Aéroport de Melbourne Tullamarine',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    {
      code: 'AUBNE_AIR',
      name: 'Aéroport de Brisbane',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    { code: 'AUPER_AIR', name: 'Aéroport de Perth', type: 'air', flag: '✈️', volume: '0.1M tons' },
  ],
  JP: [
    // Ports maritimes
    { code: 'JPTYO', name: 'Port of Tokyo', type: 'sea', flag: '🚢', volume: '4.3M TEU' },
    { code: 'JPYOK', name: 'Port of Yokohama', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'JPOSA', name: 'Port of Osaka', type: 'sea', flag: '🚢', volume: '2.4M TEU' },
    { code: 'JPNGO', name: 'Port of Nagoya', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'JPKOB', name: 'Port of Kobe', type: 'sea', flag: '🚢', volume: '2.7M TEU' },
    // Aéroports
    {
      code: 'JPNRT',
      name: 'Tokyo Narita International Airport',
      type: 'air',
      flag: '✈️',
      volume: '2.3M tons',
    },
    { code: 'JPHND', name: 'Tokyo Haneda Airport', type: 'air', flag: '✈️', volume: '0.9M tons' },
    {
      code: 'JPKIX',
      name: 'Osaka Kansai International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.8M tons',
    },
    {
      code: 'JPNGO_AIR',
      name: 'Nagoya Chubu Centrair International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    // Gares
    { code: 'JPTYO_RAIL', name: 'Tokyo Station', type: 'rail', flag: '🚂', volume: '32M tons' },
    { code: 'JPOSA_RAIL', name: 'Osaka Station', type: 'rail', flag: '🚂', volume: '18M tons' },
    { code: 'JPNGO_RAIL', name: 'Nagoya Station', type: 'rail', flag: '🚂', volume: '12M tons' },
  ],
  CN: [
    // Ports maritimes
    { code: 'CNSHA', name: 'Port de Shanghai', type: 'sea', flag: '🚢', volume: '47.0M TEU' },
    { code: 'CNSZX', name: 'Port de Shenzhen', type: 'sea', flag: '🚢', volume: '25.2M TEU' },
    {
      code: 'CNNGB',
      name: 'Port de Ningbo-Zhoushan',
      type: 'sea',
      flag: '🚢',
      volume: '28.7M TEU',
    },
    { code: 'CNQIN', name: 'Port de Qingdao', type: 'sea', flag: '🚢', volume: '22.0M TEU' },
    { code: 'CNGUA', name: 'Port de Guangzhou', type: 'sea', flag: '🚢', volume: '23.2M TEU' },
    { code: 'CNTIA', name: 'Port de Tianjin', type: 'sea', flag: '🚢', volume: '18.5M TEU' },
    // Aéroports
    {
      code: 'CNPVG',
      name: 'Aéroport international de Shanghai Pudong',
      type: 'air',
      flag: '✈️',
      volume: '3.7M tons',
    },
    {
      code: 'CNPEK',
      name: 'Aéroport international de Pékin Capital',
      type: 'air',
      flag: '✈️',
      volume: '2.0M tons',
    },
    {
      code: 'CNCAN',
      name: 'Aéroport international de Guangzhou Baiyun',
      type: 'air',
      flag: '✈️',
      volume: '1.8M tons',
    },
    {
      code: 'CNSZX_AIR',
      name: "Aéroport international de Shenzhen Bao'an",
      type: 'air',
      flag: '✈️',
      volume: '1.2M tons',
    },
    {
      code: 'CNHGH',
      name: 'Aéroport international de Hangzhou Xiaoshan',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
    // Gares
    {
      code: 'CNBEI_RAIL',
      name: 'Gare ferroviaire de Pékin',
      type: 'rail',
      flag: '🚂',
      volume: '95M tons',
    },
    {
      code: 'CNSHA_RAIL',
      name: 'Gare ferroviaire de Shanghai',
      type: 'rail',
      flag: '🚂',
      volume: '85M tons',
    },
    {
      code: 'CNGUA_RAIL',
      name: 'Gare ferroviaire de Guangzhou',
      type: 'rail',
      flag: '🚂',
      volume: '65M tons',
    },
  ],
  KR: [
    // Ports maritimes
    { code: 'KRPUS', name: 'Port of Busan', type: 'sea', flag: '🚢', volume: '22.0M TEU' },
    { code: 'KRICN', name: 'Port of Incheon', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'KRULZ', name: 'Port of Ulsan', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    // Aéroports
    {
      code: 'KRICN_AIR',
      name: 'Incheon International Airport',
      type: 'air',
      flag: '✈️',
      volume: '3.0M tons',
    },
    { code: 'KRGMP', name: 'Gimpo Airport', type: 'air', flag: '✈️', volume: '0.3M tons' },
    {
      code: 'KRPUS_AIR',
      name: 'Busan Gimhae International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    { code: 'KRSEO_RAIL', name: 'Seoul Station', type: 'rail', flag: '🚂', volume: '24M tons' },
    { code: 'KRPUS_RAIL', name: 'Busan Station', type: 'rail', flag: '🚂', volume: '18M tons' },
  ],
  SG: [
    // Ports maritimes
    { code: 'SGSIN', name: 'Port of Singapore', type: 'sea', flag: '🚢', volume: '36.9M TEU' },
    // Aéroports
    {
      code: 'SGSIN_AIR',
      name: 'Singapore Changi Airport',
      type: 'air',
      flag: '✈️',
      volume: '2.0M tons',
    },
  ],
  MY: [
    // Ports maritimes
    { code: 'MYPKG', name: 'Port Klang', type: 'sea', flag: '🚢', volume: '13.5M TEU' },
    { code: 'MYTPP', name: 'Port of Tanjung Pelepas', type: 'sea', flag: '🚢', volume: '9.1M TEU' },
    // Aéroports
    {
      code: 'MYKUL',
      name: 'Kuala Lumpur International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
  ],
  TH: [
    // Ports maritimes
    { code: 'THLCH', name: 'Port of Laem Chabang', type: 'sea', flag: '🚢', volume: '8.1M TEU' },
    { code: 'THBKK', name: 'Port of Bangkok', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    // Aéroports
    {
      code: 'THBKK_AIR',
      name: 'Bangkok Suvarnabhumi Airport',
      type: 'air',
      flag: '✈️',
      volume: '1.2M tons',
    },
  ],
  IN: [
    // Ports maritimes
    { code: 'INJNP', name: 'Jawaharlal Nehru Port', type: 'sea', flag: '🚢', volume: '5.1M TEU' },
    { code: 'INMUN', name: 'Port of Mumbai', type: 'sea', flag: '🚢', volume: '4.7M TEU' },
    { code: 'INCHE', name: 'Port of Chennai', type: 'sea', flag: '🚢', volume: '2.1M TEU' },
    { code: 'INCOK', name: 'Port of Cochin', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'INDEL',
      name: 'Delhi Indira Gandhi International Airport',
      type: 'air',
      flag: '✈️',
      volume: '1.1M tons',
    },
    {
      code: 'INMUN_AIR',
      name: 'Mumbai Chhatrapati Shivaji Maharaj International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.9M tons',
    },
    {
      code: 'INBLR',
      name: 'Bangalore Kempegowda International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    {
      code: 'INCHE_AIR',
      name: 'Chennai International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  BR: [
    // Ports maritimes
    { code: 'BRSFS', name: 'Port de Santos', type: 'sea', flag: '🚢', volume: '4.3M TEU' },
    { code: 'BRRIO', name: 'Port de Rio de Janeiro', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'BRPAR', name: 'Port de Paranaguá', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'BRGRU',
      name: 'Aéroport international de São Paulo Guarulhos',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    {
      code: 'BRRIO_AIR',
      name: 'Aéroport international de Rio de Janeiro Galeão',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'BRBSB',
      name: 'Aéroport international de Brasília',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  MX: [
    // Ports maritimes
    { code: 'MXMAN', name: 'Port of Manzanillo', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'MXLAZ', name: 'Port of Lázaro Cárdenas', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'MXVER', name: 'Port of Veracruz', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    // Aéroports
    {
      code: 'MXMEX',
      name: 'Mexico City International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
    {
      code: 'MXCUN',
      name: 'Cancún International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  AE: [
    // Ports maritimes
    { code: 'AEJEA', name: 'Port de Jebel Ali', type: 'sea', flag: '🚢', volume: '14.1M TEU' },
    { code: 'AESHJ', name: 'Port de Sharjah', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'AEDXB',
      name: 'Aéroport international de Dubaï',
      type: 'air',
      flag: '✈️',
      volume: '2.9M tons',
    },
    {
      code: 'AEAUH',
      name: "Aéroport international d'Abu Dhabi",
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
  ],
  TR: [
    // Ports maritimes
    { code: 'TRAMB', name: 'Port of Ambarli', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'TRIST', name: 'Port of Istanbul', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'TRIZM', name: 'Port of Izmir', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    // Aéroports
    { code: 'TRIST_AIR', name: 'Istanbul Airport', type: 'air', flag: '✈️', volume: '1.4M tons' },
    { code: 'TRSAW', name: 'Sabiha Gökçen Airport', type: 'air', flag: '✈️', volume: '0.3M tons' },
    {
      code: 'TRIZM_AIR',
      name: 'Izmir Adnan Menderes Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  RU: [
    // Ports maritimes
    {
      code: 'RULED',
      name: 'Port of Saint Petersburg',
      type: 'sea',
      flag: '🚢',
      volume: '2.1M TEU',
    },
    { code: 'RUNVS', name: 'Port of Novorossiysk', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'RUVVO', name: 'Port of Vladivostok', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'RUSVO',
      name: 'Moscow Sheremetyevo International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    {
      code: 'RULED_AIR',
      name: 'Saint Petersburg Pulkovo Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'RUMOS_RAIL',
      name: 'Moscow Kazansky Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '75M tons',
    },
    {
      code: 'RULED_RAIL',
      name: 'Saint Petersburg Baltic Station',
      type: 'rail',
      flag: '🚂',
      volume: '35M tons',
    },
  ],
  ZA: [
    // Ports maritimes
    { code: 'ZADUR', name: 'Port of Durban', type: 'sea', flag: '🚢', volume: '2.9M TEU' },
    { code: 'ZACPT', name: 'Port of Cape Town', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'ZAJNB',
      name: 'OR Tambo International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    {
      code: 'ZACPT_AIR',
      name: 'Cape Town International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
  ],
  EG: [
    // Ports maritimes
    { code: 'EGALY', name: "Port d'Alexandrie", type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'EGDKH', name: 'Port de Damiette', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'EGSEZ', name: 'Port de Suez', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    // Aéroports
    {
      code: 'EGCAI',
      name: 'Aéroport international du Caire',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  CL: [
    // Ports maritimes
    { code: 'CLVAP', name: 'Port de Valparaíso', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'CLSAI', name: 'Port de San Antonio', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    // Aéroports
    {
      code: 'CLSCL',
      name: 'Aéroport international de Santiago',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
  ],
  AR: [
    // Ports maritimes
    { code: 'ARBUE', name: 'Port de Buenos Aires', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    // Aéroports
    {
      code: 'AREZE',
      name: "Aéroport international d'Ezeiza",
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  PE: [
    // Ports maritimes
    { code: 'PECLL', name: 'Port of Callao', type: 'sea', flag: '🚢', volume: '2.3M TEU' },
    // Aéroports
    {
      code: 'PELIM',
      name: 'Jorge Chávez International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  CO: [
    // Ports maritimes
    { code: 'COCTG', name: 'Port de Cartagena', type: 'sea', flag: '🚢', volume: '3.0M TEU' },
    { code: 'COBAR', name: 'Port de Barranquilla', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'COBOG',
      name: 'Aéroport international de Bogotá El Dorado',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
  ],
  MA: [
    // Ports maritimes
    { code: 'MACAS', name: 'Port of Casablanca', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'MATAN', name: 'Port of Tanger Med', type: 'sea', flag: '🚢', volume: '5.8M TEU' },
    // Aéroports
    {
      code: 'MACMN',
      name: 'Casablanca Mohammed V International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
  ],
  NG: [
    // Ports maritimes
    { code: 'NGLAG', name: 'Port of Lagos Apapa', type: 'sea', flag: '🚢', volume: '1.5M TEU' },
    { code: 'NGTCR', name: 'Port of Tin Can Island', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    // Aéroports
    {
      code: 'NGLOS',
      name: 'Lagos Murtala Muhammed International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  DK: [
    // Ports maritimes
    { code: 'DKAAR', name: 'Port of Aarhus', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'DKCPH', name: 'Port of Copenhagen', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    { code: 'DKCPH_AIR', name: 'Copenhagen Airport', type: 'air', flag: '✈️', volume: '0.3M tons' },
    // Gares
    {
      code: 'DKCPH_RAIL',
      name: 'Copenhagen Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  SE: [
    // Ports maritimes
    { code: 'SEGOT', name: 'Port of Gothenburg', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'SESTO', name: 'Port of Stockholm', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'SEARN',
      name: 'Stockholm Arlanda Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'SEGOT_AIR',
      name: 'Gothenburg Landvetter Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'SESTO_RAIL',
      name: 'Stockholm Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
    {
      code: 'SEGOT_RAIL',
      name: 'Gothenburg Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
  ],
  FI: [
    // Ports maritimes
    { code: 'FIHAM', name: 'Port de Hamina-Kotka', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'FIHEL', name: "Port d'Helsinki", type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    {
      code: 'FIHEL_AIR',
      name: "Aéroport d'Helsinki-Vantaa",
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    // Gares
    {
      code: 'FIHEL_RAIL',
      name: "Gare centrale d'Helsinki",
      type: 'rail',
      flag: '🚂',
      volume: '5M tons',
    },
  ],
  NO: [
    // Ports maritimes
    { code: 'NOOSL', name: 'Port of Oslo', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'NOBERG', name: 'Port of Bergen', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'NOOSL_AIR',
      name: 'Oslo Gardermoen Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    // Gares
    {
      code: 'NOOSL_RAIL',
      name: 'Oslo Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '5M tons',
    },
  ],
  PL: [
    // Ports maritimes
    { code: 'PLGDN', name: 'Port of Gdansk', type: 'sea', flag: '🚢', volume: '2.1M TEU' },
    { code: 'PLGDY', name: 'Port of Gdynia', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'PLSZZ', name: 'Port of Szczecin', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    { code: 'PLWAW', name: 'Warsaw Chopin Airport', type: 'air', flag: '✈️', volume: '0.1M tons' },
    {
      code: 'PLKRK',
      name: 'Kraków John Paul II International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'PLWAR_RAIL',
      name: 'Warsaw Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '12M tons',
    },
    {
      code: 'PLKRK_RAIL',
      name: 'Kraków Main Station',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
  ],
  CZ: [
    // Aéroports
    {
      code: 'CZPRG',
      name: 'Aéroport de Prague Václav Havel',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'CZPRG_RAIL',
      name: 'Gare centrale de Prague',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
  ],
  AT: [
    // Aéroports
    {
      code: 'ATVIE',
      name: 'Aéroport international de Vienne',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    // Gares
    {
      code: 'ATVIE_RAIL',
      name: 'Gare centrale de Vienne',
      type: 'rail',
      flag: '🚂',
      volume: '10M tons',
    },
  ],
  CH: [
    // Aéroports
    { code: 'CHZUR', name: 'Aéroport de Zürich', type: 'air', flag: '✈️', volume: '0.5M tons' },
    { code: 'CHGVA', name: 'Aéroport de Genève', type: 'air', flag: '✈️', volume: '0.1M tons' },
    // Gares
    {
      code: 'CHZUR_RAIL',
      name: 'Gare centrale de Zürich',
      type: 'rail',
      flag: '🚂',
      volume: '7M tons',
    },
    {
      code: 'CHGVA_RAIL',
      name: 'Gare de Genève-Cornavin',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  PT: [
    // Ports maritimes
    { code: 'PTLIS', name: 'Port of Lisbon', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'PTLEI', name: 'Port of Leixões', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'PTLIS_AIR',
      name: 'Lisbon Portela Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'PTOPO',
      name: 'Porto Francisco Sá Carneiro Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'PTLIS_RAIL',
      name: 'Lisbon Santa Apolónia Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
    {
      code: 'PTOPO_RAIL',
      name: 'Porto Campanhã Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  GR: [
    // Ports maritimes
    { code: 'GRPIR', name: 'Port of Piraeus', type: 'sea', flag: '🚢', volume: '5.4M TEU' },
    { code: 'GRTHE', name: 'Port of Thessaloniki', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'GRATH',
      name: 'Athens Eleftherios Venizelos Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'GRATH_RAIL',
      name: 'Athens Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  HK: [
    // Ports maritimes
    { code: 'HKHKG', name: 'Port of Hong Kong', type: 'sea', flag: '🚢', volume: '18.1M TEU' },
    // Aéroports
    {
      code: 'HKHKG_AIR',
      name: 'Hong Kong International Airport',
      type: 'air',
      flag: '✈️',
      volume: '5.1M tons',
    },
  ],
  IE: [
    // Ports maritimes
    { code: 'IEDUB', name: 'Port of Dublin', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    { code: 'IECOR', name: 'Port of Cork', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    { code: 'IEDUB_AIR', name: 'Dublin Airport', type: 'air', flag: '✈️', volume: '0.2M tons' },
    { code: 'IECOR_AIR', name: 'Cork Airport', type: 'air', flag: '✈️', volume: '0.05M tons' },
    // Gares
    {
      code: 'IEDUB_RAIL',
      name: 'Dublin Heuston Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  NZ: [
    // Ports maritimes
    { code: 'NZAKL', name: 'Port of Auckland', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'NZTRG', name: 'Port of Tauranga', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'NZWEL', name: 'Port of Wellington', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    // Aéroports
    { code: 'NZAKL_AIR', name: 'Auckland Airport', type: 'air', flag: '✈️', volume: '0.2M tons' },
    {
      code: 'NZWEL_AIR',
      name: 'Wellington Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    {
      code: 'NZCHC_AIR',
      name: 'Christchurch Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
  ],
  TW: [
    // Ports maritimes
    { code: 'TWKHH', name: 'Port of Kaohsiung', type: 'sea', flag: '🚢', volume: '9.9M TEU' },
    { code: 'TWTPE', name: 'Port of Taipei', type: 'sea', flag: '🚢', volume: '1.6M TEU' },
    { code: 'TWTCG', name: 'Port of Taichung', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    // Aéroports
    {
      code: 'TWTPE_AIR',
      name: 'Taipei Taoyuan International Airport',
      type: 'air',
      flag: '✈️',
      volume: '2.3M tons',
    },
    {
      code: 'TWKHH_AIR',
      name: 'Kaohsiung International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    // Gares
    {
      code: 'TWTPE_RAIL',
      name: 'Taipei Main Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'TWKHH_RAIL',
      name: 'Kaohsiung Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  QA: [
    // Ports maritimes
    { code: 'QADOH', name: 'Port of Doha', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'QAMES', name: 'Port of Mesaieed', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    // Aéroports
    {
      code: 'QADOH_AIR',
      name: 'Doha Hamad International Airport',
      type: 'air',
      flag: '✈️',
      volume: '2.3M tons',
    },
  ],
  SA: [
    // Ports maritimes
    { code: 'SAJED', name: 'Port of Jeddah', type: 'sea', flag: '🚢', volume: '4.0M TEU' },
    { code: 'SADAM', name: 'Port of Dammam', type: 'sea', flag: '🚢', volume: '1.8M TEU' },
    { code: 'SAYAN', name: 'Port of Yanbu', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    // Aéroports
    {
      code: 'SARUH',
      name: 'Riyadh King Khalid International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    {
      code: 'SAJED_AIR',
      name: 'Jeddah King Abdulaziz International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
    {
      code: 'SADAM_AIR',
      name: 'Dammam King Fahd International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
  ],
  UA: [
    // Ports maritimes
    { code: 'UAODE', name: 'Port of Odesa', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'UAIEV', name: 'Port of Chornomorsk', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'UAMYK', name: 'Port of Mykolaiv', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'UAKBP',
      name: 'Kyiv Boryspil International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'UAODS',
      name: 'Odesa International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'UAKIV_RAIL',
      name: 'Kyiv Central Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '18M tons',
    },
    {
      code: 'UAODE_RAIL',
      name: 'Odesa Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
  ],
  PH: [
    // Ports maritimes
    { code: 'PHMNL', name: 'Port of Manila', type: 'sea', flag: '🚢', volume: '4.2M TEU' },
    { code: 'PHCEB', name: 'Port of Cebu', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'PHBAT', name: 'Port of Batangas', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    // Aéroports
    {
      code: 'PHMNL_AIR',
      name: 'Ninoy Aquino International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.6M tons',
    },
    {
      code: 'PHCEB_AIR',
      name: 'Mactan-Cebu International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'PHCRK',
      name: 'Clark International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  VN: [
    // Ports maritimes
    {
      code: 'VNSGN',
      name: 'Port of Ho Chi Minh City',
      type: 'sea',
      flag: '🚢',
      volume: '7.2M TEU',
    },
    { code: 'VNHAN', name: 'Port of Haiphong', type: 'sea', flag: '🚢', volume: '2.1M TEU' },
    { code: 'VNDAN', name: 'Port of Da Nang', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'VNSGN_AIR',
      name: 'Ho Chi Minh City Tan Son Nhat International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    {
      code: 'VNHAN_AIR',
      name: 'Hanoi Noi Bai International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    {
      code: 'VNDAN_AIR',
      name: 'Da Nang International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'VNHAN_RAIL',
      name: 'Hanoi Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '12M tons',
    },
    {
      code: 'VNSGN_RAIL',
      name: 'Ho Chi Minh City Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
  ],
  ID: [
    // Ports maritimes
    {
      code: 'IDJKT',
      name: 'Jakarta Tanjung Priok Port',
      type: 'sea',
      flag: '🚢',
      volume: '7.6M TEU',
    },
    { code: 'IDSUB', name: 'Port of Surabaya', type: 'sea', flag: '🚢', volume: '3.4M TEU' },
    { code: 'IDBLW', name: 'Belawan Medan Port', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    // Aéroports
    {
      code: 'IDJKT_AIR',
      name: 'Jakarta Soekarno-Hatta International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.7M tons',
    },
    {
      code: 'IDSUB_AIR',
      name: 'Surabaya Juanda International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'IDMED_AIR',
      name: 'Medan Kualanamu International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  IL: [
    // Ports maritimes
    { code: 'ILHFA', name: 'Port of Haifa', type: 'sea', flag: '🚢', volume: '1.6M TEU' },
    { code: 'ILASD', name: 'Port of Ashdod', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'ILEIL', name: 'Port of Eilat', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'ILTLV',
      name: 'Tel Aviv Ben Gurion Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    { code: 'ILHFA_AIR', name: 'Haifa Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
  ],
  KZ: [
    // Ports maritimes
    { code: 'KZAKT', name: 'Port of Aktau', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'KZALA',
      name: 'Almaty International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'KZNUR',
      name: 'Nur-Sultan Nazarbayev International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    // Gares
    {
      code: 'KZALA_RAIL',
      name: 'Almaty Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '25M tons',
    },
    {
      code: 'KZNUR_RAIL',
      name: 'Nur-Sultan Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '15M tons',
    },
  ],
  PK: [
    // Ports maritimes
    { code: 'PKKAR', name: 'Port of Karachi', type: 'sea', flag: '🚢', volume: '2.4M TEU' },
    { code: 'PKQAS', name: 'Port Qasim', type: 'sea', flag: '🚢', volume: '1.3M TEU' },
    { code: 'PKGWA', name: 'Port of Gwadar', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'PKKAR_AIR',
      name: 'Jinnah International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    {
      code: 'PKLHE',
      name: 'Allama Iqbal International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'PKISB',
      name: 'Islamabad International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'PKKAR_RAIL',
      name: 'Karachi City Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'PKLHE_RAIL',
      name: 'Lahore Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
  ],
  LK: [
    // Ports maritimes
    { code: 'LKCMB', name: 'Port of Colombo', type: 'sea', flag: '🚢', volume: '7.2M TEU' },
    { code: 'LKHMS', name: 'Port of Hambantota', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    // Aéroports
    {
      code: 'LKCMB_AIR',
      name: 'Colombo Bandaranaike International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
  ],
  BD: [
    // Ports maritimes
    { code: 'BDCGP', name: 'Port de Chittagong', type: 'sea', flag: '🚢', volume: '3.1M TEU' },
    { code: 'BDDHA', name: 'Port de Dhaka', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    { code: 'BDMGL', name: 'Port de Mongla', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'BDDAC',
      name: 'Aéroport international de Dhaka Hazrat Shahjalal',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    {
      code: 'BDCGP_AIR',
      name: 'Aéroport international de Chittagong Shah Amanat',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'BDDHA_RAIL',
      name: 'Gare ferroviaire de Dhaka',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
    {
      code: 'BDCGP_RAIL',
      name: 'Gare ferroviaire de Chittagong',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  OM: [
    // Ports maritimes
    { code: 'OMSAL', name: 'Port of Salalah', type: 'sea', flag: '🚢', volume: '5.0M TEU' },
    { code: 'OMMUS', name: 'Port of Muscat', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'OMSOH', name: 'Port of Sohar', type: 'sea', flag: '🚢', volume: '4.1M TEU' },
    // Aéroports
    {
      code: 'OMMUS_AIR',
      name: 'Muscat International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    { code: 'OMSAL_AIR', name: 'Salalah Airport', type: 'air', flag: '✈️', volume: '0.05M tons' },
  ],
  KW: [
    // Ports maritimes
    { code: 'KWKWI', name: 'Port of Kuwait', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    { code: 'KWSHU', name: 'Port of Shuwaikh', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    // Aéroports
    {
      code: 'KWKWI_AIR',
      name: 'Kuwait International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  JO: [
    // Ports maritimes
    { code: 'JOAQJ', name: 'Port of Aqaba', type: 'sea', flag: '🚢', volume: '0.9M TEU' },
    // Aéroports
    {
      code: 'JOAMM',
      name: 'Amman Queen Alia International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'JOAQJ_AIR',
      name: 'Aqaba King Hussein International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.01M tons',
    },
  ],
  LB: [
    // Ports maritimes
    { code: 'LBBEY', name: 'Port of Beirut', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    { code: 'LBTRI', name: 'Port of Tripoli', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'LBBEY_AIR',
      name: 'Beirut Rafic Hariri International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  IR: [
    // Ports maritimes
    { code: 'IRBND', name: 'Port of Bandar Abbas', type: 'sea', flag: '🚢', volume: '2.8M TEU' },
    { code: 'IRIMAM', name: 'Imam Khomeini Port', type: 'sea', flag: '🚢', volume: '2.2M TEU' },
    { code: 'IRBZG', name: 'Port of Bushehr', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'IRIKU',
      name: 'Tehran Imam Khomeini International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.4M tons',
    },
    { code: 'IRMHD', name: 'Mashhad Airport', type: 'air', flag: '✈️', volume: '0.1M tons' },
    // Gares
    {
      code: 'IRTEH_RAIL',
      name: 'Tehran Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '10M tons',
    },
    {
      code: 'IRISF_RAIL',
      name: 'Isfahan Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  HR: [
    // Ports maritimes
    { code: 'HRRJK', name: 'Port of Rijeka', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'HRSPT', name: 'Port of Split', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'HRZAG', name: 'Port of Zadar', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'HRZAG_AIR',
      name: 'Zagreb Franjo Tuđman Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    { code: 'HRSPT_AIR', name: 'Split Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'HRZAG_RAIL',
      name: 'Zagreb Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  RO: [
    // Ports maritimes
    { code: 'ROCND', name: 'Port of Constanta', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'ROGLT', name: 'Port of Galati', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'ROBUH',
      name: 'Bucharest Henri Coandă International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    { code: 'ROCND_AIR', name: 'Constanta Airport', type: 'air', flag: '✈️', volume: '0.01M tons' },
    // Gares
    {
      code: 'ROBUH_RAIL',
      name: 'Bucharest North Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '8M tons',
    },
    {
      code: 'ROCND_RAIL',
      name: 'Constanta Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '5M tons',
    },
  ],
  BG: [
    // Ports maritimes
    { code: 'BGVAR', name: 'Port de Varna', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'BGBOJ', name: 'Port de Bourgas', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    { code: 'BGSOF', name: 'Aéroport de Sofia', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'BGVAR_AIR', name: 'Aéroport de Varna', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'BGSOF_RAIL',
      name: 'Gare centrale de Sofia',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  RS: [
    // Ports maritimes
    { code: 'RSBEG', name: 'Port of Belgrade', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    { code: 'RSNOV', name: 'Port of Novi Sad', type: 'sea', flag: '🚢', volume: '0.05M TEU' },
    // Aéroports
    {
      code: 'RSBEG_AIR',
      name: 'Belgrade Nikola Tesla Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    // Gares
    {
      code: 'RSBEG_RAIL',
      name: 'Belgrade Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '6M tons',
    },
  ],
  HU: [
    // Ports maritimes
    { code: 'HUBUD', name: 'Port of Budapest', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'HUBUD_AIR',
      name: 'Budapest Liszt Ferenc International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'HUBUD_RAIL',
      name: 'Budapest Keleti Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '7M tons',
    },
  ],
  SK: [
    // Aéroports
    {
      code: 'SKBTS',
      name: 'Bratislava Milan Rastislav Štefánik Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.02M tons',
    },
    // Gares
    {
      code: 'SKBTS_RAIL',
      name: 'Bratislava Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  SI: [
    // Ports maritimes
    { code: 'SIKOP', name: 'Port of Koper', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    // Aéroports
    {
      code: 'SILJU',
      name: 'Ljubljana Jože Pučnik Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.03M tons',
    },
    // Gares
    {
      code: 'SILJU_RAIL',
      name: 'Ljubljana Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  LT: [
    // Ports maritimes
    { code: 'LTKLA', name: 'Port of Klaipeda', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    { code: 'LTVIL', name: 'Vilnius Airport', type: 'air', flag: '✈️', volume: '0.05M tons' },
    { code: 'LTKUN', name: 'Kaunas Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'LTVIL_RAIL',
      name: 'Vilnius Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
    {
      code: 'LTKLA_RAIL',
      name: 'Klaipeda Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '4M tons',
    },
  ],
  LV: [
    // Ports maritimes
    { code: 'LVRIX', name: 'Port of Riga', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'LVVEN', name: 'Port of Ventspils', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    { code: 'LVRIX_AIR', name: 'Riga Airport', type: 'air', flag: '✈️', volume: '0.06M tons' },
    // Gares
    {
      code: 'LVRIX_RAIL',
      name: 'Riga Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '5M tons',
    },
  ],
  EE: [
    // Ports maritimes
    { code: 'EETLL', name: 'Port de Tallinn', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'EETLL_AIR',
      name: 'Aéroport de Tallinn Lennart Meri',
      type: 'air',
      flag: '✈️',
      volume: '0.04M tons',
    },
    // Gares
    {
      code: 'EETLL_RAIL',
      name: 'Gare ferroviaire de Tallinn',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  KE: [
    // Ports maritimes
    { code: 'KEMSA', name: 'Port of Mombasa', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'KEKIS', name: 'Port of Kisumu', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'KENBO',
      name: 'Nairobi Jomo Kenyatta International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
    {
      code: 'KEMSA_AIR',
      name: 'Mombasa Moi International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'KENBO_RAIL',
      name: 'Nairobi Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
    {
      code: 'KEMSA_RAIL',
      name: 'Mombasa Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  GH: [
    // Ports maritimes
    { code: 'GHTEM', name: 'Port of Tema', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'GHTKO', name: 'Port of Takoradi', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'GHACC',
      name: 'Accra Kotoka International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
  ],
  CI: [
    // Ports maritimes
    { code: 'CIABJ', name: "Port d'Abidjan", type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    { code: 'CISAN', name: 'Port de San-Pédro', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    // Aéroports
    {
      code: 'CIABJ_AIR',
      name: "Aéroport international d'Abidjan Félix Houphouët-Boigny",
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  AO: [
    // Ports maritimes
    { code: 'AOLAD', name: 'Port de Luanda', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'AOLOS', name: 'Port de Lobito', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'AOLAD_AIR',
      name: 'Aéroport de Luanda Quatro de Fevereiro',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'AOLAD_RAIL',
      name: 'Gare ferroviaire de Luanda',
      type: 'rail',
      flag: '🚂',
      volume: '1M tons',
    },
  ],
  MZ: [
    // Ports maritimes
    { code: 'MZMPM', name: 'Port of Maputo', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'MZBEI', name: 'Port of Beira', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'MZNAC', name: 'Port of Nacala', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'MZMPM_AIR',
      name: 'Maputo International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    // Gares
    {
      code: 'MZMPM_RAIL',
      name: 'Maputo Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  ET: [
    // Aéroports
    {
      code: 'ETADD',
      name: "Aéroport international d'Addis-Abeba Bole",
      type: 'air',
      flag: '✈️',
      volume: '0.5M tons',
    },
    // Gares
    {
      code: 'ETADD_RAIL',
      name: "Gare ferroviaire d'Addis-Abeba",
      type: 'rail',
      flag: '🚂',
      volume: '1M tons',
    },
  ],
  TN: [
    // Ports maritimes
    { code: 'TNTU1', name: 'Port of Tunis', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'TNSFA', name: 'Port of Sfax', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'TNRAD', name: 'Port of Radès', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    {
      code: 'TNTU1_AIR',
      name: 'Tunis-Carthage Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    // Gares
    {
      code: 'TNTU1_RAIL',
      name: 'Tunis Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '1M tons',
    },
  ],
  SN: [
    // Ports maritimes
    { code: 'SNDKR', name: 'Port of Dakar', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'SNDSS',
      name: 'Dakar Blaise Diagne International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'SNDKR_RAIL',
      name: 'Dakar Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.5M tons',
    },
  ],
  UY: [
    // Ports maritimes
    { code: 'UYMVD', name: 'Port of Montevideo', type: 'sea', flag: '🚢', volume: '1.1M TEU' },
    // Aéroports
    {
      code: 'UYMVD_AIR',
      name: 'Montevideo Carrasco International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'UYMVD_RAIL',
      name: 'Montevideo Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.8M tons',
    },
  ],
  PY: [
    // Ports maritimes
    { code: 'PYASU', name: 'Port of Asunción', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'PYASU_AIR',
      name: 'Silvio Pettirossi International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.03M tons',
    },
    // Gares
    {
      code: 'PYASU_RAIL',
      name: 'Asunción Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.5M tons',
    },
  ],
  EC: [
    // Ports maritimes
    { code: 'ECGYE', name: 'Port de Guayaquil', type: 'sea', flag: '🚢', volume: '2.0M TEU' },
    { code: 'ECMNT', name: 'Port de Manta', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    // Aéroports
    {
      code: 'ECUIO',
      name: 'Aéroport international de Quito Mariscal Sucre',
      type: 'air',
      flag: '✈️',
      volume: '0.2M tons',
    },
    {
      code: 'ECGYE_AIR',
      name: 'Aéroport international de Guayaquil José Joaquín de Olmedo',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'ECUIO_RAIL',
      name: 'Gare ferroviaire de Quito',
      type: 'rail',
      flag: '🚂',
      volume: '0.3M tons',
    },
  ],
  PA: [
    // Ports maritimes
    { code: 'PABAL', name: 'Port of Balboa', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    { code: 'PACOL', name: 'Port of Colón', type: 'sea', flag: '🚢', volume: '4.3M TEU' },
    { code: 'PACRZ', name: 'Port of Cristóbal', type: 'sea', flag: '🚢', volume: '2.8M TEU' },
    // Aéroports
    {
      code: 'PAPTY',
      name: 'Tocumen International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.3M tons',
    },
  ],
  VE: [
    // Ports maritimes
    { code: 'VELAS', name: 'Port of La Guaira', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    { code: 'VEPZO', name: 'Port of Puerto Cabello', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    { code: 'VEMCB', name: 'Port of Maracaibo', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    // Aéroports
    {
      code: 'VECCS',
      name: 'Caracas Simón Bolívar International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    // Gares
    {
      code: 'VECCS_RAIL',
      name: 'Caracas Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.5M tons',
    },
  ],
  GT: [
    // Ports maritimes
    { code: 'GTGUA', name: 'Port of Guatemala', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'GTPAC', name: 'Port Quetzal', type: 'sea', flag: '🚢', volume: '1.0M TEU' },
    // Aéroports
    {
      code: 'GTGUA_AIR',
      name: 'Guatemala City La Aurora International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
  ],
  CR: [
    // Ports maritimes
    { code: 'CRLIM', name: 'Port de Limón', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'CRPUN', name: 'Port de Puntarenas', type: 'sea', flag: '🚢', volume: '0.4M TEU' },
    // Aéroports
    {
      code: 'CRSJO',
      name: 'Aéroport international Juan Santamaría',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  DO: [
    // Ports maritimes
    { code: 'DOSDQ', name: 'Port of Santo Domingo', type: 'sea', flag: '🚢', volume: '1.4M TEU' },
    { code: 'DOHIG', name: 'Port of Haina', type: 'sea', flag: '🚢', volume: '0.6M TEU' },
    // Aéroports
    {
      code: 'DOSDQ_AIR',
      name: 'Santo Domingo Las Américas International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'DOPOP',
      name: 'Puerto Plata Gregorio Luperón International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
  ],
  JM: [
    // Ports maritimes
    { code: 'JMKIN', name: 'Port of Kingston', type: 'sea', flag: '🚢', volume: '1.7M TEU' },
    { code: 'JMMBY', name: 'Port of Montego Bay', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    // Aéroports
    {
      code: 'JMKIN_AIR',
      name: 'Kingston Norman Manley International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    {
      code: 'JMMBY_AIR',
      name: 'Montego Bay Sangster International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
  ],
  TT: [
    // Ports maritimes
    { code: 'TTPOS', name: 'Port of Port of Spain', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'TTCOU', name: 'Port of Point Lisas', type: 'sea', flag: '🚢', volume: '0.5M TEU' },
    // Aéroports
    {
      code: 'TTPOS_AIR',
      name: 'Port of Spain Piarco International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
  ],
  LU: [
    // Aéroports
    {
      code: 'LULUX',
      name: 'Luxembourg Findel Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.9M tons',
    },
    // Gares
    {
      code: 'LULUX_RAIL',
      name: 'Luxembourg Central Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
  ],
  MC: [
    // Ports maritimes
    { code: 'MCMON', name: 'Port of Monaco', type: 'sea', flag: '🚢', volume: '0.05M TEU' },
    // Aéroports (utilise Nice)
    {
      code: 'MCNCE',
      name: "Nice Côte d'Azur Airport",
      type: 'air',
      flag: '✈️',
      volume: '0.06M tons',
    },
  ],
  LI: [
    // Pas de ports/aéroports propres (utilise Suisse/Autriche)
    // Gares
    {
      code: 'LIVAD_RAIL',
      name: 'Vaduz Railway Connection',
      type: 'rail',
      flag: '🚂',
      volume: '0.1M tons',
    },
  ],
  IS: [
    // Ports maritimes
    { code: 'ISREY', name: 'Port of Reykjavik', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'ISAKR', name: 'Port of Akranes', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'ISKEF',
      name: 'Reykjavik Keflavik Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    { code: 'ISREY_AIR', name: 'Reykjavik Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
  ],
  MT: [
    // Ports maritimes
    { code: 'MTMLA', name: 'Port of Valletta', type: 'sea', flag: '🚢', volume: '3.2M TEU' },
    { code: 'MTMRS', name: 'Port of Marsaxlokk', type: 'sea', flag: '🚢', volume: '3.5M TEU' },
    // Aéroports
    {
      code: 'MTMLA_AIR',
      name: 'Malta International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
  ],
  CY: [
    // Ports maritimes
    { code: 'CYLIM', name: 'Port de Limassol', type: 'sea', flag: '🚢', volume: '0.8M TEU' },
    { code: 'CYLCA', name: 'Port de Larnaca', type: 'sea', flag: '🚢', volume: '0.3M TEU' },
    { code: 'CYPAF', name: 'Port de Paphos', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    {
      code: 'CYLCA_AIR',
      name: 'Aéroport international de Larnaca',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'CYPAF_AIR',
      name: 'Aéroport international de Paphos',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
  ],
  RW: [
    // Aéroports
    {
      code: 'RWKGL',
      name: 'Kigali International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'RWKGL_RAIL',
      name: 'Kigali Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.3M tons',
    },
  ],
  UG: [
    // Ports maritimes (Lac Victoria)
    { code: 'UGKMP', name: 'Port of Kampala', type: 'sea', flag: '🚢', volume: '0.05M TEU' },
    { code: 'UGENT', name: 'Port of Entebbe', type: 'sea', flag: '🚢', volume: '0.03M TEU' },
    // Aéroports
    {
      code: 'UGENT_AIR',
      name: 'Entebbe International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    // Gares
    {
      code: 'UGKMP_RAIL',
      name: 'Kampala Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.5M tons',
    },
  ],
  TZ: [
    // Ports maritimes
    { code: 'TZDAR', name: 'Port of Dar es Salaam', type: 'sea', flag: '🚢', volume: '1.2M TEU' },
    { code: 'TZMTW', name: 'Port of Mtwara', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    { code: 'TZMZA', name: 'Port of Mwanza', type: 'sea', flag: '🚢', volume: '0.05M TEU' },
    // Aéroports
    {
      code: 'TZDAR_AIR',
      name: 'Dar es Salaam Julius Nyerere International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    {
      code: 'TZKIL',
      name: 'Kilimanjaro International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    // Gares
    {
      code: 'TZDAR_RAIL',
      name: 'Dar es Salaam Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
    {
      code: 'TZMZA_RAIL',
      name: 'Mwanza Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '0.8M tons',
    },
  ],
  ZW: [
    // Ports maritimes (fluviaux)
    { code: 'ZWHRE', name: 'Port of Harare', type: 'sea', flag: '🚢', volume: '0.02M TEU' },
    { code: 'ZWBYO', name: 'Port of Bulawayo', type: 'sea', flag: '🚢', volume: '0.01M TEU' },
    // Aéroports
    {
      code: 'ZWHRE_AIR',
      name: 'Harare International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.05M tons',
    },
    { code: 'ZWBYO_AIR', name: 'Bulawayo Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
    // Gares
    {
      code: 'ZWHRE_RAIL',
      name: 'Harare Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '1M tons',
    },
    {
      code: 'ZWBYO_RAIL',
      name: 'Bulawayo Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '1.5M tons',
    },
  ],
  ZM: [
    // Ports maritimes (fluviaux)
    { code: 'ZMLUN', name: 'Port of Lusaka', type: 'sea', flag: '🚢', volume: '0.03M TEU' },
    { code: 'ZMKAP', name: 'Port of Kapiri Mposhi', type: 'sea', flag: '🚢', volume: '0.02M TEU' },
    // Aéroports
    {
      code: 'ZMLUN_AIR',
      name: 'Kenneth Kaunda International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.06M tons',
    },
    { code: 'ZMNDO', name: 'Ndola Airport', type: 'air', flag: '✈️', volume: '0.03M tons' },
    // Gares
    {
      code: 'ZMLUN_RAIL',
      name: 'Lusaka Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '2M tons',
    },
    {
      code: 'ZMKAP_RAIL',
      name: 'Kapiri Mposhi Railway Station',
      type: 'rail',
      flag: '🚂',
      volume: '3M tons',
    },
  ],
  FJ: [
    // Ports maritimes
    { code: 'FJSUV', name: 'Port de Suva', type: 'sea', flag: '🚢', volume: '0.2M TEU' },
    { code: 'FJLAU', name: 'Port de Lautoka', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    // Aéroports
    { code: 'FJNAN', name: 'Aéroport de Nadi', type: 'air', flag: '✈️', volume: '0.05M tons' },
    {
      code: 'FJSUV_AIR',
      name: 'Aéroport de Suva Nausori',
      type: 'air',
      flag: '✈️',
      volume: '0.02M tons',
    },
  ],
  MU: [
    // Ports maritimes
    { code: 'MUPTS', name: 'Port Louis', type: 'sea', flag: '🚢', volume: '0.7M TEU' },
    // Aéroports
    {
      code: 'MUPTS_AIR',
      name: 'Mauritius Sir Seewoosagur Ramgoolam International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.1M tons',
    },
    { code: 'MUPLN', name: 'Plaine Corail Airport', type: 'air', flag: '✈️', volume: '0.02M tons' },
  ],
  SC: [
    // Ports maritimes
    { code: 'SCVIC', name: 'Port of Victoria', type: 'sea', flag: '🚢', volume: '0.1M TEU' },
    { code: 'SCPRS', name: 'Port of Praslin', type: 'sea', flag: '🚢', volume: '0.02M TEU' },
    // Aéroports
    {
      code: 'SCVIC_AIR',
      name: 'Mahé Seychelles International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.03M tons',
    },
    { code: 'SCPRS_AIR', name: 'Praslin Airport', type: 'air', flag: '✈️', volume: '0.01M tons' },
  ],
  MV: [
    // Ports maritimes
    { code: 'MVMAL', name: 'Port of Malé', type: 'sea', flag: '🚢', volume: '0.05M TEU' },
    { code: 'MVGAN', name: 'Port of Gan', type: 'sea', flag: '🚢', volume: '0.02M TEU' },
    // Aéroports
    {
      code: 'MVMAL_AIR',
      name: 'Malé Velana International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.08M tons',
    },
    {
      code: 'MVGAN_AIR',
      name: 'Gan International Airport',
      type: 'air',
      flag: '✈️',
      volume: '0.01M tons',
    },
  ],
};
export const SEA_PORTS: Array<DestinationPort & { region?: string }> = [
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
] as DestinationPort[];
export const AIRPORTS: Array<DestinationPort & { region?: string }> = [
  { code: 'PEK', name: 'Beijing Capital', type: 'air', flag: '✈️' },
  { code: 'PVG', name: 'Shanghai Pudong', type: 'air', flag: '✈️' },
  { code: 'CAN', name: 'Guangzhou Baiyun', type: 'air', flag: '✈️' },
  { code: 'CTU', name: 'Chengdu Tianfu', type: 'air', flag: '✈️' },
  { code: 'KMG', name: 'Kunming Changshui', type: 'air', flag: '✈️' },
] as DestinationPort[];
export const RAIL_TERMINALS: Array<DestinationPort & { region?: string }> = [] as DestinationPort[];
