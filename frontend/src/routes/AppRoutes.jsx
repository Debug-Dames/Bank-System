import { Routes, Route, Navigate } from "react-router-dom";

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
import Transact from "../pages/Transact/Transact";
import Landing from "../pages/Landing/Landing";
import SavingsPlans from "../pages/Savings/SavingsPlans";

// Layout
import AppLayout from '../components/layout/AppLayout';

const isAuthenticated = () => true;

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Auth Routes (No Layout) */}
      <Route path="/" element={<Landing/>} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
  

      {/* Protected routes — AppLayout renders <Outlet />, children render into it */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="cards" element={<Cards />} />
        <Route path="transact" element={<Transact />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="savings" element={<SavingsPlans />} />
        
        
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}