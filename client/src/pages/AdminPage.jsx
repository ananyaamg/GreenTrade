import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

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
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        API.get('/api/admin/stats'),
        API.get('/api/admin/users'),
        API.get('/api/admin/items'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their items?')) return;
    try {
      await API.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      alert('User deleted');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/admin/items/${id}/approve`);
      setItems(items.map(item =>
        item._id === id ? { ...item, isApproved: true } : item
      ));
    } catch (err) {
      alert('Failed to approve item');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and delete this item?')) return;
    try {
      await API.delete(`/api/admin/items/${id}/reject`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to reject item');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🛡️ Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage users and item listings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['stats', 'users', 'items'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}>
              {tab === 'stats' ? '📊 Stats' : tab === 'users' ? '👥 Users' : '📦 Items'}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-50 text-blue-700' },
              { label: 'Total Items', value: stats.totalItems, color: 'bg-green-50 text-green-700' },
              { label: 'Pending Approval', value: stats.pendingItems, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Approved Items', value: stats.approvedItems, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Gifted Items', value: stats.giftedItems, color: 'bg-purple-50 text-purple-700' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-2xl p-5 ${stat.color} text-center`}>
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-sm mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'ZIP', 'Points', 'Badge', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.filter(u => !u.isAdmin).map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{u.zipCode}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">⭐ {u.greenPoints}</td>
                    <td className="px-4 py-3 text-sm">{u.badge}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                item.isApproved ? 'border-green-500' : 'border-yellow-500'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.isApproved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category} • {item.itemCategory} •
                      By: {item.owner?.name} • ZIP: {item.zipCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!item.isApproved && (
                      <button onClick={() => handleApprove(item._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition">
                        ✅ Approve
                      </button>
                    )}
                    <button onClick={() => handleReject(item._id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition">
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;