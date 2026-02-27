import { useState, useEffect } from 'react';
import API from '../api/axios';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ item, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [canReviewData, setCanReviewData] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item?._id && item?.status === 'Gifted') {
      API.get(`/api/reviews/can-review/${item._id}`)
        .then(({ data }) => setCanReviewData(data))
        .catch(() => {});
    }
  }, [item]);

  if (!canReviewData || !canReviewData.canReview) return null;

  const revieweeId =
    canReviewData.role === 'seller_to_buyer'
      ? null // seller needs buyer ID — handled below
      : item.owner?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        itemId: item._id,
        rating,
        feedback,
        role: canReviewData.role,
      };

      // For seller rating buyer — we pass buyer from item interactions
      // Since we don't track buyer explicitly, we skip seller_to_buyer
      // in this simplified version (can be extended)

      await API.post('/api/reviews', payload);
      setSubmitted(true);
      onReviewSubmitted && onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-green-700 font-bold">Review submitted!</p>
        <p className="text-green-600 text-sm mt-1">Thank you for your feedback</p>
      </div>
    );
  }

  if (canReviewData.alreadyReviewed) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
        <p className="text-gray-500 text-sm">✅ You have already reviewed this transaction</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-green-200 rounded-2xl p-6">
      <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
        ⭐ Rate This Transaction
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        {canReviewData.role === 'buyer_to_seller'
          ? `Rate your experience with ${item.owner?.name}`
          : 'Rate the buyer'}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Share your experience..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">{feedback.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : '⭐ Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
