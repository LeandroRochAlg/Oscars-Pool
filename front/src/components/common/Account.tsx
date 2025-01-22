import React from "react";

// Don't have an account yet? <a href="/signup">Sign Up</a>
interface AccountProps {
    message: string;
    link: string;
    linkText: string;
}

const Account: React.FC<AccountProps> = ({ message, link, linkText }) => {
    return (
        <div className="w-full text-center text-base-100 text-sm my-5">
            <p className="">{message}</p>
            <p className="font-bold hover:underline"><a href={link}>{linkText}</a></p>
        </div>
    );
}

export default Account;