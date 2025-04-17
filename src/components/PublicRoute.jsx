import Dashboard from "./Dashboard";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import Calendar from "./Calendar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Project from "./Project";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import TaskAnalytics from "./TaskAnalytics";
import Reports from "./Reports";
import ResetPassword from "./ResetPassword";
const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;

  // Define sidebar expanded state with proper initialization
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // On mobile/tablet, sidebar should always be collapsed initially
    if (window.innerWidth < 1024) return false;
    // On desktop, respect user preference
    return localStorage.getItem("sidebarExpanded") === "true";
  });

  // Update window width state on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar and persist state
  const toggleSidebar = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  useEffect(() => {
    // Short timeout to ensure token is properly checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const AppLayout = ({ children }) => {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="flex flex-1 w-full ">
          <Sidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
          <div
          
            className={`transform transition-all duration-300 ease-in-out flex-1 ${
              isDesktop
                ? sidebarExpanded
                  ? "ml-48" // Margin for expanded sidebar
                  : "ml-16" // Margin for collapsed sidebar
                : "ml-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <AppLayout>
                <Project />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/comments"
          element={
            <PrivateRoute>
              <AppLayout>
                <CommentSection />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AppLayout>
                <TaskAnalytics />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
    </>
  );
};

export default PublicRoute;
