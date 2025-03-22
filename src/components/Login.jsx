import { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../redux/actions/loginAction";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import eye icons

const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  // to store the errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  // to validate the fields
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);
  console.log(user, "User");
  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    // Additional email validation
    if (email.length > 100) return "Email must be less than 100 characters";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 50) return "Password must be less than 50 characters";

    // Add more comprehensive password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";

    return "";
  };

  // Handle blur events to mark fields as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur
    let errorMessage = "";
    if (name === "email") errorMessage = validateEmail(value);
    else if (name === "password") errorMessage = validatePassword(value);

    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEmail(formState.email);
    const passwordError = validatePassword(formState.password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
    });

    // Check if there are any errors
    if (emailError || passwordError) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    // console.log(formState, "formState");

    dispatch(handleLogin({ formState, navigate }));
  };

  // To pass a message
  useEffect(() => {
    console.log("Loading", loading);
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading, isSubmitting]);

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
              <div className="w-full mb-4">
                <input
                  className={`${styles.inputBoxes} ${
                    errors.email && touched.email ? "border border-red-500" : ""
                  }`}
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({ ...formState, email: e.target.value });
                    setTouched({ ...touched, email: true });
                    setErrors({
                      ...errors,
                      email: validateEmail(e.target.value),
                    });
                  }}
                  onBlur={handleBlur}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="w-full mb-4">
                <div className="relative">
                  <input
                    className={`${styles.inputBoxes} ${
                      errors.password && touched.password
                        ? "border border-red-500"
                        : ""
                    }`}
                    type={showPassword ? "text" : "password"} // Toggle input type
                    name="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={(e) => {
                      setFormState({ ...formState, password: e.target.value });
                      setTouched({ ...touched, password: true });
                      setErrors({
                        ...errors,
                        password: validatePassword(e.target.value),
                      });
                    }}
                    onBlur={handleBlur}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />{" "}
                    {/* Toggle icon */}
                  </span>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                className={`${styles.submitBtn} ${
                  errors.email || errors.password || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                type="submit"
                disabled={
                  isSubmitting ||
                  errors.email ||
                  errors.password ||
                  (!touched.email && !touched.password)
                }
                // disabled={errors.email || errors.password || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="m-auto">
                <p>
                  Don&apos;t have account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
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
