import React from "react";
import './InputField.module.css';

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    className?: string;
    error?: string;
    children?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ type, name, placeholder, className, error, ...rest }, ref) => {
        return (
            <div>
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    placeholder={error ? error : placeholder}
                    className={`${className} ${error ? 'error' : ''}`} // Apply error styling conditionally
                    {...rest} // Spread the remaining props
                />
            </div>
        );
    }
  );

export default InputField;