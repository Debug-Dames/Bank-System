import { Outlet } from 'react-router-dom';
import './styles/layout.css';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <main className="main">
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}