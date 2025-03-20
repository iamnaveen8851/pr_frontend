import { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../redux/actions/loginAction";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons

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
  const { loading, message, isLoggedIn } = useSelector(
    (state) => state.authReducer
  );

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Validate on change if field has been touched
    if (touched[name]) {
      let errorMessage = "";
      if (name === "email") errorMessage = validateEmail(value);
      else if (name === "password") errorMessage = validatePassword(value);

      setErrors({
        ...errors,
        [name]: errorMessage,
      });
    }
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
    dispatch(handleLogin(formState, navigate));
  };

  // To pass a message
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [isLoggedIn, message, loading]);

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
                  onChange={handleChange}
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
                      errors.password && touched.password ? "border border-red-500" : ""
                    }`}
                    type={showPassword ? "text" : "password"} // Toggle input type
                    name="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Toggle icon */}
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
                disabled={errors.email || errors.password || isSubmitting}
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
                  Dont have account?{" "}
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
