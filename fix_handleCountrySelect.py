import re

# Read the file
with open('src/features/lead/QuoteFormContext.tsx', 'r') as f:
    content = f.read()

# Find and replace the handleCountrySelect function (lines 400-427 approximately)
old_pattern = r'  // Handler migrated from QuoteForm\.tsx \(simplified\)\s+const handleCountrySelect = useCallback\(\s+\(countryCode: string\) => \{[^}]+\}[^}]+\}[^}]+\},\s+\[[^\]]+\]\s+\);'

new_function = '''  // Handler migrated from QuoteForm.tsx (COMPLETE VERSION)
  const handleCountrySelect = useCallback(
    (countryCode: string) => {
      const selectedCountryData = COUNTRIES.find(c => c.code === countryCode);
      
      if (selectedCountryData) {
        setFormData(prevFormData => ({
          ...prevFormData,
          country: selectedCountryData.code,
          phoneCountryCode: selectedCountryData.phonePrefix || prevFormData.phoneCountryCode 
        }));

        setFieldValid(prevFieldValid => ({
          ...prevFieldValid,
          country: true
        }));

        // Update the countrySearch input display
        setCountrySearch(`${selectedCountryData.flag} ${getTranslatedCountryName(selectedCountryData.code, userLang)}`);

        // Update the phonePrefixSearch state
        if (selectedCountryData.phonePrefix) {
          setPhonePrefixSearch(`${selectedCountryData.flag} ${selectedCountryData.phonePrefix}`);
        } else {
          const currentPhoneCountry = COUNTRIES.find(c => c.phonePrefix === formData.phoneCountryCode);
          if (currentPhoneCountry) {
            setPhonePrefixSearch(`${currentPhoneCountry.flag} ${formData.phoneCountryCode}`);
          } else {
            setPhonePrefixSearch(formData.phoneCountryCode);
          }
        }
      } else {
        // Fallback if countryCode didn't match any country
        setFormData(prevFormData => ({
          ...prevFormData,
          country: countryCode
        }));
        setFieldValid(prevFieldValid => ({
          ...prevFieldValid,
          country: true
        }));
        setCountrySearch('');
        const fallbackCountry = COUNTRIES.find(c => c.phonePrefix === formData.phoneCountryCode);
        if (fallbackCountry) {
          setPhonePrefixSearch(`${fallbackCountry.flag} ${formData.phoneCountryCode}`);
        } else {
          setPhonePrefixSearch(formData.phoneCountryCode);
        }
      }
      setIsCountryListVisible(false);
      
      // If newly selected country does not support rail freight and Rail was selected, reset mode
      const RAIL_FREIGHT_COUNTRIES = [
        'AT','BE','BG','CH','CZ','DE','DK','EE','ES','FI','FR','GB','HU','IT','LT','LV','NL','NO','PL','PT','RO','SE','SI','SK','UA','RU','BY','KZ','MN'
      ];
      if (!RAIL_FREIGHT_COUNTRIES.includes(countryCode) && formData.mode === 'Rail') {
        setFormData(prev => ({ ...prev, mode: '' }));
        setFieldValid(prev => ({ ...prev, mode: null }));
      }
      
      // Usage tracking
      try {
        const key = 'countryUsage';
        const usageRaw = localStorage.getItem(key);
        const usageObj: Record<string, number> = usageRaw ? JSON.parse(usageRaw) : {};
        usageObj[countryCode] = (usageObj[countryCode] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(usageObj));
      } catch (err) { /* ignore quota errors */ }
    },
    [userLang, formData.phoneCountryCode, formData.mode, setFormData, setFieldValid, setCountrySearch, setPhonePrefixSearch, setIsCountryListVisible]
  );'''

# Replace using a more specific pattern
lines = content.split('\n')
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'const handleCountrySelect = useCallback(' in line:
        start_idx = i - 1  # Include the comment line
        break

if start_idx != -1:
    bracket_count = 0
    for i in range(start_idx, len(lines)):
        line = lines[i]
        if 'useCallback(' in line:
            bracket_count = 1
        bracket_count += line.count('(') - line.count(')')
        if bracket_count == 0 and i > start_idx:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + new_function.split('\n') + lines[end_idx+1:]
    new_content = '\n'.join(new_lines)
    
    with open('src/features/lead/QuoteFormContext.tsx', 'w') as f:
        f.write(new_content)
    print(f"Replaced handleCountrySelect function (lines {start_idx}-{end_idx})")
else:
    print("Could not find handleCountrySelect function to replace")
