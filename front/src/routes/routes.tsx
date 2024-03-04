import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../pages/Login/LoginComponent";
import RegisterPage from "../pages/Register/RegisterComponent";
import HomePage from "../pages/Home/HomeComponent";
import BetsPage from "../pages/Bets/BetsComponent";
import WinnersPage from "../pages/Winners/WinnersComponent";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Private Routes */}
                <Route path="/" element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } />
                <Route path="/bets" element={
                    <PrivateRoute>
                        <BetsPage />
                    </PrivateRoute>
                } />
                <Route path="/winners" element={
                    <PrivateRoute>
                        <WinnersPage />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default AppRoutes;