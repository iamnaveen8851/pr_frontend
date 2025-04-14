import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  // const { isLoggedIn, isSignedUp } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  // console.log("Access token", token);

  // Use ternary operator for conditional rendering
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return children;
};

// PrivateRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export default PrivateRoute;
