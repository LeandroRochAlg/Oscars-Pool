import React from "react";
import { useTranslation } from "react-i18next";

interface FormCardProps {
    children: React.ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormCard: React.FC<FormCardProps> = ({ children, onSubmit }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-base-100">
            <div className="card lg:card-side lg:w-1/2 lg:h-[400px] mx-4 lg:mx-auto bg-base-200 shadow-xl">
                <figure className="max-h-40 lg:max-h-full lg:w-1/2">
                    <img
                        src="/assets/images/AindaEstouAqui.jpeg"
                        alt={t('images.alt.AindaEstouAqui')}
                        className="h-full w-full object-cover"
                    />
                </figure>
                <div className="card-body lg:w-1/2 p-5 my-auto">
                    <form
                        onSubmit={onSubmit}
                    >
                        {children}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormCard;