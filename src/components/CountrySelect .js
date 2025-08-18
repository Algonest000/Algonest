import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { countries } from 'country-list';

const CountrySelect = ({ value, onChange }) => {
  // Get all countries with their codes and names
  const countryList = Object.entries(countries).map(([code, name]) => ({
    code,
    name
  }));

  // Sort countries alphabetically
  countryList.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full mb-4 px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select Country</option>
      {countryList.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name} ({country.code})
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;