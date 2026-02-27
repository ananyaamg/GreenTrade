import { useState, useEffect } from 'react';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Giveaway', 'Lend', 'Trade'];
const STATUSES = ['All', 'Available', 'Pending', 'Gifted'];

const DashboardPage = () => {

  const { user } = useAuth();

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [categoryFilter, setCategoryFilter] =
    useState('All');

  const [statusFilter, setStatusFilter] =
    useState('Available');


  const fetchItems = async () => {

    setLoading(true);

    try {

      const params = {};

      if (categoryFilter !== 'All')
        params.category = categoryFilter;

      if (statusFilter !== 'All')
        params.status = statusFilter;

      const { data } =
        await API.get('/api/items', { params });

      setItems(data);

    }
    catch {

      setError(
        'Failed to load items'
      );

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchItems();

  }, [
    categoryFilter,
    statusFilter
  ]);


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">

            🏘️ Local Listings

          </h1>


          {/* ✅ UPDATED ADMIN-AWARE TEXT */}
          <p className="text-gray-500 mt-1">

            {user?.isAdmin ? (

              <>
                Showing items as{' '}
                <span className="font-semibold text-yellow-600">
                  🛡️ Admin
                </span>

                {' — '}

                <span className="text-green-700 font-semibold">
                  Configure in Admin → Settings
                </span>
              </>

            ) : (

              <>
                Showing items in your area:{' '}
                <span className="font-semibold text-green-700">
                  {user?.zipCode}
                </span>
              </>

            )}

          </p>

        </div>



        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap gap-4">


          {/* CATEGORY */}
          <div className="flex items-center flex-wrap gap-2">

            <label className="text-sm font-medium text-gray-700">

              Category:

            </label>


            {CATEGORIES.map(cat => (

              <button

                key={cat}

                onClick={() =>
                  setCategoryFilter(cat)
                }

                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  categoryFilter === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                }`}

              >

                {cat}

              </button>

            ))}

          </div>



          {/* STATUS */}
          <div className="flex items-center flex-wrap gap-2">

            <label className="text-sm font-medium text-gray-700">

              Status:

            </label>


            {STATUSES.map(s => (

              <button

                key={s}

                onClick={() =>
                  setStatusFilter(s)
                }

                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  statusFilter === s
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                }`}

              >

                {s}

              </button>

            ))}

          </div>


        </div>



        {/* CONTENT */}
        {loading ? (

          <div className="flex justify-center py-20">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>

          </div>

        ) : error ? (

          <div className="text-red-500 text-center py-10">

            {error}

          </div>

        ) : items.length === 0 ? (

          <div className="text-center py-20 text-gray-400">

            <div className="text-6xl mb-4">

              📭

            </div>

            <p className="text-xl">

              No items found

            </p>

            <p className="mt-2">

              Be the first to list something!

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {items.map(item => (

              <ItemCard
                key={item._id}
                item={item}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  );

};


export default DashboardPage;