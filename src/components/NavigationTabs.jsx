import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine active view based on current path
  const getActiveView = () => {
    const path = location.pathname;
    if (path === "/" || path.includes("tasks")) {
      return "tasks";
    } else if (path.includes("projects")) {
      return "projects";
    } else if (path.includes("calendar")) {
      return "calendar";
    } else if (path.includes("comments")) {
      return "comments";
    } else if (path.includes("analytics")) {
      return "analytics";
    } else if (path.includes("reports")) {
      return "reports";
    }
    return "tasks"; // Default
  };

  const activeView = getActiveView();

  // Get display name for active view
  const getActiveViewName = () => {
    switch (activeView) {
      case "tasks":
        return "Tasks";
      case "projects":
        return "Projects";
      case "calendar":
        return "Calendar";
      case "comments":
        return "Comments";
      case "analytics":
        return "Analytics";
      default:
        return "Tasks";
    }
  };

  // Toggle dropdown for mobile view
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      {/* Mobile dropdown (visible on small screens) */}
      <div className="md:hidden relative mb-4">
        <button
          onClick={toggleDropdown}
          className="w-full flex justify-between items-center py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
        >
          <span className="font-medium">{getActiveViewName()}</span>
          <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} />
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "tasks"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/");
                setDropdownOpen(false);
              }}
            >
              Tasks
            </button>

            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "projects"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/projects");
                setDropdownOpen(false);
              }}
            >
              Projects
            </button>

            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "calendar"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/calendar");
                setDropdownOpen(false);
              }}
            >
              Calendar
            </button>

            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "comments"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/comments");
                setDropdownOpen(false);
              }}
            >
              Comments
            </button>

            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "analytics"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/analytics");
                setDropdownOpen(false);
              }}
            >
              Analytics
            </button>
            <button
              className={`w-full text-left py-2 px-4 ${
                activeView === "analytics"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => {
                navigate("/reports");
                setDropdownOpen(false);
              }}
            >
              Reports
            </button>
          </div>
        )}
      </div>

      {/* Desktop tabs (hidden on small screens) */}
      <div className="hidden md:flex mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "tasks"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => navigate("/")}
        >
          Tasks
        </button>

        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "projects"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => navigate("/projects")}
        >
          Projects
        </button>

        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "calendar"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => navigate("/calendar")}
        >
          Calendar
        </button>

        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "comments"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => navigate("/comments")}
        >
          Comments
        </button>

        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "analytics"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => navigate("/analytics")}
        >
          Analytics
        </button>

        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeView === "reports"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => {
            navigate("/reports");
            setDropdownOpen(false);
          }}
        >
          Reports
        </button>
      </div>
    </>
  );
};

export default NavigationTabs;
