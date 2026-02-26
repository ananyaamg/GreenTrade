import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CarbonCounter from '../components/CarbonCounter';

const ImpactPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    API.get('/api/leaderboard/my-impact')
      .then(({ data }) => {
        setImpact(data);
        setTimeout(() => setShowDetails(true), 500);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-4xl font-black">Your Green Impact</h1>
          <p className="text-green-300 mt-2">
            Here's what you've done for the planet,{' '}
            <span className="font-bold text-white">{impact?.name}</span>
          </p>
        </div>

        <div className="mb-8">
          <CarbonCounter
            target={impact?.totalCO2Saved || 0}
            duration={2500}
            label="kg of CO₂ Saved"
            color="text-green-400"
          />
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mb-8 animate-countup">
            {[
              { value: impact?.giftedCount, label: 'Items Gifted/Traded' },
              { value: `⭐ ${impact?.greenPoints}`, label: 'Green Points Earned' },
              { value: `🌳 ${impact?.treesEquivalent}`, label: 'Trees Equivalent/Year' },
              { value: `🚗 ${impact?.drivingKmAvoided}`, label: 'Driving km Avoided' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-yellow-400">{stat.value}</div>
                <div className="text-sm text-green-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {impact?.badge !== 'None' && (
          <div className="bg-yellow-400/20 border border-yellow-400 rounded-2xl p-4 text-center mb-8">
            <div className="text-3xl mb-1">🏅</div>
            <p className="font-bold text-yellow-300 text-xl">{impact?.badge}</p>
            <p className="text-green-200 text-sm">Your current badge</p>
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-6 text-center mb-8">
          <p className="text-green-200 text-sm leading-relaxed">
            Every item traded instead of discarded reduces manufacturing demand and keeps
            materials in the circular economy.{' '}
            <span className="text-white font-semibold">Thank you for making a difference! 🌿</span>
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white text-green-800 py-3 rounded-xl font-bold hover:bg-green-50 transition">
            Keep Trading
          </button>
          <button onClick={handleLogout}
            className="flex-1 bg-red-500/80 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;