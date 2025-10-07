
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLoginView ? 'Inicia sessió' : 'Crea el teu compte'}
          </h2>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsLoginView(true)}
            className={`w-1/2 py-4 text-sm font-medium text-center transition-colors ${
              isLoginView 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={`w-1/2 py-4 text-sm font-medium text-center transition-colors ${
              !isLoginView 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>
        {isLoginView ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;