import { useNavigate, useLocation } from "react-router-dom";

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    }
    return "tasks"; // Default
  };
  
  const activeView = getActiveView();

  return (
    <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
      <button
        className={`py-2 px-4 font-medium ${
          activeView === "tasks"
            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => navigate("/")}
      >
        Tasks
      </button>
      
      <button
        className={`py-2 px-4 font-medium ${
          activeView === "projects"
            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => navigate("/projects")}
      >
        Projects
      </button>
      
      <button
        className={`py-2 px-4 font-medium ${
          activeView === "calendar"
            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => navigate("/calendar")}
      >
        Calendar
      </button>
      
      <button
        className={`py-2 px-4 font-medium ${
          activeView === "comments"
            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => navigate("/comments")}
      >
        Comments
      </button>
      
      <button
        className={`py-2 px-4 font-medium ${
          activeView === "analytics"
            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => navigate("/analytics")}
      >
        Analytics
      </button>
    </div>
  );
};

export default NavigationTabs;