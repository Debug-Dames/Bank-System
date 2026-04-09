import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles/layout.css';

export default function AppLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}