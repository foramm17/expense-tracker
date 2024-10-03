import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTION } from '../graphql/queries/transaction.query.js';
import { UPDATE_TRANSACTION } from '../graphql/mutations/transaction.mutation.js';
import toast from 'react-hot-toast';
import TransactionFormFields from '../components/forms/TransactionFormFields.jsx';
import TransactionFormSkeleton from '../components/skeletons/TransactionFormSkeleton.jsx';

const TransactionPage = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_TRANSACTION, {
    variables: { id },
  });

  const [updateTransaction, { loading: loadingUpdate }] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: ['GetTransaction', 'GetTransactionStatistics'],
    }
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      reset({
        description: data.transaction.description,
        paymentType: data.transaction.paymentType,
        category: data.transaction.category,
        amount: data.transaction.amount,
        location: data.transaction.location,
        date: new Date(+data.transaction.date).toISOString().substr(0, 10),
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    const amount = parseFloat(formData.amount);
    try {
      await updateTransaction({
        variables: {
          input: {
            ...formData,
            amount,
            transactionId: id,
          },
        },
      });
      toast.success('Transaction updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col items-center">
      <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
        Update this transaction
      </p>
      <form
        className="w-full max-w-lg flex flex-col gap-5 px-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TransactionFormFields control={control} errors={errors} />
        <button
          className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600"
          type="submit"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? 'Updating...' : 'Update Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionPage;
