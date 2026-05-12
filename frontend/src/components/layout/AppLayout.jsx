import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transactionSlice";
import { fetchAccounts } from "../../features/accountSlice";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles/layout.css';

export default function AppLayout() {
  const dispatch = useDispatch();
  const txStatus = useSelector((state) => state.auth?.transactions?.status) || "idle";
  const accounts = useSelector((state) => state.auth?.accounts);
  const accountId = accounts?.items?.[0]?._id;

  useEffect(() => {
    if (accounts?.status === "idle") dispatch(fetchAccounts());
  }, [dispatch, accounts?.status]);

  useEffect(() => {
    if (!accountId) return;
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
