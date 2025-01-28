import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../libs/firebase";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import api from "../../libs/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmEmailPage = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [continueUrl, setContinueUrl] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code: string = params.get('oobCode') || '';
        const continueUrl: string = params.get('continueUrl') || '';
        setContinueUrl(continueUrl);

        if (code) {
            applyActionCode(auth, code).then(() => {
                const userEmail = auth.currentUser?.email;

                console.log('User email:', userEmail);

                if (!userEmail) {
                    setStatus("error");
                    return;
                }

                api.patch('/confirm-email', { email: userEmail }).then(() => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    user.emailConfirmed = true;
                    localStorage.setItem('user', JSON.stringify(user));

                    setStatus("success");
                }).catch((error: AxiosError) => {
                    console.error('Error confirming email:', error);
                    setStatus("error");
                });
            }).catch((error) => {
                console.error('Error confirming email:', error);
                setStatus("error");
            });
        } else {
            setStatus("error");
        }
    }, [navigate]);

    const handleContinue = () => {
        if (continueUrl) {
            window.location.href = continueUrl;
        }
    };

    return (
        document.title = t('confirmEmail'),
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100">
                <div className="col-md-6 offset-md-3 text-center">
                    {status === "loading" && 
                        <div className="text-base-100">
                            <span className="loading loading-spinner text-base-100"></span>
                            <p>{t('confirmEmail.confirmLoading')}</p>
                        </div>
                    }
                    {status === "success" && (
                        <div>
                            <SuccessMessage message={t('confirmEmail.confirmSuccess')} />
                            {continueUrl && (
                                <button onClick={handleContinue} className="btn btn-primary mt-3">
                                    {t('confirmEmail.proceed')}
                                </button>
                            )}
                        </div>
                    )}
                    {status === "error" && <ErrorMessage error={t('confirmEmail.confirmError')} />}
                </div>
            </div>
        </div>
    );
}

export default ConfirmEmailPage;