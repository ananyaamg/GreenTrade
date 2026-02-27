\import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateItemPage from './pages/CreateItemPage';
import EditItemPage from './pages/EditItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyItemsPage from './pages/MyItemsPage';
import LeaderboardPage from './pages/LeaderboardPage';

import ImpactPage from './pages/ImpactPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';

// ✅ NEW IMPORTS
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';


function App() {

  return (

    <AuthProvider>

      <Router>

        <div className="min-h-screen bg-gray-50">

          <Navbar />


          <Routes>

            {/* PUBLIC ROUTES */}

            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* PASSWORD RESET ROUTES */}

            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />


            {/* PROTECTED ROUTES */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-item"
              element={
                <ProtectedRoute>
                  <CreateItemPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-item/:id"
              element={
                <ProtectedRoute>
                  <EditItemPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/item/:id"
              element={
                <ProtectedRoute>
                  <ItemDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-items"
              element={
                <ProtectedRoute>
                  <MyItemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/impact"
              element={
                <ProtectedRoute>
                  <ImpactPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />


            {/* PROFILE ROUTE */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />


            {/* FALLBACK */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />


          </Routes>

        </div>

      </Router>

    </AuthProvider>

  );

}

export default App;