import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminZipCodeManager = () => {
  const [zipCodes, setZipCodes] = useState([]);
  const [newZip, setNewZip] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch current zip codes on mount
  useEffect(() => {
    API.get('/api/admin/zipcodes')
      .then(({ data }) => setZipCodes(data.adminZipCodes || []))
      .catch(() => setError('Failed to load zip codes'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    const trimmed = newZip.trim();
    if (!trimmed) return;
    if (zipCodes.includes(trimmed)) {
      setError('Zip code already added');
      return;
    }
    setZipCodes([...zipCodes, trimmed]);
    setNewZip('');
    setError('');
  };

  const handleRemove = (zip) => {
    setZipCodes(zipCodes.filter(z => z !== zip));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const { data } = await API.put('/api/admin/zipcodes', {
        adminZipCodes: zipCodes,
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = () => {
    setZipCodes([]);
    setMessage('');
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        📍 Zip Code Visibility
      </h3>
      <p className="text-sm text-gray-500 mb-5">
        Control which zip codes you see on the dashboard.
        Leave empty to see <span className="font-semibold text-green-700">ALL zip codes</span>.
      </p>

      {/* Current Mode Banner */}
      <div className={`rounded-xl px-4 py-3 mb-5 flex items-center gap-2 ${
        zipCodes.length === 0
          ? 'bg-green-50 border border-green-200'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <span className="text-xl">
          {zipCodes.length === 0 ? '🌍' : '📌'}
        </span>
        <div>
          <p className={`text-sm font-semibold ${
            zipCodes.length === 0 ? 'text-green-700' : 'text-blue-700'
          }`}>
            {zipCodes.length === 0
              ? 'Currently viewing ALL zip codes'
              : `Currently viewing ${zipCodes.length} zip code(s)`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {zipCodes.length === 0
              ? 'Add specific zip codes to filter your view'
              : 'Remove all to see everything again'}
          </p>
        </div>
      </div>

      {/* Add New Zip Code */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newZip}
          onChange={(e) => setNewZip(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Enter zip code e.g. 10001"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
        >
          + Add
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {/* Zip Code Tags */}
      {zipCodes.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-5">
          {zipCodes.map((zip) => (
            <div
              key={zip}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              📍 {zip}
              <button
                onClick={() => handleRemove(zip)}
                className="text-blue-400 hover:text-red-500 transition ml-1 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm mb-5 border border-dashed border-gray-200 rounded-xl">
          No zip codes added — showing all items
        </div>
      )}

      {/* Success message */}
      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">
          ✅ {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
        {zipCodes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminZipCodeManager;