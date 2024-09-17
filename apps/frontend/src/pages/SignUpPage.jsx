import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RadioButton from '../components/RadioButton.jsx';
import InputField from '../components/InputField.jsx';

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to keep track of your expenses
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                register={register}
                required="Name is required"
                error={errors.name}
              />
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
              <div className="flex gap-10">
                <RadioButton
                  id="male"
                  label="Male"
                  name="gender"
                  value="male"
                  register={register}
                  required="Gender is required"
                />
                <RadioButton
                  id="female"
                  label="Female"
                  name="gender"
                  value="female"
                  register={register}
                  required="Gender is required"
                />
              </div>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-black hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
