import Dashboard from "./Dashboard";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";


const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  console.log("Token", token);
  console.log("Current path:", location.pathname);

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
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp />}
        />
        {/* Catch-all route for any undefined routes */}
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </>
  );
};

export default PublicRoute;
