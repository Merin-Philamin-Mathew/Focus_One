import React, { useEffect, useState } from "react";
import { FaLock, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetAll, toggleDarkMode } from "../../features/user/userSlice";
import Logo from "../Logo/Logo";
import InputField from "../utils/InputField";
import { userSignup } from "../../features/user/userActions";
import { customToast } from "../utils/toasts/Sonner";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {darkMode, loading, error, success, message} = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(success, 'success', error)

  useEffect(()=>{
    if(success){
      navigate('/signin')
      customToast.success(message)
      dispatch(resetAll())
    }
    if(error){
      console.log(error, 'error sign up')
      if (typeof error === 'object') {
        setErrors(error);
      }
    }
  }, [error, success])

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
    const nameRegex = /^[a-zA-Z]+$/;
    
    // Username validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    } else if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name = "First name must contain only letters";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    } else if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = "Last name must contain only letters";
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
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one digit";
      } else if (!/[@$!%*?&._#^()\-+=]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character";
      }
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

    dispatch(userSignup(formData))
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
            <div className="w-full flex gap-4 ">
              <InputField
                id="first_name"
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                icon={FaUser}
                error={errors.first_name}
                darkMode={darkMode}
              />

              <InputField
                id="last_name"
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                // icon={FaUser}
                error={errors.last_name}
                darkMode={darkMode}
              />
            </div>
            
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
                {loading ? (
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