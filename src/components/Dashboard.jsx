import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TaskComponent from "./TaskComponent";
import Project from "./Project";
// Import Calendar component when it's ready
// import Calendar from "./Calendar";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState("tasks"); // Default view is tasks

  // Sync activeView with current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path.includes("tasks")) {
      setActiveView("tasks");
    } else if (path.includes("projects")) {
      setActiveView("projects");
    } else if (path.includes("calendar")) {
      setActiveView("calendar");
    }
  }, [location.pathname]);

  // Function to handle tab changes
  const handleTabChange = (view) => {
    setActiveView(view);
    if (view === "tasks") {
      navigate("/");
    } else {
      navigate(`/${view}`);
    }
  };

  // Function to render the appropriate component based on activeView
  const renderView = () => {
    switch (activeView) {
      case "tasks":
        return <TaskComponent />;
      case "projects":
        return <Project />;
      case "calendar":
        // Temporarily using Project component for calendar view
        return <Project />;
      default:
        return <TaskComponent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-gray-800 text-white fixed left-0 top-16 bottom-0 z-10 hidden md:block">
          {/* Sidebar content with navigation buttons */}
          <div className="flex flex-col items-center py-4">
            <button 
              onClick={() => handleTabChange("tasks")}
              className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg ${
                activeView === "tasks" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              title="Tasks"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            
            <button 
              onClick={() => handleTabChange("projects")}
              className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg ${
                activeView === "projects" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              title="Projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>
            
            <button 
              onClick={() => handleTabChange("calendar")}
              className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg ${
                activeView === "calendar" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              title="Calendar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full md:ml-16 p-4 pt-20">
          {/* View selector tabs */}
          <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium ${
                activeView === "tasks"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabChange("tasks")}
            >
              Tasks
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeView === "projects"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabChange("projects")}
            >
              Projects
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeView === "calendar"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabChange("calendar")}
            >
              Calendar
            </button>
          </div>

          {/* Render the active view */}
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
