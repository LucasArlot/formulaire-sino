import React, { memo } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/QuoteFormContext';
import { Truck, Ship, Plane, TrainFront, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

const StepMode: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,

    setFieldValid,
    userLang,
    I18N_TEXT
  } = useQuoteForm();

  const RAIL_FREIGHT_COUNTRIES = ['DE', 'AT', 'CZ', 'HU', 'PL', 'NL', 'BE', 'FR', 'IT', 'LU'];

  // Translation for mode names, descriptions and benefits
  const MODE_INFO: Record<string, Record<string, {name: string, desc: string, benefits: string}>> = {
    en: {
      Sea: { name: 'Sea Freight', desc: 'Economical, 30-45 days', benefits: 'Best for large, heavy shipments' },
      Rail: { name: 'Rail Freight', desc: 'Cost-effective, 15-25 days', benefits: 'Eco-friendly option' },
      Air: { name: 'Air Freight', desc: 'Fast, 7-10 days', benefits: 'Ideal for urgent shipments' },
      Express: { name: 'Express', desc: 'Fastest, 3-5 days', benefits: 'Door-to-door service' }
    },
    fr: {
      Sea: { name: 'Fret maritime', desc: 'Économique, 30-45 jours', benefits: 'Idéal pour les expéditions volumineuses et lourdes' },
      Rail: { name: 'Fret ferroviaire', desc: 'Rentable, 15-25 jours', benefits: 'Option écologique' },
      Air: { name: 'Fret aérien', desc: 'Rapide, 7-10 jours', benefits: 'Parfait pour les envois urgents' },
      Express: { name: 'Express', desc: 'Le plus rapide, 3-5 jours', benefits: 'Service porte-à-porte' }
    },
    de: {
      Sea: { name: 'Seefracht', desc: 'Wirtschaftlich, 30-45 Tage', benefits: 'Ideal für große, schwere Sendungen' },
      Rail: { name: 'Schienengüterverkehr', desc: 'Kosteneffektiv, 15-25 Tage', benefits: 'Umweltfreundliche Option' },
      Air: { name: 'Luftfracht', desc: 'Schnell, 7-10 Tage', benefits: 'Ideal für eilige Sendungen' },
      Express: { name: 'Express', desc: 'Am schnellsten, 3-5 Tage', benefits: 'Tür-zu-Tür-Service' }
    },
    es: {
      Sea: { name: 'Transporte marítimo', desc: 'Económico, 30-45 días', benefits: 'Mejor para cargas grandes y pesadas' },
      Rail: { name: 'Transporte ferroviario', desc: 'Rentable, 15-25 días', benefits: 'Opción ecológica' },
      Air: { name: 'Transporte aéreo', desc: 'Rápido, 7-10 días', benefits: 'Ideal para envíos urgentes' },
      Express: { name: 'Express', desc: 'El más rápido, 3-5 días', benefits: 'Servicio puerta a puerta' }
    },
    it: {
      Sea: { name: 'Trasporto marittimo', desc: 'Economico, 30-45 giorni', benefits: 'Ideale per spedizioni grandi e pesanti' },
      Rail: { name: 'Trasporto ferroviario', desc: 'Conveniente, 15-25 giorni', benefits: 'Opzione ecologica' },
      Air: { name: 'Trasporto aereo', desc: 'Veloce, 7-10 giorni', benefits: 'Ideale per spedizioni urgenti' },
      Express: { name: 'Express', desc: 'Il più veloce, 3-5 giorni', benefits: 'Servizio porta a porta' }
    },
    nl: {
      Sea: { name: 'Zeevracht', desc: 'Economisch, 30-45 dagen', benefits: 'Beste voor grote, zware zendingen' },
      Rail: { name: 'Goederentreinvervoer', desc: 'Kosteneffectief, 15-25 dagen', benefits: 'Milieuvriendelijke optie' },
      Air: { name: 'Luchtvracht', desc: 'Snel, 7-10 dagen', benefits: 'Ideaal voor spoedzendingen' },
      Express: { name: 'Express', desc: 'Snelst, 3-5 dagen', benefits: 'Deur-tot-deur service' }
    },
    zh: {
      Sea: { name: '海运', desc: '经济实惠，30-45天', benefits: '适合大型重货' },
      Rail: { name: '铁路运输', desc: '成本效益高，15-25天', benefits: '环保选项' },
      Air: { name: '空运', desc: '快速，7-10天', benefits: '适合紧急货物' },
      Express: { name: '快递', desc: '最快，3-5天', benefits: '门到门服务' }
    },
    ar: {
      Sea: { name: 'الشحن البحري', desc: 'اقتصادي، 30-45 يوماً', benefits: 'الأفضل للشحنات الكبيرة والثقيلة' },
      Rail: { name: 'الشحن بالقطار', desc: 'فعّال من حيث التكلفة، 15-25 يوماً', benefits: 'خيار صديق للبيئة' },
      Air: { name: 'الشحن الجوي', desc: 'سريع، 7-10 أيام', benefits: 'مثالي للشحنات العاجلة' },
      Express: { name: 'الشحن السريع', desc: 'الأسرع، 3-5 أيام', benefits: 'خدمة من الباب إلى الباب' }
    },
    pt: {
      Sea: { name: 'Transporte marítimo', desc: 'Econômico, 30-45 dias', benefits: 'Melhor para cargas grandes e pesadas' },
      Rail: { name: 'Transporte ferroviário', desc: 'Custo-efetivo, 15-25 dias', benefits: 'Opção ecológica' },
      Air: { name: 'Transporte aéreo', desc: 'Rápido, 7-10 dias', benefits: 'Ideal para envios urgentes' },
      Express: { name: 'Express', desc: 'O mais rápido, 3-5 dias', benefits: 'Serviço porta a porta' }
    },
    tr: {
      Sea: { name: 'Denizyolu taşımacılığı', desc: 'Ekonomik, 30-45 gün', benefits: 'Büyük, ağır yükler için en iyisi' },
      Rail: { name: 'Demiryolu taşımacılığı', desc: 'Maliyet etkin, 15-25 gün', benefits: 'Çevre dostu seçenek' },
      Air: { name: 'Havayolu taşımacılığı', desc: 'Hızlı, 7-10 gün', benefits: 'Acil gönderiler için ideal' },
      Express: { name: 'Ekspres', desc: 'En hızlı, 3-5 gün', benefits: 'Kapıdan kapıya hizmet' }
    },
    ru: {
      Sea: { name: 'Морские перевозки', desc: 'Экономично, 30-45 дней', benefits: 'Лучший выбор для крупных тяжёлых грузов' },
      Rail: { name: 'Железнодорожные перевозки', desc: 'Выгодно, 15-25 дней', benefits: 'Экологичный вариант' },
      Air: { name: 'Авиаперевозки', desc: 'Быстро, 7-10 дней', benefits: 'Идеально для срочных отправок' },
      Express: { name: 'Экспресс', desc: 'Самый быстрый, 3-5 дней', benefits: 'Доставка от двери до двери' }
    },
    // Fallback: other languages default to English for now
  };

  const tMode = (modeId: string) => MODE_INFO[userLang]?.[modeId] || MODE_INFO['en'][modeId];

  const shippingModes = useMemo(() => ([
    { id: 'Sea', ...tMode('Sea'), icon: Ship, condition: true },
    { id: 'Rail', ...tMode('Rail'), icon: TrainFront, condition: RAIL_FREIGHT_COUNTRIES.includes(formData.country) },
    { id: 'Air', ...tMode('Air'), icon: Plane, condition: true },
    { id: 'Express', ...tMode('Express'), icon: Truck, condition: true }
  ]), [userLang, formData.country]);



  const handleModeSelect = (modeId: string) => {
    setFormData(prev => ({ ...prev, mode: modeId }));
    setFieldValid(prev => ({ ...prev, mode: true }));
  };

  // Local translation fallback for Step 2 header texts
  const STEP2_TEXT: Record<string, { choose: string; desc: string; rail: string }> = {
    en: {
      choose: 'Choose your preferred shipping method',
      desc: 'Different shipping modes offer various trade-offs between cost, speed, and reliability.',
      rail: 'Rail freight is available for your destination.'
    },
    fr: {
      choose: 'Choisissez votre méthode d\'expédition préférée',
      desc: 'Les différents modes d\'expédition offrent divers compromis entre coût, rapidité et fiabilité.',
      rail: 'Le fret ferroviaire est disponible pour votre destination.'
    },
    de: {
      choose: 'Wählen Sie Ihre bevorzugte Versandmethode',
      desc: 'Verschiedene Versandarten bieten unterschiedliche Kompromisse zwischen Kosten, Geschwindigkeit und Zuverlässigkeit.',
      rail: 'Schienengüterverkehr ist für Ihr Ziel verfügbar.'
    },
    es: {
      choose: 'Elija su método de envío preferido',
      desc: 'Los distintos modos de envío ofrecen diferentes compensaciones entre costo, rapidez y fiabilidad.',
      rail: 'El transporte ferroviario está disponible para su destino.'
    },
    it: {
      choose: 'Scegli il tuo metodo di spedizione preferito',
      desc: 'I diversi metodi di spedizione offrono vari compromessi tra costo, velocità e affidabilità.',
      rail: 'Il trasporto ferroviario è disponibile per la tua destinazione.'
    },
    nl: {
      choose: 'Kies uw voorkeur verzendmethode',
      desc: 'Verschillende verzendmethoden bieden verschillende afwegingen tussen kosten, snelheid en betrouwbaarheid.',
      rail: 'Goederentreinvervoer is beschikbaar voor uw bestemming.'
    },
    zh: {
      choose: '选择您偏好的运输方式',
      desc: '不同的运输方式在成本、速度和可靠性之间提供不同的权衡。',
      rail: '您的目的地可使用铁路运输。'
    },
    ar: {
      choose: 'اختر طريقة الشحن المفضلة لديك',
      desc: 'توفر طرق الشحن المختلفة موازنةً مختلفة بين التكلفة والسرعة والموثوقية.',
      rail: 'الشحن بالقطار متاح لوجهتك.'
    },
    pt: {
      choose: 'Escolha seu método de envio preferido',
      desc: 'Diferentes modos de envio oferecem diferentes compensações entre custo, velocidade e confiabilidade.',
      rail: 'O transporte ferroviário está disponível para o seu destino.'
    },
    tr: {
      choose: 'Tercih ettiğiniz gönderim yöntemini seçin',
      desc: 'Farklı gönderim yöntemleri maliyet, hız ve güvenilirlik arasında çeşitli dengeler sunar.',
      rail: 'Varış noktanız için demir yolu taşımacılığı mevcuttur.'
    },
    ru: {
      choose: 'Выберите предпочитаемый способ доставки',
      desc: 'Различные способы доставки предлагают разные компромиссы между стоимостью, скоростью и надежностью.',
      rail: 'Железнодорожные перевозки доступны для вашего направления.'
    }
  };

  return (
    <FormStep isVisible={currentStep === 2} stepNumber={2} title={(I18N_TEXT as any)[userLang]?.step2Title || 'Shipping Mode'} emoji="🚢">
      <div className="step-2-container">
        {/* Guidance header */}
        <div className="shipping-options-guidance-phase">
          <div className="phase-header">
            <h3 className="phase-header-title">
              {STEP2_TEXT[userLang]?.choose || 'Choose your preferred shipping method'}
            </h3>
            <p className="phase-header-subtitle">
              {STEP2_TEXT[userLang]?.desc || 'Different modes offer various trade-offs between cost, speed, and reliability.'}
              {RAIL_FREIGHT_COUNTRIES.includes(formData.country) && (
                <span className="success-text"> {STEP2_TEXT[userLang]?.rail || 'Rail freight is available for your destination.'}</span>
              )}
            </p>
          </div>
        </div>

        {/* Modes */}
        <div className={`shipping-modes ${RAIL_FREIGHT_COUNTRIES.includes(formData.country) ? 'four-options' : 'three-options'}`}>
          {shippingModes.filter(m => m.id !== 'Rail' || m.condition).map(mode => (
            <div
              key={mode.id}
              className={`mode-option ${formData.mode === mode.id ? 'selected' : ''}`}
              data-mode={mode.id}
              onClick={() => handleModeSelect(mode.id)}
            >
              <mode.icon size={28} />
              <span className="mode-name">{mode.name}</span>
              <p className="mode-desc">{mode.desc}</p>
              {mode.benefits && <div className="mode-additional-info">{mode.benefits}</div>}
            </div>
          ))}
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
              {(I18N_TEXT as any)[userLang]?.unsureAboutChoice || 'Unsure about your choice?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }}></div>
          </div>
        </div>

        {/* Not sure yet */}
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
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="mode-name">{(I18N_TEXT as any)[userLang]?.unsureShipping || "I'm not sure yet"}</span>
            <p className="mode-desc">{(I18N_TEXT as any)[userLang]?.unsureShippingDesc || 'Let the experts help'}</p>
            <div className="mode-additional-info" style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.5rem', fontWeight: '500' }}>
              {(I18N_TEXT as any)[userLang]?.unsureShippingBenefits || 'Professional guidance'}
            </div>
          </div>


        </div>

        {/* Contextual guidance based on selection */}
        {formData.mode && (
          <div className="selection-feedback" style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', border: '2px solid rgba(16, 185, 129, 0.3)', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 600, lineHeight: '1.4', flex: 1 }}>
                {formData.mode === 'Sea' && (I18N_TEXT as any)[userLang]?.seaFeedback}
                {formData.mode === 'Rail' && (I18N_TEXT as any)[userLang]?.railFeedback}
                {formData.mode === 'Air' && (I18N_TEXT as any)[userLang]?.airFeedback}
                {formData.mode === 'Express' && (I18N_TEXT as any)[userLang]?.expressFeedback}
                {formData.mode === 'Unsure' && (I18N_TEXT as any)[userLang]?.unsureShippingFeedback}
              </span>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default memo(StepMode); 