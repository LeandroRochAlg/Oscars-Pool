import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import styles from './HomeComponent.module.css';
import "../../styles/system.css"

const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUsername(user.username || '');
    setAvailable(true);
  }, []);

  return (document.title = 'Home',
    <div className='system-body'>
      <Header />
      <div className={styles.messageContainer}>
        {available && <h2 className={styles.messageTitle}>Welcome, <span>{username}</span>!</h2>}
        <p className={styles.message}>You are now logged into the Pool. Feel free to make a <a href="/bets">Bet</a> or see the <a href="/winners">Winners</a> or <a href="/leaderboard">Leaderboard</a> if available!</p>
      </div>
      <Sidebar />
      <Footer />
    </div>
  );
};

export default HomePage;