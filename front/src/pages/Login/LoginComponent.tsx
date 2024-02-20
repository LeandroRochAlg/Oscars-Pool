import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Title from '../../components/ui/Title';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import '../../styles/auth.css';
import api from '../../libs/api';
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const [msg, setMsg] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login FormData:', formData);

    try {
      const response = await api.post<string>('/login', formData);
  
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response?.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Login Error:', axiosError.response?.data);

      // Verifying if axiosError.response exists avoids the error "Object is possibly 'null'"
      if (axiosError.response?.status) {
        setMsg(axiosError.response.data as string);
      } else {
        setMsg('An unexpected error occurred.');
      }  
    }
  };

  return (document.title = 'Login'), (
    <div>
        <FormCard onSubmit={handleSubmit}>
        <Title title="Login" className='log'/>
        <InputField
            placeholder="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
        />
        <InputField
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
        />

        {/* Display the error message */}
        {msg && (<p className='error-message'>{msg}</p>)}

        <Button type="submit">LOGIN</Button>
        <Account message="Don't have an account yet?" linkText='Create one now.' link='/register'/>
        </FormCard>
    </div>
  );
};

export default LoginPage;