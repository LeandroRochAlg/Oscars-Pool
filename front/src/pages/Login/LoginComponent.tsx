import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import ErrorMessage from '../../components/common/ErrorMessage';
import WarningMessage from '../../components/common/WarningMessage';
import api from '../../libs/api';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { User } from '../../models/user';
import { auth } from '../../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage: React.FC = () => {
  type UserResponse = Pick<User, 'username' | 'email' | 'admin' | 'emailVerified'> & { token: string };
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  // Define the validation schema using Yup
  const schema = yup.object({
    emailOrUsername: yup.string().required(t('validation.usernameOrEmailRequired')),
    password: yup.string().required(t('validation.passwordRequired')),
  }).required();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await api.post<string>('/login', data);

      // Get the user data from the response and store it in local storage
      const user: UserResponse = response.data as unknown as UserResponse;
      localStorage.setItem('user', JSON.stringify(user));

      // Save user in Firebase Authentication
      await signInWithEmailAndPassword(auth, user.email, data.password);

      // Check if there is a redirect URL, if so, redirect the user to that page
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirectUrl ? redirectUrl : '/';
    } catch (error) {
      setLoading(false);
      const axiosError = error as AxiosError;
      console.error('Login Error:', axiosError.response?.data);
      
      // Display an error message
      if (axiosError.response?.status === 401) {
        setMsg(t('apiResults.login.invalidCredentials'));
      }
      if (axiosError.response?.status === 500) {
        setMsg(t('apiResults.login.error'));
      }
    }

    setLoading(false);
    setTimeout(() => {
      setMsg('');
    }, 5000);
  };

  return (document.title = t('login'),
    <div className='auth-body'>
      <FormCard onSubmit={handleSubmit(onSubmit)}>
        <h1 className='text-3xl text-base-100 mb-2'>{t('login')}</h1>

        <InputField
          type="text"
          placeholder={t('usernameOrEmail')}
          {...register('emailOrUsername')}
        />
        <InputField
          type="password"
          placeholder={t('password')}
          {...register('password')}
        />

        {/* Forgot password */}
        <div className='w-full flex justify-end text-sm text-base-100 mt-2 italic'>
          <a href='/reset-password' className='text-base-100 hover:underline'>{t('forgotPassword')}</a>
        </div>

        <div className='w-full flex justify-center'>
          <Button type="submit" loading={loading}>{t('login')}</Button>
        </div>

        <Account message={t('dontHaveAnAccount')} linkText={t('createAccount')} link='/register'/>

        {errors.emailOrUsername && <WarningMessage error={errors.emailOrUsername.message as string} />}
        {!errors.emailOrUsername && errors.password && <WarningMessage error={errors.password.message as string} />}

        <ErrorMessage error={msg} />
      </FormCard>
    </div>
  );
};

export default LoginPage;