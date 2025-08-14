import React, { useCallback, useMemo, useState } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/QuoteFormContext';
import {
  Warehouse,
  Ship,
  Building2,
  Home,

  MapPin,
  XCircle,
  CheckCircle
} from 'lucide-react';

import { DESTINATION_PORTS_BY_COUNTRY } from '@/features/lead/QuoteFormContext';
// Country code for pickup (factory/port etc.). In this MVP we assume goods are picked up in China
const ORIGIN_COUNTRY_CODE = 'CN';

const StepOrigin: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,

    setFieldValid,
    I18N_TEXT,
    userLang,
    getLocationTypeName,
    getLocationTypeDescription,
    getTranslatedPortNameLocal,
    getTranslatedCountryName,
  } = useQuoteForm();

  // -----------------------
  // Local state for port dropdown
  // -----------------------
  const [portSearch, setPortSearch] = useState('');
  const [isPortListVisible, setIsPortListVisible] = useState(false);

  // Ports list for China only (reuse destination list structure)
  const originPorts = useMemo(() => DESTINATION_PORTS_BY_COUNTRY[ORIGIN_COUNTRY_CODE] || [], []);

  const filteredPorts = useMemo(() => {
    if (!portSearch.trim()) return originPorts;
    // Clean search (remove emojis)
    const clean = portSearch.replace(/[🚢✈️🚂]/g, '').trim().toLowerCase();
    return originPorts.filter(
      (p: any) =>
        p.name.toLowerCase().includes(clean) ||
        p.code.toLowerCase().includes(clean) ||
        p.type.toLowerCase().includes(clean)
    );
  }, [originPorts, portSearch]);

  // -----------------------
  // Handlers
  // -----------------------
  const handleLocationTypeSelect = useCallback(
    (typeId: string) => {
      setFormData(prev => ({ ...prev, locationType: typeId, city: '', zipCode: '', origin: '' }));
      setFieldValid(prev => ({ ...prev, city: null, zipCode: null, origin: null, locationType: true }));
      // reset port search
      setPortSearch('');
    },
    [setFormData, setFieldValid]
  );

  const handlePortSelect = useCallback(
    (code: string) => {
      setFormData(prev => ({ ...prev, origin: code }));
      setFieldValid(prev => ({ ...prev, origin: true }));
      const p = originPorts.find((po: any) => po.code === code);
      if (p) {
        setPortSearch(`${p.flag} ${getTranslatedPortNameLocal(p, userLang)}`);
      }
      setIsPortListVisible(false);
    },
    [originPorts, setFormData, setFieldValid, getTranslatedPortNameLocal, userLang]
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
      title={`${(I18N_TEXT as any)[userLang]?.step3Title || 'Select pickup location in China'}` }
      emoji="🇨🇳"
    >
      <div className="step-3-container">
        {/* Phase 1 – type selection */}
        <div className="location-type-selection-phase">
          <div className="phase-header">
            <h3 className="phase-header-title" style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
              <span className={selectedType ? 'step-indicator completed' : 'step-indicator'}>1</span>
              {(I18N_TEXT as any)[userLang]?.selectPickupLocationType || 'Sélectionnez votre type de lieu de collecte'}
            </h3>
            <p className="phase-header-subtitle" style={{ color:'#6b7280', marginBottom:'1.5rem' }}>
              {(I18N_TEXT as any)[userLang]?.pickupLocationDescription || 'Choisissez où nous devons collecter vos marchandises en Chine'}
            </p>
          </div>
          <div className="location-types">
            {LOCATION_TYPES.map(type => (
              <div
                key={type.id}
                role="button"
                tabIndex={0}
                data-id={type.id}
                className={`location-type-option ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => handleLocationTypeSelect(type.id)}
                onKeyDown={e => e.key === 'Enter' && handleLocationTypeSelect(type.id)}
              >
                <type.icon size={24} />
                <span>{getLocationTypeName(type.id, userLang)}</span>
                <p className="location-desc">{getLocationTypeDescription(type.id, userLang)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)', margin: '2rem 0' }}></div>

        {/* Phase 2 – details */}
        {selectedType && (
          <div className="location-details-phase" style={{ marginTop: '2rem' }}>
            {/* Header micro-step 2 */}
            <div className="phase-header" style={{ marginBottom: '1.5rem' }}>
              <h3 className="phase-header-title" style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                <span className={detailsValid ? 'step-indicator completed' : 'step-indicator'}>2</span>
                {selectedType === 'port'
                  ? (I18N_TEXT as any)[userLang]?.selectOriginPort || 'Sélectionnez le port de collecte'
                  : (I18N_TEXT as any)[userLang]?.enterPickupDetails || 'Entrez les détails de collecte'}
              </h3>
              <p className="phase-header-subtitle" style={{ color:'#6b7280' }}>
                {selectedType === 'port'
                  ? (I18N_TEXT as any)[userLang]?.selectDestinationPortDescription || 'Choisissez le port ou l\'aéroport spécifique pour collecte'
                  : (I18N_TEXT as any)[userLang]?.pickupCityPostalDescription || 'Fournissez la ville et le code postal pour une collecte précise'}
              </p>
            </div>
            {selectedType !== 'port' ? (
              <div className="address-details" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="input glassmorphism"
                  style={{ flex: '1 0 200px' }}
                  placeholder={(I18N_TEXT as any)[userLang]?.destinationCity || 'City'}
                  value={formData.city}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, city: val }));
                    setFieldValid(prev => ({ ...prev, city: val.trim() ? true : null }));
                  }}
                />
                <input
                  type="text"
                  className="input glassmorphism"
                  style={{ flex: '1 0 200px' }}
                  placeholder={(I18N_TEXT as any)[userLang]?.destinationZipCode || 'ZIP Code'}
                  value={formData.zipCode}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, zipCode: val }));
                    setFieldValid(prev => ({ ...prev, zipCode: val.trim() ? true : null }));
                  }}
                />
              </div>
            ) : (
              <div className="form-control port-select">
                <div className="search-input-wrapper" style={{ position:'relative' }}>
                  <MapPin className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder={`${(I18N_TEXT as any)[userLang]?.searchDestinationPorts || 'Search ports'}...`}
                    value={portSearch}
                    onChange={e => { setPortSearch(e.target.value); setIsPortListVisible(true); }}
                    onFocus={() => setIsPortListVisible(true)}
                    className="input glassmorphism search-input"
                    style={{ transition:'all 0.3s ease', transform: formData.origin ? 'scale(1.02)' : 'scale(1)' }}
                  />
                  {formData.origin && (
                    <XCircle size={18} className="clear-search-icon" style={{ cursor:'pointer', position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}
                      onClick={() => { setFormData(prev=>({...prev, origin:''})); setPortSearch(''); setFieldValid(prev=>({...prev, origin:null})); }}
                    />
                  )}
                </div>
                <div className={`port-list ${isPortListVisible ? 'show' : ''}`} style={{ maxHeight:240, overflowY:'auto' }}>
                  {filteredPorts.length ? (
                    filteredPorts.map((port:any)=>(
                      <div key={port.code} className={`port-option ${formData.origin===port.code?'selected':''}`} onClick={()=>handlePortSelect(port.code)}>
                        <span className="port-icon">{port.flag}</span>
                        <div className="port-info">
                          <span className="port-name">{getTranslatedPortNameLocal(port, userLang)}</span>
                          <span className="port-region">{port.region || 'China'}</span>
                          {port.volume && <span className="port-volume">{(I18N_TEXT as any)[userLang]?.annualVolume || 'Annual Volume'} : {port.volume}</span>}
                        </div>
                        <span className="port-code">{port.code}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results" style={{ padding:'0.75rem' }}>
                      {(I18N_TEXT as any)[userLang]?.noPortsFoundFor || 'No ports found'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation indicator */}
        {detailsValid && (
          <div className="selection-feedback" style={{ marginTop:'1.5rem', padding:'1rem', background:'rgba(16,185,129,0.15)', border:'2px solid rgba(16,185,129,0.3)', borderRadius:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <CheckCircle size={20} style={{ color:'#10b981', flexShrink:0 }} />
              <span style={{ color:'#047857', fontWeight:600 }}>
                {selectedType === 'port'
                  ? `${(I18N_TEXT as any)[userLang]?.pickupPortFeedback || 'Parfait ! Nous organiserons l\'enlèvement depuis'} ${getTranslatedPortNameLocal(originPorts.find((p:any)=>p.code===formData.origin) || {name:''}, userLang)}`
                  : `${(I18N_TEXT as any)[userLang]?.pickupCityFeedback || 'Parfait ! Nous organiserons l\'enlèvement depuis'} ${formData.city}, ${getTranslatedCountryName(ORIGIN_COUNTRY_CODE, userLang)}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default StepOrigin;
