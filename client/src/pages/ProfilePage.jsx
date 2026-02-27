import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (!password) {
      return setError('Please enter your password');
    }
    setDeleting(true);
    setError('');
    try {
      await API.delete('/api/auth/delete-account', {
        data: { password },
      });
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h1>

          <div className="space-y-4">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'ZIP Code', value: user?.zipCode },
              { label: 'Phone', value: user?.phone || 'Not provided' },
              { label: 'Green Points', value: `⭐ ${user?.greenPoints}` },
              { label: 'Badge', value: user?.badge },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500 font-medium">{field.label}</span>
                <span className="text-gray-800 font-semibold">{field.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Security</h2>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-100 transition text-sm"
          >
            🔑 Change / Reset Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-red-100">
          <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">
            Permanently delete your account and all your listings.
            This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-medium hover:bg-red-100 transition text-sm w-full"
          >
            🗑️ Delete My Account
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800">Delete Account?</h2>
              <p className="text-gray-500 mt-2 text-sm">
                This will permanently delete your account and
                all your listings. This cannot be undone.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your current password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                  setError('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
