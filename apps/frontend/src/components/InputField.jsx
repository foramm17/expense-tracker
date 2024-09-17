const InputField = ({
  label,
  id,
  name,
  type = 'text',
  register,
  required,
  error,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="mt-1 p-2 w-full border rounded-md text-black focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        id={id}
        type={type}
        {...register(name, { required })}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
