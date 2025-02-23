import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import NomineesCard from '../../components/common/NomineeCard';
import api from '../../libs/api';
import { AxiosError } from 'axios';
import { Category } from '../../types/Category';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

const WinnersPage: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(() => {
    // Get the current category index from the local storage
    const savedIndex = localStorage.getItem('currentCategoryIndex');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });
  const [currentCategory, setCurrentCategory] = useState<Category>();
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const sendNominee = async (selectedNominee: Number) => {
    if (selectedNominee === null) {
      setMsg("Please select a nominee.");
      return;
    }

    const category = currentCategory as Category;

    try {
      const response = await api.post<string>("/winner", {
        nomineeId: selectedNominee,
        categoryId: category._id,
      });

      if(response.status === 201 || response.status === 200){
        setMsg("Nominee sent successfully.");

        // Send back to the page so the user can see the updated bets
        window.location.href = "/winners";
      }else{
        setMsg("An unexpected error occurred.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setMsg(axiosError.response?.data as string || "An unexpected error occurred.");

      if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories= async () => {
      try {
        const response = await api.get('/nominees');
        setCategories(response.data);
        setCurrentCategory(response.data[currentCategoryIndex]);
        setLoaded(true);
      } catch (error) {
        console.error('Categories Error:', error);
        setMsg((error as AxiosError).response?.data as string || "An unexpected error occurred.");

        // Case token expired or invalid
        if ((error as any).response?.status === 401 || (error as any).response?.status === 400) {
          // Redirect to login and clear the token
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    fetchCategories();

    const fetchUser = async () => {
        try {
          const response = await api.get('/admin');
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error('User Error:', error);
        }
    };
    fetchUser();
  }, []);

  const navigateToNextCategory = () => {
    const nextIndex = currentCategoryIndex + 1 < categories.length ? currentCategoryIndex + 1 : 0;
    setCurrentCategoryIndex(nextIndex);
    setCurrentCategory(categories[nextIndex]);
    localStorage.setItem('currentCategoryIndex', nextIndex.toString());
  };

  const navigateToPreviousCategory = () => {
    const prevIndex = currentCategoryIndex - 1 >= 0 ? currentCategoryIndex - 1 : categories.length - 1;
    setCurrentCategoryIndex(prevIndex);
    setCurrentCategory(categories[prevIndex]);
    localStorage.setItem('currentCategoryIndex', prevIndex.toString());
  };

  return (document.title = 'Bets',
    <div className='system-body'>
      <Header />
      <Sidebar />
      <div>
        <button onClick={navigateToPreviousCategory}><GoArrowLeft /></button>
        {loaded && <NomineesCard category={currentCategory as Category} msg={msg} onClick={sendNominee} showBtn={isAdmin}/>} {/* If available, pass the current category to the NomineesCard component */}
        <button onClick={navigateToNextCategory}><GoArrowRight /></button>
      </div>
      <Footer />
    </div>
  );
};

export default WinnersPage;