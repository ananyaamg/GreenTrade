import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import StarRating from '../components/StarRating';

const STATUSES = ['Available', 'Pending', 'Gifted'];

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchItem = async () => {
    try {
      const { data } = await API.get(`/api/items/${id}`);
      setItem(data);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const isOwner = item?.owner?._id === user?._id;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await API.put(`/api/items/${id}`, { status: newStatus });
      setItem(data);

      if (newStatus === 'Gifted') {
        const { data: profile } = await API.get('/api/auth/profile');

        updateUser({
          greenPoints: profile.greenPoints,
          badge: profile.badge,
          totalCO2Saved: profile.totalCO2Saved,
        });

        alert(`🎉 +20 Green Points earned! Badge: ${profile.badge}`);
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;

    try {
      await API.delete(`/api/items/${id}`);
      navigate('/my-items');
    } catch {
      alert('Delete failed');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );

  if (!item) return null;

  const imageUrl = item.image
    ? item.image.startsWith('http')
      ? item.image
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/uploads/${item.image}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:underline mb-6"
        >
          ← Back
        </button>


        {/* Pending notice */}
        {!item.isApproved && isOwner && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
            <p className="font-bold text-yellow-800">
              ⏳ Your listing is under review
            </p>
            <p className="text-sm text-yellow-700">
              It will be visible once approved by admin.
            </p>
          </div>
        )}


        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">


          {/* Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">
              📦
            </div>
          )}


          <div className="p-8">


            {/* Title */}
            <div className="flex justify-between mb-4">

              <div>
                <h1 className="text-3xl font-bold">
                  {item.title}
                </h1>

                <p className="text-gray-500">
                  Listed by {item.owner?.name}
                </p>
              </div>


              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {item.status}
              </span>

            </div>


            {/* Description */}
            <p className="text-gray-600 mb-6">
              {item.description}
            </p>


            {/* Lend price */}
            {item.category === 'Lend' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">

                <p className="text-sm text-gray-500">
                  Lending Price
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  ₹{item.price || 0} / day
                </p>

              </div>
            )}


            {/* Seller rating */}
            {!isOwner && item.owner?.averageRating > 0 && (

              <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">

                <p className="text-sm text-gray-500">
                  Seller Rating
                </p>

                <div className="flex items-center gap-2">

                  <StarRating
                    value={Math.round(item.owner.averageRating)}
                    readonly
                  />

                  <span className="font-bold text-yellow-700">
                    {item.owner.averageRating.toFixed(1)}
                  </span>

                  <span className="text-xs text-gray-400">
                    ({item.owner.totalRatings} reviews)
                  </span>

                </div>

              </div>

            )}


            {/* Contact */}
            {!isOwner && (

              <div className="space-y-3 mb-6">


                {/* Email */}
                <div className="flex justify-between items-center border rounded-xl p-3">

                  <div>
                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p className="text-sm">
                      {item.owner?.email}
                    </p>
                  </div>


                  <a
                    href={`mailto:${item.owner?.email}?subject=Interested in ${item.title}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Send Email
                  </a>

                </div>


                {/* WhatsApp */}
                {item.owner?.phone && (

                  <div className="flex justify-between items-center border rounded-xl p-3">

                    <div>
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-sm">
                        {item.owner.phone}
                      </p>
                    </div>


                    <a
                      href={`https://wa.me/${item.owner.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      WhatsApp
                    </a>

                  </div>

                )}

              </div>

            )}


            {/* Owner actions */}
            {isOwner && (

              <div className="border-t pt-6">

                <p className="text-sm font-medium mb-3">
                  Update Status
                </p>


                <div className="flex gap-2 flex-wrap">

                  {STATUSES.map((s) => (

                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={updating}
                      className="px-4 py-2 bg-gray-100 rounded hover:bg-green-100"
                    >
                      {s}
                    </button>

                  ))}


                  <button
                    onClick={() => navigate(`/edit-item/${id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>


                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>


                </div>

              </div>

            )}


            {/* Reviews */}
            <div className="border-t pt-6 mt-6">


              {item.status === 'Gifted' && (
                <ReviewForm
                  item={item}
                  onReviewSubmitted={fetchItem}
                />
              )}


              <h3 className="font-bold mt-6 mb-3">
                ⭐ Reviews
              </h3>


              <ReviewsList itemId={id} />


            </div>


          </div>


        </div>


      </div>


    </div>
  );
};

export default ItemDetailPage;