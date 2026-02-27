import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ✅ NEW IMPORT
import AdminZipCodeManager from '../components/AdminZipCodeManager';

const AdminPage = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const [activeTab, setActiveTab] = useState('stats');

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!user?.isAdmin) {

      navigate('/dashboard');
      return;

    }

    fetchData();

  }, []);


  const fetchData = async () => {

    setLoading(true);

    try {

      const [
        statsRes,
        usersRes,
        itemsRes
      ] = await Promise.all([

        API.get('/api/admin/stats'),

        API.get('/api/admin/users'),

        API.get('/api/admin/items'),

      ]);


      setStats(statsRes.data);

      setUsers(usersRes.data);

      setItems(itemsRes.data);

    }
    catch {

      alert('Failed to load admin data');

    }
    finally {

      setLoading(false);

    }

  };


  const handleDeleteUser = async (id) => {

    if (!window.confirm(
      'Delete this user and all their items?'
    )) return;

    try {

      await API.delete(
        `/api/admin/users/${id}`
      );

      setUsers(
        users.filter(
          u => u._id !== id
        )
      );

    }
    catch (err) {

      alert(
        err.response?.data?.message ||
        'Failed'
      );

    }

  };


  const handleApprove = async (id) => {

    try {

      await API.put(
        `/api/admin/items/${id}/approve`
      );

      setItems(

        items.map(item =>

          item._id === id
            ? {
                ...item,
                isApproved: true
              }
            : item

        )

      );

    }
    catch {

      alert('Failed');

    }

  };


  const handleReject = async (id) => {

    if (!window.confirm(
      'Delete item?'
    )) return;

    try {

      await API.delete(
        `/api/admin/items/${id}/reject`
      );

      setItems(

        items.filter(
          item => item._id !== id
        )

      );

    }
    catch {

      alert('Failed');

    }

  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );


  return (

    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-7xl mx-auto">


        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            🛡️ Admin Panel

          </h1>

          <p className="text-gray-500">

            Manage platform

          </p>

        </div>


        {/* TABS */}
        <div className="flex gap-3 mb-6">

          {[
            'stats',
            'users',
            'items',
            'settings'
          ].map(tab => (

            <button

              key={tab}

              onClick={() =>
                setActiveTab(tab)
              }

              className={`px-5 py-2 rounded-xl font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >

              {tab === 'stats'
                ? '📊 Stats'
                : tab === 'users'
                ? '👥 Users'
                : tab === 'items'
                ? '📦 Items'
                : '⚙️ Settings'}

            </button>

          ))}

        </div>


        {/* STATS */}
        {activeTab === 'stats' && stats && (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {[
              ['Users', stats.totalUsers],
              ['Items', stats.totalItems],
              ['Pending', stats.pendingItems],
              ['Approved', stats.approvedItems],
              ['Gifted', stats.giftedItems],
            ].map(([label, value]) => (

              <div
                key={label}
                className="bg-white rounded-xl p-4 text-center"
              >

                <div className="text-3xl font-bold">

                  {value}

                </div>

                <div className="text-sm text-gray-500">

                  {label}

                </div>

              </div>

            ))}

          </div>

        )}


        {/* USERS */}
        {activeTab === 'users' && (

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-3 text-left text-xs">
                    Name
                  </th>

                  <th className="p-3 text-left text-xs">
                    Email
                  </th>

                  <th className="p-3 text-left text-xs">
                    ZIP
                  </th>

                  <th className="p-3 text-left text-xs">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users
                  .filter(u => !u.isAdmin)
                  .map(u => (

                    <tr key={u._id}>

                      <td className="p-3">
                        {u.name}
                      </td>

                      <td className="p-3">
                        {u.email}
                      </td>

                      <td className="p-3">
                        {u.zipCode}
                      </td>

                      <td className="p-3">

                        <button
                          onClick={() =>
                            handleDeleteUser(u._id)
                          }
                          className="text-red-600"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {/* ITEMS */}
        {activeTab === 'items' && (

          <div className="space-y-3">

            {items.map(item => (

              <div
                key={item._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >

                <div>

                  <div className="font-semibold">
                    {item.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    {item.owner?.name}
                  </div>

                </div>


                <div className="flex gap-2">

                  {!item.isApproved && (

                    <button
                      onClick={() =>
                        handleApprove(item._id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                  )}


                  <button
                    onClick={() =>
                      handleReject(item._id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (

          <div className="max-w-xl">

            <h2 className="text-xl font-bold mb-4">

              ⚙️ Admin Settings

            </h2>

            <AdminZipCodeManager />

          </div>

        )}


      </div>

    </div>

  );

};

export default AdminPage;