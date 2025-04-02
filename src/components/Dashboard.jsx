import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TaskComponent from "./TaskComponent";
import Project from "./Project";
import CommentSection from "./CommentSection";
import TaskAnalytics from "./TaskAnalytics";
import Sidebar from "./Sidebar";
import NavigationTabs from "./NavigationTabs"; // Import the NavigationTabs component

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
    <>
      <Navbar />
      <Sidebar />
      <div className="container w-[88%] m-auto mt-0 px-5 ">
        {/* Use the NavigationTabs component */}
        <NavigationTabs />

        {/* Render the active view */}
        {renderView()}
      </div>
    </>
  );
};

export default Dashboard;
