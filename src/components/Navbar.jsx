import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faSun,
  faMoon,
  faTasks,
  faProjectDiagram,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Notification from "./Notification";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    dispatch(clearCookie({ navigate }));
    setMobileMenuOpen(false);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when navigating
  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md w-full px-4 sm:px-6 py-3 flex justify-between items-center transition-colors duration-300 fixed top-0 z-30">
ui
        <div className="text-xl md:text-2xl lg:text-2xl  font-bold text-gray-800 dark:text-white  m-auto md:m-0 lg:m-0 ">
          Task Management

        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Notification />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon
              icon={theme === "light" ? faMoon : faSun}
              className={`text-lg ${
                theme === "light" ? "text-gray-700" : "text-yellow-300"
              }`}
            />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {user}
            </span>
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

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden fixed top-16 right-0 left-0 bg-white dark:bg-gray-800 shadow-md z-20 transition-transform duration-300 transform ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 flex flex-col space-y-4">
          {/* Navigation links for mobile */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={handleNavigation}
                >
                  <FontAwesomeIcon icon={faTasks} className="mr-3" />
                  <span>Tasks</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/projects"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={handleNavigation}
                >
                  <FontAwesomeIcon icon={faProjectDiagram} className="mr-3" />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/calendar"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={handleNavigation}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                  <span>Calendar</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User controls */}
          <button
            onClick={toggleTheme}
            className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <FontAwesomeIcon
              icon={theme === "light" ? faMoon : faSun}
              className={`text-lg mr-2 ${
                theme === "light" ? "text-gray-700" : "text-yellow-300"
              }`}
            />
            <span className="text-gray-700 dark:text-gray-200">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </button>

          {/* Logout button for mobile */}
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar - only shown on desktop */}
      <div
        className={`h-[calc(100vh-4rem)] fixed top-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } 
        ${
          theme === "dark" ? "text-white" : "text-gray-800"
        } transition-all duration-300 
        ${sidebarExpanded ? "md:w-64" : "md:w-16"} 
        hidden md:block
        left-0 z-20 shadow-lg overflow-hidden`}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarExpanded && (
            <h2 className="text-xl font-bold hidden md:block">Menu</h2>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            } transition-colors hidden md:block`}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FontAwesomeIcon
              icon={sidebarExpanded ? faChevronLeft : faChevronRight}
            />
          </button>
        </div>

        <nav
          className="mt-6 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 12rem)" }}
        >
          <ul>
            <li
              className={`mb-2 ${
                location.pathname === "/" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <Link
                to="/"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faTasks}
                  className={sidebarExpanded ? "mr-3" : "mx-auto"}
                />
                {sidebarExpanded && <span>Tasks</span>}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/projects"
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              <Link
                to="/projects"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faProjectDiagram}
                  className={sidebarExpanded ? "mr-3" : "mx-auto"}
                />
                {sidebarExpanded && <span>Projects</span>}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/calendar"
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              <Link
                to="/calendar"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className={sidebarExpanded ? "mr-3" : "mx-auto"}
                />
                {sidebarExpanded && <span>Calendar</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content wrapper with padding to account for navbar and sidebar */}
      <div
        className={`pt-16 transition-all duration-300 ${
          sidebarExpanded ? "md:pl-64" : "md:pl-16"
        } pl-0`}
      >
        {/* This is where your page content will be rendered */}
      </div>
    </>
  );
};

export default Navbar;
