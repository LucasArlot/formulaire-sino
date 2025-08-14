import React from 'react';
import CustomSelect from '@/shared/components/CustomSelect';

interface Port {
  code: string;
  name: string;
  flag: string;
  type: 'sea' | 'air' | 'rail' | 'unknown';
  volume?: string;
}

interface Props {
  ports: Port[];
  value: string;
  onSelect: (code: string) => void;
  placeholder: string;
  renderLabels?: {
    volumeLabel: string;
    getTypeLabel: (type: Port['type']) => string;
  }
}

const DestinationPortSelect: React.FC<Props> = ({
  ports,
  value,
  onSelect,
  placeholder,
  renderLabels,
}) => {
  const options = ports.map((p) => ({
    value: p.code,
    label: `${p.flag} ${p.name}`,
    original: p,
  }));

  return (
    <CustomSelect
      options={options}
      value={value || null}
      onChange={onSelect}
      placeholder={placeholder}
      searchable
      renderOption={(opt) => {
        const p: Port = opt.original;
        return (
          <div className="flex items-center">
            <span className="mr-3">{p.flag}</span>
            <div>
              <span className="font-semibold">{p.name}</span>
              <div className="text-xs text-gray-500">
                {renderLabels?.getTypeLabel(p.type)}
                {p.volume && ` • ${renderLabels?.volumeLabel}: ${p.volume}`}
              </div>
            </div>
            <span className="ml-auto font-mono text-xs opacity-60">{p.code}</span>
          </div>
        );
      }}
      renderValue={(opt) => {
        const p: Port = opt.original;
        return (
          <div className="flex items-center">
            <span className="mr-2">{p.flag}</span>
            <span>{p.name}</span>
          </div>
        );
      }}
    />
  );
};

export default DestinationPortSelect; 