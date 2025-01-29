import React from 'react';

interface ButtonProps{
    children: React.ReactNode;  // React.ReactNode is a type that represents anything that is renderable in React
    onClick?: () => void;
    loading?: boolean;
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({children, onClick, loading, id, type, disabled}) => {
    return (
        <button // Button properties
            type={type}
            onClick={onClick}
            className='btn btn-primary my-2 mx-auto text-md uppercase w-32'
            id={id}
            disabled={disabled || loading}
        >
            {loading ? <span className="loading loading-spinner text-base-100"></span> : children}
        </button>
    );
};

export default Button;