import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faProjectDiagram,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faComments,
  faBars,
  faFileAlt, // Add hamburger menu icon
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(!isMobile); // Hide by default on mobile

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-hide on mobile, auto-show on desktop
      if (!mobile && !isVisible) {
        setIsVisible(true);
      } else if (mobile && isVisible && expanded) {
        // On mobile, collapse the sidebar when resizing
        setExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible, expanded]);

  // Theme detection logic
  useEffect(() => {
    // Function to update theme state
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    // Create a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });

    // Also listen for storage events for cross-tab synchronization
    window.addEventListener("storage", updateTheme);

    // Initial check
    updateTheme();

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    // When showing sidebar on mobile, start with collapsed state
    if (!isVisible && isMobile) {
      setExpanded(false);
    }
  };

  return (
    <>

      {/* Sidebar */}
      <div
        className={`h-[calc(100vh-4rem)] fixed top-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } 
        ${
          theme === "dark" ? "text-white" : "text-gray-800"
        } transition-all duration-300 ${expanded ? "w-64" : "w-16"} ${
          isVisible ? "left-0" : "-left-20"
        } z-20 shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center">
          {expanded && <h2 className="text-xl font-bold">Menu</h2>}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 rounded ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            } transition-colors`}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
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
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Tasks</span>}
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
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Projects</span>}
              </Link>
            </li>

            {/* Continue updating the rest of the icons in the same way */}
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
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Google Calendar</span>}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/comments"
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              <Link
                to="/comments"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faComments}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Comments</span>}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/reports"
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              <Link
                to="/reports"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Reports</span>}
              </Link>
            </li>
            <li
              className={`mb-2 ${
                location.pathname === "/analytics"
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              <Link
                to="/analytics"
                className={`flex items-center p-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } rounded transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && <span>Analytics</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay to close sidebar on mobile when clicked outside */}
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
