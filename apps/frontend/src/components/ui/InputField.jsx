import React from 'react';
import { Controller } from 'react-hook-form';

const InputField = ({ name, label, control, rules, ...props }) => (
  <div className="w-full flex-1 mb-6 md:mb-0">
    <label
      className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <input
          {...field}
          {...props}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id={name}
        />
      )}
    />
  </div>
);

export default InputField;
