import React, { useState } from 'react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import Login from './Login';
import DogSearch from './DogSearch'; // Import the DogSearch component
import { login } from './api';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [loginError, setLoginError] = useState('');
  const [userName, setUserName] = useState(''); // State to track the user name

  const handleLogin = async (name: string, email: string) => {
    try {
      const response = await login(name, email);
      console.log('Login successful', response);
      setIsLoggedIn(true); // Set the login state to true on successful login
      setUserName(name); // Set the user name
      setLoginError('');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setLoginError(`Login failed: ${error.message}`);
      } else {
        setLoginError('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
};
  return (
<div>
  <h1 className="text-6xl font-extrabold text-center bg-custom-orange pt-10 pb-10">WELCOME TO placeholder DOG ADOPTION</h1>
  {!isLoggedIn ? (
    <>
      <Login onLogin={handleLogin} />
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </>
  ) : (
    <DogSearch handleLogout = {handleLogout} userName={userName} /> // Render DogSearch component when logged in
  )}
</div>
  );
};

function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App />
}

const container = document.getElementById('app');
if (!container) {
  throw new Error('Container element not found');
}

const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);