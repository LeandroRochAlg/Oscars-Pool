import React from 'react';
import styles from './Button.module.css';

interface ButtonProps{
    children: React.ReactNode;  // React.ReactNode is a type that represents anything that is renderable in React
    onClick?: () => void;
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({children, onClick, id, type, disabled}) => {
    return (
        <button // Button properties
            type={type}
            onClick={onClick}
            className={styles.btn}
            id={id}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;