import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/authSlice";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles/layout.css';

export default function AppLayout() {
  const dispatch = useDispatch();
  const txStatus = useSelector((state) => state.auth?.transactions?.status) || "idle";
  const accountId = useSelector((state) => state.auth?.account?.id) || "acc_001";

  useEffect(() => {
    if (txStatus !== "idle") return;
    dispatch(fetchTransactions({ accountId }));
  }, [dispatch, txStatus, accountId]);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-layout__body">
        <Sidebar />
        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
