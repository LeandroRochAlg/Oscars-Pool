import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Title from '../../components/ui/Title';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import '../../styles/auth.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../libs/api';
import { AxiosError } from 'axios';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
  token: yup.string().required('Invite Token is required'),
}).required();

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [msg, setMsg] = useState<string>('');

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post<string>('/register', data);
      console.log('Registration successful:', response.data);
      setMsg('Registration successful. You can now login.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Registration Error:', axiosError.response?.data);
      setMsg(axiosError.response?.data as string || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <FormCard onSubmit={handleSubmit(onSubmit)}>
        <Title title="Register" />
        <InputField
          type="text"
          placeholder="Username"
          {...register('username')}
          error={errors.username?.message}
        />
        <InputField
          type="password"
          placeholder="Password"
          {...register('password')}
          error={errors.password?.message}
        />
        <InputField
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <InputField
          type="text"
          placeholder="Invite Token"
          {...register('token')}
          error={errors.token?.message}
        />
        {msg && (<p className='error-message'>{msg}</p>)}
        <Button type="submit">REGISTER</Button>
        <Account message="Already have an account?" linkText='Login now.' link='/login'/>
      </FormCard>
    </div>
  );
};

export default RegisterPage;