import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isSignedUp } = useSelector((state) => state.signUpReducer);
  const { isLoggedIn } = useSelector((state) => state.loginReducer);

  useEffect(() => {
    // Check for JWT token in cookies
    const token = Cookies.get("jwtToken");

    // If token exists but user is not logged in Redux state, dispatch action to set auth state
    if (token) {
      dispatch({
        type: "SET_AUTH_FROM_TOKEN",
        payload: token,
      });
    }
  }, [dispatch, isLoggedIn, isSignedUp]);

  // Check both Redux state and cookies
  const token = Cookies.get("jwtToken");
  if (isLoggedIn || isSignedUp || token) {
    return children;
  } else {
    return <Navigate to="/users/login" />;
  }
};

export default PrivateRoute;
