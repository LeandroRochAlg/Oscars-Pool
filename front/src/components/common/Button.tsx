import React from 'react';

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
            className='btn btn-primary my-2 mx-auto text-md uppercase'
            id={id}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;