import React from "react";
import styles from "./FormCard.module.css";

interface FormCardProps {
    children: React.ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormCard: React.FC<FormCardProps> = ({ children, onSubmit }) => {
    return (
        <div className={styles.container}>
            <form
                onSubmit={onSubmit}
            >
                {children}
            </form>
        </div>
    );
};

export default FormCard;