import { createContext,  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { isLoggedIn, isSignedUp } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT_SUCCESS" });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSignedUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
