import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devURL, setDevURL] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const { data } = await API.post(
        '/api/auth/forgot-password',
        { email }
      );

      setSent(true);

      if (data.devResetURL)
        setDevURL(data.devResetURL);

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        'Something went wrong'
      );

    }
    finally {

      setLoading(false);

    }

  };


  // SUCCESS SCREEN
  if (sent) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">

          <div className="text-6xl mb-4">
            📬
          </div>


          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>


          <p className="text-gray-500 mb-4">
            If
            <span className="font-semibold text-green-700">
              {" "}{email}
            </span>
            {" "}exists, a reset link has been sent.
          </p>


          {/* DEV MODE LINK */}
          {devURL && (

            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4 text-left">

              <p className="text-xs font-bold text-yellow-800 mb-1">
                🛠️ Dev Mode — Reset Link:
              </p>


              <a
                href={devURL}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-xs break-all hover:underline"
              >
                {devURL}
              </a>

            </div>

          )}


          <Link
            to="/login"
            className="text-green-600 hover:underline text-sm"
          >
            ← Back to Login
          </Link>


        </div>

      </div>

    );

  }


  // FORM SCREEN
  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">


        <div className="text-center mb-8">

          <div className="text-5xl mb-3">
            🔑
          </div>


          <h1 className="text-3xl font-bold text-green-700">
            Forgot Password
          </h1>


          <p className="text-gray-500 mt-1">
            Enter your email to reset your password
          </p>


        </div>


        {error && (

          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">

            {error}

          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Email Address

            </label>


            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />


          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >

            {loading
              ? 'Sending...'
              : 'Send Reset Link'}

          </button>


        </form>


        <p className="text-center text-gray-500 mt-6 text-sm">

          Remember your password?{" "}

          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Sign in
          </Link>

        </p>


      </div>

    </div>

  );

};

export default ForgotPasswordPage;