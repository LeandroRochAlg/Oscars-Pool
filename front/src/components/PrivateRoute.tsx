import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    console.log('Is authenticated: ', isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;