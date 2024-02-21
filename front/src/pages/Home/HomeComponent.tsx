import React from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <Footer />
    </div>
  );
};

export default HomePage;