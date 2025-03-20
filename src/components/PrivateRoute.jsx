import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isSignedUp } = useSelector((state) => state.signUpReducer);
  const { isLoggedIn } = useSelector((state) => state.loginReducer);

  const token = localStorage.getItem("accessToken");
  // console.log("Token", token);
  if (isLoggedIn || isSignedUp || token) {
    return children;
  } else {
    return <Navigate to="/users/login" />;
  }
};

export default PrivateRoute;
