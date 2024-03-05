import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '../../libs/api';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import styles from './HomeComponent.module.css';
import "../../styles/system.css"

const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get<{username: string}>('/username');
        setUsername(response.data.username);
        setAvailable(true);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    fetchUsername();
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