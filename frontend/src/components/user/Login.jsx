import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaUser, FaLock } from 'react-icons/fa';
import Logo from '../Logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { resetAll, setIsLoggedin, toggleDarkMode } from '../../features/user/userSlice';
import { userLogin } from '../../features/user/userActions';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../utils/InputField';
import { customToast } from '../utils/toasts/Sonner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {darkMode, loading, error, success, message} = useSelector((state) => state.user);
  
  useEffect(()=>{
    if(success){
      customToast.success(message)
      dispatch(setIsLoggedin())
      navigate('/');
      dispatch(resetAll())
    }
    if (error){
      console.log(error, 'error sign in')
      if (typeof error === 'object') {
        setErrors(error);
      }
    }
  },[success, error])


  console.log(errors, 'errororororor')
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    console.log(id, 'idddd')
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: '',
      });
    }
    if(errors['message']){
      setErrors({
        ...errors,
        message: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Enter an email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Enter a password.';
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    dispatch(userLogin({
      email: formData.email, 
      password: formData.password
    })).finally(() => {
      setIsSubmitting(false);
      dispatch(resetAll())
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary-50 to-secondary-100 dark:from-dark-300 dark:to-dark-400 px-4">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => { dispatch(toggleDarkMode()) }} 
          className="p-2 rounded-full bg-white/80 dark:bg-dark-200/80 hover:bg-secondary-200 dark:hover:bg-dark-100 transition-colors shadow-md"
          aria-label="Toggle dark mode"
        >
          {darkMode ? 
            <FaSun className="text-yellow-500" size={20} /> : 
            <FaMoon className="text-secondary-600" size={20} />
          }
        </button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-14 transition-all hover:scale-105" />
        </div>
        
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-lg dark:shadow-dark-soft p-8 border border-secondary-100 dark:border-dark-100">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-secondary-500 dark:text-secondary-400 mb-6">
            Sign In to <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-medium">FocusOne</span>
          </p>
          
          <form onSubmit={handleSubmit} className="">
            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={FaUser}
              error={errors.email}
              darkMode={darkMode}
            />
            
            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              error={errors.password}
              darkMode={darkMode}
            />
            
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <span className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
            </div>
            {errors?.message &&
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-all duration-300 ease-in-out">{errors?.message[0]}</p>
            }
            
            <div className="pt-5">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-secondary-600 dark:text-secondary-400">Don't have an account? </span>
            <Link 
              to="/signup"  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer transition-colors">
              Sign up
            </Link>
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