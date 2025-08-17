import React from 'react';
import { Check } from 'lucide-react';
import '@/styles/timeline.css';

interface TimelineProps {
  currentStep: number;
  totalSteps: number;
  translations: {
    timelineDestination: string;
    timelineMode: string;
    timelineOrigin: string;
    timelineCargo: string;
    timelineGoodsDetails: string;
    timelineContact: string;
    stepCounter: string;
  };
}

const Timeline: React.FC<TimelineProps> = ({ currentStep, totalSteps, translations }) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const formatStepCounter = (template: string): string => {
    if (!template) return `${currentStep}/${totalSteps}`;
    const replaced = template
      .replace('{current}', String(currentStep))
      .replace('{total}', String(totalSteps));
    if (replaced.includes('{current}') || replaced.includes('{total}')) {
      return `${currentStep}/${totalSteps}`;
    }
    return replaced;
  };

  const timelineItems = [
    { icon: '🌍', label: translations.timelineDestination },
    { icon: '🚢', label: translations.timelineMode },
    { icon: '🇨🇳', label: translations.timelineOrigin },
    { icon: '📦', label: translations.timelineCargo },
    { icon: '📝', label: translations.timelineGoodsDetails },
    { icon: '📱', label: translations.timelineContact },
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-progress">
        {timelineItems.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className={`timeline-item ${currentStep > index + 1 ? 'completed' : currentStep === index + 1 ? 'active' : ''}`}
            >
              <div className="timeline-icon">
                {currentStep > index + 1 ? <Check size={18} /> : item.icon}
              </div>
              <span className="timeline-label">{item.label}</span>
            </div>

            {index < timelineItems.length - 1 && (
              <div className="timeline-connector">
                <div
                  className="timeline-connector-fill"
                  style={{
                    width:
                      currentStep > index + 1 ? '100%' : currentStep === index + 1 ? '50%' : '0%',
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="timeline-info">
        <span className="timeline-step-count">{formatStepCounter(translations.stepCounter)}</span>
        <span className="timeline-percentage">{progressPercent}%</span>
      </div>
    </div>
  );
};

export default Timeline;
