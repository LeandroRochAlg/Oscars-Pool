import React from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import "../../styles/system.css"

const HomePage: React.FC = () => {
  return (document.title = 'Home',
    <div className='system-body'>
      <Header />
      <Sidebar />
      <Footer />
    </div>
  );
};

export default HomePage;