import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BADGE_EMOJI = { 'None': '👤', 'Green Starter': '🌱', 'Eco Warrior': '⚔️', 'Local Hero': '🦸' };
const RANK_STYLE = ['bg-yellow-50 border-yellow-300', 'bg-gray-50 border-gray-300', 'bg-orange-50 border-orange-300'];

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/leaderboard')
      .then(({ data }) => setLeaders(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800">Green Leaderboard</h1>
          <p className="text-gray-500 mt-1">
            Top traders in ZIP code <span className="font-semibold text-green-700">{user?.zipCode}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : leaders.length === 0 ? (
          <p className="text-center text-gray-400">No trades yet in your area. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div key={leader._id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${RANK_STYLE[index] || 'bg-white border-gray-100'} ${leader._id === user?._id ? 'ring-2 ring-green-500' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{BADGE_EMOJI[leader.badge]}</span>
                    <span className="font-semibold text-gray-800">
                      {leader.name}
                      {leader._id === user?._id && <span className="text-green-600 text-sm ml-1">(You)</span>}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{leader.badge}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-700 text-lg">⭐ {leader.greenPoints}</p>
                  <p className="text-xs text-gray-500">🌱 {leader.totalCO2Saved}kg CO₂</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4">🏅 Badge System</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>🌱 Green Starter</span><span>10+ points</span></div>
            <div className="flex justify-between"><span>⚔️ Eco Warrior</span><span>50+ points</span></div>
            <div className="flex justify-between"><span>🦸 Local Hero</span><span>100+ points</span></div>
            <div className="flex justify-between text-gray-400 text-xs mt-3"><span>Each gifted item = 20 Green Points</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;