import { useState } from 'react';
import styles from './Sidebar.module.css';
import Button from '../common/Button';
import { FaBars, FaClipboardList, FaTrophy, FaUser, FaHome } from 'react-icons/fa';
import { MdLeaderboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <FaBars /> Menu
      </button>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <ul className={styles.sidebarMenu}>
            <li className={window.location.pathname === '/' ? styles.active : ''}><a href="/"><FaHome /> Home</a></li>
            <li className={window.location.pathname === '/bets' ? styles.active : ''}><a href="/bets"><FaClipboardList /> Bets</a></li>
            <li className={window.location.pathname === '/winners' ? styles.active : ''}><a href="/winners"><FaTrophy /> Winners</a></li>
            <li className={window.location.pathname === '/leaderboard' ? styles.active : ''}><a href="/leaderboard"><MdLeaderboard /> Leaderboard</a></li>
            <li className={window.location.pathname === '/user' ? styles.active : ''}><a href="/user"><FaUser /> User</a></li>
        </ul>
        <Button onClick={handleLogout}>
          <LuLogOut /> Logout
        </Button>
      </div>
    </>
  );
};

export default Sidebar;