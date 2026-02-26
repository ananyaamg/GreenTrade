import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = ['Giveaway', 'Lend', 'Trade'];
const ITEM_CATEGORIES = ['Electronics', 'Books', 'Tools', 'Clothing', 'Furniture', 'Sports', 'Other'];
const CO2_PREVIEW = { Electronics: 15, Books: 2, Tools: 5, Clothing: 3, Furniture: 20, Sports: 4, Other: 3 };

const CreateItemPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Giveaway',
    itemCategory: 'Other',
    sustainabilityRating: 3,
    price: 0,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (image) formData.append('image', image);
      await API.post('/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/my-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">📦 List an Item</h1>
          <p className="text-gray-500 mb-6">Share something useful with your community</p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Title
              </label>
              <input
                name="title" value={form.title}
                onChange={handleChange} required
                placeholder="e.g. Old Bicycle"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange} required rows={3}
                placeholder="Describe the item, its condition, etc."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category + Item Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Type
                </label>
                <select
                  name="category" value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Type
                </label>
                <select
                  name="itemCategory" value={form.itemCategory}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {ITEM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Price field - only for Lend */}
            {form.category === 'Lend' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lending Price (₹ per day)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                  <input
                    type="number" name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0" placeholder="0"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter 0 for free lending
                </p>
              </div>
            )}

            {/* CO2 Preview */}
            <div className="bg-green-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="text-sm text-gray-600">Estimated CO₂ savings if traded:</p>
                <p className="text-green-700 font-bold text-lg">
                  ~{CO2_PREVIEW[form.itemCategory]} kg CO₂
                </p>
              </div>
            </div>

            {/* Sustainability Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sustainability Rating: {form.sustainabilityRating}/5
              </label>
              <input
                type="range" name="sustainabilityRating"
                min="1" max="5"
                value={form.sustainabilityRating}
                onChange={handleChange}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low impact</span>
                <span>High impact</span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Image (optional)
              </label>
              <input
                type="file" accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {preview && (
                <img
                  src={preview} alt="Preview"
                  className="mt-3 h-40 w-full object-cover rounded-xl"
                />
              )}
            </div>

            {/* Info box for Lend */}
            {form.category === 'Lend' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                <p className="font-semibold mb-1">📋 Lending Guidelines:</p>
                <p>• Set a fair daily price or offer for free</p>
                <p>• Agree on return date with the borrower</p>
                <p>• Meet in a public place for handover</p>
              </div>
            )}

            {/* Info box for Trade */}
            {form.category === 'Trade' && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
                <p className="font-semibold mb-1">🔄 Trading Guidelines:</p>
                <p>• Describe what you're looking to trade for</p>
                <p>• Be clear about item condition</p>
                <p>• Meet in a public place for exchange</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? 'Publishing...' : '🌿 Publish Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItemPage;