import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/context/useQuoteForm';
import { CheckCircle, Info } from 'lucide-react';

const StepGoodsDetails: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,
    fieldValid,
    userLang,
    getText,
    handleInputChange,
    step5SubStep,

    // Currency (from context)
    currencySearch,
    setCurrencySearch,
    isCurrencyListVisible,
    setIsCurrencyListVisible,
    handleCurrencySelect,
  } = useQuoteForm();

  // Safe translator with fallback to English and a provided default
  const t = useCallback((key: string, fallback: string): string => getText(key, fallback), [getText]);

  // Local UI states for Step 5 dropdowns
  const [timingSearch, setTimingSearch] = useState('');
  const [isTimingListVisible, setIsTimingListVisible] = useState(false);
  const [requirementsSearch, setRequirementsSearch] = useState('');
  const [isRequirementsListVisible, setIsRequirementsListVisible] = useState(false);

  // Refs for dropdown DOM nodes
  const currencyListRef = useRef<HTMLDivElement>(null);
  const timingListRef = useRef<HTMLDivElement>(null);
  const requirementsListRef = useRef<HTMLDivElement>(null);

  // Options (copied from QuoteForm.tsx for component encapsulation)
  const CURRENCY_OPTIONS = useMemo(
    () => [
      { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
      { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
      { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
      { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
      { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
      { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
      { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    ],
    []
  );

  const TIMING_OPTIONS = useMemo(
    () => [
      {
        code: 'yes',
        name: 'Ready now',
        description: 'goods are available for immediate pickup',
        icon: '🟢',
      },
      { code: 'no_in_1_week', name: 'Within 1 week', description: 'currently preparing', icon: '🗓️' },
      {
        code: 'no_in_2_weeks',
        name: 'Within 2 weeks',
        description: 'production in progress',
        icon: '🗓️',
      },
      { code: 'no_in_1_month', name: 'Within 1 month', description: 'planning ahead', icon: '🗓️' },
      { code: 'no_date_set', name: 'Date not determined yet', description: '', icon: '❔' },
    ],
    []
  );

  const REQUIREMENTS_OPTIONS = useMemo(
    () => [
      { code: '', name: 'No special requirements', description: '', icon: '🟢' },
      { code: 'fragile', name: 'Fragile goods', description: 'handle with care', icon: '📦' },
      { code: 'temperature', name: 'Temperature controlled', description: '', icon: '🧊' },
      { code: 'urgent', name: 'Urgent/time-sensitive', description: '', icon: '🚀' },
      { code: 'insurance', name: 'High-value insurance required', description: '', icon: '💎' },
      {
        code: 'other',
        name: 'Other',
        description: t('pleaseSpecifyInRemarks', 'Please specify in remarks'),
        icon: '➕',
      },
    ],
    [t]
  );

  const cleanEmojiFromText = useCallback((text: string | undefined): string => {
    const safe = text ?? '';
    return safe.replace(/^\p{Extended_Pictographic}+\s*/u, '').trim();
  }, []);

  const handleTimingSelect = (timingCode: string) => {
    const timing = TIMING_OPTIONS.find((t) => t.code === timingCode);
    setFormData({
      ...formData,
      areGoodsReady: timingCode,
    });

    let translatedName = '';
    switch (timingCode) {
      case 'yes':
        translatedName = cleanEmojiFromText(
          t('readyNow', 'Ready now - goods are available for immediate pickup')
        );
        break;
      case 'no_in_1_week':
        translatedName = cleanEmojiFromText(
          t('readyIn1Week', 'Within 1 week - currently preparing')
        );
        break;
      case 'no_in_2_weeks':
        translatedName = cleanEmojiFromText(
          t('readyIn2Weeks', 'Within 2 weeks - production in progress')
        );
        break;
      case 'no_in_1_month':
        translatedName = cleanEmojiFromText(t('readyIn1Month', 'Within 1 month - planning ahead'));
        break;
      case 'no_date_set':
        translatedName = cleanEmojiFromText(t('dateNotSet', 'Date not determined yet'));
        break;
    }
    setTimingSearch(timing ? `${timing.icon}  ${translatedName}` : timingCode);
    setIsTimingListVisible(false);
  };

  const handleRequirementsSelect = (requirementCode: string) => {
    const requirement = REQUIREMENTS_OPTIONS.find((r) => r.code === requirementCode);
    setFormData({
      ...formData,
      specialRequirements: requirementCode,
    });

    let translatedName = '';
    switch (requirementCode) {
      case '':
        translatedName = t('noSpecialRequirements', 'No special requirements');
        break;
      case 'fragile':
        translatedName = cleanEmojiFromText(t('fragileGoods', 'Fragile goods - handle with care'));
        break;
      case 'temperature':
        translatedName = cleanEmojiFromText(t('temperatureControlled', 'Temperature controlled'));
        break;
      case 'urgent':
        translatedName = cleanEmojiFromText(t('urgentTimeSensitive', 'Urgent/time-sensitive'));
        break;
      case 'insurance':
        translatedName = cleanEmojiFromText(
          t('highValueInsurance', 'High-value insurance required')
        );
        break;
      case 'other':
        translatedName = cleanEmojiFromText(t('otherSpecify', 'Other (please specify)'));
        break;
    }
    setRequirementsSearch(
      requirement
        ? `${requirement.icon}  ${translatedName}`
        : t('noSpecialRequirements', 'No special requirements')
    );
    setIsRequirementsListVisible(false);
  };

  // Initialize display values when form data changes
  useEffect(() => {
    // Currency selection text
    const currency = CURRENCY_OPTIONS.find((c) => c.code === formData.goodsCurrency);
    if (currency) setCurrencySearch(`${currency.flag} ${currency.code}`);

    // Timing text
    const timing = TIMING_OPTIONS.find((t) => t.code === formData.areGoodsReady);
    if (timing) {
      let translatedName = '';
      switch (timing.code) {
        case 'yes':
          translatedName = cleanEmojiFromText(
            t('readyNow', 'Ready now - goods are available for immediate pickup')
          );
          break;
        case 'no_in_1_week':
          translatedName = cleanEmojiFromText(
            t('readyIn1Week', 'Within 1 week - currently preparing')
          );
          break;
        case 'no_in_2_weeks':
          translatedName = cleanEmojiFromText(
            t('readyIn2Weeks', 'Within 2 weeks - production in progress')
          );
          break;
        case 'no_in_1_month':
          translatedName = cleanEmojiFromText(
            t('readyIn1Month', 'Within 1 month - planning ahead')
          );
          break;
        case 'no_date_set':
          translatedName = cleanEmojiFromText(t('dateNotSet', 'Date not determined yet'));
          break;
      }
      setTimingSearch(`${timing.icon}  ${translatedName}`);
    }

    // Requirements text
    const requirement = REQUIREMENTS_OPTIONS.find((r) => r.code === formData.specialRequirements);
    if (requirement) {
      let translatedName = '';
      switch (requirement.code) {
        case '':
          translatedName = t('noSpecialRequirements', 'No special requirements');
          break;
        case 'fragile':
          translatedName = cleanEmojiFromText(
            t('fragileGoods', 'Fragile goods - handle with care')
          );
          break;
        case 'temperature':
          translatedName = cleanEmojiFromText(t('temperatureControlled', 'Temperature controlled'));
          break;
        case 'urgent':
          translatedName = cleanEmojiFromText(t('urgentTimeSensitive', 'Urgent/time-sensitive'));
          break;
        case 'insurance':
          translatedName = cleanEmojiFromText(
            t('highValueInsurance', 'High-value insurance required')
          );
          break;
        case 'other':
          translatedName = cleanEmojiFromText(t('otherSpecify', 'Other (please specify)'));
          break;
      }
      setRequirementsSearch(`${requirement.icon}  ${translatedName}`);
    }
  }, [
    formData.goodsCurrency,
    formData.areGoodsReady,
    formData.specialRequirements,
    userLang,
    t,
    cleanEmojiFromText,
    CURRENCY_OPTIONS,
    TIMING_OPTIONS,
    REQUIREMENTS_OPTIONS,
    setCurrencySearch,
  ]);

  // Click outside to close lists
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyListRef.current && !currencyListRef.current.contains(event.target as Node)) {
        setIsCurrencyListVisible(false);
      }
      if (timingListRef.current && !timingListRef.current.contains(event.target as Node)) {
        setIsTimingListVisible(false);
      }
      if (
        requirementsListRef.current &&
        !requirementsListRef.current.contains(event.target as Node)
      ) {
        setIsRequirementsListVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsCurrencyListVisible, setIsTimingListVisible, setIsRequirementsListVisible]);

  // Auto-position dropdowns
  useEffect(() => {
    const adjustDropdownPosition = (
      dropdown: HTMLElement | null,
      inputElement: HTMLElement | null
    ) => {
      if (!dropdown || !inputElement) return;
      const inputRect = inputElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 300;
      const spaceBelow = viewportHeight - inputRect.bottom - 20;
      const spaceAbove = inputRect.top - 20;
      const spaceRight = viewportWidth - inputRect.left;
      const spaceLeft = inputRect.right;
      dropdown.classList.remove('show-above', 'adjust-right', 'adjust-left');
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow)
        dropdown.classList.add('show-above');
      if (spaceRight < 300) dropdown.classList.add('adjust-right');
      else if (spaceLeft < 300) dropdown.classList.add('adjust-left');
      dropdown.style.setProperty('--dropdown-top', `${inputRect.bottom}px`);
    };

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

    const handleResize = () => {
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
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isCurrencyListVisible, isTimingListVisible, isRequirementsListVisible]);

  return (
    <FormStep
      isVisible={currentStep === 5}
      stepNumber={5}
      title={t('step5Title', 'Tell us about your goods')}
      emoji="📝"
    >
      {/* Sub-step indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '3rem',
          gap: '0.75rem',
          padding: '1.5rem 0',
        }}
      >
        {[1, 2, 3].map((step, index) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background:
                  step5SubStep >= step
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                color: step5SubStep >= step ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: '700',
                backdropFilter: 'blur(16px)',
                border:
                  step5SubStep >= step
                    ? '2px solid rgba(16, 185, 129, 0.3)'
                    : '2px solid rgba(107, 114, 128, 0.2)',
                boxShadow:
                  step5SubStep >= step
                    ? '0 8px 32px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(16, 185, 129, 0.2)'
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: step5SubStep === step ? 'scale(1.1)' : 'scale(1)',
                position: 'relative',
              }}
            >
              {step5SubStep > step ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step
              )}
              {step5SubStep === step && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #10b981, #3b82f6, #10b981)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 2s ease infinite',
                    zIndex: -1,
                  }}
                />
              )}
            </div>
            {index < 2 && (
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  borderRadius: '2px',
                  background:
                    step5SubStep > step + 1
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, rgba(229, 231, 235, 0.8), rgba(229, 231, 235, 0.4))',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {step5SubStep === step + 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: '100%',
                      background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                      animation: 'slide 1.5s ease-in-out infinite',
                    }}
                  />
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
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              {t('goodsValueDeclaration', 'Goods Value & Declaration')}
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: '0 0 2rem 0',
                textAlign: 'center',
              }}
            >
              {t(
                'goodsValueDescription',
                'Provide the commercial value for customs declaration and insurance purposes'
              )}
            </p>
          </div>

          <div className="form-control">
            <label htmlFor="goodsValue" className="label-text">
              {t('commercialValue', 'Commercial value of goods')}
            </label>
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
                  transition: 'all 0.3s ease',
                }}
              />
              <div
                className="currency-select"
                style={{ minWidth: '120px', margin: 0, position: 'relative' }}
              >
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
                  {CURRENCY_OPTIONS.map((currency) => (
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
            <div
              className="help-text"
              style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}
            >
              💡{' '}
              {t(
                'goodsValueHelp',
                'This value is used for customs declaration and insurance calculations'
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPersonalOrHazardous"
                checked={formData.isPersonalOrHazardous}
                onChange={(e) =>
                  setFormData({ ...formData, isPersonalOrHazardous: e.target.checked })
                }
              />
              <span>
                {t(
                  'personalOrHazardous',
                  'Personal effects or contains hazardous/restricted materials'
                )}
              </span>
            </label>
            <div
              className="help-text"
              style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}
            >
              ⚠️{' '}
              {t(
                'personalHazardousHelp',
                'Check this if shipping personal belongings or goods requiring special handling'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 2: Shipment Timing */}
      {step5SubStep === 2 && (
        <div className="shipment-timing-phase animate-slide-in">
          <div className="phase-header">
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              {t('shipmentReadiness', 'Shipment Readiness')}
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: '0 0 2rem 0',
                textAlign: 'center',
              }}
            >
              {t(
                'shipmentTimingDescription',
                'Help us plan your shipment timeline and provide accurate rates'
              )}
            </p>
          </div>

          <div className="form-control">
            <label htmlFor="areGoodsReady" className="label-text">
              {t('goodsReadyQuestion', 'When will your goods be ready for pickup?')}
            </label>
            <div className="timing-select" style={{ position: 'relative' }}>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={timingSearch || t('selectOption', 'Select an option...')}
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
                {TIMING_OPTIONS.map((timing) => (
                  <div
                    key={timing.code}
                    className={`port-option ${formData.areGoodsReady === timing.code ? 'selected' : ''}`}
                    onClick={() => handleTimingSelect(timing.code)}
                  >
                    <span className="port-icon">{timing.icon}</span>
                    <div className="port-info">
                      <span className="port-name">
                        {timing.code === 'yes' &&
                          cleanEmojiFromText(
                            t('readyNow', 'Ready now - goods are available for immediate pickup')
                          )}
                        {timing.code === 'no_in_1_week' &&
                          cleanEmojiFromText(
                            t('readyIn1Week', 'Within 1 week - currently preparing')
                          )}
                        {timing.code === 'no_in_2_weeks' &&
                          cleanEmojiFromText(
                            t('readyIn2Weeks', 'Within 2 weeks - production in progress')
                          )}
                        {timing.code === 'no_in_1_month' &&
                          cleanEmojiFromText(t('readyIn1Month', 'Within 1 month - planning ahead'))}
                        {timing.code === 'no_date_set' &&
                          cleanEmojiFromText(t('dateNotSet', 'Date not determined yet'))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {formData.areGoodsReady && <CheckCircle className="check-icon" />}
            <div
              className="help-text"
              style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}
            >
              ⏰ {t('timingHelp', 'Accurate timing helps us provide the most competitive rates')}
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 3: Additional Information */}
      {step5SubStep === 3 && (
        <div className="additional-info-phase animate-slide-in">
          <div className="phase-header">
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              {t('additionalDetails', 'Additional Details (Optional)')}
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: '0 0 2rem 0',
                textAlign: 'center',
              }}
            >
              {t(
                'additionalDetailsDescription',
                'Provide any special requirements or additional information'
              )}
            </p>
          </div>

          <div className="form-control">
            <label htmlFor="goodsDescription" className="label-text">
              {t('goodsDescription', 'Brief description of goods (optional)')}
            </label>
            <input
              type="text"
              name="goodsDescription"
              id="goodsDescription"
              placeholder={t(
                'goodsDescriptionPlaceholder',
                'e.g., Electronics, Furniture, Clothing, Machinery...'
              )}
              value={formData.goodsDescription || ''}
              onChange={handleInputChange}
              className="input glassmorphism"
            />
            <div
              className="help-text"
              style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}
            >
              💡 {t('goodsDescriptionHelp', 'Helps us ensure proper handling and documentation')}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="specialRequirements" className="label-text">
              {t('specialRequirements', 'Special handling requirements (optional)')}
            </label>
            <div className="requirements-select" style={{ position: 'relative' }}>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={
                    requirementsSearch || t('noSpecialRequirements', 'No special requirements')
                  }
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
                {REQUIREMENTS_OPTIONS.map((requirement) => (
                  <div
                    key={requirement.code}
                    className={`port-option ${formData.specialRequirements === requirement.code ? 'selected' : ''}`}
                    onClick={() => handleRequirementsSelect(requirement.code)}
                  >
                    <span className="port-icon">{requirement.icon}</span>
                    <div className="port-info">
                      <span className="port-name">
                        {requirement.code === '' &&
                          t('noSpecialRequirements', 'No special requirements')}
                        {requirement.code === 'fragile' &&
                          cleanEmojiFromText(t('fragileGoods', 'Fragile goods - handle with care'))}
                        {requirement.code === 'temperature' &&
                          cleanEmojiFromText(t('temperatureControlled', 'Temperature controlled'))}
                        {requirement.code === 'urgent' &&
                          cleanEmojiFromText(t('urgentTimeSensitive', 'Urgent/time-sensitive'))}
                        {requirement.code === 'insurance' &&
                          cleanEmojiFromText(
                            t('highValueInsurance', 'High-value insurance required')
                          )}
                        {requirement.code === 'other' &&
                          cleanEmojiFromText(t('otherSpecify', 'Other (please specify)'))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="info-banner"
            style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <Info size={20} style={{ color: '#3b82f6', marginTop: '0.1rem', flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
              <strong style={{ color: '#3b82f6' }}>
                {t('rateValidityTitle', 'Rate Validity Notice:')}
              </strong>
              <br />
              {t(
                'rateValidityText',
                'Quoted rates are valid until the expiry date shown on each quote. If your goods are not ready for pickup by this date, rates may be subject to change based on current market conditions.'
              )}
            </div>
          </div>
        </div>
      )}
    </FormStep>
  );
};

export default memo(StepGoodsDetails);
