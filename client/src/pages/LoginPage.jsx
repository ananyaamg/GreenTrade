import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      await login(
        form.email,
        form.password
      );

      navigate('/dashboard');

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        'Login failed'
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">


        {/* Header */}
        <div className="text-center mb-8">

          <div className="text-5xl mb-3">
            🌿
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-1">
            Sign in to GreenTrade
          </p>

        </div>


        {/* Error */}
        {error && (

          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">

            {error}

          </div>

        )}


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Email

            </label>


            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>


          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Password

            </label>


            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>


          {/* ✅ Forgot Password Link */}
          <div className="text-right">

            <Link
              to="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Forgot password?
            </Link>

          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >

            {loading
              ? 'Signing in...'
              : 'Sign In'}

          </button>


        </form>


        {/* Register */}
        <p className="text-center text-gray-500 mt-6 text-sm">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >

            Register here

          </Link>

        </p>


      </div>

    </div>

  );

};

export default LoginPage;