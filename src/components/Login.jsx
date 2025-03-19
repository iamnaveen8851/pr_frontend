import { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../redux/actions/loginAction";
import Loader from "./Loader";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { loading, message, isLoggedIn } = useSelector(
    (state) => state.loginReducer
  );
  // const { message, user, isLoggedIn } = useSelector(
  //   (state) => state.loginReducer
  // );
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleLogin(formState, navigate));
  };

  // To pass a message
  useEffect(() => {
    if (!isLoggedIn && message && !loading) {
      toast.error(`${message}`);
    }
  }, [isLoggedIn, message, loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.parentContainer}>
        {/* left div for image */}
        <div className={styles.leftChild}>
          <img className={styles.imageStyling} src="\authImage.avif" alt="" />
        </div>

        {/* right div for form */}
        <div className={styles.rightChild}>
          <div className={styles.formContainer}>
            <h3 className={styles.heading}>Login</h3>
            <br />
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.inputBoxes}
                type="text"
                placeholder="Email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                className={styles.inputBoxes}
                type="password"
                placeholder="Password"
                value={formState.password}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  })
                }
                required
              />

              <button className={styles.submitBtn} type="submit">
                Sign In
              </button>

              <div className="m-auto">
                <p>
                  Dont have account?{" "}
                  <button
                    onClick={() => navigate("/users/signup")}
                    className={styles.linkBtn}
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
