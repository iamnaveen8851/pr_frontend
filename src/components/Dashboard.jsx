import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Dashboard = () => {
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
  return <div>Dashboard </div>;
};

export default Dashboard;
