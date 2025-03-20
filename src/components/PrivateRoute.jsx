import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const PrivateRoute = ({ children }) => {
  const { isSignedUp } = useSelector((state) => state.signUpReducer);
  const { isLoggedIn } = useSelector((state) => state.loginReducer);

  const token = localStorage.getItem("accessToken");

  if (isLoggedIn || isSignedUp || token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

// Add prop validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a React node
};

export default PrivateRoute;
