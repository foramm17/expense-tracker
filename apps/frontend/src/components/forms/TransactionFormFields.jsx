import React from 'react';
import { Controller } from 'react-hook-form';
import InputField from '../ui/InputField.jsx';
import SelectField from '../ui/SelectField.jsx';

const TransactionFormFields = ({ control, errors }) => (
  <>
    <InputField
      name="description"
      label="Transaction"
      control={control}
      rules={{ required: 'Description is required' }}
      placeholder="Rent, Groceries, Salary, etc."
    />
    <div className="flex flex-wrap gap-3">
      <SelectField
        name="paymentType"
        label="Payment Type"
        control={control}
        options={[
          { value: 'card', label: 'Card' },
          { value: 'cash', label: 'Cash' },
        ]}
      />
      <SelectField
        name="category"
        label="Category"
        control={control}
        options={[
          { value: 'saving', label: 'Saving' },
          { value: 'expense', label: 'Expense' },
          { value: 'investment', label: 'Investment' },
        ]}
      />
      <InputField
        name="amount"
        label="Amount"
        control={control}
        rules={{
          required: 'Amount is required',
          min: { value: 0, message: 'Amount must be positive' },
        }}
        type="number"
        placeholder="150"
      />
    </div>
    <div className="flex flex-wrap gap-3">
      <InputField
        name="location"
        label="Location"
        control={control}
        placeholder="New York"
      />
      <InputField
        name="date"
        label="Date"
        control={control}
        rules={{ required: 'Date is required' }}
        type="date"
      />
    </div>
  </>
);

export default TransactionFormFields;
