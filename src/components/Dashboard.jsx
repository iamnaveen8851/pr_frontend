import { useDispatch } from "react-redux";
import styles from "../styles/dashboard.module.css";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure state variables are accessed correctly
  // const {isLoggedIn } = useSelector((state) => state.auth);
  //  useEffect(() => {
  //   //  if (isLoggedIn && user) {
  //   //   //  toast.success(`Welcome ${user}!`);
  //   //  }
  //  }, [isLoggedIn, user]);

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
