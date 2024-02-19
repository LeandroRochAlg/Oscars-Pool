import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Title from '../../components/ui/Title';

const RegisterPage: React.FC = () => {
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
    <form onSubmit={handleSubmit}>
      <Title title="Login" />
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
      <Button type="submit">Login</Button>
    </form>
  );
};

export default RegisterPage;