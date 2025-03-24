import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  // const { isLoggedIn, isSignedUp } = useSelector((state) => state.auth);

  const token = localStorage.getItem("accessToken");

  // Use ternary operator for conditional rendering
  return token ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
