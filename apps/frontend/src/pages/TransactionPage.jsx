import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TransactionFormSkeleton from '../components/skeletons/TransactionFormSkeleton.jsx';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTION } from '../graphql/queries/transaction.query.js';
import { UPDATE_TRANSACTION } from '../graphql/mutations/transaction.mutation.js';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';

const TransactionPage = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_TRANSACTION, {
    variables: { id: id },
  });

  console.log('Transaction', data);

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
  } = useForm({
    defaultValues: {
      description: data?.transaction?.description || '',
      paymentType: data?.transaction?.paymentType || 'card',
      category: data?.transaction?.category || 'saving',
      amount: data?.transaction?.amount || '',
      location: data?.transaction?.location || '',
      date: data?.transaction?.date || '',
    },
  });

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    try {
      await updateTransaction({
        variables: {
          input: {
            ...data,
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
        {/* TRANSACTION */}
        <div className="flex flex-wrap">
          <div className="w-full">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="description"
            >
              Transaction
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="description"
                  type="text"
                  placeholder="Rent, Groceries, Salary, etc."
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        {/* PAYMENT TYPE */}
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex-1 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="paymentType"
            >
              Payment Type
            </label>
            <div className="relative">
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="paymentType"
                  >
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
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

          {/* CATEGORY */}
          <div className="w-full flex-1 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <div className="relative">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="category"
                  >
                    <option value="saving">Saving</option>
                    <option value="expense">Expense</option>
                    <option value="investment">Investment</option>
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

          {/* AMOUNT */}
          <div className="w-full flex-1 mb-6 md:mb-0">
            <label
              className="block uppercase text-white text-xs font-bold mb-2"
              htmlFor="amount"
            >
              Amount($)
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                min: { value: 0, message: 'Amount must be positive' },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="amount"
                  type="number"
                  placeholder="150"
                />
              )}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs italic">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex-1 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="location"
                  type="text"
                  placeholder="New York"
                />
              )}
            />
          </div>

          {/* DATE */}
          <div className="w-full flex-1">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  id="date"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  placeholder="Select date"
                />
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-xs italic">
                {errors.date.message}
              </p>
            )}
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <button
          className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600"
          type="submit"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? 'updating...' : 'Update Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionPage;
