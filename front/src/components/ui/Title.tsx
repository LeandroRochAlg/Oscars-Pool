import React from "react";
import './Title.module.css';

interface TitleProps {
    title: string;
    className?: string;
}

const Title: React.FC<TitleProps> = ({title, className}) => {
    return (
        <h1
            className={className}
        >
            {title}
        </h1>
    );
};

export default Title;