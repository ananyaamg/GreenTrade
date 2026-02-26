import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Available', 'Pending', 'Gifted'];

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    API.get(`/api/items/${id}`)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

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

        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:underline mb-6"
        >
          ← Back
        </button>


        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">


          {/* IMAGE */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-7xl">
              📦
            </div>
          )}


          <div className="p-8">


            {/* TITLE */}
            <div className="flex justify-between mb-4">

              <div>
                <h1 className="text-3xl font-bold">
                  {item.title}
                </h1>

                <p className="text-gray-500">
                  Listed by {item.owner?.name}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                {item.status}
              </span>

            </div>


            {/* ✅ PENDING NOTICE */}
            {!item.isApproved && isOwner && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">

                <span className="text-2xl">⏳</span>

                <div>
                  <p className="font-bold text-yellow-800">
                    Your listing is under review
                  </p>

                  <p className="text-yellow-700 text-sm mt-1">
                    This item is not yet visible to other users.
                    An admin will approve it shortly before it goes live.
                  </p>
                </div>

              </div>
            )}


            {/* DESCRIPTION */}
            <p className="text-gray-600 mb-6">
              {item.description}
            </p>


            {/* PRICE */}
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


            {/* CONTACT */}
            {!isOwner && (
              <div className="border-t pt-6 space-y-3">


                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border">

                  <div>
                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p className="text-sm font-medium">
                      {item.owner?.email}
                    </p>
                  </div>


                  <a
                    href={`mailto:${item.owner?.email}`}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs"
                  >
                    Send Email
                  </a>

                </div>


                {item.owner?.phone && (

                  <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border">

                    <div>
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-sm font-medium">
                        {item.owner.phone}
                      </p>
                    </div>


                    <a
                      href={`https://wa.me/${item.owner.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 text-white px-3 py-1.5 rounded text-xs"
                    >
                      WhatsApp
                    </a>

                  </div>

                )}

              </div>
            )}


            {/* OWNER ACTIONS */}
            {isOwner && (
              <div className="border-t pt-6 mt-6">

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


          </div>

        </div>

      </div>

    </div>
  );
};

export default ItemDetailPage;