import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = ['Giveaway', 'Lend', 'Trade'];
const ITEM_CATEGORIES = ['Electronics', 'Books', 'Tools', 'Clothing', 'Furniture', 'Sports', 'Other'];

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/api/items/${id}`).then(({ data }) => {
      setForm({
        title: data.title,
        description: data.description,
        category: data.category,
        itemCategory: data.itemCategory,
        sustainabilityRating: data.sustainabilityRating,
        price: data.price || 0,
      });
      if (data.image) setPreview(data.image);
    });
  }, [id]);

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
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);
      await API.put(`/api/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/item/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">✏️ Edit Listing</h1>
        <p className="text-gray-500 mb-6">Update your item details</p>

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

          {/* Price - only for Lend */}
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
              <p className="text-xs text-gray-400 mt-1">Enter 0 for free lending</p>
            </div>
          )}

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
              Item Image
            </label>
            {preview && (
              <img
                src={preview} alt="Current"
                className="mb-3 h-40 w-full object-cover rounded-xl"
              />
            )}
            <input
              type="file" accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to keep current image
            </p>
          </div>

          {/* Lend guidelines */}
          {form.category === 'Lend' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
              <p className="font-semibold mb-1">📋 Lending Guidelines:</p>
              <p>• Set a fair daily price or offer for free</p>
              <p>• Agree on return date with the borrower</p>
              <p>• Meet in a public place for handover</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '✅ Save Changes'}
            </button>
            <button
              type="button" onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;