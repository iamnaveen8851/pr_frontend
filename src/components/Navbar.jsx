import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // handle logout
  const handleLogout = () => {
    console.log("logout Clicked");
    localStorage.removeItem("accessToken");
    dispatch(clearCookie({ navigate }));
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md w-full px-6 py-3 flex justify-between items-center transition-colors duration-300">
      <div className="text-xl font-bold text-gray-800 dark:text-white">Task Management</div>
      <div className="flex items-center space-x-4 ">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon 
            icon={theme === "light" ? faMoon : faSun} 
            className={`text-lg ${theme === "light" ? "text-gray-700" : "text-yellow-300"}`} 
          />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-600 dark:text-gray-300" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-200">{user}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
