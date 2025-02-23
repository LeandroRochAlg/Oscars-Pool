import React from "react";
import { Navigate } from "react-router-dom";
import ConfirmEmail from "./common/ConfirmEmail";
import ErrorMessage from "./common/ErrorMessage";
import { useTranslation } from "react-i18next";

interface PrivateRouteProps {
    children: JSX.Element;
    admin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, admin }) => {
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.token) {
        return <Navigate to={`/login?redirect=${window.location.pathname}`} />;
    }

    if (admin && !user.admin) {
        return <ErrorMessage error={t('unauthorized')} />;
    }

    return (
        <>
            {children}
            <ConfirmEmail />
        </>
    );
}

export default PrivateRoute;