import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout, toggleDarkMode } from "../../features/user/userSlice";
import Logo from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaSignOutAlt} from "react-icons/fa";
import { userLogout } from "../../features/user/userActions";

function Navbar() {
  const dispatch = useDispatch();
  const {userDetails, darkMode, success, error, loading} = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(()=>{
    if(success){
      dispatch(Logout())
      navigate('/signin') 
    }
  }, [success, error])

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(userDetails, darkMode, 'userrrr')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = (e) => {
    e.stopPropagation();
    setShowPopup(false);
    dispatch(userLogout())
    console.log("Logging out...");
  };

  return (
    <div>
      <header className="bg-white shadow-md dark:bg-dark-200 dark:border-b dark:border-dark-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo className="h-10 transition-all hover:scale-105" />

          <div className="flex items-center space-x-4">
            {userDetails ? (
              <div className="relative" ref={popupRef}>
                <button
                  onClick={() => setShowPopup((prev) => !prev)}
                  className="flex items-center focus:outline-none group"
                  aria-expanded={showPopup}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all duration-200">
                    {userDetails.first_name?.charAt(0).toUpperCase()}
                  </div>
                  <svg
                    className={`ml-1.5 h-4 w-4 text-secondary-600 dark:text-secondary-400 transition-transform duration-400 ${
                      showPopup ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showPopup && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-200 rounded-lg border border-secondary-100 dark:border-dark-100 shadow-lg py-2 z-50 transition-all duration-200 ease-in-out transform origin-top-right">
                    <div className="px-4 py-3 border-b border-secondary-100 dark:border-dark-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold mr-3">
                          {userDetails.first_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                            {userDetails.first_name} {userDetails.last_name}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                            {userDetails.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 border-t border-secondary-200 dark:border-dark-700 dark:border-dark-50">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="py-2 px-4 rounded-md hover:bg-secondary-100 dark:hover:bg-dark-100 text-secondary-900 dark:text-secondary-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 py-2 px-6 rounded-md text-sm font-medium text-white shadow-sm hover:shadow transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-dark-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-200"
              onClick={() => dispatch(toggleDarkMode())}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="h-4 w-4 text-yellow-500" />
              ) : (
                <FaMoon className="h-4 w-4 text-secondary-700" />
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
