import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/dashboard.module.css";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, isSignedUp } = useSelector(
    (state) => state.authReducer
  );
  // const { user: signedUpUser,  } = useSelector(
  //   (state) => state.signUpReducer
  // );

  useEffect(() => {
    if (isLoggedIn) {
      toast.success(`Welcome ${user}!`);
    }
  }, [isLoggedIn, isSignedUp]);

  // To Trigger the logout event and clear the access token & cookies simultaneously
  const handleLogout = () => {
    console.log("logout Clicked");
    console.log(isLoggedIn, isSignedUp, "..........auth status........");
    if (!isLoggedIn || !isSignedUp) {
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
