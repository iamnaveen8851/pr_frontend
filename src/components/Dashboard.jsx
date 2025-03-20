import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styles from "../styles/dashboard.module.css";
import { clearCookie } from "../redux/actions/logoutAction";
const Dashboard = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: loggedInUser, isLoggedIn } = useSelector(
    (state) => state.loginReducer
  );
  const { user: signedUpUser, isSignedUp } = useSelector(
    (state) => state.signUpReducer
  );

  useEffect(() => {
    if (isLoggedIn) {
      toast.success(`Welcome ${loggedInUser}!`);
    } else if (isSignedUp) {
      toast.success(`Welcome ${signedUpUser}!`);
    }
  }, [isLoggedIn, isSignedUp]);

  const handleLogout = () => {
    console.log("logout Clicked");
    if (isLoggedIn || isSignedUp) {
      dispatch(clearCookie());
    }

    // navigate("/login");
  };
  return (
    <div className={styles.parentContainer}>
      Dashboard
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
