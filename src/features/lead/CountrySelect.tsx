import React from 'react';
import CustomSelect from '@/shared/components/CustomSelect';
import { COUNTRIES } from '@/data/countries';
interface Props {
  value: string;
  onSelect: (code: string) => void;
  placeholder: string;
  getTranslatedCountryName: (code: string) => string;
}

const CountrySelect: React.FC<Props> = ({ value, onSelect, placeholder, getTranslatedCountryName }) => {
  const options = COUNTRIES.map(c => ({
    value: c.code,
    label: `${c.flag} ${getTranslatedCountryName(c.code)}`,
    flag: c.flag,
    code: c.code,
  }));

  return (
    <CustomSelect
      options={options}
      value={value || null}
      onChange={onSelect}
      placeholder={placeholder}
      searchable
      renderOption={(opt) => (
        <div className="flex items-center">
          <span className="mr-3">{opt.flag}</span>
          <span>{opt.label}</span>
        </div>
      )}
      renderValue={(opt) => (
        <div className="flex items-center">
          <span className="mr-2">{opt.flag}</span>
          <span>{opt.label}</span>
        </div>
      )}
    />
  );
};

export default CountrySelect; 