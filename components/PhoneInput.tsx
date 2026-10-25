import React, { useState } from 'react';
import { describeLeadPhone } from '../lib/leadValidation';

// Compact country selector + phone input. The selected country supplies the
// default region for validation so foreign visitors typing a LOCAL number
// (e.g. a German "0151 ..." without +49) are validated against their own
// country's rules, not misclassified as UAE. Numbers typed with a leading
// "+<code>" always validate against their own country regardless.
export const PHONE_COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: 'AE', name: 'UAE', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'QA', name: 'Qatar', dial: '+974' },
  { code: 'BH', name: 'Bahrain', dial: '+973' },
  { code: 'KW', name: 'Kuwait', dial: '+965' },
  { code: 'OM', name: 'Oman', dial: '+968' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'JO', name: 'Jordan', dial: '+962' },
  { code: 'LB', name: 'Lebanon', dial: '+961' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'PH', name: 'Philippines', dial: '+63' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'IE', name: 'Ireland', dial: '+353' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'ES', name: 'Spain', dial: '+34' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'CH', name: 'Switzerland', dial: '+41' },
  { code: 'TR', name: 'Turkiye', dial: '+90' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'OTHER', name: 'Other (type + code)', dial: '+' },
];

interface PhoneInputProps {
  name?: string;
  countryName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange?: (country: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;      // tel input classes
  selectClassName?: string;
  wrapperClassName?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  name = 'phone', countryName = 'phoneCountry', value, onChange, onCountryChange,
  required = false, placeholder = '50 123 4567', className = '', selectClassName = '', wrapperClassName = '',
}) => {
  const [country, setCountry] = useState('AE');
  const [typed, setTyped] = useState('');
  const selectCountry = (c: string) => { setCountry(c); onCountryChange?.(c); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setTyped(e.target.value); onChange?.(e); };
  const current = value !== undefined ? value : typed;
  const check = describeLeadPhone(current, country);
  let hint = '';
  if (check.valid && check.actualCountry) {
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    const actualName = names.of(check.actualCountry) || check.actualCountry;
    if (country === 'OTHER') hint = `Will be saved as ${check.international} (${actualName}).`;
    else if (check.actualCountry !== country) hint = `This looks like a ${actualName} number: ${check.international}.`;
  }
  return (
    <div className={wrapperClassName}>
      <div className="flex gap-2">
        <select value={country} onChange={e => selectCountry(e.target.value)} aria-label="Country code" className={selectClassName || className.replace(/pl-\d+/g, 'pl-2')} style={selectClassName ? undefined : { width: '7.5rem', flexShrink: 0 }}>
          {PHONE_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} {c.dial}</option>)}
        </select>
        <input type="tel" name={name} value={value} onChange={handleChange} required={required} placeholder={placeholder} className={className} style={{ minWidth: 0 }} />
        <input type="hidden" name={countryName} value={country} />
      </div>
      {hint && <p className="text-xs text-fann-gold mt-1">{hint}</p>}
    </div>
  );
};
export default PhoneInput;
