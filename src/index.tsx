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

  const handleLogin = async (name: string, email: string) => {
    try {
      const response = await login(name, email);
      console.log('Login successful', response);
      setIsLoggedIn(true); // Set the login state to true on successful login
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

  return (
<div>
  <h1 className="text-6xl font-extrabold text-center bg-custom-orange pt-10">WELCOME TO FETCH DOG ADOPTION</h1>
  <h2 className="text-2xl font-thin text-center bg-custom-orange pb-5">Frontend Take-Home Exercise</h2>
  {!isLoggedIn ? (
    <>
      <Login onLogin={handleLogin} />
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </>
  ) : (
    <DogSearch /> // Render DogSearch component when logged in
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