import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Extracted from QuoteForm.tsx to make the dropdown reusable across the application.
 * Props and behaviour are kept identical so that the visual result remains unchanged.
 */
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  compact?: boolean;
  unitSelector?: boolean;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  compact = false,
  unitSelector = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Auto-position to avoid viewport overflow (same logic as original)
  useEffect(() => {
    if (isOpen && listRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const listElement = listRef.current;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      listElement.classList.remove('show-above', 'adjust-left', 'adjust-right');

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        listElement.classList.add('show-above');
      }

      const listWidth = 200; // approx.
      const viewportWidth = window.innerWidth;
      if (triggerRect.right + listWidth > viewportWidth) {
        listElement.classList.add('adjust-right');
      } else if (triggerRect.left < 0) {
        listElement.classList.add('adjust-left');
      }
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const dropdownClasses = [
    'custom-dropdown',
    compact ? 'compact' : '',
    unitSelector ? 'unit-selector' : '',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={dropdownRef} className={dropdownClasses}>
      <button
        ref={triggerRef}
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-dropdown-text">{displayText}</span>
        <ChevronDown size={16} className="custom-dropdown-icon" />
      </button>

      <div ref={listRef} className={`custom-dropdown-list ${isOpen ? 'show' : ''}`} role="listbox">
        {options.map((option) => (
          <div
            key={option.value}
            className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
            role="option"
            aria-selected={value === option.value}
          >
            <span className="custom-dropdown-option-text">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
