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

  useEffect(() => {
    // Short timeout to ensure token is properly checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Wrapper component for layout consistency
  const AppLayout = ({ children }) => {
    // Get sidebar expanded state from somewhere (localStorage or context)
    const [sidebarExpanded, setSidebarExpanded] = useState(
      localStorage.getItem("sidebarExpanded") === "true"
    );

    // Listen for sidebar toggle events
    useEffect(() => {
      const handleSidebarToggle = (e) => {
        if (e.detail && Object.prototype.hasOwnProperty.call(e.detail, 'expanded')) {
          setSidebarExpanded(e.detail.expanded);
        }
      };
      
      window.addEventListener('sidebar-toggle', handleSidebarToggle);
      return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle);
    }, []);

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="flex flex-1 pt-4">
          <Sidebar />
          <main className={`flex-1 transition-all duration-150 ease-in-out ${
            sidebarExpanded ? 'ml-[130px]' : 'ml-0'}`}>
            {children}
          </main>
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

        {/* Add Analytics route */}
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
        {/* Add Analytics route */}
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
        {/* Catch-all route for any undefined routes */}
        {/* <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} /> */}
      </Routes>
    </>
  );
};

export default PublicRoute;
