import { useState, useEffect } from 'react';
import API from '../api/axios';
import StarRating from './StarRating';

const ReviewsList = ({ userId, itemId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = userId
      ? `/api/reviews/user/${userId}`
      : `/api/reviews/item/${itemId}`;

    API.get(url)
      .then(({ data }) => setReviews(data))
      .finally(() => setLoading(false));
  }, [userId, itemId]);

  if (loading) return (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
    </div>
  );

  if (reviews.length === 0) return (
    <div className="text-center py-4 text-gray-400 text-sm">
      No reviews yet
    </div>
  );

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                {review.reviewer?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {review.reviewer?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <StarRating value={review.rating} readonly size="sm" />
          </div>

          {review.feedback && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              "{review.feedback}"
            </p>
          )}

          {review.item?.title && (
            <p className="text-xs text-green-600 mt-2">
              📦 {review.item.title}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
