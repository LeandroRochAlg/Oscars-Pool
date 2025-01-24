import { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import ErrorMessage from '../../components/common/ErrorMessage';
import WarningMessage from '../../components/common/WarningMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../libs/api';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { User } from '../../models/user';

const RegisterPage = () => {
  type UserForm = Pick<User, 'username' | 'email' | 'password'> & { confirmPassword?: string }; // Confirm password needs to be optional for validation
  const [msg, setMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  const schema = yup.object({
    username: yup.string()
      .required(t('validation.usernameRequired'))
      .min(4, t('validation.usernameLength'))
      .matches(/^[a-zA-Z0-9_]+$/, t('validation.usernameInvalid')),
    email: yup.string()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: yup.string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordLength')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), undefined], t('validation.passwordsDontMatch')),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: UserForm) => {
    try {
      setLoading(true);
      const response = await api.post<string>('/register', data);
      
      if (response.status === 201) {
        setMsg(t('apiResults.register.success'));
      }

      if (response.status === 400) {
        setErrorMsg(t('apiResults.register.usernameOrEmailTaken'));
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 400) {
        setErrorMsg(t('apiResults.register.usernameOrEmailTaken'));
      } else {
        setErrorMsg(t('apiResults.register.error'));
      }
    }
    
    setLoading(false);
    setTimeout(() => {
      setMsg('');
      setErrorMsg('');
    }, 5000);
  };

  return (document.title = t('register'),
    <>
      <FormCard onSubmit={handleSubmit(onSubmit)}>
        <h1 className='text-3xl text-base-100 mb-2'>{t('register')}</h1>

        <InputField
          type="text"
          placeholder={t('username')}
          {...register('username')}
        />
        <InputField
          type="email"
          placeholder={t('email')}
          {...register('email')}
        />
        <InputField
          type="password"
          placeholder={t('password')}
          {...register('password')}
        />
        <InputField
          type="password"
          placeholder={t('confirmPassword')}
          {...register('confirmPassword')}
        />

        <div className='w-full flex justify-center'>
          <Button type="submit" loading={loading}>{t('register')}</Button>
        </div>

        <Account message={t('alreadyHaveAnAccount')} linkText={t('loginNow')} link='/login'/>

        {errors.username && <WarningMessage error={errors.username.message as string} />}
        {!errors.username && errors.email && <WarningMessage error={errors.email.message as string} />}
        {!errors.username && !errors.email && errors.password && <WarningMessage error={errors.password.message as string} />}
        {!errors.username && !errors.email && !errors.password && errors.confirmPassword && <WarningMessage error={errors.confirmPassword.message as string} />}

        <ErrorMessage error={errorMsg} />
        <SuccessMessage message={msg} />
      </FormCard>
      </>
  );
};

export default RegisterPage;