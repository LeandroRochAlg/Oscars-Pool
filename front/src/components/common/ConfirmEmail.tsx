import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../libs/firebase";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const ConfirmEmail: React.FC = () => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.emailVerified) {
            setShow(true);
        }
    }, []);

    const handleConfirmEmail = async () => {
        try {
            auth.languageCode = i18n.language;
            const firebaseUser = auth.currentUser;
            
            if(firebaseUser) {
                const actionCodeSettings = {
                    url: `${window.location}`,
                    handleCodeInApp: true,
                }

                try {
                    setLoading(true);
                    await sendEmailVerification(firebaseUser, actionCodeSettings);
                    setLoading(false);
                    setSuccess(t('confirmEmail.success'));
                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                } catch (error) {
                    setLoading(false);
                    console.error('Error sending email verification:', error);
                    setError(t('confirmEmail.error'));
                    setTimeout(() => {
                        setError('');
                    }, 5000);
                }
            }
        } catch (error) {
            console.error('Error sending email verification:', error);
            alert(t('confirmEmail.error'));
        }
    }

    const handleClose = () => {
        setShow(false);
    }

    if (!show) {
        return null;
    }

    return (
        <>        
            <div role="alert" className="alert shadow-lg w-4/5 mx-auto text-base-100 fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 z-50">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info h-6 w-6 shrink-0">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-bold">{t('confirmEmail.title')}</h3>
                    <div className="text-xs">{t('confirmEmail.message')}</div>
                </div>
                {loading && <span className="loading loading-spinner text-info"></span>}
                <button className="btn btn-sm text-info" onClick={handleConfirmEmail}>{t('confirmEmail.sendEmail')}</button>
                <button className="btn btn-sm text-info" onClick={handleClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

            <ErrorMessage error={error} />
            <SuccessMessage message={success} />
        </>
    );
}

export default ConfirmEmail;