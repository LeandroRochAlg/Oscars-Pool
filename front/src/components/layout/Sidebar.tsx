import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import Button from '../common/Button';
import { FaBars, FaClipboardList, FaTrophy, FaUser } from 'react-icons/fa';
import { MdLeaderboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  return (
    <>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <FaBars /> Menu
      </button>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <ul className={styles.sidebarMenu}>
          <li><a href="/bets"><FaClipboardList /> Bets</a></li>
          <li><a href="/winners"><FaTrophy /> Winners</a></li>
          <li><a href="/leaderboard"><MdLeaderboard /> Leaderboard</a></li>
          <li><a href="/user"><FaUser /> User</a></li>
        </ul>
        <Button onClick={handleLogout}>
          <LuLogOut /> Logout
        </Button>
      </div>
    </>
  );
};

export default Sidebar;