import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../pages/Login/LoginComponent";
import RegisterPage from "../pages/Register/RegisterComponent";
import HomePage from "../pages/Home/HomeComponent";
import UserPage from "../pages/User/UserComponent";
import NotFoundPage from "../pages/NotFound/NotFoundComponent";
import ActionHandler from "../pages/ActionHandler/ActionHandler";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Nominees from "../pages/Nominees/Nominees";
import CreatePool from "../pages/CreatePool/CreatePool";
import PoolInfo from "../pages/PoolInfo/PoolInfo";
import FindPools from "../pages/FindPools/FindPools";
import MyPools from "../pages/MyPools/MyPools";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/nominees" element={<Nominees />} />
                    <Route path="/" element={<HomePage />} />

                    {/* Private Routes */}
                    <Route path="/user" element={
                        <PrivateRoute>
                            <UserPage />
                        </PrivateRoute>
                    } />
                    <Route path="/createPool" element={
                        <PrivateRoute>
                            <CreatePool />
                        </PrivateRoute>
                    } />
                    <Route path="/pool/:id" element={
                        <PrivateRoute>
                            <PoolInfo />
                        </PrivateRoute>
                    } />
                    <Route path="/findPools" element={
                        <PrivateRoute>
                            <FindPools />
                        </PrivateRoute>
                    } />
                    <Route path="/myPools" element={
                        <PrivateRoute>
                            <MyPools />
                        </PrivateRoute>
                    } />
                    
                    {/* Action Handler */}
                    <Route path="/action-handler" element={<ActionHandler />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default AppRoutes;