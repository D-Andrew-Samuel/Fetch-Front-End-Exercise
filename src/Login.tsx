import React, { useState } from 'react';
import './styles/tailwind.css';

type LoginProps = {
  onLogin: (name: string, email: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email) {
      setError('Please enter both name and email');
      return;
    }
    setError('');
    onLogin(name, email);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-500">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-custom-orange text-sm font-sm font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            className="shadow appearance-none border-custom-orange rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="mb-6">
          <label className="block text-custom-orange text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="shadow appearance-none border-custom-orange rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between">
  <div className="text-center w-full">
    <button
      className="bg-custom-orange font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 md:mb-0"
      type="submit"
    >
      Login
    </button>
  </div>
  {error && <p className="text-red-500 text-xs italic mt-2 md:mt-0">{error}</p>}
</div>
      </form>
    </div>
  );
};

export default Login;
