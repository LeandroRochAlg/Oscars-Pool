import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Title from '../../components/ui/Title';
import Account from '../../components/common/Account';
import FormCard from '../../components/common/FormCard';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login FormData:', formData);
    // Implement login logic here
  };

  return (
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
        <Button type="submit">LOGIN</Button>
        <Account message="Don't have an account yet?" linkText='Create one now.' link='/register'/>
        </FormCard>
    </div>
  );
};

export default LoginPage;