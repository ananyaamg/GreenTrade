import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const HomePage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ items: 0, users: 0, co2: 0 });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    fetchPublicItems();
  }, [user]);

  const fetchPublicItems = async () => {
    try {
      const { data } = await API.get('/api/items/public');
      setItems(data.items || []);
      setStats(data.stats || { items: 0, users: 0, co2: 0 });
    } catch (err) {
      console.log('Could not load public items');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🌿</div>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            Trade Green.<br />Live Clean.
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            GreenTrade connects neighbors to trade, lend, and give away reusable items.
            Reduce waste. Save CO₂. Build community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition text-lg">
              Get Started Free
            </Link>
            <a href="#how-it-works"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition text-lg">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-black text-green-300">{stats.items}+</div>
            <div className="text-sm text-green-200">Items Listed</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-300">{stats.users}+</div>
            <div className="text-sm text-green-200">Active Traders</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-300">{stats.co2}kg</div>
            <div className="text-sm text-green-200">CO₂ Saved</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How GreenTrade Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { icon: '📝', step: '1', title: 'Register', desc: 'Sign up with your ZIP code to join your local community' },
              { icon: '📦', step: '2', title: 'List Item', desc: 'Post items you want to give away, lend, or trade' },
              { icon: '🔍', step: '3', title: 'Browse', desc: 'Discover items available in your neighborhood' },
              { icon: '🤝', step: '4', title: 'Trade', desc: 'Connect with neighbors and complete the trade' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {items.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🌱 Recently Listed Items
            </h2>
            <p className="text-gray-500 mb-8">
              Register to see items available in your area
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.slice(0, 8).map(item => (
                <div key={item._id} className="relative">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                    <Link to="/register"
                      className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition text-sm">
                      Join to View
                    </Link>
                  </div>
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why GreenTrade */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why GreenTrade?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: '🏘️', title: 'Hyperlocal', desc: 'Only see items from your ZIP code. Trade with people you can actually meet.' },
              { icon: '🌱', title: 'Eco Impact', desc: 'Track your CO₂ savings and earn Green Points for every successful trade.' },
              { icon: '🏆', title: 'Gamified', desc: 'Climb the leaderboard. Earn badges. Become your neighborhood\'s Local Hero.' },
            ].map(item => (
              <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Form at Bottom */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-900 to-emerald-800" id="login">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 text-white">
            <div className="text-4xl mb-3">🌿</div>
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-green-300 mt-1">Sign in to continue trading</p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Email</label>
              <input
                type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Password</label>
              <input
                type="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-400 transition disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-green-300 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">
              Register free
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-400 py-6 px-4 text-center text-sm">
        <p>🌿 GreenTrade — Trade Green. Live Clean.</p>
        <p className="mt-1 text-green-600">Built with MERN Stack</p>
      </footer>
    </div>
  );
};

export default HomePage;