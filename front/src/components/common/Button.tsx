import React from 'react';
import './Button.module.css';

interface ButtonProps{
    children: React.ReactNode;  // React.ReactNode is a type that represents anything that is renderable in React
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({children, onClick, className, type, disabled}) => {
    return (
        <button // Button properties
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;