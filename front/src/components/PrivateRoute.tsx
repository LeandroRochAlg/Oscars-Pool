import React from "react";
import { Navigate } from "react-router-dom";
import ConfirmEmail from "./common/ConfirmEmail";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('user') !== null;

    console.log('Is authenticated: ', isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${window.location.pathname}`} />;
    }

    return (
        <>
            {children}
            <ConfirmEmail />
        </>
    );
}

export default PrivateRoute;