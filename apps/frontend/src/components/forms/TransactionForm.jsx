import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../../graphql/mutations/transaction.mutation.js';
import toast from 'react-hot-toast';
import TransactionFormFields from './TransactionFormFields.jsx';

const TransactionForm = () => {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionStatistics'],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      description: '',
      paymentType: 'card',
      category: 'saving',
      amount: '',
      location: '',
      date: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const transactionData = {
        ...data,
        amount: parseFloat(data.amount),
      };
      await createTransaction({ variables: { input: transactionData } });
      reset();
      toast.success('Transaction created successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="w-full max-w-lg flex flex-col gap-5 px-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TransactionFormFields control={control} errors={errors} />
      <button
        className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600
          disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
