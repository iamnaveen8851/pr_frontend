// import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/actions/getUserAction";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isSignedUp } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      // console.log("Dispatching getUsers from PrivateRoute");
      dispatch(getUsers());
    }
  }, [dispatch, token]);
  // Use ternary operator for conditional rendering
  return token ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
