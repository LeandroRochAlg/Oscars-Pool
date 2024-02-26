import React from "react";
import "./Account.module.css";

// Don't have an account yet? <a href="/signup">Sign Up</a>
interface AccountProps {
    message: string;
    link: string;
    linkText: string;
}

const Account: React.FC<AccountProps> = ({ message, link, linkText }) => {
    return (
        <div className="account-info-container">
            <p className="account-text">{message}</p>
            <p className="account-text"><a className="account-link" href={link}>{linkText}</a></p>
        </div>
    );
}

export default Account;