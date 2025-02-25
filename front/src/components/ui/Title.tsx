import React from "react";

interface TitleProps {
    children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({children}) => {
    return (
        <h1
            className="text-3xl text-base-200 font-semibold uppercase text-center my-2"
        >
            {children}
        </h1>
    );
};

export default Title;