import React, { useEffect, useState } from "react";
import { FaLock, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleDarkMode } from "../../features/user/userSlice";
import Logo from "../Logo/Logo";
import InputField from "../utils/InputField";

function SignUp() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.user.darkMode);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      // Here you would typically call your authentication API
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary-50 to-secondary-100 dark:from-dark-300 dark:to-dark-400 px-4 py-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-full bg-white/80 dark:bg-dark-200/80 hover:bg-secondary-200 dark:hover:bg-dark-100 transition-colors shadow-md"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FaSun className="text-yellow-500" size={20} />
          ) : (
            <FaMoon className="text-secondary-600" size={20} />
          )}
        </button>
      </div>

      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Logo className="h-14 transition-all hover:scale-105" />
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-lg dark:shadow-dark-soft p-8 border border-secondary-100 dark:border-dark-100">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Create your account
          </h1>
          <p className="text-center text-secondary-500 dark:text-secondary-400 mb-6">
            Join{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-medium">
              FocusOne
            </span>{" "}
            today
          </p>

          <form onSubmit={handleSubmit} className="">
            <InputField
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              icon={FaUser}
              error={errors.username}
              darkMode={darkMode}
            />
            
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={MdEmail}
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

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              error={errors.confirmPassword}
              darkMode={darkMode}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-secondary-600 dark:text-secondary-400">
              Already have an account?{" "}
            </span>
            <Link 
              to="/signin" 
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-4 pt-3 border-t border-secondary-200 dark:border-dark-100">
            <p className="text-xs text-center text-secondary-500 dark:text-secondary-400">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;