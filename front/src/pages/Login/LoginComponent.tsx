import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Title from '../../components/ui/Title';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import api from '../../libs/api';
import { AxiosError } from 'axios';

// Define the validation schema using Yup
const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const [msg, setMsg] = useState<string>('');

  const onSubmit = async (data: any) => {
    console.log('Login data:', data);
    try {
      const response = await api.post<string>('/login', data);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data);
      
      // Redirect to the home page
      window.location.href = '/';
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Login Error:', axiosError.response?.data);
      setMsg(axiosError.response?.data as string || 'An unexpected error occurred.');
    }
  };

  return (document.title = 'Login',
    <div className='auth-body'>
      <FormCard onSubmit={handleSubmit(onSubmit)}>
        <Title title="Login" />
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
        {msg && (<p className='error-message'>{msg}</p>)}
        <Button type="submit">LOGIN</Button>
        <Account message="Don't have an account yet?" linkText='Create one now.' link='/register'/>
      </FormCard>
    </div>
  );
};

export default LoginPage;