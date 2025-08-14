import React, { memo, useEffect, useRef, useState } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/QuoteFormContext';
import { CheckCircle } from 'lucide-react';
import { COUNTRIES } from '@/data/countries';

const StepContact: React.FC = () => {
  const {
    currentStep,
    formData,
    setFormData,
    fieldValid,
    userLang,
    I18N_TEXT,
    handleInputChange,
    phonePrefixSearch,
    setPhonePrefixSearch,
    getTranslatedCountryName,
  } = useQuoteForm();

  const t = (key: string, fallback: string): string => {
    const dict: any = I18N_TEXT as any;
    return (dict?.[userLang]?.[key] ?? dict?.en?.[key] ?? fallback) as string;
  };

  // Local Step 6 UI states (customerType is now stored in context formData)
  const [experienceSearch, setExperienceSearch] = useState('');
  const [isExperienceListVisible, setIsExperienceListVisible] = useState(false);
  const [isPhonePrefixListVisible, setIsPhonePrefixListVisible] = useState(false);
  const experienceListRef = useRef<HTMLDivElement>(null);
  const phonePrefixListRef = useRef<HTMLDivElement>(null);
  const phonePrefixSearchInputRef = useRef<HTMLInputElement>(null);

  // Experience options (icons + language descriptions)
  const EXPERIENCE_OPTIONS = [
    { code: 'first-time', icon: '🌟' },
    { code: 'up-to-10x', icon: '📦' },
    { code: 'more-than-10x', icon: '🚀' },
    { code: 'regular', icon: '🏆' },
  ] as const;

  const cleanEmojiFromText = (text?: string) => (text ?? '').replace(/^\p{Extended_Pictographic}+\s*/u, '').trim();

  const handleExperienceSelect = (experienceCode: string) => {
    setFormData({ ...formData, shipperType: experienceCode as any });
    let translatedName = '';
    switch (experienceCode) {
      case 'first-time':
        translatedName = cleanEmojiFromText(t('firstTimeShipper', 'First international shipment'));
        break;
      case 'up-to-10x':
        translatedName = cleanEmojiFromText(t('upTo10Times', 'Limited experience'));
        break;
      case 'more-than-10x':
        translatedName = cleanEmojiFromText(t('moreThan10Times', 'Experienced shipper'));
        break;
      case 'regular':
        translatedName = cleanEmojiFromText(t('regularShipper', 'Regular shipper'));
        break;
    }
    const icon = EXPERIENCE_OPTIONS.find(e => e.code === experienceCode)?.icon ?? '';
    setExperienceSearch(`${icon}  ${translatedName}`);
    setIsExperienceListVisible(false);
  };

  const handlePhonePrefixSelect = (prefix: string) => {
    setFormData({ ...formData, phoneCountryCode: prefix });
    const country = COUNTRIES.find(c => c.phonePrefix === prefix);
    setPhonePrefixSearch(country ? `${country.flag} ${prefix}` : prefix);
    setIsPhonePrefixListVisible(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (experienceListRef.current && !experienceListRef.current.contains(e.target as Node)) {
        setIsExperienceListVisible(false);
      }
      if (phonePrefixListRef.current && !phonePrefixListRef.current.contains(e.target as Node) &&
          phonePrefixSearchInputRef.current && !phonePrefixSearchInputRef.current.contains(e.target as Node)) {
        setIsPhonePrefixListVisible(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Auto-position dropdowns
  useEffect(() => {
    const adjust = (dropdown: HTMLElement | null, input: HTMLElement | null) => {
      if (!dropdown || !input) return;
      const rect = input.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const dh = 300;
      const below = vh - rect.bottom - 20;
      const above = rect.top - 20;
      const right = vw - rect.left;
      const left = rect.right;
      dropdown.classList.remove('show-above', 'adjust-right', 'adjust-left');
      if (below < dh && above > below) dropdown.classList.add('show-above');
      if (right < 300) dropdown.classList.add('adjust-right');
      else if (left < 300) dropdown.classList.add('adjust-left');
      dropdown.style.setProperty('--dropdown-top', `${rect.bottom}px`);
    };
    if (isExperienceListVisible && experienceListRef.current) {
      const input = experienceListRef.current.previousElementSibling as HTMLElement;
      adjust(experienceListRef.current, input);
    }
    if (isPhonePrefixListVisible && phonePrefixListRef.current && phonePrefixSearchInputRef.current) {
      adjust(phonePrefixListRef.current, phonePrefixSearchInputRef.current);
    }
  }, [isExperienceListVisible, isPhonePrefixListVisible]);

  return (
    <FormStep isVisible={currentStep === 6} stepNumber={6} title={t('step6Title', 'Contact details')} emoji="📱">
      <div className="step-6-container">
        {/* Phase 0: Customer Type Selection */}
        <div className="customer-type-phase">
          <div className="phase-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: formData.customerType ? '#10b981' : '#6b7280', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>1</span>
              {t('customerTypeQuestion', 'Are you shipping as an individual or for a company?')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('customerTypeDescription', 'This helps us provide the most relevant information fields')}</p>
          </div>
          <div className="customer-type-selection" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className={`customer-type-option ${formData.customerType === 'individual' ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, customerType: 'individual' })} style={{ padding: '1.5rem', border: formData.customerType === 'individual' ? '2px solid #10b981' : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: formData.customerType === 'individual' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.9)', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem', transform: formData.customerType === 'individual' ? 'scale(1.02)' : 'scale(1)', boxShadow: formData.customerType === 'individual' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '2rem' }}>👤</div>
              <h4 style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>{t('individualCustomer', 'Private individual')}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{t('individualDescription', 'For personal shipments and small volumes')}</p>
            </div>
            <div className={`customer-type-option ${formData.customerType === 'company' ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, customerType: 'company' })} style={{ padding: '1.5rem', border: formData.customerType === 'company' ? '2px solid #10b981' : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: formData.customerType === 'company' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.9)', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem', transform: formData.customerType === 'company' ? 'scale(1.02)' : 'scale(1)', boxShadow: formData.customerType === 'company' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '2rem' }}>🏢</div>
              <h4 style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>{t('companyCustomer', 'Company')}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{t('companyDescription', 'For business shipments and regular operations')}</p>
            </div>
          </div>
          </div>

        {/* Phase 1: Personal Information */}
        {formData.customerType && (
          <div className="personal-info-phase animate-slide-in">
            <div className="phase-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: (formData.firstName && formData.lastName) ? '#10b981' : '#6b7280', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>2</span>
                {t('personalInformation', 'Personal Information')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('personalInfoDescription', 'Tell us who you are')}</p>
            </div>
            <div className="personal-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-control">
                <label htmlFor="firstName" className="label-text">{t('firstName', 'First Name')}</label>
                <div className="input-wrapper">
                  <input type="text" name="firstName" id="firstName" placeholder={t('firstNamePlaceholder', 'Enter your first name')} value={formData.firstName} onChange={handleInputChange} className={`input glassmorphism ${fieldValid.firstName === false ? 'input-error' : ''}`} style={{ transition: 'all 0.3s ease', transform: formData.firstName ? 'scale(1.02)' : 'scale(1)' }} />
                  {fieldValid.firstName === true && <CheckCircle className="check-icon" />}
                </div>
              </div>
                <div className="form-control">
                <label htmlFor="lastName" className="label-text">{t('lastName', 'Last Name')}</label>
                <div className="input-wrapper">
                  <input type="text" name="lastName" id="lastName" placeholder={t('lastNamePlaceholder', 'Enter your last name')} value={formData.lastName} onChange={handleInputChange} className={`input glassmorphism ${fieldValid.lastName === false ? 'input-error' : ''}`} style={{ transition: 'all 0.3s ease', transform: formData.lastName ? 'scale(1.02)' : 'scale(1)' }} />
                  {fieldValid.lastName === true && <CheckCircle className="check-icon" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Shipping Experience */}
        {(formData.firstName && formData.lastName) && (
          <div className="shipping-experience-phase animate-slide-in">
            <div className="phase-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: formData.shipperType ? '#10b981' : '#6b7280', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>3</span>
                {t('shippingExperience', 'Shipping Experience')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('selectExperience', 'Select your level of experience')}</p>
            </div>
            <div className="experience-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-control">
                <label htmlFor="shipperType" className="label-text">{t('shippingExperience', 'Shipping Experience')}</label>
                <div className="timing-select input-wrapper" style={{ position: 'relative' }}>
                  <input type="text" value={experienceSearch || t('selectExperience', 'Select your level of experience')} onClick={() => setIsExperienceListVisible(true)} onFocus={() => setIsExperienceListVisible(true)} readOnly className={`input glassmorphism timing-input ${fieldValid.shipperType === false ? 'input-error' : ''}`} style={{ cursor: 'pointer', transition: 'all 0.3s ease', transform: formData.shipperType ? 'scale(1.02)' : 'scale(1)' }} placeholder={t('selectExperience', 'Select your level of experience')} />
                  <div ref={experienceListRef} className={`port-list ${isExperienceListVisible ? 'show' : ''}`} style={{ zIndex: 1000 }}>
                    {EXPERIENCE_OPTIONS.map(experience => (
                      <div key={experience.code} className="port-option" onClick={() => handleExperienceSelect(experience.code)}>
                        <span className="port-icon">{experience.icon}</span>
                        <div className="port-info">
                          <span className="port-name">
                            {experience.code === 'first-time' && t('firstTimeShipper', 'First international shipment')}
                            {experience.code === 'up-to-10x' && t('upTo10Times', 'Limited experience')}
                            {experience.code === 'more-than-10x' && t('moreThan10Times', 'Experienced shipper')}
                            {experience.code === 'regular' && t('regularShipper', 'Regular shipper')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {fieldValid.shipperType === true && <CheckCircle className="check-icon" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Contact Information */}
        {(formData.firstName && formData.lastName && formData.shipperType) && (
          <div className="contact-info-phase animate-slide-in">
            <div className="phase-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: (formData.email && formData.phone) ? '#10b981' : '#6b7280', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>4</span>
                {t('contactInformation', 'Contact Information')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('contactInfoDescription', 'How can we reach you?')}</p>
            </div>
            <div className="contact-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-control">
                <label htmlFor="email" className="label-text">{t('emailAddress', 'Email Address')}</label>
                <div className="input-wrapper">
                  <input type="email" name="email" id="email" placeholder={t('emailPlaceholder', 'your.email@company.com')} value={formData.email} onChange={handleInputChange} className={`input glassmorphism ${fieldValid.email === false ? 'input-error' : ''}`} style={{ transition: 'all 0.3s ease', transform: formData.email ? 'scale(1.02)' : 'scale(1)' }} />
                  {fieldValid.email === true && <CheckCircle className="check-icon" />}
                </div>
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>📧 {t('emailHelp', 'We will send your quote and updates to this address')}</div>
              </div>
                <div className="form-control">
                <label htmlFor="phone" className="label-text">{t('phoneNumber', 'Phone Number')}</label>
                <div className="phone-input-wrapper" style={{ display: 'grid', gridTemplateColumns: '105px 1fr', gap: '0.5rem' }}>
                  <div className="phone-prefix-select" style={{ position: 'relative' }}>
                    <div className="search-input-wrapper" style={{ position: 'relative' }}>
                      <input type="text" value={phonePrefixSearch} onClick={() => setIsPhonePrefixListVisible(true)} onFocus={() => setIsPhonePrefixListVisible(true)} onChange={(e) => setPhonePrefixSearch(e.target.value)} placeholder="+1" ref={phonePrefixSearchInputRef} className="input glassmorphism search-input" style={{ cursor: 'pointer', fontSize: '0.9rem' }} />
                    </div>
                    <div ref={phonePrefixListRef} className={`port-list ${isPhonePrefixListVisible ? 'show' : ''}`} style={{ zIndex: 1000 }}>
                      {COUNTRIES.filter(c => c.phonePrefix && (c.name.toLowerCase().includes((phonePrefixSearch || '').toLowerCase()) || c.phonePrefix.includes((phonePrefixSearch || '').replace(/[^\d+]/g, '')))).slice(0, 10).map(country => (
                        <div key={country.code} className="port-option" onClick={() => handlePhonePrefixSelect(country.phonePrefix)}>
                          <span className="port-icon">{country.flag}</span>
                          <div className="port-info">
                            <span className="port-name">{country.phonePrefix}</span>
                            <span className="port-region">{getTranslatedCountryName(country.code, userLang as any)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <input type="tel" name="phone" id="phone" placeholder={t('phonePlaceholder', 'Your phone number')} value={formData.phone} onChange={handleInputChange} className={`input glassmorphism ${fieldValid.phone === false ? 'input-error' : ''}`} style={{ transition: 'all 0.3s ease', transform: formData.phone ? 'scale(1.02)' : 'scale(1)' }} />
                </div>
                {fieldValid.phone === true && <CheckCircle className="check-icon" />}
                <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>📱 {t('phoneHelp', 'For urgent updates and clarifications')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 5: Business Information (company only) */}
        {(formData.firstName && formData.lastName && formData.shipperType && formData.customerType === 'company') && (
          <div className="business-info-phase animate-slide-in">
            <div className="phase-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: formData.companyName ? '#10b981' : '#6b7280', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>5</span>
                {t('businessInformation', 'Business Information')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('businessInfoDescription', 'Tell us about your company')}</p>
            </div>
            <div className="business-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-control">
                <label htmlFor="companyName" className="label-text">{t('companyName', 'Company Name')}</label>
                <div className="input-wrapper">
                  <input type="text" name="companyName" id="companyName" placeholder={t('companyNamePlaceholder', 'Your company name (optional)')} value={formData.companyName} onChange={handleInputChange} className={`input glassmorphism ${fieldValid.companyName === false ? 'input-error' : ''}`} style={{ transition: 'all 0.3s ease', transform: formData.companyName ? 'scale(1.02)' : 'scale(1)' }} />
                {fieldValid.companyName === true && <CheckCircle className="check-icon" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 6: Additional Notes (optional) */}
        {(formData.email && formData.phone) && (
          <div className="additional-notes-phase animate-slide-in">
            <div className="phase-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: '#10b981', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}>✓</span>
                {t('additionalNotes', 'Additional Notes')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>{t('additionalNotesDescription', 'Is there anything else we should know?')}</p>
            </div>
            <div className="form-control">
              <label htmlFor="remarks" className="label-text">{t('remarks', 'Special Remarks')}</label>
              <textarea name="remarks" id="remarks" placeholder={t('remarksPlaceholder', 'Any special instructions, requirements, or questions...')} value={formData.remarks || ''} onChange={handleInputChange} className="input glassmorphism" rows={4} style={{ minHeight: '120px', resize: 'vertical', transition: 'all 0.3s ease' }} />
              <div className="help-text" style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>💬 {t('remarksHelp', 'Extra context helps us assist you better')}</div>
            </div>
            <div className="contact-summary-banner" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: '#10b981', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', height: '40px' }}>
                <CheckCircle size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#047857', margin: '0 0 0.5rem 0' }}>{t('readyToSubmit', 'You are ready to get your quote!')}</h4>
                <p style={{ fontSize: '0.9rem', color: '#065f46', margin: '0', lineHeight: '1.5' }}>{t('submitDescription', 'Click the Get My Quote button below to submit your request. We will respond within 24 hours.')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="security-badge glassmorphism" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🔒</span>
          <span style={{ fontWeight: '500' }}>{t('securityBadge', 'Secure and GDPR compliant')}</span>
        </div>
      </div>
    </FormStep>
  );
};

export default memo(StepContact); 