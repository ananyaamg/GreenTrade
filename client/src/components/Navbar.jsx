import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  // navigate to impact page (logout handled there)
  const handleLogout = () => {
    navigate('/impact');
  };

  return (

    <nav className="bg-green-700 text-white shadow-lg">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold"
        >
          🌿 GreenTrade
        </Link>


        {/* USER LOGGED IN */}
        {user && (

          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="hover:text-green-200 transition-colors text-sm"
            >
              Browse
            </Link>


            <Link
              to="/create-item"
              className="hover:text-green-200 transition-colors text-sm"
            >
              + List Item
            </Link>


            <Link
              to="/my-items"
              className="hover:text-green-200 transition-colors text-sm"
            >
              My Items
            </Link>


            <Link
              to="/leaderboard"
              className="hover:text-green-200 transition-colors text-sm"
            >
              🏆 Leaderboard
            </Link>


            {/* ADMIN */}
            {user?.isAdmin && (

              <Link
                to="/admin"
                className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-yellow-400 transition"
              >
                🛡️ Admin
              </Link>

            )}


            {/* USER INFO */}
            <div className="flex items-center gap-2 bg-green-800 rounded-full px-3 py-1">

              <span className="text-xs">
                {user.badge !== 'None' ? '🏅' : '👤'}
              </span>

              <span className="text-sm font-medium">
                {user.name}
              </span>

              <span className="text-xs text-green-300">
                ⭐ {user.greenPoints}
              </span>

            </div>


            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-100 transition"
            >
              Impact & Logout
            </button>


          </div>

        )}


        {/* NOT LOGGED IN */}
        {!user && (

          <div className="flex items-center gap-3">

            <Link
              to="/register"
              className="hover:text-green-200 transition-colors text-sm font-medium"
            >
              Register
            </Link>


            <a
              href="/#login"
              className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-100 transition"
            >
              Sign In
            </a>


          </div>

        )}

      </div>

    </nav>

  );

};

export default Navbar;