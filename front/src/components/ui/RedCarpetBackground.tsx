import React from "react";
import './RedCarpetBackground.module.css';

interface RedCarpetBackgroundProps {
    children: React.ReactNode;
}

const RedCarpetBackground: React.FC<RedCarpetBackgroundProps> = ({children}) => {
    return (
        <div className="background-container">
            {children}
        </div>
    );
};

export default RedCarpetBackground;