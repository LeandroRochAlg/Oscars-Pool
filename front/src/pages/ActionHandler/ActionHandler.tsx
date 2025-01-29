import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "../../libs/firebase";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import WarningMessage from "../../components/common/WarningMessage";
import FormCard from "../../components/common/FormCard";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import api from "../../libs/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type ActionType = "verifyEmail" | "resetPassword";

const ActionHandler = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [actionType, setActionType] = useState<ActionType | null>(null);
    const [continueUrl, setContinueUrl] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    // Validation schema for the password reset form
    const schema = yup.object({
        newPassword: yup
            .string()
            .required(t('validation.passwordRequired'))
            .min(6, t('validation.passwordMinLength')),
        confirmPassword: yup
            .string()
            .required(t('validation.passwordRequired'))
            .oneOf([yup.ref('newPassword')], t('validation.passwordsDontMatch')),
    }).required();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const code = searchParams.get('oobCode');
        const mode = searchParams.get('mode');
        const continueUrl = searchParams.get('continueUrl') || '';
        setContinueUrl(continueUrl);

        if (!code || !mode) {
            setStatus("error");
            setErrorMessage(t('actionHandler.invalidLink'));
            return;
        }

        if (mode === "verifyEmail") {
            setActionType("verifyEmail");
            handleVerifyEmail(code);
        } else if (mode === "resetPassword") {
            setActionType("resetPassword");
            setStatus("success"); // Waits for the user to enter the new password
        } else {
            setStatus("error");
            setErrorMessage(t('actionHandler.invalidAction'));
        }
    }, [searchParams, t]);

    const handleVerifyEmail = async (code: string) => {
        try {
            await applyActionCode(auth, code);
            const userEmail = auth.currentUser?.email;

            if (!userEmail) {
                setStatus("error");
                setErrorMessage(t('actionHandler.emailNotFound'));
                return;
            }

            await api.patch('/confirm-email', { email: userEmail });
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.emailConfirmed = true;
            localStorage.setItem('user', JSON.stringify(user));

            setStatus("success");
        } catch (error) {
            console.error('Error verifying email:', error);
            setStatus("error");
            setErrorMessage(t('actionHandler.emailVerificationError'));
        }
    };

    const handleResetPassword = async (data: { newPassword: string }) => {
        setLoading(true);
        const code = searchParams.get('oobCode');
        if (!code) {
            setStatus("error");
            setErrorMessage(t('actionHandler.invalidLink'));
            return;
        }

        try {
            await checkActionCode(auth, code).then((info) => {
                console.log(info);
                api.put('/reset-password', {
                    email: info.data.email,
                    newPassword: data.newPassword,
                });
            });

            setStatus("success");
            setSuccessMessage(t('actionHandler.passwordResetSuccess'));
            setErrorMessage('');
        } catch (error) {
            console.error('Error resetting password:', error);
            setStatus("error");
            setErrorMessage(t('actionHandler.passwordResetError'));
        }

        setLoading(false);
    };

    const handleContinue = () => {
        if (continueUrl) {
            window.location.href = continueUrl;
        } else {
            navigate('/');
        }
    };

    return (
        <div className="auth-body">
            {status === "loading" && (
                <div className="text-base-100 text-center">
                    <span className="loading loading-spinner text-base-100"></span>
                    <p>{t('actionHandler.loading')}</p>
                </div>
            )}

            {status === "success" && actionType === "verifyEmail" && (
                <div className="text-center">
                    <SuccessMessage message={t('actionHandler.emailVerified')} />
                    {continueUrl && (
                        <Button onClick={handleContinue}>
                            {t('actionHandler.proceed')}
                        </Button>
                    )}
                </div>
            )}

            {status === "success" && actionType === "resetPassword" && (
                <FormCard onSubmit={handleSubmit(handleResetPassword)}>
                    <h2 className='text-3xl text-base-100 mb-2'>{t('actionHandler.resetPasswordTitle')}</h2>

                    <InputField
                        type="password"
                        placeholder={t('actionHandler.newPassword')}
                        {...register('newPassword')}
                    />
                    {errors.newPassword && <WarningMessage error={errors.newPassword.message as string} />}

                    <InputField
                        type="password"
                        placeholder={t('actionHandler.confirmPassword')}
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && <WarningMessage error={errors.confirmPassword.message as string} />}

                    <div className='w-full flex justify-center'>
                        <Button type="submit" loading={loading}>
                            {t('actionHandler.resetPassword')}
                        </Button>
                    </div>

                    {errorMessage && <ErrorMessage error={errorMessage} />}

                    {successMessage && (
                        <div className="w-full flex justify-center mt-4 text-sm">
                            <a href="/login" className="text-base-100 hover:underline">{t('resetPassword.backToLogin')}</a>
                            <SuccessMessage message={t('actionHandler.passwordResetSuccess')} />
                        </div>
                    )}
                </FormCard>
            )}

            {status === "error" && (
                <div className="text-center">
                    <ErrorMessage error={errorMessage} />
                </div>
            )}
        </div>
    );
};

export default ActionHandler;