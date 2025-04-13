import { useState, useEffect, useRef } from "react";
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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Notification from "./Notification";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profilePicture } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Profile dropdown ref for handling outside clicks
  const profileDropdownRef = useRef(null);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, profilePicture]);

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // handle logout
  const handleLogout = () => {
    console.log("logout Clicked");
    dispatch(clearCookie({ navigate }));
    setProfileModalOpen(false);
    setMobileMenuOpen(false);
  };

  // Toggle profile modal
  const toggleProfileModal = () => {
    setProfileModalOpen(!profileModalOpen);
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
    setProfileModalOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md w-full px-4 sm:px-6 py-3 flex justify-between items-center transition-colors duration-300 fixed top-0 z-30">
        <div className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-800 dark:text-white m-auto md:m-0 lg:m-0">
          Task Management
        </div>

        <div className="md:hidden lg:hidden">
          <Notification />
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

          <div className="relative" ref={profileDropdownRef}>
            {/* Profile picture that triggers the dropdown */}
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleProfileModal}
              aria-label="Open profile menu"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center cursor-pointer">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={user}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to user icon if image fails to load
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-600 dark:text-gray-300"
                  />
                )}
              </div>
            </button>

            {/* Profile dropdown modal */}
            {profileModalOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt={user}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-gray-600 dark:text-gray-300"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={theme === "light" ? faMoon : faSun}
                    className={`mr-2 ${
                      theme === "light" ? "text-gray-700" : "text-yellow-300"
                    }`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden fixed top-16 right-0 left-0 bg-white dark:bg-gray-800 shadow-md z-20 transition-transform duration-300 transform ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 flex flex-col space-y-4">
          {/* User profile for mobile */}
          <div className="flex items-center space-x-3 p-2 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={user}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-600 dark:text-gray-300"
                />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                {user}
              </p>
            </div>
          </div>

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
