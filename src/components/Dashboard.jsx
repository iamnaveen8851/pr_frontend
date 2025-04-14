import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TaskComponent from "./TaskComponent";
import Project from "./Project";
import CommentSection from "./CommentSection";
import TaskAnalytics from "./TaskAnalytics";

import NavigationTabs from "./NavigationTabs";

const Dashboard = () => {
 
  const location = useLocation();
  const [activeView, setActiveView] = useState("tasks");

  // Sync activeView with current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path.includes("tasks")) {
      setActiveView("tasks");
    } else if (path.includes("projects")) {
      setActiveView("projects");
    } else if (path.includes("calendar")) {
      setActiveView("calendar");
    } else if (path.includes("comments")) {
      setActiveView("comments");
    } else if (path.includes("analytics")) {
      setActiveView("analytics");
    }
  }, [location.pathname]);

  // Function to render the appropriate component based on activeView
  const renderView = () => {
    switch (activeView) {
      case "tasks":
        return <TaskComponent />;
      case "projects":
        return <Project />;
      case "calendar":
        return <Project />; // Temporarily using Project component
      case "comments":
        return <CommentSection />;
      case "analytics":
        return <TaskAnalytics />;
      default:
        return <TaskComponent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* <Navbar /> */}

      <div className="flex flex-1
       ">
         {/* relative */}
      

        {/* Main content - adjusted for responsive layout */}
        <div className="flex-1 w-full transition-all duration-300 p-6 pt-0 ">
          {/* Navigation tabs */}
          <NavigationTabs />

          {/* Render the active view */}
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
