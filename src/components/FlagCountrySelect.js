import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const FlagCountrySelect = ({ value, onChange }) => {
  // List of common countries with codes, names, and calling codes
  const countries = [
    { code: 'US', name: 'United States', callingCode: '+1' },
    { code: 'GB', name: 'United Kingdom', callingCode: '+44' },
    { code: 'CA', name: 'Canada', callingCode: '+1' },
    { code: 'AU', name: 'Australia', callingCode: '+61' },
    { code: 'IN', name: 'India', callingCode: '+91' },
    { code: 'JP', name: 'Japan', callingCode: '+81' },
    { code: 'DE', name: 'Germany', callingCode: '+49' },
    { code: 'FR', name: 'France', callingCode: '+33' },
    { code: 'BR', name: 'Brazil', callingCode: '+55' },
    { code: 'NG', name: 'Nigeria', callingCode: '+234' },
    { code: 'ZA', name: 'South Africa', callingCode: '+27' },
    { code: 'KE', name: 'Kenya', callingCode: '+254' },
    // Add more countries as needed
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full mb-4 px-4 py-2 pl-12 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.callingCode})
          </option>
        ))}
      </select>
      {value && (
        <div className="absolute left-3 top-2.5">
          <ReactCountryFlag
            countryCode={value}
            svg
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
            title={value}
          />
        </div>
      )}
    </div>
  );
};

export default FlagCountrySelect;