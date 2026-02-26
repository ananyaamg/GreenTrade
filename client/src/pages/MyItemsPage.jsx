import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';

const MyItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/items/my-items')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  const approvedItems = items.filter(item => item.isApproved);
  const pendingItems = items.filter(item => !item.isApproved);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-500 mt-1">{items.length} item(s) listed</p>
          </div>
          <Link to="/create-item"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">
            + New Listing
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">You haven't listed anything yet</p>
            <Link to="/create-item" className="text-green-600 hover:underline mt-2 block">
              List your first item →
            </Link>
          </div>
        ) : (
          <>
            {/* Pending Approval Section */}
            {pendingItems.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
                    ⏳ Pending Admin Approval
                    <span className="bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {pendingItems.length}
                    </span>
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-yellow-800 font-semibold text-sm">
                      Your listing is under review
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      An admin will review and approve your item before it becomes
                      visible to other users in your area. This usually takes a few minutes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pendingItems.map(item => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Approved / Active Listings */}
            {approvedItems.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
                    ✅ Active Listings
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {approvedItems.length}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {approvedItems.map(item => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyItemsPage;
