import { useState } from 'react';
import './Sidebar.module.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        Menu
      </button>
      <ul className="sidebar-menu">
        <li>
          <a href="/bets">Bets</a>
        </li>
        <li>
          <a href="/winners">Winners</a>
        </li>
        <li>
          <a href="/leaderboard">Leaderboard</a>
        </li>
        <li>
          <a href="/user">User</a>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
