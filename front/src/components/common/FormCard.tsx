import React from "react";
import "./FormCard.module.css";

interface FormCardProps {
    children: React.ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, onSubmit, className }) => {
    return (
        <form
            className={className}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
};

export default FormCard;