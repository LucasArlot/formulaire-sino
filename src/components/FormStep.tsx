import React from 'react';

interface FormStepProps {
  isVisible: boolean;
  stepNumber: number;
  title: string;
  emoji: string;
  children: React.ReactNode;
  hideStepNumber?: boolean;
}

const FormStep: React.FC<FormStepProps> = ({ 
  isVisible, 
  stepNumber, 
  title, 
  emoji, 
  children,
  hideStepNumber = false
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="form-step">
      <div className="step-header">
        <h2>
          {!hideStepNumber && <span className="step-number">{stepNumber}.</span>} {title} <span className="step-emoji">{emoji}</span>
        </h2>
      </div>
      <div className="step-content">
        {children}
      </div>
    </div>
  );
};

export default FormStep;