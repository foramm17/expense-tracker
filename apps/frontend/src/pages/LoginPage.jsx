import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputField from '../components/InputField.jsx';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations/user.mutation.js';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { loading }] = useMutation(LOGIN, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const onSubmit = async (data) => {
    if (!data.username || !data.password)
      return toast.error('Please fill in all fields');
    try {
      console.log('Form data:', data);
      const response = await login({
        variables: {
          input: data,
        },
      });
      console.log('Login response:', response);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Login
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Welcome back! Log in to your account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <InputField
                label="Username"
                id="username"
                name="username"
                register={register}
                required="Username is required"
                error={errors.username}
              />
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                register={register}
                required="Password is required"
                error={errors.password}
              />
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-black hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
