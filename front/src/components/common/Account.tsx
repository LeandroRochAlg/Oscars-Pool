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
        <div>
            <p>{message}</p>
            <p><a href={link}>{linkText}</a></p>
        </div>
    );
}

export default Account;