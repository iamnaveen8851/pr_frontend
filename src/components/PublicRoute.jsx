import { useEffect } from "react";
import Dashboard from "./Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";

import { getUsers } from "../redux/actions/getUserAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

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
          path={"/login"}
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
    </>
  );
};

export default PublicRoute;
