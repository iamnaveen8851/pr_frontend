import { useDispatch, useSelector } from "react-redux";
import { clearCookie } from "../redux/actions/logoutAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // handle logout
  const handleLogout = () => {
    console.log("logout Clicked");
    localStorage.removeItem("accessToken");
    dispatch(clearCookie({ navigate }));
  };

  return (
    <nav className="bg-white shadow-md w-full px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">Task Management</div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
          </div>
          <span className="font-medium text-gray-700">{user || "User"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
