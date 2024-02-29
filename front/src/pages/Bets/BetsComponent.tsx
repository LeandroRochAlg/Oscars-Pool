import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import NomineesCard from '../../components/common/NomineesCard';
import "../../styles/system.css"
import api from '../../libs/api';

const BetsPage: React.FC = () => {
  const [nominees, setNominees] = useState([]);
  const alreadyRunned = useRef(false);

  useEffect(() => {
    // Fetch nominees from the API
    const fetchNominees = async () => {
      // Prevents the function to run more than once
      if (alreadyRunned.current == false) {
        alreadyRunned.current = true;
        try {
          const response = await api.get('/nominees');
          setNominees(response.data);
          console.log('Nominees:', response.data);
        } catch (error) {
          console.error('Nominees Error:', error);

          // Case token expired or invalid
          if ((error as any).response?.status === 401 || (error as any).response?.status === 400) {
            // Redirect to login and clear the token
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
      }
    };
    fetchNominees();
  }, []);

  return (document.title = 'Bets',
    <div className='system-body'>
      <Header />
      <Sidebar />
      <NomineesCard categories={nominees} />
      <Footer />
    </div>
  );
};

export default BetsPage;