import Dashboard from "./Dashboard";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import Calendar from "./Calendar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  console.log("Token", token);
  console.log("Current path:", location.pathname);

  // Wrapper component for layout consistency
  const AppLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
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
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
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
