import { useState } from "react";
import FormCard from "../../components/common/FormCard";
import ErrorMessage from "../../components/common/ErrorMessage";
import WarningMessage from "../../components/common/WarningMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { auth } from "../../libs/firebase";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
    const [msg, setMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const { t, i18n } = useTranslation();
    
    const schema = yup.object({
        email: yup.string().email(t('validation.invalidEmail')).required(t('validation.emailRequired'))
    }).required();
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    const onSubmit = async (data: any) => {
        auth.languageCode = i18n.language;
        setLoading(true);

        try {
            sendPasswordResetEmail(auth, data.email).then(() => {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
                setMsg(t('resetPassword.success'));
            }).catch((_error) => {
                setError(t('resetPassword.error'));
                setTimeout(() => setError(''), 5000);
            });
        } catch (error) {
            setError(t('resetPassword.error'));
        }

        setLoading(false);
    };
    
    return (
        <FormCard onSubmit={handleSubmit(onSubmit)}>
            <h1 className='text-3xl text-base-100 mb-2'>{t('resetPassword.title')}</h1>
            <p className="text-base-100 text-sm my-3">{t('resetPassword.message')}</p>

            <InputField
                type="email"
                placeholder={t('email')}
                {...register('email')}
            />

            <div className='w-full flex justify-center'>
                <Button type="submit" loading={loading}>{t('resetPassword.submit')}</Button>
            </div>

            <div className="w-full flex justify-center mt-4 text-sm">
                <a href="/login" className="text-base-100 hover:underline">{t('resetPassword.backToLogin')}</a>
            </div>

            {errors.email && <WarningMessage error={errors.email.message as string} />}
            {success && <SuccessMessage message={msg} />}
            {error && <ErrorMessage error={error} />}
        </FormCard>
    );
};

export default ResetPassword;