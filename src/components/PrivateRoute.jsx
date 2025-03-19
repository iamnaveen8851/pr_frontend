import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { isSignedUp } = useSelector((state) => state.signUpReducer);
  const { isLoggedIn, message, loading } = useSelector(
    (state) => state.loginReducer
  );

  
 

  if (isLoggedIn || isSignedUp) {
    return children;
  } else {
    return <Navigate to="/users/login" />;
  }
};

export default PrivateRoute;
