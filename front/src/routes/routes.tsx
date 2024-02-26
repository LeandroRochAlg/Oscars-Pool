import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/LoginComponent";
import RegisterPage from "../pages/Register/RegisterComponent";
import HomePage from "../pages/Home/HomeComponent";
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default AppRoutes;