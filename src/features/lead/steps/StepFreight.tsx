import React, { memo } from 'react';
import FormStep from '../FormStep';
import { useQuoteForm } from '@/features/lead/context/useQuoteForm';
import { initialLoadDetails } from '@/features/lead/context/types';
import type { LoadDetails } from '@/features/lead/context/types';
import { PackageOpen, Package, Container, CheckCircle, Info, Minus, Plus } from 'lucide-react';
import CustomDropdown from '@/shared/components/CustomDropdown';

const StepFreight: React.FC = () => {
  const { currentStep, formData, setFormData, getText, activeLoadIndex } = useQuoteForm();

  const t = (key: string, fallback: string): string => getText(key, fallback);

  const updateActiveLoad = (partial: Partial<LoadDetails>) => {
    const updatedLoads = [...formData.loads];
    updatedLoads[activeLoadIndex] = { ...updatedLoads[activeLoadIndex], ...partial } as LoadDetails;
    setFormData((prev) => ({ ...prev, loads: updatedLoads }));
  };

  const currentLoad = formData.loads[activeLoadIndex] || initialLoadDetails;

  return (
    <FormStep
      isVisible={currentStep === 4}
      stepNumber={4}
      title={t('step4Title', 'What are you shipping?')}
      emoji="📦"
    >
      <div className="step-4-container">
        <div className="cargo-type-guidance-phase">
          <div className="phase-header">
            <h3 className="phase-header-title">
              <span className={`step-indicator ${currentLoad.shippingType ? 'completed' : ''}`}>
                1
              </span>
              {t('chooseShippingType', 'Choose your shipping type')}
            </h3>
            <p className="phase-header-subtitle">
              {t('selectPackagingMethod', 'Select how your goods are packaged for shipping')}
            </p>
          </div>

          <div className="step4-choice-option-group-extended shipping-type-selector mx-auto my-6">
            <div
              className={`step4-choice-option ${currentLoad.shippingType === 'loose' ? 'selected' : ''}`}
              data-choice-theme="loose-cargo"
              onClick={() => updateActiveLoad({ shippingType: 'loose' })}
              style={{ cursor: 'pointer' }}
            >
              <PackageOpen size={48} strokeWidth={2.25} />
              <span>{t('looseCargo', 'Loose Cargo')}</span>
              <div className="location-desc">
                {t('looseCargoDesc', 'Pallets, boxes, or individual items')}
              </div>
            </div>
            <div
              className={`step4-choice-option ${currentLoad.shippingType === 'container' ? 'selected' : ''}`}
              data-choice-theme="container"
              onClick={() => updateActiveLoad({ shippingType: 'container' })}
              style={{ cursor: 'pointer' }}
            >
              <Container size={48} strokeWidth={2.25} />
              <span>{t('fullContainer', 'Full Container')}</span>
              <div className="location-desc">
                {t('fullContainerDesc', 'Complete container (FCL)')}
              </div>
            </div>
            <div
              className={`step4-choice-option ${currentLoad.shippingType === 'unsure' ? 'selected' : ''}`}
              data-choice-theme="unsure"
              onClick={() => updateActiveLoad({ shippingType: 'unsure' })}
              style={{ cursor: 'pointer' }}
            >
              <Package size={48} strokeWidth={2.25} />
              <span>{t('imNotSure', "I'm not sure")}</span>
              <div className="location-desc">
                {t('teamWillHelp', 'Our team will help you choose the best option')}
              </div>
            </div>
          </div>

          {/* Selection feedback (loose cargo) */}
          {currentLoad.shippingType === 'loose' && (
            <div
              className="selection-feedback"
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#047857',
                    fontWeight: 600,
                    lineHeight: '1.4',
                  }}
                >
                  {t(
                    'looseCargoFeedback',
                    'Perfect for mixed goods, small to medium quantities, or when you need flexible packaging'
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Selection feedback (container) */}
          {currentLoad.shippingType === 'container' && (
            <div
              className="selection-feedback"
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(139, 92, 246, 0.15)',
                borderRadius: '12px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#581c87',
                    fontWeight: 600,
                    lineHeight: '1.4',
                  }}
                >
                  {t(
                    'containerFeedback',
                    'Great choice for large volumes, complete product lines, or when you have enough goods to fill a container'
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Selection feedback (unsure) */}
          {currentLoad.shippingType === 'unsure' && (
            <div
              className="selection-feedback"
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.15)',
                borderRadius: '12px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#1e40af',
                    fontWeight: 600,
                    lineHeight: '1.4',
                  }}
                >
                  {t(
                    'unsureFeedback',
                    "No worries! Our experienced team will guide you through the process and recommend the best shipping solution for your specific needs. We'll handle all the technical details."
                  )}
                </span>
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                  <span role="img" aria-label="phone">
                    📞
                  </span>{' '}
                  <strong>{t('whatHappensNextTitle', 'What happens next:')}</strong>
                  <br />•{' '}
                  {t('contactWithin24h', 'Our shipping experts will contact you within 24 hours')}
                  <br />•{' '}
                  {t('discussCargoDetails', "We'll discuss your cargo details and requirements")}
                  <br />•{' '}
                  {t(
                    'personalizedRecommendations',
                    "You'll receive personalized recommendations and pricing"
                  )}
                  <br />• {t('noCommitment', 'No commitment required - just expert guidance!')}
                </div>
              </div>
            </div>
          )}

          {/* Simple actions - removed for micro step 2 reset */}
        </div>

        {/* Micro step 2 – Loose cargo details (UNIT calculation) */}
        {currentLoad.shippingType === 'loose' && (
          <div className="cargo-details-phase" style={{ marginTop: '2rem' }}>
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
                <span className="step-indicator">2</span>
                {t('describeLooseCargo', 'Describe your loose cargo')}
              </h3>
              <p className="phase-header-subtitle">
                {t(
                  'provideDimensionsWeight',
                  'Provide dimensions and weight details for accurate pricing'
                )}
              </p>
            </div>

            {/* Container card wrapping radios + fields */}
            <div
              className="loose-cargo-section"
              style={{
                background: 'rgba(255,255,255,0.35)',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                padding: '1rem',
              }}
            >
              {/* Calculation type selector (unit/total) – default unit */}
              <div
                className="calculation-type-selector button-group-horizontal"
                style={{ margin: '1rem 0' }}
              >
                <label
                  className={`radio-label ${currentLoad.calculationType === 'unit' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`calculationType-${0}`}
                    value="unit"
                    checked={currentLoad.calculationType === 'unit'}
                    onChange={() => updateActiveLoad({ calculationType: 'unit' })}
                  />
                  {t('calcPerUnit', 'Calculate by unit type')}
                </label>
                <label
                  className={`radio-label ${currentLoad.calculationType === 'total' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`calculationType-${0}`}
                    value="total"
                    checked={currentLoad.calculationType === 'total'}
                    onChange={() => updateActiveLoad({ calculationType: 'total' })}
                  />
                  {t('calcTotal', 'Calculate by total shipment')}
                </label>
              </div>

              {/* Only render unit form for now */}
              {currentLoad.calculationType === 'unit' && (
                <div className="unit-details sub-section-card">
                  {/* Info banner */}
                  <div
                    className="info-banner"
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Info size={20} className="info-icon" />
                    <span>
                      {t(
                        'unitInfo',
                        'Provide details about each individual item or pallet for accurate calculation.'
                      )}
                    </span>
                  </div>

                  {/* Package type + units counter */}
                  <div
                    className="package-selection-row"
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div className="package-type-section" style={{ minWidth: 220 }}>
                      <label className="label-text">{t('packageType', 'Package type')}</label>
                      <div className="button-group-horizontal">
                        <button
                          type="button"
                          className={`btn-tab-compact ${currentLoad.packageType === 'pallets' ? 'active' : ''}`}
                          onClick={() =>
                            updateActiveLoad({
                              packageType: 'pallets',
                              palletType: currentLoad.palletType || 'non_specified',
                            })
                          }
                        >
                          {t('pallets', 'Pallets')}
                        </button>
                        <button
                          type="button"
                          className={`btn-tab-compact ${currentLoad.packageType === 'boxes' ? 'active' : ''}`}
                          onClick={() => updateActiveLoad({ packageType: 'boxes' })}
                        >
                          {t('boxes', 'Boxes/Crates')}
                        </button>
                      </div>
                    </div>

                    <div className="units-counter-section">
                      <label className="label-text">{t('numUnits', '# of units')}</label>
                      <div
                        className="input-number-wrapper-compact"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <button
                          type="button"
                          className="btn-number-control-compact"
                          onClick={() =>
                            updateActiveLoad({
                              numberOfUnits: Math.max(1, (currentLoad.numberOfUnits || 1) - 1),
                            })
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          className="input-number-compact"
                          min={1}
                          value={currentLoad.numberOfUnits || 1}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({
                              numberOfUnits: Math.max(1, parseInt(e.target.value || '1', 10)),
                            })
                          }
                        />
                        <button
                          type="button"
                          className="btn-number-control-compact"
                          onClick={() =>
                            updateActiveLoad({
                              numberOfUnits: (currentLoad.numberOfUnits || 1) + 1,
                            })
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pallet type dropdown (only for pallets) */}
                  {currentLoad.packageType === 'pallets' && (
                    <div className="form-control" style={{ marginTop: '0.75rem' }}>
                      <label className="label-text">{t('palletType', 'Pallet type')}</label>
                      <CustomDropdown
                        value={currentLoad.palletType || 'non_specified'}
                        onChange={(v: string) => updateActiveLoad({ palletType: v })}
                        options={[
                          {
                            value: 'non_specified',
                            label: t('palletNonSpecified', 'Non-specified'),
                          },
                          { value: 'eur1', label: t('euroPallet', 'Euro Pallet (120x80 cm)') },
                          {
                            value: 'std120x100',
                            label: t('stdPallet', 'Standard Pallet (120x100 cm)'),
                          },
                          { value: 'custom', label: t('customSize', 'Custom Size') },
                        ]}
                      />
                    </div>
                  )}

                  {/* Dimensions and weight */}
                  <div
                    className="dimensions-weight-compact"
                    style={{ display: 'grid', gap: '1rem', marginTop: '0.75rem' }}
                  >
                    {/* Dimensions */}
                    <div className="dimensions-section-compact">
                      <label className="label-text-compact">
                        {t('dimensionsPerUnit', 'Dimensions (L×W×H per unit)')}
                      </label>
                      <div className="dimensions-input-row">
                        <input
                          type="number"
                          placeholder="L"
                          className="dimension-input-compact"
                          value={currentLoad.dimensions.length}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({
                              dimensions: { ...currentLoad.dimensions, length: e.target.value },
                            })
                          }
                        />
                        <span className="dimension-separator">×</span>
                        <input
                          type="number"
                          placeholder="W"
                          className="dimension-input-compact"
                          value={currentLoad.dimensions.width}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({
                              dimensions: { ...currentLoad.dimensions, width: e.target.value },
                            })
                          }
                        />
                        <span className="dimension-separator">×</span>
                        <input
                          type="number"
                          placeholder="H"
                          className="dimension-input-compact"
                          value={currentLoad.dimensions.height}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({
                              dimensions: { ...currentLoad.dimensions, height: e.target.value },
                            })
                          }
                        />
                        <CustomDropdown
                          value={currentLoad.dimensionUnit || 'CM'}
                          onChange={(v: string) => updateActiveLoad({ dimensionUnit: v })}
                          options={[
                            { value: 'CM', label: 'CM' },
                            { value: 'M', label: 'M' },
                            { value: 'IN', label: 'IN' },
                          ]}
                          compact
                          unitSelector
                        />
                      </div>
                      {!(
                        currentLoad.dimensions.length &&
                        currentLoad.dimensions.width &&
                        currentLoad.dimensions.height
                      ) && <div className="validation-message">{t('required', 'Required')}</div>}
                    </div>

                    {/* Weight per unit */}
                    <div className="weight-section-compact">
                      <label className="label-text-compact">
                        {t('weightPerUnit', 'Weight (Per unit)')}
                      </label>
                      <div className="weight-input-row">
                        <input
                          type="number"
                          placeholder={t('weight', 'Weight')}
                          className="weight-input-compact"
                          value={currentLoad.weightPerUnit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({ weightPerUnit: e.target.value })
                          }
                        />
                        <CustomDropdown
                          value={currentLoad.weightUnit || 'KG'}
                          onChange={(v: string) => updateActiveLoad({ weightUnit: v })}
                          options={[
                            { value: 'KG', label: 'KG' },
                            { value: 'LB', label: 'LB' },
                            { value: 'T', label: 'T' },
                          ]}
                          compact
                          unitSelector
                        />
                      </div>
                      {!currentLoad.weightPerUnit && (
                        <div className="validation-message">{t('required', 'Required')}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {currentLoad.calculationType === 'total' && (
                <div className="total-shipment-details">
                  {/* Info banner */}
                  <div
                    className="info-banner-total"
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Info size={20} className="info-icon" />
                    <span>
                      {t(
                        'totalInfo',
                        'Providing total shipment figures can be less precise. Inaccurate or oversized dimensions may lead to additional charges.'
                      )}
                    </span>
                  </div>
                  <div
                    className="total-description"
                    style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.75rem' }}
                  >
                    {t(
                      'enterTotalDimWeight',
                      'Enter the total dimensions and weight of your shipment.'
                    )}
                  </div>

                  {/* Number of logical units represented by totals */}
                  <div className="total-units-section" style={{ marginBottom: '0.75rem' }}>
                    <label className="label-text-compact">{t('numUnits', '# of units')}</label>
                    <div
                      className="input-number-wrapper-compact"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <button
                        type="button"
                        className="btn-number-control-compact"
                        onClick={() =>
                          updateActiveLoad({
                            numberOfUnits: Math.max(1, (currentLoad.numberOfUnits || 1) - 1),
                          })
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        className="input-number-compact"
                        min={1}
                        value={currentLoad.numberOfUnits || 1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateActiveLoad({
                            numberOfUnits: Math.max(1, parseInt(e.target.value || '1', 10)),
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn-number-control-compact"
                        onClick={() =>
                          updateActiveLoad({ numberOfUnits: (currentLoad.numberOfUnits || 1) + 1 })
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div
                      className="field-help"
                      style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}
                    >
                      {t(
                        'numUnitsHelp',
                        'How many logical units does this total volume/weight represent?'
                      )}
                    </div>
                  </div>

                  {/* Totals inputs */}
                  <div
                    className="total-inputs-row"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                  >
                    {/* Total Volume */}
                    <div className="total-volume-section">
                      <label className="label-text-compact">
                        {t('totalVolume', 'Total Volume')}
                      </label>
                      <div
                        className="total-input-group"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                      >
                        <input
                          type="number"
                          className="total-input-compact"
                          value={currentLoad.totalVolume}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({ totalVolume: e.target.value })
                          }
                        />
                        <CustomDropdown
                          value={currentLoad.totalVolumeUnit || 'CBM'}
                          onChange={(v: string) => updateActiveLoad({ totalVolumeUnit: v })}
                          options={[
                            { value: 'CBM', label: 'CBM (m³)' },
                            { value: 'CFT', label: 'CFT (ft³)' },
                          ]}
                          compact
                          unitSelector
                        />
                      </div>
                      {!currentLoad.totalVolume && (
                        <div className="validation-message">{t('required', 'Required')}</div>
                      )}
                    </div>

                    {/* Total Weight */}
                    <div className="total-weight-section">
                      <label className="label-text-compact">
                        {t('totalWeight', 'Total Weight')}
                      </label>
                      <div
                        className="total-input-group"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                      >
                        <input
                          type="number"
                          className="total-input-compact"
                          value={currentLoad.totalWeight}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateActiveLoad({ totalWeight: e.target.value })
                          }
                        />
                        <CustomDropdown
                          value={currentLoad.totalWeightUnit || 'KG'}
                          onChange={(v: string) => updateActiveLoad({ totalWeightUnit: v })}
                          options={[
                            { value: 'KG', label: 'KG' },
                            { value: 'LB', label: 'LB' },
                            { value: 'T', label: 'T' },
                          ]}
                          compact
                          unitSelector
                        />
                      </div>
                      {!currentLoad.totalWeight && (
                        <div className="validation-message">{t('required', 'Required')}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Micro step 2 – Container details */}
        {currentLoad.shippingType === 'container' && (
          <div className="cargo-details-phase" style={{ marginTop: '2rem' }}>
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
                <span className="step-indicator">2</span>
                {t('configureContainer', 'Configure your container')}
              </h3>
              <p className="phase-header-subtitle">
                {t(
                  'selectContainerTypeQty',
                  'Select container type and quantity for your shipment'
                )}
              </p>
            </div>

            <div
              className="container-details"
              style={{
                background: 'rgba(255,255,255,0.35)',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                padding: '1rem',
              }}
            >
              {/* Info banner */}
              <div
                className="info-banner"
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Info size={20} className="info-icon" />
                <span>
                  {t(
                    'containerInfo',
                    'Select the container type and quantity that best fits your cargo volume.'
                  )}
                </span>
              </div>

              {/* Type + quantity */}
              <div
                className="flex flex-col md:flex-row md:items-baseline md:gap-x-6 mb-6"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                  marginBottom: '1rem',
                }}
              >
                <div
                  className="form-control items-center flex-grow md:flex-1"
                  style={{ flex: 1, minWidth: 240 }}
                >
                  <label className="label-text" style={{ marginBottom: '0.5rem' }}>
                    {t('containerType', 'Container type')}
                  </label>
                  <CustomDropdown
                    value={currentLoad.containerType || "20'"}
                    onChange={(v: string) =>
                      updateActiveLoad({
                        containerType: v as unknown as LoadDetails['containerType'],
                      })
                    }
                    options={[
                      { value: "20'", label: "20' Standard (33 CBM)" },
                      { value: "40'", label: "40' Standard (67 CBM)" },
                      { value: "40'HC", label: "40' High Cube (76 CBM)" },
                      { value: "45'HC", label: "45' High Cube (86 CBM)" },
                    ]}
                  />
                </div>

                <div className="form-control items-center" style={{ minWidth: 220 }}>
                  <label className="label-text" style={{ marginBottom: '0.5rem' }}>
                    {t('numContainers', 'Number of containers')}
                  </label>
                  <div
                    className="input-number-wrapper"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <button
                      type="button"
                      className="btn-number-control"
                      onClick={() =>
                        updateActiveLoad({
                          numberOfUnits: Math.max(1, (currentLoad.numberOfUnits || 1) - 1),
                        })
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      className="input glassmorphism"
                      min={1}
                      value={currentLoad.numberOfUnits || 1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateActiveLoad({
                          numberOfUnits: Math.max(1, parseInt(e.target.value || '1', 10)),
                        })
                      }
                    />
                    <button
                      type="button"
                      className="btn-number-control"
                      onClick={() =>
                        updateActiveLoad({ numberOfUnits: (currentLoad.numberOfUnits || 1) + 1 })
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Overweight checkbox */}
              <div className="form-control">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!currentLoad.isOverweight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateActiveLoad({ isOverweight: e.target.checked })
                    }
                  />
                  <span>{t('overweightContainer', 'Overweight container (>25 tons)')}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Micro step 2 reset: removed total mode (not used for now) */}

        {/* Micro step 2 reset: removed container tip */}

        {/* Micro step 2 reset: removed summary */}

        {/* Micro step 2 reset: removed container type chooser */}

        {/* Micro step 2 reset: removed advanced zone */}
      </div>
    </FormStep>
  );
};

export default memo(StepFreight);
