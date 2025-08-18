import React from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/context/useQuoteForm';
import { initialLoadDetails } from '@/features/lead/context/types';
import { COUNTRIES } from '@/data/countries';

type StepConfirmationProps = {
  submissionId: string;
  setSubmissionId: React.Dispatch<React.SetStateAction<string>>;
  showToast: (message: string) => void;
};

const StepConfirmation: React.FC<StepConfirmationProps> = ({
  submissionId,
  setSubmissionId,
  showToast,
}) => {
  const {
    currentStep,
    userLang,
    formData,
    setFormData,
    setFieldValid,
    setCurrentStep,
    getText: ctxGetText,
  } = useQuoteForm();

  const DEFAULT_EN_TEXT: Record<string, string> = {
    confirmationTitle: ctxGetText('confirmationTitle', 'Quote Request Confirmed'),
    confirmationSubtitle: ctxGetText('confirmationSubtitle', 'Your request has been successfully submitted'),
    referenceNumber: 'Reference Number',
    yourRequest: 'Your Request Summary',
    shipmentDetails: 'Shipment Details',
    contactDetails: 'Contact Details',
    nextSteps: 'Next Steps',
    step1: 'Request received',
    step1Time: 'Now',
    step2: 'Analysis & pricing',
    step2Time: 'Within 4 business hours',
    step3: 'Sales contact',
    step3Time: 'Within 24 hours',
    step4: 'Detailed quote',
    step4Time: 'Within 48 hours',
    mode: 'Mode',
    shipment: 'shipment',
    shipments: 'shipments',
    aboutSino: 'About SINO Shipping & FS International',
    aboutSubtitle: 'Your request is in expert hands',
    sinoDescription:
      'SINO Shipping, launched in 2018 by French entrepreneurs, became part of FS International in 2021. This partnership combines Western customer-focused approach with deep Chinese local expertise.',
    fsDescription:
      'FS International, founded in Hong Kong in September 1989, is one of the most trusted names in global logistics and transportation in the region.',
    ourExpertise: 'Our Expertise',
    expertise1: 'Maritime, air, rail & multimodal transport',
    expertise2: 'E-commerce solutions (Amazon FBA, dropshipping)',
    expertise3: 'Sourcing & quality control',
    expertise4: 'Complete logistics services',
    impactInNumbers: 'Our Impact in Numbers',
    impactDescription: 'Delivering excellence across China with proven results and trusted service',
    satisfiedCustomers: 'Satisfied Customers',
    customerSatisfaction: 'Customer Satisfaction',
    teamMembers: 'Team Members',
    oceanVolume: 'TEU Ocean Volume',
    officesInChina: 'Offices in China',
    cfsFacilities: 'M² CFS Facilities',
    globalNetwork: 'Global Network',
    networkDescription: 'Strategic offices in key logistics hubs:',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong: 1/F, Block C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Websites',
    needHelp: 'Need Help?',
    community: 'Community',
    contactEmail: 'Contact email',
    available: 'available',
    businessHours: '9am-6pm (China time)',
    actions: 'Quick Actions',
    newRequest: 'Make another request',
    thankYouTitle: 'Thank you for your trust!',
    thankYouMessage:
      'Your request will be handled with the utmost care by our international transport experts.',
  };

  const DEFAULT_DE_TEXT: Record<string, string> = {
    confirmationTitle: 'Angebotsanfrage Bestätigt',
    confirmationSubtitle: 'Ihre Anfrage wurde erfolgreich übermittelt',
    referenceNumber: 'Referenznummer',
    yourRequest: 'Ihre Anfragezusammenfassung',
    shipmentDetails: 'Sendungsdetails',
    contactDetails: 'Kontaktdaten',
    nextSteps: 'Nächste Schritte',
    step1: 'Anfrage erhalten',
    step1Time: 'Jetzt',
    step2: 'Analyse und Kalkulation',
    step2Time: 'Innerhalb von 4 Geschäftsstunden',
    step3: 'Vertriebskontakt',
    step3Time: 'Innerhalb von 24 Stunden',
    step4: 'Detailliertes Angebot',
    step4Time: 'Innerhalb von 48 Stunden',
    mode: 'Modus',
    shipment: 'Sendung',
    shipments: 'Sendungen',
    aboutSino: 'Über SINO Shipping & FS International',
    aboutSubtitle: 'Ihre Anfrage ist in Expertenhänden',
    sinoDescription:
      'SINO Shipping, 2018 von französischen Unternehmern gegründet, wurde 2021 Teil von FS International. Diese Partnerschaft verbindet einen westlich kundenorientierten Ansatz mit tiefgehender lokaler China-Expertise.',
    fsDescription:
      'FS International, gegründet in Hongkong im September 1989, ist einer der vertrauenswürdigsten Namen für globale Logistik und Transport in der Region.',
    ourExpertise: 'Unsere Expertise',
    expertise1: 'See-, Luft-, Bahn- und multimodaler Transport',
    expertise2: 'E‑Commerce‑Lösungen (Amazon FBA, Dropshipping)',
    expertise3: 'Beschaffung & Qualitätskontrolle',
    expertise4: 'Umfassende Logistikservices',
    impactInNumbers: 'Unser Einfluss in Zahlen',
    impactDescription: 'Exzellenz in China mit nachweisbaren Ergebnissen und verlässlichem Service',
    satisfiedCustomers: 'Zufriedene Kunden',
    customerSatisfaction: 'Kundenzufriedenheit',
    teamMembers: 'Teammitglieder',
    oceanVolume: 'TEU Seefrachtvolumen',
    officesInChina: 'Büros in China',
    cfsFacilities: 'm² CFS‑Anlagen',
    globalNetwork: 'Globales Netzwerk',
    networkDescription: 'Strategische Büros in wichtigen Logistikhubs:',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hongkong: 1. Stock, Block C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Websites',
    needHelp: 'Benötigen Sie Hilfe?',
    community: 'Community',
    contactEmail: 'Kontakt‑E‑Mail',
    available: 'erreichbar',
    businessHours: '9–18 Uhr (China‑Zeit)',
    actions: 'Schnellaktionen',
    newRequest: 'Weitere Anfrage stellen',
    thankYouTitle: 'Vielen Dank für Ihr Vertrauen!',
    thankYouMessage:
      'Ihre Anfrage wird von unseren internationalen Transportexperten mit größter Sorgfalt bearbeitet.',
  };

  const DEFAULT_ES_TEXT: Record<string, string> = {
    confirmationTitle: 'Solicitud de Cotización Confirmada',
    confirmationSubtitle: 'Su solicitud ha sido enviada exitosamente',
    referenceNumber: 'Número de Referencia',
    yourRequest: 'Resumen de Su Solicitud',
    shipmentDetails: 'Detalles del Envío',
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
    mode: 'Modo',
    shipment: 'envío',
    shipments: 'envíos',
    aboutSino: 'Acerca de SINO Shipping & FS International',
    aboutSubtitle: 'Su solicitud está en manos expertas',
    sinoDescription:
      'SINO Shipping, lanzado en 2018 por emprendedores franceses, se convirtió en parte de FS International en 2021. Esta asociación combina el enfoque occidental centrado en el cliente con una profunda experiencia local en China.',
    fsDescription:
      'FS International, fundada en Hong Kong en septiembre de 1989, es uno de los nombres más confiables en logística y transporte global de la región.',
    ourExpertise: 'Nuestra Experiencia',
    expertise1: 'Transporte marítimo, aéreo, ferroviario y multimodal',
    expertise2: 'Soluciones de comercio electrónico (Amazon FBA, dropshipping)',
    expertise3: 'Abastecimiento y control de calidad',
    expertise4: 'Servicios logísticos completos',
    impactInNumbers: 'Nuestro Impacto en Números',
    impactDescription:
      'Ofreciendo excelencia en China con resultados probados y servicio confiable',
    satisfiedCustomers: 'Clientes Satisfechos',
    customerSatisfaction: 'Satisfacción del Cliente',
    teamMembers: 'Miembros del Equipo',
    oceanVolume: 'Volumen Oceánico TEU',
    officesInChina: 'Oficinas en China',
    cfsFacilities: 'Instalaciones CFS M²',
    globalNetwork: 'Red Global',
    networkDescription: 'Oficinas estratégicas en centros logísticos clave:',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong: 1.º piso, Bloque C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Sitios web',
    needHelp: '¿Necesita Ayuda?',
    community: 'Comunidad',
    contactEmail: 'Correo electrónico de contacto',
    available: 'disponible',
    businessHours: '9:00–18:00 (hora de China)',
    actions: 'Acciones Rápidas',
    newRequest: 'Hacer otra solicitud',
    thankYouTitle: '¡Gracias por su confianza!',
    thankYouMessage:
      'Su solicitud será manejada con el máximo cuidado por nuestros expertos en transporte internacional.',
  };

  const DEFAULT_IT_TEXT: Record<string, string> = {
    confirmationTitle: 'Richiesta di Preventivo Confermata',
    confirmationSubtitle: 'La vostra richiesta è stata inviata con successo',
    referenceNumber: 'Numero di Riferimento',
    yourRequest: 'Riepilogo della Vostra Richiesta',
    shipmentDetails: 'Dettagli della Spedizione',
    contactDetails: 'Dettagli di Contatto',
    nextSteps: 'Prossimi Passi',
    step1: 'Richiesta ricevuta',
    step1Time: 'Ora',
    step2: 'Analisi e quotazione',
    step2Time: 'Entro 4 ore lavorative',
    step3: 'Contatto commerciale',
    step3Time: 'Entro 24 ore',
    step4: 'Preventivo dettagliato',
    step4Time: 'Entro 48 ore',
    mode: 'Modalità',
    shipment: 'spedizione',
    shipments: 'spedizioni',
    aboutSino: 'Su SINO Shipping & FS International',
    aboutSubtitle: 'La vostra richiesta è in mani esperte',
    sinoDescription:
      'SINO Shipping, lanciata nel 2018 da imprenditori francesi, è diventata parte di FS International nel 2021. Questa partnership combina l’approccio occidentale orientato al cliente con una profonda expertise locale in Cina.',
    fsDescription:
      'FS International, fondata a Hong Kong nel settembre 1989, è uno dei nomi più affidabili nella logistica e nel trasporto globale nella regione.',
    ourExpertise: 'La Nostra Esperienza',
    expertise1: 'Trasporto marittimo, aereo, ferroviario e multimodale',
    expertise2: 'Soluzioni e‑commerce (Amazon FBA, dropshipping)',
    expertise3: 'Sourcing e controllo qualità',
    expertise4: 'Servizi logistici completi',
    impactInNumbers: 'Il Nostro Impatto in Numeri',
    impactDescription: 'Offrendo eccellenza in Cina con risultati comprovati e servizio affidabile',
    satisfiedCustomers: 'Clienti Soddisfatti',
    customerSatisfaction: 'Soddisfazione del Cliente',
    teamMembers: 'Membri del Team',
    oceanVolume: 'Volume Marittimo TEU',
    officesInChina: 'Uffici in Cina',
    cfsFacilities: 'M² Strutture CFS',
    globalNetwork: 'Rete Globale',
    networkDescription: 'Uffici strategici nei principali hub logistici:',
    chinaOffices: 'Cina: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong: 1º piano, Blocco C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Siti web',
    needHelp: 'Serve Aiuto?',
    community: 'Comunità',
    contactEmail: 'Email di contatto',
    available: 'disponibile',
    businessHours: '9:00–18:00 (ora della Cina)',
    actions: 'Azioni Rapide',
    newRequest: "Fare un'altra richiesta",
    thankYouTitle: 'Grazie per la vostra fiducia!',
    thankYouMessage:
      'La vostra richiesta sarà gestita con la massima cura dai nostri esperti di trasporto internazionale.',
  };

  const DEFAULT_NL_TEXT: Record<string, string> = {
    confirmationTitle: 'Offerteaanvraag Bevestigd',
    confirmationSubtitle: 'Uw aanvraag is succesvol verzonden',
    referenceNumber: 'Referentienummer',
    yourRequest: 'Samenvatting van Uw Aanvraag',
    shipmentDetails: 'Zendingdetails',
    contactDetails: 'Contactgegevens',
    nextSteps: 'Volgende Stappen',
    step1: 'Aanvraag ontvangen',
    step1Time: 'Nu',
    step2: 'Analyse en prijsopgave',
    step2Time: 'Binnen 4 werkuren',
    step3: 'Salescontact',
    step3Time: 'Binnen 24 uur',
    step4: 'Gedetailleerde offerte',
    step4Time: 'Binnen 48 uur',
    mode: 'Vervoerswijze',
    shipment: 'zending',
    shipments: 'zendingen',
    aboutSino: 'Over SINO Shipping & FS International',
    aboutSubtitle: 'Uw aanvraag wordt afgehandeld door experts',
    sinoDescription:
      'SINO Shipping werd opgericht in 2018 door Franse ondernemers en werd in 2021 onderdeel van FS International. Deze samenwerking combineert een westerse klantgerichte benadering met diepe lokale expertise in China.',
    fsDescription:
      'FS International werd opgericht in september 1989 in Hongkong en is een van de meest vertrouwde namen voor wereldwijde logistiek en transport in de regio.',
    ourExpertise: 'Onze Expertise',
    expertise1: 'Zee-, lucht-, spoor- en multimodaal transport',
    expertise2: 'E‑commerceoplossingen (Amazon FBA, dropshipping)',
    expertise3: 'Sourcing en kwaliteitscontrole',
    expertise4: 'Volledige logistieke diensten',
    impactInNumbers: 'Onze Impact in Cijfers',
    impactDescription: 'Excellentie leveren in China met bewezen resultaten en betrouwbare service',
    satisfiedCustomers: 'Tevreden Klanten',
    customerSatisfaction: 'Klanttevredenheid',
    teamMembers: 'Teamleden',
    oceanVolume: 'TEU Zeevracht Volume',
    officesInChina: 'Kantoren in China',
    cfsFacilities: 'M² CFS Faciliteiten',
    globalNetwork: 'Wereldwijd Netwerk',
    networkDescription:
      'Met strategische kantoren in China en Hongkong zijn we ideaal gepositioneerd om uw zendingen efficiënt af te handelen.',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hongkong: 1e verdieping, Blok C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Websites',
    needHelp: 'Hulp Nodig?',
    community: 'Community',
    contactEmail: 'Contact e‑mail',
    available: 'bereikbaar',
    businessHours: '09:00–18:00 (Chinese tijd)',
    actions: 'Snelle Acties',
    newRequest: 'Nieuwe Aanvraag Indienen',
    thankYouTitle: 'Dank u voor uw vertrouwen!',
    thankYouMessage:
      'Uw verzoek wordt met de grootste zorg behandeld door onze internationale transportexperts.',
  };

  const DEFAULT_ZH_TEXT: Record<string, string> = {
    confirmationTitle: '报价申请已确认',
    confirmationSubtitle: '您的申请已成功提交',
    referenceNumber: '参考编号',
    yourRequest: '您的申请摘要',
    shipmentDetails: '货运详情',
    contactDetails: '联系方式',
    nextSteps: '后续步骤',
    step1: '申请已接收',
    step1Time: '现在',
    step2: '分析与报价',
    step2Time: '4个工作小时内',
    step3: '商务联系',
    step3Time: '24小时内',
    step4: '详细报价',
    step4Time: '48小时内',
    mode: '运输方式',
    shipment: '货运',
    shipments: '货运',
    aboutSino: '关于SINO Shipping & FS International',
    aboutSubtitle: '您的申请由专家处理',
    sinoDescription:
      'SINO Shipping由法国企业家于2018年创立，2021年成为FS International的一部分。这种合作结合了西方以客户为中心的方法和深厚的中国本地专业知识。',
    fsDescription:
      'FS International成立于1989年9月在香港，是该地区全球物流和运输最值得信赖的品牌之一。',
    ourExpertise: '我们的专业能力',
    expertise1: '海运、空运、铁路和多式联运',
    expertise2: '电子商务解决方案（亚马逊FBA、代发货）',
    expertise3: '采购和质量控制',
    expertise4: '完整的物流服务',
    impactInNumbers: '我们的数字影响力',
    impactDescription: '在中国提供卓越服务，拥有经过验证的结果和可信赖的服务',
    satisfiedCustomers: '满意客户',
    customerSatisfaction: '客户满意度',
    teamMembers: '团队成员',
    oceanVolume: 'TEU海运量',
    officesInChina: '中国办公室',
    cfsFacilities: 'CFS设施平方米',
    globalNetwork: '全球网络',
    networkDescription: '在主要物流枢纽的战略办事处：',
    chinaOffices: '中国：上海、深圳、广州、宁波、天津、青岛、厦门',
    hkOffice: '香港：北角华森道8号 Sea View Estate C座 1楼',
    websites: '网站',
    needHelp: '需要帮助?',
    community: '社区',
    contactEmail: '联系邮箱',
    available: '在线时间',
    businessHours: '9:00–18:00（中国时间）',
    actions: '快速操作',
    newRequest: '提交新申请',
    thankYouTitle: '感谢您的信任！',
    thankYouMessage: '您的请求将由我们的国际运输专家精心处理。',
  };

  const DEFAULT_AR_TEXT: Record<string, string> = {
    confirmationTitle: 'تأكيد طلب عرض السعر',
    confirmationSubtitle: 'تم إرسال طلبكم بنجاح',
    referenceNumber: 'رقم المرجع',
    yourRequest: 'ملخص طلبكم',
    shipmentDetails: 'تفاصيل الشحنة',
    contactDetails: 'تفاصيل الاتصال',
    nextSteps: 'الخطوات التالية',
    step1: 'تم استلام الطلب',
    step1Time: 'الآن',
    step2: 'التحليل والتسعير',
    step2Time: 'خلال 4 ساعات عمل',
    step3: 'التواصل التجاري',
    step3Time: 'خلال 24 ساعة',
    step4: 'عرض سعر مفصل',
    step4Time: 'خلال 48 ساعة',
    mode: 'طريقة النقل',
    shipment: 'شحنة',
    shipments: 'شحنات',
    aboutSino: 'حول SINO Shipping & FS International',
    aboutSubtitle: 'طلبكم بيد خبراء',
    sinoDescription:
      'تأسست SINO Shipping عام 2018 على يد رواد أعمال فرنسيين، وأصبحت جزءًا من FS International في 2021. يجمع هذا التعاون بين نهج غربي متمحور حول العميل وخبرة محلية صينية عميقة.',
    fsDescription:
      'تأسست FS International في هونغ كونغ في سبتمبر 1989، وهي من الأسماء الأكثر موثوقية في مجال الخدمات اللوجستية والنقل العالمي في المنطقة.',
    ourExpertise: 'خبرتنا',
    expertise1: 'الشحن البحري والجوي والسككي والمتعدد الوسائط',
    expertise2: 'حلول التجارة الإلكترونية (Amazon FBA، دروبشيبينغ)',
    expertise3: 'التوريد ومراقبة الجودة',
    expertise4: 'خدمات لوجستية متكاملة',
    impactInNumbers: 'تأثيرنا بالأرقام',
    impactDescription: 'تقديم التميز في الصين بنتائج مثبتة وخدمة موثوقة',
    satisfiedCustomers: 'عملاء راضون',
    customerSatisfaction: 'رضا العملاء',
    teamMembers: 'أعضاء الفريق',
    oceanVolume: 'حجم الشحن البحري TEU',
    officesInChina: 'مكاتب في الصين',
    cfsFacilities: 'مرافق CFS بالمتر المربع',
    globalNetwork: 'الشبكة العالمية',
    networkDescription: 'مكاتب استراتيجية في أهم مراكز الخدمات اللوجستية:',
    chinaOffices: 'الصين: شنغهاي، شينزين، غوانزو، نينغبو، تيانجين، تشينغداو، شيامن',
    hkOffice: 'هونغ كونغ: الطابق الأول، المبنى C، Sea View Estate، 8 Watson Road، نورث بوينت',
    websites: 'المواقع',
    needHelp: 'تحتاجون مساعدة؟',
    community: 'المجتمع',
    contactEmail: 'البريد الإلكتروني للتواصل',
    available: 'ساعات العمل',
    businessHours: '9:00–18:00 (بتوقيت الصين)',
    actions: 'إجراءات سريعة',
    newRequest: 'تقديم طلب جديد',
    thankYouTitle: 'شكراً لثقتكم!',
    thankYouMessage: 'سيتم التعامل مع طلبكم بأقصى درجات العناية من قبل خبراء النقل الدولي لدينا.',
  };

  const DEFAULT_PT_TEXT: Record<string, string> = {
    confirmationTitle: 'Solicitação de Cotação Confirmada',
    confirmationSubtitle: 'Sua solicitação foi enviada com sucesso',
    referenceNumber: 'Número de Referência',
    yourRequest: 'Resumo da Sua Solicitação',
    shipmentDetails: 'Detalhes da Remessa',
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
    mode: 'Modalidade',
    shipment: 'remessa',
    shipments: 'remessas',
    aboutSino: 'Sobre a SINO Shipping & FS International',
    aboutSubtitle: 'Sua solicitação é tratada por especialistas',
    sinoDescription:
      'A SINO Shipping foi fundada em 2018 por empreendedores franceses e tornou-se parte da FS International em 2021. Esta colaboração combina uma abordagem ocidental centrada no cliente com profunda expertise local na China.',
    fsDescription:
      'A FS International foi fundada em setembro de 1989 em Hong Kong, sendo uma das marcas mais confiáveis para logística e transporte global na região.',
    ourExpertise: 'Nossa Expertise',
    expertise1: 'Frete marítimo, aéreo, ferroviário e multimodal',
    expertise2: 'Soluções de e-commerce (Amazon FBA, dropshipping)',
    expertise3: 'Sourcing e controle de qualidade',
    expertise4: 'Serviços logísticos completos',
    impactInNumbers: 'Nosso Impacto em Números',
    impactDescription:
      'Entregando excelência na China com resultados comprovados e serviço confiável',
    satisfiedCustomers: 'Clientes Satisfeitos',
    customerSatisfaction: 'Satisfação do Cliente',
    teamMembers: 'Membros da Equipe',
    oceanVolume: 'Volume Marítimo TEU',
    officesInChina: 'Escritórios na China',
    cfsFacilities: 'M² Instalações CFS',
    globalNetwork: 'Rede Global',
    networkDescription:
      'Com escritórios estratégicos na China e Hong Kong, estamos idealmente posicionados para atender suas remessas com eficiência.',
    chinaOffices: 'China: Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong: 1º andar, Bloco C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Sites',
    needHelp: 'Precisa de Ajuda?',
    community: 'Comunidade',
    contactEmail: 'E-mail de contato',
    available: 'disponível',
    businessHours: '9h–18h (horário da China)',
    actions: 'Ações Rápidas',
    newRequest: 'Enviar Nova Solicitação',
    thankYouTitle: 'Obrigado pela sua confiança!',
    thankYouMessage:
      'Sua solicitação será tratada com o máximo cuidado por nossos especialistas em transporte internacional.',
  };

  const DEFAULT_TR_TEXT: Record<string, string> = {
    confirmationTitle: 'Teklif Talebi Onaylandı',
    confirmationSubtitle: 'Talebiniz başarıyla gönderildi',
    referenceNumber: 'Referans Numarası',
    yourRequest: 'Talebinizin Özeti',
    shipmentDetails: 'Gönderi Detayları',
    contactDetails: 'İletişim Bilgileri',
    nextSteps: 'Sonraki Adımlar',
    step1: 'Talep alındı',
    step1Time: 'Şimdi',
    step2: 'Analiz ve fiyatlandırma',
    step2Time: '4 iş saati içinde',
    step3: 'Satış iletişimi',
    step3Time: '24 saat içinde',
    step4: 'Ayrıntılı teklif',
    step4Time: '48 saat içinde',
    mode: 'Taşıma Şekli',
    shipment: 'gönderi',
    shipments: 'gönderiler',
    aboutSino: 'SINO Shipping & FS International Hakkında',
    aboutSubtitle: 'Talebiniz uzmanlarımız tarafından işleniyor',
    sinoDescription:
      "SINO Shipping 2018 yılında Fransız girişimciler tarafından kuruldu ve 2021'de FS International'ın bir parçası oldu. Bu iş birliği, müşteri odaklı Batılı yaklaşımı derin yerel Çin uzmanlığıyla birleştirir.",
    fsDescription:
      "FS International, Eylül 1989'da Hong Kong'da kuruldu ve bölgede küresel lojistik ve taşımacılığın en güvenilir isimlerinden biridir.",
    ourExpertise: 'Uzmanlığımız',
    expertise1: 'Deniz, hava, demiryolu ve multimodal taşımacılık',
    expertise2: 'E-ticaret çözümleri (Amazon FBA, dropshipping)',
    expertise3: 'Tedarik ve kalite kontrol',
    expertise4: 'Kapsamlı lojistik hizmetleri',
    impactInNumbers: 'Rakamlarla Etkimiz',
    impactDescription: "Kanıtlanmış sonuçlar ve güvenilir hizmetle Çin'de mükemmellik sunuyoruz",
    satisfiedCustomers: 'Memnun Müşteriler',
    customerSatisfaction: 'Müşteri Memnuniyeti',
    teamMembers: 'Takım Üyeleri',
    oceanVolume: 'TEU Deniz Hacmi',
    officesInChina: "Çin'deki Ofisler",
    cfsFacilities: 'M² CFS Tesisleri',
    globalNetwork: 'Küresel Ağ',
    networkDescription:
      "Çin ve Hong Kong'daki stratejik ofislerimizle, gönderilerinizi verimli şekilde ele almak için ideal konumdayız.",
    chinaOffices: 'Çin: Şanghay, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen',
    hkOffice: 'Hong Kong: 1. kat, C Blok, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Web Siteleri',
    needHelp: 'Yardıma İhtiyacınız Var?',
    community: 'Topluluk',
    contactEmail: 'İletişim e-postası',
    available: 'çalışma saatleri',
    businessHours: '09:00–18:00 (Çin saati)',
    actions: 'Hızlı İşlemler',
    newRequest: 'Yeni Talep Gönder',
    thankYouTitle: 'Güveniniz için teşekkürler!',
    thankYouMessage:
      'Talebiniz uluslararası taşımacılık uzmanlarımız tarafından en büyük özenle işlenecektir.',
  };

  const DEFAULT_RU_TEXT: Record<string, string> = {
    confirmationTitle: 'Запрос на Расчёт Стоимости Подтверждён',
    confirmationSubtitle: 'Ваш запрос был успешно отправлен',
    referenceNumber: 'Номер Заявки',
    yourRequest: 'Краткое Описание Вашего Запроса',
    shipmentDetails: 'Детали Груза',
    contactDetails: 'Контактные Данные',
    nextSteps: 'Следующие Шаги',
    step1: 'Запрос получен',
    step1Time: 'Сейчас',
    step2: 'Анализ и расчёт',
    step2Time: 'В течение 4 рабочих часов',
    step3: 'Связь с отделом продаж',
    step3Time: 'В течение 24 часов',
    step4: 'Детализированное коммерческое предложение',
    step4Time: 'В течение 48 часов',
    mode: 'Способ Доставки',
    shipment: 'отправление',
    shipments: 'отправления',
    aboutSino: 'О SINO Shipping & FS International',
    aboutSubtitle: 'Ваш запрос обрабатывается экспертами',
    sinoDescription:
      'SINO Shipping была основана в 2018 году французскими предпринимателями и в 2021 году стала частью FS International. Это сотрудничество объединяет западный клиентоориентированный подход и глубокую локальную экспертизу в Китае.',
    fsDescription:
      'FS International была основана в сентябре 1989 года в Гонконге и является одним из самых надёжных брендов глобальной логистики и транспорта в регионе.',
    ourExpertise: 'Наша Экспертиза',
    expertise1: 'Морские, авиационные, железнодорожные и мультимодальные перевозки',
    expertise2: 'Решения для e‑commerce (Amazon FBA, дропшиппинг)',
    expertise3: 'Закупки и контроль качества',
    expertise4: 'Полный комплекс логистических услуг',
    impactInNumbers: 'Наше Влияние в Цифрах',
    impactDescription:
      'Обеспечиваем превосходство в Китае с проверенными результатами и надёжным сервисом',
    satisfiedCustomers: 'Довольных Клиентов',
    customerSatisfaction: 'Удовлетворённость Клиентов',
    teamMembers: 'Члены Команды',
    oceanVolume: 'Объём Морских Перевозок TEU',
    officesInChina: 'Офисы в Китае',
    cfsFacilities: 'М² Объекты CFS',
    globalNetwork: 'Глобальная Сеть',
    networkDescription:
      'Со стратегическими офисами в Китае и Гонконге мы идеально позиционированы для эффективной обработки ваших грузов.',
    chinaOffices: 'Китай: Шанхай, Шэньчжэнь, Гуанчжоу, Нинбо, Тяньцзинь, Циндао, Сямэнь',
    hkOffice: 'Гонконг: 1 этаж, блок C, Sea View Estate, 8 Watson Road, North Point',
    websites: 'Сайты',
    needHelp: 'Нужна Помощь?',
    community: 'Сообщество',
    contactEmail: 'Эл. почта для связи',
    available: 'доступны',
    businessHours: '9:00–18:00 (по времени Китая)',
    actions: 'Быстрые Действия',
    newRequest: 'Отправить Новый Запрос',
    thankYouTitle: 'Спасибо за ваше доверие!',
    thankYouMessage:
      'Ваш запрос будет обработан с максимальной заботой нашими экспертами по международным перевозкам.',
  };

  const getText = (key: string): string => {
    const fallback =
      (userLang === 'de' && DEFAULT_DE_TEXT[key]) ||
      (userLang === 'es' && DEFAULT_ES_TEXT[key]) ||
      (userLang === 'it' && DEFAULT_IT_TEXT[key]) ||
      (userLang === 'nl' && DEFAULT_NL_TEXT[key]) ||
      (userLang === 'zh' && DEFAULT_ZH_TEXT[key]) ||
      (userLang === 'ar' && DEFAULT_AR_TEXT[key]) ||
      (userLang === 'pt' && DEFAULT_PT_TEXT[key]) ||
      (userLang === 'tr' && DEFAULT_TR_TEXT[key]) ||
      (userLang === 'ru' && DEFAULT_RU_TEXT[key]) ||
      DEFAULT_EN_TEXT[key] ||
      key;
    return ctxGetText(key, fallback);
  };

  return (
    <FormStep
      isVisible={currentStep === 7}
      stepNumber={7}
      title={userLang === 'fr' ? 'Demande de Devis Confirmée' : getText('confirmationTitle')}
      emoji="✅"
      hideStepNumber={true}
    >
      <div
        className="confirmation-container"
        style={{
          background:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderRadius: '2rem',
          padding: '0',
          margin: '2rem 0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite',
            zIndex: 0,
          }}
        ></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '8px',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%',
                animation: 'float 3s ease-in-out infinite',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '60%',
                right: '15%',
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                animation: 'float 4s ease-in-out infinite reverse',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '30%',
                right: '30%',
                width: '10px',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                animation: 'float 5s ease-in-out infinite',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '25%',
                left: '20%',
                width: '4px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                animation: 'sparkle 2s ease-in-out infinite',
              }}
            ></div>
            <div
              style={{
                fontSize: '6rem',
                marginBottom: '1.5rem',
                animation: 'bounceIn 1s ease-out',
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
              }}
            >
              🎉
            </div>
            <div
              style={{
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
                letterSpacing: '1px',
              }}
            >
              ✨{' '}
              {userLang === 'fr'
                ? 'Processus Terminé avec Succès'
                : userLang === 'de'
                  ? 'Vorgang Erfolgreich Abgeschlossen'
                  : userLang === 'es'
                    ? 'Proceso Completado con Éxito'
                    : userLang === 'it'
                      ? 'Processo Completato con Successo'
                      : userLang === 'nl'
                        ? 'Proces Succesvol Voltooid'
                        : userLang === 'ar'
                          ? 'تم إنجاز العملية بنجاح'
                          : userLang === 'pt'
                            ? 'Processo Concluído com Sucesso'
                            : userLang === 'tr'
                              ? 'Süreç Başarıyla Tamamlandı'
                              : userLang === 'ru'
                                ? 'Процесс Успешно Завершён'
                                : userLang === 'zh'
                                  ? '流程成功完成'
                                  : 'Process Successfully Completed'}
            </div>
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                animation: 'slideInUp 0.8s ease-out 0.1s both',
                background: 'linear-gradient(45deg, #ffffff 0%, #f0fdf4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {userLang === 'fr' ? 'Merci pour votre confiance !' : getText('thankYouTitle')}
            </h1>
            <p
              style={{
                fontSize: '1.3rem',
                opacity: '0.95',
                marginBottom: '2.5rem',
                maxWidth: '700px',
                margin: '0 auto 2.5rem auto',
                lineHeight: '1.7',
                animation: 'slideInUp 0.8s ease-out 0.2s both',
                fontWeight: '300',
              }}
            >
              {userLang === 'fr'
                ? 'Votre demande a été soumise avec succès'
                : getText('confirmationSubtitle')}
            </p>
            <div
              onClick={() => {
                try {
                  if (submissionId) {
                    navigator.clipboard?.writeText(submissionId);
                    showToast(userLang === 'fr' ? 'Référence copiée' : 'Reference copied');
                  }
                } catch {
                  // ignore
                }
              }}
              title={userLang === 'fr' ? 'Cliquer pour copier' : 'Click to copy'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  try {
                    if (submissionId) {
                      navigator.clipboard?.writeText(submissionId);
                      showToast(userLang === 'fr' ? 'Référence copiée' : 'Reference copied');
                    }
                  } catch {
                    // ignore
                  }
                }
              }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                padding: '1.5rem 3rem',
                borderRadius: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-block',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: 'slideInUp 0.8s ease-out 0.4s both',
                minWidth: '300px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                {userLang === 'fr' ? 'Numéro de Référence' : getText('referenceNumber')}
              </div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                {submissionId}
              </div>
            </div>
          </div>
        </div>
        <div
          className="request-summary"
          style={{
            marginBottom: '2rem',
            padding: '2rem',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
            borderRadius: '1.5rem',
            border: '2px solid rgba(16, 185, 129, 0.1)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            animation: 'slideInUp 0.8s ease-out 0.6s both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '1.2rem',
              }}
            >
              📋
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              {userLang === 'fr' ? 'Récapitulatif de Votre Demande' : getText('yourRequest')}
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                borderRadius: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.75rem',
                    fontSize: '1rem',
                  }}
                >
                  🚢
                </div>
                <h4 style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                  {userLang === 'fr' ? "Détails de l'Expédition" : getText('shipmentDetails')}
                </h4>
              </div>
              <div style={{ color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📍</span>
                  <strong>{formData.city || formData.origin}</strong> →{' '}
                  <strong>
                    {formData.destCity || formData.country},{' '}
                    {COUNTRIES.find((c) => c.code === formData.country)?.name}
                  </strong>
                </p>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🚛</span>
                  {userLang === 'fr' ? 'Mode' : getText('mode')}:&nbsp;
                  <strong>
                    {getText(
                      formData.mode === 'Unsure'
                        ? 'unsureShipping'
                        : formData.mode === 'Sea Freight'
                          ? 'seaFreight'
                          : formData.mode === 'Air Freight'
                            ? 'airFreight'
                            : formData.mode === 'Rail Freight'
                              ? 'railFreight'
                              : formData.mode === 'Express'
                                ? 'express'
                                : 'mode'
                    )}
                  </strong>
                </p>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📦</span>
                  <strong>{formData.loads.length}</strong>&nbsp;
                  {formData.loads.length === 1
                    ? userLang === 'fr'
                      ? 'expédition'
                      : getText('shipment')
                    : userLang === 'fr'
                      ? 'expéditions'
                      : getText('shipments')}
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '1.5rem',
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                borderRadius: '1rem',
                border: '1px solid rgba(59, 130, 246, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.75rem',
                    fontSize: '1rem',
                  }}
                >
                  👤
                </div>
                <h4 style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                  {userLang === 'fr' ? 'Coordonnées' : getText('contactDetails')}
                </h4>
              </div>
              <div style={{ color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>👨‍💼</span>
                  <strong>
                    {formData.firstName} {formData.lastName}
                  </strong>
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
                    <strong>
                      {formData.phoneCountryCode} {formData.phone}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="next-steps"
          style={{
            marginBottom: '3rem',
            padding: '2.5rem',
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
            borderRadius: '1.5rem',
            border: '2px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)',
            animation: 'slideInUp 0.8s ease-out 0.8s both',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          ></div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '1.5rem',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              }}
            >
              ⏱️
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              {userLang === 'fr' ? 'Prochaines Étapes' : getText('nextSteps')}
            </h3>
          </div>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '24px',
                top: '40px',
                bottom: '40px',
                width: '3px',
                background: 'linear-gradient(to bottom, #10b981 0%, #3b82f6 50%, #94a3b8 100%)',
                borderRadius: '2px',
                opacity: 0.3,
              }}
            ></div>
            <div style={{ display: 'grid', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transform: 'translateX(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
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
                    border: '3px solid white',
                  }}
                >
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {userLang === 'fr' ? 'Demande reçue' : getText('step1')}
                  </div>
                  <div style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '500' }}>
                    {userLang === 'fr' ? 'Maintenant' : getText('step1Time')}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  transform: 'translateX(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
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
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {userLang === 'fr' ? 'Analyse et cotation' : getText('step2')}
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: '500' }}>
                    {userLang === 'fr' ? 'Sous 4h ouvrées' : getText('step2Time')}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  opacity: 0.8,
                }}
              >
                <div
                  style={{
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
                    border: '3px solid white',
                  }}
                >
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#64748b',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {userLang === 'fr' ? 'Contact commercial' : getText('step3')}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                    {userLang === 'fr' ? 'Sous 24h' : getText('step3Time')}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  opacity: 0.8,
                }}
              >
                <div
                  style={{
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
                    border: '3px solid white',
                  }}
                >
                  4
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#64748b',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {userLang === 'fr' ? 'Devis détaillé' : getText('step4')}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                    {userLang === 'fr' ? 'Sous 48h' : getText('step4Time')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="company-info"
          style={{
            marginBottom: '2rem',
            padding: '3rem',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 95, 70, 0.05) 100%)',
            borderRadius: '2rem',
            border: '2px solid rgba(16, 185, 129, 0.15)',
            boxShadow: '0 15px 35px rgba(16, 185, 129, 0.1)',
            animation: 'slideInUp 0.8s ease-out 1s both',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          ></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '2rem',
                  boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
                }}
              >
                🚢
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
                {userLang === 'fr'
                  ? 'À Propos de SINO Shipping & FS International'
                  : getText('aboutSino')}
              </h3>
            </div>
            <p
              style={{
                color: '#6b7280',
                fontSize: '1.2rem',
                textAlign: 'center',
                marginBottom: '3rem',
                maxWidth: '800px',
                margin: '0 auto 3rem auto',
                lineHeight: '1.7',
                fontWeight: '300',
              }}
            >
              {userLang === 'fr'
                ? 'Votre demande est entre de bonnes mains'
                : getText('aboutSubtitle')}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0.75rem',
                }}
              >
                <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  🇫🇷 SINO Shipping (2018)
                </h4>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {userLang === 'fr'
                    ? "SINO Shipping, lancée en 2018 par des entrepreneurs français, est devenue une marque de FS International en 2021. Ce partenariat combine l'approche occidentale centrée client avec une expertise locale chinoise approfondie."
                    : getText('sinoDescription')}
                </p>
              </div>
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0.75rem',
                }}
              >
                <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  🇭🇰 FS International (1989)
                </h4>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {userLang === 'fr'
                    ? "FS International, fondée à Hong Kong en septembre 1989, est l'un des noms les plus fiables en logistique et transport global dans sa région."
                    : getText('fsDescription')}
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    🎯
                  </div>
                  <h4
                    style={{
                      color: '#1f2937',
                      margin: 0,
                      fontSize: '1.3rem',
                      fontWeight: '700',
                    }}
                  >
                    {getText('ourExpertise')}
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      🚢
                    </div>
                    <span style={{ color: '#374151', fontWeight: '500', lineHeight: '1.4' }}>
                      {userLang === 'fr'
                        ? 'Transport maritime, aérien, ferroviaire et multimodal'
                        : getText('expertise1')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      📦
                    </div>
                    <span style={{ color: '#374151', fontWeight: '500', lineHeight: '1.4' }}>
                      {userLang === 'fr'
                        ? 'Solutions e-commerce (Amazon FBA, dropshipping)'
                        : getText('expertise2')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      🔍
                    </div>
                    <span style={{ color: '#374151', fontWeight: '500', lineHeight: '1.4' }}>
                      {userLang === 'fr' ? 'Sourcing et contrôle qualité' : getText('expertise3')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      📋
                    </div>
                    <span style={{ color: '#374151', fontWeight: '500', lineHeight: '1.4' }}>
                      {userLang === 'fr' ? 'Services logistiques complets' : getText('expertise4')}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  📊 {userLang === 'fr' ? 'Notre Impact en Chiffres' : getText('impactInNumbers')}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {userLang === 'fr'
                    ? "Offrir l'excellence en Chine avec des résultats prouvés et un service de confiance"
                    : getText('impactDescription')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>
                      55,000+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? 'Clients Satisfaits' : getText('satisfiedCustomers')}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>
                      4.8/5
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? 'Satisfaction Client' : getText('customerSatisfaction')}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>
                      400+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? "Membres de l'Équipe" : getText('teamMembers')}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>
                      140,000+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? 'Volume Maritime TEU' : getText('oceanVolume')}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>8</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? 'Bureaux en Chine' : getText('officesInChina')}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#10b981' }}>
                      519,000+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {userLang === 'fr' ? 'M² Installations CFS' : getText('cfsFacilities')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.75rem',
              }}
            >
              <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>
                🌍 {userLang === 'fr' ? 'Réseau Mondial' : getText('globalNetwork')}
              </h4>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {userLang === 'fr'
                  ? 'Bureaux stratégiques dans les hubs logistiques clés :'
                  : getText('networkDescription')}
              </p>
              <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.6' }}>
                <p>
                  <strong>
                    🇨🇳{' '}
                    {userLang === 'fr'
                      ? 'Chine : Shanghai, Shenzhen, Guangzhou, Ningbo, Tianjin, Qingdao, Xiamen'
                      : getText('chinaOffices')}
                  </strong>
                </p>
                <p>
                  <strong>
                    🇭🇰{' '}
                    {userLang === 'fr'
                      ? 'Hong Kong : 1er étage, Bloc C, Sea View Estate, 8 Watson Road, North Point'
                      : getText('hkOffice')}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="contact-support"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <h4 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1rem' }}>
              ❓ {userLang === 'fr' ? "Besoin d'Aide ?" : getText('needHelp')}
            </h4>
            {userLang === 'fr' ? (
              <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.8 }}>
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.25rem 0',
                  }}
                >
                  <span>👥</span>
                  <span>Communauté WhatsApp:</span>
                  <strong>
                    <a
                      href="https://chat.whatsapp.com/EcOPbD18vFxHTVjECQVsRE"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#0ea5e9',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      WhatsApp
                    </a>
                  </strong>
                </p>
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.25rem 0',
                  }}
                >
                  <span>📧</span>
                  <span>Email:</span>
                  <strong>
                    <a
                      href="mailto:info@sino-shipping.com"
                      style={{
                        color: '#0ea5e9',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      info@sino-shipping.com
                    </a>
                  </strong>
                </p>
                <p>⏰ available: 9h-18h (Heure de Chine)</p>
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.25rem 0',
                  }}
                >
                  <span>👥</span>
                  <span>{getText('community')}:</span>
                  <strong>
                    <a
                      href="https://chat.whatsapp.com/EcOPbD18vFxHTVjECQVsRE"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#0ea5e9',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      WhatsApp
                    </a>
                  </strong>
                </p>
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.25rem 0',
                  }}
                >
                  <span>📧</span>
                  <span>{getText('contactEmail')}:</span>
                  <strong>
                    <a
                      href="mailto:info@sino-shipping.com"
                      style={{
                        color: '#0ea5e9',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      info@sino-shipping.com
                    </a>
                  </strong>
                </p>
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.25rem 0',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>⏰</span>
                  <span>
                    {getText('available')}: {getText('businessHours')}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <h4 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1rem' }}>
              🔗 {userLang === 'fr' ? 'Nos Sites Web' : getText('websites')}
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#374151' }}>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🌐</span>
                <strong>
                  <a
                    href="https://sino-shipping.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    sino-shipping.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – Global freight forwarder
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🇭🇰</span>
                <strong>
                  <a
                    href="https://fschina.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    fschina.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – FS International (HK)
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🇪🇸</span>
                <strong>
                  <a
                    href="https://es.sino-shipping.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    es.sino-shipping.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – SINO Shipping (ES)
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🧩</span>
                <strong>
                  <a
                    href="https://moreplusfsi.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    moreplusfsi.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – MorePlus (Sourcing)
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🧭</span>
                <strong>
                  <a
                    href="https://eaanetwork.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    eaanetwork.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – EAA Network
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🤝</span>
                <strong>
                  <a
                    href="https://can-qianhai.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    can-qianhai.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – CAN Alliance
                </span>
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.25rem 0',
                }}
              >
                <span>🚢</span>
                <strong>
                  <a
                    href="https://mcc-qianhai.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    mcc-qianhai.com
                  </a>
                </strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  – Export to China
                </span>
              </p>
            </div>
            <h4 style={{ color: '#1f2937', marginTop: '1.5rem', marginBottom: '1rem' }}>
              ⚡ {userLang === 'fr' ? 'Actions Rapides' : getText('actions')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const resetMessage =
                    userLang === 'fr'
                      ? 'Nouveau formulaire prêt !'
                      : userLang === 'es'
                        ? '¡Nuevo formulario listo!'
                        : userLang === 'de'
                          ? 'Neues Formular bereit!'
                          : userLang === 'it'
                            ? 'Nuovo modulo pronto!'
                            : userLang === 'nl'
                              ? 'Nieuw formulier klaar!'
                              : userLang === 'zh'
                                ? '新表单已准备!'
                                : userLang === 'ar'
                                  ? 'استمارة جديدة جاهزة!'
                                  : userLang === 'pt'
                                    ? 'Novo formulário pronto!'
                                    : userLang === 'tr'
                                      ? 'Yeni form hazır!'
                                      : userLang === 'ru'
                                        ? 'Новая форма готова!'
                                        : 'New form ready!';
                  try {
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
                    });
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
                      destPort: null,
                      firstName: null,
                      lastName: null,
                      companyName: null,
                      shipperType: null,
                      goodsValue: null,
                      destLocationType: null,
                    });
                    setCurrentStep(1);
                    setSubmissionId('');
                    showToast(resetMessage);
                  } catch {
                    // Silent fail with fallback toast
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
                  outline: 'none',
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
                ➕ {userLang === 'fr' ? 'Faire une autre demande' : getText('newRequest')}
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>
            🙏 {userLang === 'fr' ? 'Merci pour votre confiance !' : getText('thankYouTitle')}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            {userLang === 'fr'
              ? 'Votre demande sera traitée avec le plus grand soin par nos experts en transport international.'
              : getText('thankYouMessage')}
          </p>
        </div>
      </div>
    </FormStep>
  );
};

export default StepConfirmation;
