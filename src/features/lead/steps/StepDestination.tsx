import React, { useEffect, useRef, useState, memo } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/QuoteFormContext';
import { COUNTRIES } from '@/data/countries';
import { Search, XCircle, Warehouse, Ship, Building2, Home, MapPin, CheckCircle, Info } from 'lucide-react';

const StepDestination: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,
    fieldValid,
    setFieldValid,
    userLang,
    
    // Country search states
    countrySearch,
    setCountrySearch,
    debouncedCountrySearch,
    setDebouncedCountrySearch,
    isCountryListVisible,
    setIsCountryListVisible,
    highlightedCountryIndex,
    setHighlightedCountryIndex,
    
    // Destination port states
    destPortSearch,
    setDestPortSearch,
    isDestPortListVisible,
    setIsDestPortListVisible,
    
    // Handlers
    handleCountrySelect,
    handleCountrySearchKeyDown,
    clearCountrySelection,
    handleDestLocationTypeSelect,
    handleDestPortSelect,
    handleInputChange,
    
    // Helper functions
    getDestinationLocationTypes,
    getFilteredDestinationPorts,
    filteredCountries,
    sanitizedCountrySearch,
    
    // I18N and helpers
    I18N_TEXT,
    getLocationTypeName,
    getLocationTypeDescription,
    getTranslatedPortNameLocal,
    getTranslatedPortType,
    getSearchPortsText,
    getTranslatedCountryName,
  } = useQuoteForm();


  const countryListRef = useRef<HTMLDivElement>(null);
  const destPortListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce the country search input (200 ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCountrySearch(countrySearch);
    }, 200);
    return () => clearTimeout(handler);
  }, [countrySearch, setDebouncedCountrySearch]);

  // Reset highlighted index when list visibility or search changes
  useEffect(() => {
    if (!isCountryListVisible) {
      setHighlightedCountryIndex(-1);
    } else {
      setHighlightedCountryIndex(prev => {
        const withinBounds = prev >= 0 && prev < filteredCountries.length;
        return withinBounds ? prev : 0;
      });
    }
  }, [isCountryListVisible, sanitizedCountrySearch, filteredCountries.length, setHighlightedCountryIndex]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (!isCountryListVisible) return;
    if (highlightedCountryIndex < 0 || highlightedCountryIndex >= filteredCountries.length) return;
    const optionElem = document.getElementById(`country-option-${filteredCountries[highlightedCountryIndex].code}`);
    if (optionElem && optionElem.scrollIntoView) {
      optionElem.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedCountryIndex, isCountryListVisible, filteredCountries]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Country list
      if (!countryListRef.current?.contains(event.target as Node) && 
          !searchInputRef.current?.contains(event.target as Node)) {
        setIsCountryListVisible(false);
      }
      
      // Destination port list
      if (!destPortListRef.current?.contains(event.target as Node)) {
        setIsDestPortListVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsCountryListVisible, setIsDestPortListVisible]);

  return (
    <FormStep isVisible={currentStep === 1} stepNumber={1} title={(I18N_TEXT as any)[userLang]?.step1Title || 'Destination'} emoji="🌍">
      {/* Country Selection with Progressive Disclosure */}
      <div className="step-1-container">
        
        {/* Phase 1: Country Search */}
        <div className="country-selection-phase">
          <div className="phase-header">
            <h3 className="phase-header-title">
              <span className={`step-indicator ${formData.country ? 'completed' : ''}`}>1</span>
              {(I18N_TEXT as any)[userLang]?.selectDestinationCountry || 'Select destination country'}
            </h3>
            <p className="phase-header-subtitle">
              {(I18N_TEXT as any)[userLang]?.searchCountryDescription || 'Start typing to find your destination country'}
            </p>
          </div>

          <div className="form-control country-select">
            <div className="search-input-wrapper relative">
              <Search className="search-icon" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={(I18N_TEXT as any)[userLang]?.searchCountry || 'Search country...'}
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
                  aria-label={(I18N_TEXT as any)[userLang]?.clearCountry || 'Clear country'}
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
                  // Définir les pays prioritaires selon la langue
                  const PRIORITY_COUNTRIES_BY_LANG: Record<string, string[]> = {
                    fr: ['FR', 'BE', 'CH', 'CA', 'LU', 'MC'],
                    en: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE'],
                    de: ['DE', 'AT', 'CH', 'LI'],
                    es: ['ES', 'MX', 'AR', 'CO', 'PE', 'CL'],
                    it: ['IT', 'SM', 'VA', 'CH'],
                    nl: ['NL', 'BE'],
                    pt: ['PT', 'BR', 'AO', 'MZ'],
                    zh: ['CN', 'TW', 'HK', 'MO', 'SG'],
                    ar: ['SA', 'AE', 'EG', 'JO', 'LB', 'MA'],
                    tr: ['TR', 'CY'],
                    ru: ['RU', 'BY', 'KZ', 'KG', 'UA']
                  };
                  const priorityCountryCodes = PRIORITY_COUNTRIES_BY_LANG[userLang] || [];
                  const priorityCountries = filteredCountries.filter(c => priorityCountryCodes.includes(c.code));
                  const otherCountries = filteredCountries.filter(c => !priorityCountryCodes.includes(c.code));

                  return (
                    <>
                      {/* Section Populaires */}
                      {!sanitizedCountrySearch && priorityCountries.length > 0 && (
                        <>
                          <div className="country-section-header section-header" style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e5e7eb',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span style={{ color: '#10b981' }}>⭐</span>
                            {(I18N_TEXT as any)[userLang]?.popular || 'Popular'}
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
                              <span className="country-name">{getTranslatedCountryName(country.code, userLang)}</span>
                              <span className="country-code">{country.code}</span>
                            </div>
                          ))}
                          {otherCountries.length > 0 && (
                            <div className="country-section-header section-header" style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f1f5f9',
                              borderBottom: '1px solid #e5e7eb',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#475569',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              borderRadius: '4px'
                            }}>
                              {(I18N_TEXT as any)[userLang]?.otherCountries || 'Other Countries'}
                            </div>
                          )}
                        </>
                      )}

                      {/* Reste des pays (ou tous si recherche) */}
                      {(sanitizedCountrySearch ? filteredCountries : otherCountries).map((country, idx) => {
                        const adjustedIdx = !sanitizedCountrySearch ? idx + priorityCountries.length : idx;
                        return (
                          <div
                            id={`country-option-${country.code}`}
                            role="option"
                            aria-selected={highlightedCountryIndex === adjustedIdx}
                            key={country.code}
                            className={`country-option ${formData.country === country.code ? 'selected' : ''} ${highlightedCountryIndex === adjustedIdx ? 'highlighted' : ''}`}
                            onClick={() => handleCountrySelect(country.code)}
                          >
                            <span className="country-flag">{country.flag}</span>
                            <span className="country-name">{getTranslatedCountryName(country.code, userLang)}</span>
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
                    {(I18N_TEXT as any)[userLang]?.noCountryResults || 'No countries found'}
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
                <span className={`step-indicator ${formData.destLocationType ? 'completed' : ''}`}>2</span>
                {(I18N_TEXT as any)[userLang]?.addressTypeQuestion || 'What kind of delivery location?'}
              </h3>
              
              {/* Help hint */}
              <div className="phase-header-subtitle flex-center flex-gap-sm">
                <Info size={14} className="info-icon" />
                <span>{(I18N_TEXT as any)[userLang]?.helpChooseLocation || 'Not sure? Most beginners choose Business/Office'}</span>
              </div>
            </div>

            <div className="location-types">
              {getDestinationLocationTypes().map(type => (
                <div
                  key={type.id}
                  className={`location-type-option ${formData.destLocationType === type.id ? 'selected' : ''}`}
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
        {formData.country && formData.destLocationType && (
          <div 
            className="address-details-phase"
            style={{
              marginTop: '2rem',
              opacity: formData.destLocationType ? 1 : 0,
              transform: formData.destLocationType ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s ease 0.2s',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '2rem'
            }}
          >
            <div className="phase-header">
              <h3 className="phase-header-title">
                <span className={`step-indicator ${(
                  formData.destLocationType === 'port' 
                    ? !!formData.destPort 
                    : !!(formData.destCity && formData.destZipCode)
                ) ? 'completed' : ''}`}>3</span>
                {formData.destLocationType === 'port' 
                  ? ((I18N_TEXT as any)[userLang]?.selectDestinationPort || 'Select destination port')
                  : ((I18N_TEXT as any)[userLang]?.enterDestinationDetails || 'Enter destination details')
                }
              </h3>
              <p className="phase-header-subtitle">
                {formData.destLocationType === 'port' 
                  ? ((I18N_TEXT as any)[userLang]?.selectDestinationPortDescription || 'Choose the specific port or airport for delivery')
                  : ((I18N_TEXT as any)[userLang]?.cityPostalDescription || 'Enter the city and postal code for delivery')
                }
              </p>
            </div>

            {formData.destLocationType === 'port' ? (
              // Port selection interface
              <div className="form-control port-select">
                <div className="search-input-wrapper" style={{ position: 'relative' }}>
                  <MapPin className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder={`${formData.country ? getSearchPortsText(formData.country, userLang) + ' ' + getTranslatedCountryName(formData.country, userLang) : ((I18N_TEXT as any)[userLang]?.searchDestinationPorts || 'Search destination ports')}...`}
                    value={destPortSearch}
                    onChange={(e) => {
                      setDestPortSearch(e.target.value);
                      setIsDestPortListVisible(true);
                    }}
                    onFocus={() => setIsDestPortListVisible(true)}
                    className="input glassmorphism search-input"
                    style={{
                      transition: 'all 0.3s ease',
                      transform: formData.destPort ? 'scale(1.02)' : 'scale(1)'
                    }}
                  />
                  {formData.destPort && (
                    <XCircle
                      size={18}
                      className="clear-search-icon"
                      style={{ cursor: 'pointer', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, destPort: '' }));
                        setDestPortSearch('');
                        setFieldValid(prev => ({ ...prev, destPort: null }));
                      }}
                      aria-label="Clear selected port"
                    />
                  )}
                </div>
                <div 
                  ref={destPortListRef}
                  className={`port-list ${isDestPortListVisible ? 'show' : ''}`}
                >
                  {getFilteredDestinationPorts().length > 0 ? (
                    getFilteredDestinationPorts().map(port => (
                      <div
                        key={port.code}
                        className={`port-option ${formData.destPort === port.code ? 'selected' : ''}`}
                        onClick={() => handleDestPortSelect(port.code)}
                      >
                        <span className="port-icon">{port.flag}</span>
                        <div className="port-info">
                          <span className="port-name">{getTranslatedPortNameLocal(port, userLang)}</span>
                          <span className="port-region">{getTranslatedPortType(port.type, userLang)}</span>
                          {port.volume && <span className="port-volume">{(I18N_TEXT as any)[userLang]?.annualVolume || 'Annual Volume'} : {port.volume}</span>}
                        </div>
                        <span className="port-code">{port.code}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      {formData.country 
                        ? `${(I18N_TEXT as any)[userLang]?.noPortsFoundFor || 'No ports found for'} ${getTranslatedCountryName(formData.country, userLang)}`
                        : ((I18N_TEXT as any)[userLang]?.selectCountryFirst || 'Please select a country first')
                      }
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Standard city + zip code interface
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
                    placeholder={(I18N_TEXT as any)[userLang]?.destinationCity || 'Destination City'}
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
                    placeholder={(I18N_TEXT as any)[userLang]?.destinationZipCode || 'Postal Code'}
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
            )}
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default memo(StepDestination); 