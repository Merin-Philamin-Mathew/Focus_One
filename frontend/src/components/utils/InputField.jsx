import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InputField({
  id,
  label,
  type: initialType,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  darkMode,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = initialType === "password";
  const type = isPasswordField && showPassword ? "text" : initialType;

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && (
            <Icon 
              className={`${
                isFocused 
                  ? "text-primary-500 dark:text-primary-400" 
                  : "text-secondary-400 dark:text-secondary-500"
              } transition-colors duration-200`}
              size={18}
            />
          )}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full py-3 px-4 pl-10 
            ${isPasswordField ? 'pr-10' : ''}
            outline-none 
            bg-white dark:bg-dark-100 
            border ${error 
              ? "border-red-400 dark:border-red-500" 
              : isFocused 
                ? "border-primary-500 dark:border-primary-400" 
                : "border-secondary-300 dark:border-dark-50"
            }
            rounded-lg 
            focus:ring-2 
            ${error 
              ? "focus:ring-red-200 dark:focus:ring-red-900/30" 
              : "focus:ring-primary-100 dark:focus:ring-primary-900/30"
            }
            shadow-sm
            text-secondary-900 dark:text-white
            placeholder-secondary-400 dark:placeholder-secondary-500
            transition-all duration-200
          `}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex="-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors" />
            ) : (
              <FaEye className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors" />
            )}
          </button>
        )}
      </div>
        {error && (
      <div className="min-h-6">
          <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-all duration-300 ease-in-out">
            {error}
          </p>
      </div>
        )}
    </div>
  );
}

export default InputField;