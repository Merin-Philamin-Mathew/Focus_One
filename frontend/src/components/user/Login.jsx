import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaLock } from 'react-icons/fa';
import Logo from '../Logo/Logo';
import {useDispatch, useSelector} from 'react-redux'
import { toggleDarkMode } from '../../features/user/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch()
  const darkMode = useSelector((state)=>state.user.darkMode)

  useEffect(()=>{
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode])

  console.log(darkMode, 'darkmode')

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 dark:bg-dark-300 px-4">
      <div className="absolute top-4 right-4">
        <button 
          onClick={()=>{dispatch(toggleDarkMode())}} 
          className="p-2 rounded-full hover:bg-secondary-200 dark:hover:bg-dark-200 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun className="text-secondary-100" /> : <FaMoon className="text-secondary-600" />}
        </button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="h-12" />
        </div>
        
        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-soft dark:shadow-dark-soft p-8">
          <h1 className="text-2xl font-heading font-bold text-center mb-6">
            Welcome to <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">FocusOne</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-secondary-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-4 pl-10 bg-secondary-50 outline-none dark:bg-dark-100 border border-secondary-300 dark:border-dark-100 rounded-lg focus:ring-0.5 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600 shadow-inner-soft"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-secondary-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 px-4 pl-10 outline-none bg-secondary-50 dark:bg-dark-100 border border-secondary-300 dark:border-dark-100 rounded-lg focus:ring-0.5 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600 shadow-inner-soft"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-dark-100 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                {/* <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"> */}
                  <span className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer">
                    Forgot password?
                  </span>
                {/* </Link> */}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              Sign in
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-secondary-600 dark:text-secondary-400">Don't have an account? </span>
            {/* <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"> */}
              <span className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer">
                Sign up
              </span>
            {/* </Link> */}
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-secondary-500 dark:text-secondary-400">
          <p>One task at a time. Build habits that last.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;