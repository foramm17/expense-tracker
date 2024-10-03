import React from 'react';
import { Controller } from 'react-hook-form';

const SelectField = ({ name, label, control, options, ...props }) => (
  <div className="w-full flex-1 mb-6 md:mb-0">
    <label
      className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            {...props}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id={name}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);

export default SelectField;
