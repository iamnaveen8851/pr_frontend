import { useDispatch } from "react-redux";
import styles from "../styles/dashboard.module.css";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    console.log("logout Clicked");

    dispatch(clearCookie({ navigate }));
    // navigate("/login");
  };

  return (
    <div className={styles.parentContainer}>
      Dashboard
      <button className={styles.logout} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
