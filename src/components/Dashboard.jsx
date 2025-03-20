import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/dashboard.module.css";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon

const Dashboard = () => {
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

  // To Trigger the logout event and clear the access token & cookies simultaneously
  const handleLogout = () => {
    console.log("logout Clicked");
    if (isLoggedIn || isSignedUp) {
      dispatch(clearCookie());
    }
  };

  return (
    <div className={styles.parentContainer}>
      Dashboard
      <button className={styles.logout} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />{" "}
        {/* Add icon with margin */}
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
