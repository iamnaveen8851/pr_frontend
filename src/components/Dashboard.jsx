import { useState } from "react";
import Navbar from "./Navbar";
import TaskComponent from "./TaskComponent";
// Import other components when they're ready
// import ProjectComponent from "./ProjectComponent";
// import CalendarComponent from "./Calendar";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("tasks"); // Default view is tasks

  // Function to render the appropriate component based on activeView
  const renderView = () => {
    switch (activeView) {
      case "tasks":
        return <TaskComponent />;
      case "projects":
        // Return ProjectComponent when it's ready
        return <div className="text-center p-8">Projects view coming soon</div>;
      case "calendar":
        // Return CalendarComponent when it's ready
        return <div className="text-center p-8">Calendar view coming soon</div>;
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
          {/* Sidebar content */}
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
              onClick={() => setActiveView("tasks")}
            >
              Tasks
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeView === "projects"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveView("projects")}
            >
              Projects
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeView === "calendar"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveView("calendar")}
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


