import { Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Main pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Deposit from '../pages/Deposit/Deposit';
import Withdraw from '../pages/Withdraw/Withdraw';
import Transactions from '../pages/Transactions/Transactions';
import Profile from '../pages/Profile/Profile';
import Cards from '../pages/Cards/Cards';

// Layout
import AppLayout from '../components/layout/AppLayout';

export default function AppRoutes() {
  return (
    <Routes>

      {/* Auth Routes (No Layout) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected / Main App Routes */}
      <Route element={<AppLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />

      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<h2>Page Not Found</h2>} />

    </Routes>
  );
}
