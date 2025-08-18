import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/QuoteFormContext';
import { Warehouse, Ship, Building2, Home, MapPin, XCircle, CheckCircle } from 'lucide-react';

// Origin country is handled in context (assumed CN)

const StepOrigin: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,

    setFieldValid,
    getText,
    userLang,
    getLocationTypeName,
    getLocationTypeDescription,
    getTranslatedPortNameLocal,
    getTranslatedCountryName,
    // Origin context states/handlers
    originPortSearch,
    setOriginPortSearch,
    isOriginPortListVisible,
    setIsOriginPortListVisible,
    getFilteredOriginPorts,
    handleOriginLocationTypeSelect,
    handleOriginPortSelect,
  } = useQuoteForm();

  const originListRef = useRef<HTMLDivElement>(null);
  const originInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string, fallback: string): string => getText(key, fallback);
  // Close origin dropdowns on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!originListRef.current?.contains(target) && !originInputRef.current?.contains(target)) {
        setIsOriginPortListVisible(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [setIsOriginPortListVisible]);

  // -----------------------
  // Origin dropdown state is provided by context
  // -----------------------

  const filteredPorts = useMemo(() => getFilteredOriginPorts(), [getFilteredOriginPorts]);

  // -----------------------
  // Handlers
  // -----------------------
  const handleLocationTypeSelect = useCallback(
    (typeId: string) => {
      handleOriginLocationTypeSelect(typeId);
    },
    [handleOriginLocationTypeSelect]
  );

  const handlePortSelect = useCallback(
    (code: string) => {
      handleOriginPortSelect(code);
    },
    [handleOriginPortSelect]
  );

  const LOCATION_TYPES = useMemo(
    () => [
      { id: 'factory', icon: Warehouse },
      { id: 'port', icon: Ship },
      { id: 'business', icon: Building2 },
      { id: 'residential', icon: Home },
    ],
    []
  );

  const selectedType = formData.locationType;

  // Validation helpers
  const detailsValid = useMemo(() => {
    if (!selectedType) return false;
    if (selectedType === 'port') return !!formData.origin;
    return !!(formData.city && formData.zipCode);
  }, [selectedType, formData.origin, formData.city, formData.zipCode]);

  return (
    <FormStep
      isVisible={currentStep === 3}
      stepNumber={3}
      title={`${t('step3Title', 'Select pickup location in China')}`}
      emoji="🇨🇳"
    >
      <div className="step-3-container">
        {/* Phase 1 – type selection */}
        <div className="location-type-selection-phase">
          <div className="phase-header">
            <h3
              className="phase-header-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <span className={selectedType ? 'step-indicator completed' : 'step-indicator'}>
                1
              </span>
              {t('selectPickupLocationType', 'Sélectionnez votre type de lieu de collecte')}
            </h3>
            <p
              className="phase-header-subtitle"
              style={{ color: '#6b7280', marginBottom: '1.5rem' }}
            >
              {t(
                'pickupLocationDescription',
                'Choisissez où nous devons collecter vos marchandises en Chine'
              )}
            </p>
          </div>
          <div className="location-types">
            {LOCATION_TYPES.map((type) => (
              <div
                key={type.id}
                role="button"
                tabIndex={0}
                data-id={type.id}
                className={`location-type-option ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => handleLocationTypeSelect(type.id)}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  e.key === 'Enter' && handleLocationTypeSelect(type.id)
                }
              >
                <type.icon size={24} />
                <span>{getLocationTypeName(type.id, userLang)}</span>
                <p className="location-desc">{getLocationTypeDescription(type.id, userLang)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
            margin: '2rem 0',
          }}
        ></div>

        {/* Phase 2 – details */}
        {selectedType && (
          <div className="location-details-phase" style={{ marginTop: '2rem' }}>
            {/* Header micro-step 2 */}
            <div className="phase-header" style={{ marginBottom: '1.5rem' }}>
              <h3
                className="phase-header-title"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span className={detailsValid ? 'step-indicator completed' : 'step-indicator'}>
                  2
                </span>
                {selectedType === 'port'
                  ? t('selectOriginPort', 'Sélectionnez le port de collecte')
                  : t('enterPickupDetails', 'Entrez les détails de collecte')}
              </h3>
              <p className="phase-header-subtitle" style={{ color: '#6b7280' }}>
                {selectedType === 'port'
                  ? t(
                      'selectDestinationPortDescription',
                      "Choisissez le port ou l'aéroport spécifique pour collecte"
                    )
                  : t(
                      'pickupCityPostalDescription',
                      'Fournissez la ville et le code postal pour une collecte précise'
                    )}
              </p>
            </div>
            {selectedType !== 'port' ? (
              <div
                className="address-details"
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <input
                  type="text"
                  className="input glassmorphism"
                  style={{ flex: '1 0 200px' }}
                  placeholder={t('destinationCity', 'City')}
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, city: val }));
                    setFieldValid((prev) => ({ ...prev, city: val.trim() ? true : null }));
                  }}
                />
                <input
                  type="text"
                  className="input glassmorphism"
                  style={{ flex: '1 0 200px' }}
                  placeholder={t('destinationZipCode', 'ZIP Code')}
                  value={formData.zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, zipCode: val }));
                    setFieldValid((prev) => ({ ...prev, zipCode: val.trim() ? true : null }));
                  }}
                />
              </div>
            ) : (
              <div className="form-control port-select">
                <div className="search-input-wrapper" style={{ position: 'relative' }}>
                  <MapPin className="search-icon" size={18} />
                  <input
                    type="text"
                    ref={originInputRef}
                    placeholder={`${t('searchDestinationPorts', 'Search ports')}...`}
                    value={originPortSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setOriginPortSearch(e.target.value);
                      setIsOriginPortListVisible(true);
                    }}
                    onFocus={() => setIsOriginPortListVisible(true)}
                    className="input glassmorphism search-input"
                    style={{
                      transition: 'all 0.3s ease',
                      transform: formData.origin ? 'scale(1.02)' : 'scale(1)',
                    }}
                  />
                  {formData.origin && (
                    <XCircle
                      size={18}
                      className="clear-search-icon"
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, origin: '' }));
                        setOriginPortSearch('');
                        setFieldValid((prev) => ({ ...prev, origin: null }));
                      }}
                    />
                  )}
                </div>
                <div
                  ref={originListRef}
                  className={`port-list ${isOriginPortListVisible ? 'show' : ''}`}
                  style={{ maxHeight: 240, overflowY: 'auto' }}
                >
                  {filteredPorts.length ? (
                    filteredPorts.map((port) => (
                      <div
                        key={port.code}
                        className={`port-option ${formData.origin === port.code ? 'selected' : ''}`}
                        onClick={() => handlePortSelect(port.code)}
                      >
                        <span className="port-icon">{port.flag}</span>
                        <div className="port-info">
                          <span className="port-name">
                            {getTranslatedPortNameLocal(port, userLang)}
                          </span>
                          <span className="port-region">
                            {getTranslatedCountryName('CN', userLang)}
                          </span>
                          {port.volume && (
                            <span className="port-volume">
                              {t('annualVolume', 'Annual Volume')} : {port.volume}
                            </span>
                          )}
                        </div>
                        <span className="port-code">{port.code}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results" style={{ padding: '0.75rem' }}>
                      {t('noPortsFoundFor', 'No ports found')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation indicator */}
        {detailsValid && (
          <div
            className="selection-feedback"
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(16,185,129,0.15)',
              border: '2px solid rgba(16,185,129,0.3)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ color: '#047857', fontWeight: 600 }}>
                {selectedType === 'port'
                  ? (() => {
                      const chosen = filteredPorts.find((p) => p.code === formData.origin);
                      const name = chosen ? getTranslatedPortNameLocal(chosen, userLang) : '';
                      return `${t('pickupPortFeedback', "Parfait ! Nous organiserons l'enlèvement depuis")} ${name}`;
                    })()
                  : `${t('pickupCityFeedback', "Parfait ! Nous organiserons l'enlèvement depuis")} ${formData.city}, ${getTranslatedCountryName('CN', userLang)}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default StepOrigin;
