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
  faFileAlt, // Add hamburger menu icon
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // Near the top of your component
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024);
  const [isVisible, setIsVisible] = useState(window.innerWidth >= 1024); // Only visible on desktop initially

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobileOrTablet = window.innerWidth < 1024;
      const wasMobileOrTablet = isMobileOrTablet;
      
      setIsMobileOrTablet(mobileOrTablet);

      // If transitioning from desktop to mobile/tablet, hide the sidebar
      if (mobileOrTablet && !wasMobileOrTablet) {
        setIsVisible(false);
      }
      // If transitioning from mobile/tablet to desktop, show the sidebar
      else if (!mobileOrTablet && wasMobileOrTablet) {
        setIsVisible(true);
      }
      
      // On mobile/tablet, collapse the sidebar when resizing
      if (mobileOrTablet && expanded) {
        setExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOrTablet, expanded]);

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
    // When showing sidebar on mobile/tablet, start with collapsed state
    if (!isVisible && isMobileOrTablet) {
      setExpanded(false);
    }
  };

  // Add this function to handle sidebar expansion
  const handleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Store in localStorage for persistence
    localStorage.setItem("sidebarExpanded", newExpandedState.toString());
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent('sidebar-toggle', { 
        detail: { expanded: newExpandedState } 
      })
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`h-[calc(100vh-4rem)] fixed top-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } 
        ${
          theme === "dark" ? "text-white" : "text-gray-800"
        } transition-all duration-500 ease-in ${expanded ? "w-45" : "w-16"} ${
          isVisible ? "left-0" : "-left-20"
        } z-20 shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center">
          {expanded && <h2 className="text-xl font-bold">Menu</h2>}
          <button
            onClick={handleExpand}
            className={`p-2 rounded ${
              theme === "dark" ? "hover:bg-blue-600" : "hover:bg-gray-200"
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
                location.pathname === "/" ? "bg-orange-500 text-white" : ""
              }`}
            >
              <Link
                to="/"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
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
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/projects"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
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
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/calendar"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
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
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/comments"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
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
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/reports"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
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
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/analytics"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600  hover:text-white"
                }  rounded transition-colors`}
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
      {/* Overlay to close sidebar on mobile/tablet when clicked outside */}
      {isMobileOrTablet && isVisible && (
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
