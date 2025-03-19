import { useEffect, useState } from "react";
import styles from "../styles/signup.module.css";
import { handleSignUp } from "../redux/actions/signUpAction";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isSignedUp, message, user } = useSelector(
    (state) => state.signUpReducer
  );
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    console.log("Sign up form submitted:", formState);
    e.preventDefault();
    dispatch(handleSignUp(formState, navigate));
  };

  useEffect(() => {
    if (!isSignedUp && message && !loading) {
      toast.error(`${message}`);
    }
  }, [isSignedUp, message, loading]);
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
            <h3 className={styles.heading}>Register</h3>
            <br />
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.inputBoxes}
                type="text"
                placeholder="Username"
                value={formState.username}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    username: e.target.value,
                  })
                }
                required
              />
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
                Register
              </button>

              <div className="m-auto">
                <p>
                  If you have account{" "}
                  <button
                    onClick={() => navigate("/users/login")}
                    className={styles.linkBtn}
                  >
                    Login
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

export default SignUp;
