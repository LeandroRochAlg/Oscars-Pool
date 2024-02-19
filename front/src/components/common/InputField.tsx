import React from "react";
import './InputField.module.css';

interface InputFieldProps {
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    className?: string;
    required?: boolean;
    children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({type, name, value, onChange, placeholder, className, required, children}) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            required={required}
        >
            {children}
        </input>
    );
};

export default InputField;