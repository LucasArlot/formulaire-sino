import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../styles/customSelect.css';

interface Option {
  value: string;
  label: string;
  flag?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  renderOption?: (option: Option) => React.ReactNode;
  renderValue?: (option: Option) => React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  className = '',
  renderOption,
  renderValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({
    showAbove: false,
    adjustRight: false,
    adjustLeft: false,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Auto-positioning logic for dropdown to prevent overflow
  useEffect(() => {
    const adjustDropdownPosition = () => {
      if (!dropdownRef.current || !triggerRef.current || !isOpen) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = Math.min(300, filteredOptions.length * 48 + (searchable ? 60 : 0)); // Estimate dropdown height

      // Calculate available space
      const spaceBelow = viewportHeight - triggerRect.bottom - 20; // 20px padding
      const spaceAbove = triggerRect.top - 20; // 20px padding
      const spaceRight = viewportWidth - triggerRect.left;
      const spaceLeft = triggerRect.right;

      const newPosition = {
        showAbove: false,
        adjustRight: false,
        adjustLeft: false,
      };

      // Vertical positioning - show above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        newPosition.showAbove = true;
      }

      // Horizontal positioning - adjust if dropdown would overflow
      const dropdownMinWidth = 200;
      if (spaceRight < dropdownMinWidth) {
        newPosition.adjustRight = true;
      } else if (spaceLeft < dropdownMinWidth) {
        newPosition.adjustLeft = true;
      }

      setDropdownPosition(newPosition);

      // Set CSS custom property for dynamic max-height calculation
      if (dropdownRef.current) {
        dropdownRef.current.style.setProperty('--dropdown-top', `${triggerRect.bottom}px`);
        dropdownRef.current.style.setProperty('--available-space-bottom', `${spaceBelow}px`);
        dropdownRef.current.style.setProperty('--available-space-above', `${spaceAbove}px`);
      }
    };

    if (isOpen) {
      // Delay to ensure dropdown is rendered
      const timer = setTimeout(adjustDropdownPosition, 10);

      // Also adjust on window resize
      window.addEventListener('resize', adjustDropdownPosition);
      window.addEventListener('scroll', adjustDropdownPosition);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', adjustDropdownPosition);
        window.removeEventListener('scroll', adjustDropdownPosition);
      };
    }
  }, [isOpen, filteredOptions.length, searchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Build dropdown classes
  const dropdownClasses = [
    'custom-select-dropdown',
    'glassmorphism',
    dropdownPosition.showAbove ? 'show-above' : '',
    dropdownPosition.adjustRight ? 'adjust-right' : '',
    dropdownPosition.adjustLeft ? 'adjust-left' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`custom-select-wrapper ${className}`} ref={wrapperRef}>
      <div
        ref={triggerRef}
        className={`custom-select-trigger glassmorphism ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <div className="custom-select-value">
          {selectedOption ? (
            renderValue ? (
              renderValue(selectedOption)
            ) : (
              selectedOption.label
            )
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={20} className={`custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div ref={dropdownRef} className={dropdownClasses}>
          {searchable && (
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="custom-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {renderOption ? renderOption(option) : option.label}
                </div>
              ))
            ) : (
              <div className="no-results">No options found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
