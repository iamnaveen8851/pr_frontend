import { useEffect, useState } from "react";
import styles from "../styles/signup.module.css";
import { handleSignUp } from "../redux/actions/signUpAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ensure state variables are accessed correctly
  const { loading } = useSelector((state) => state.auth);

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Add role to formState
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Add role to errors
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    role: false, // Add role to touched
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username can only contain letters, numbers and underscores";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    // Add more password validation rules if needed
    // For example, check for uppercase, lowercase, numbers, special characters
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

  // Add the missing validateRole function
  const validateRole = (role) => {
    if (!role) return "Please select a role";
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
    if (name === "username") errorMessage = validateUsername(value);
    else if (name === "email") errorMessage = validateEmail(value);
    else if (name === "password") errorMessage = validatePassword(value);
    else if (name === "role") errorMessage = validateRole(value);

    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const usernameError = validateUsername(formState.username);
    const emailError = validateEmail(formState.email);
    const passwordError = validatePassword(formState.password);
    const roleError = validateRole(formState.role);

    const newErrors = {
      username: usernameError,
      email: emailError,
      password: passwordError,
      role: roleError,
    };

    setErrors(newErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      role: true,
    });

    // Check if there are any errors
    if (usernameError || emailError || passwordError || roleError) {
      // toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    // console.log("Sign up form submitted:", formState);
    dispatch(handleSignUp({ formState, navigate }));
  };

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

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  className={`${styles.inputBoxes} ${
                    errors.username && touched.username ? styles.inputError : ""
                  }`}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formState.username}
                  onChange={(e) => {
                    setFormState({ ...formState, username: e.target.value });
                  }}
                  onBlur={handleBlur}
                />
                {errors.username && touched.username && (
                  <p className={styles.errorText}>{errors.username}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  className={`${styles.inputBoxes} ${
                    errors.email && touched.email ? styles.inputError : ""
                  }`}
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({ ...formState, email: e.target.value });
                  }}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className={styles.errorText}>{errors.email}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordContainer}>
                  <input
                    className={`${styles.inputBoxes} ${
                      errors.password && touched.password
                        ? styles.inputError
                        : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        password: e.target.value,
                      });
                    }}
                    onBlur={handleBlur}
                  />
                  <span
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                {errors.password && touched.password && (
                  <p className={styles.errorText}>{errors.password}</p>
                )}
                <div className={styles.helperText}>
                  Password must contain at least:
                  <ul className={styles.passwordRequirements}>
                    <li>6 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                  </ul>
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className={styles.inputGroup}>
                <select
                  className={styles.inputBoxes}
                  name="role"
                  value={formState.role}
                  onChange={(e) => {
                    setFormState({ ...formState, role: e.target.value });
                  }}
                  onBlur={handleBlur}
                >
                  <option value="">Select Role</option>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
                {errors.role && touched.role && (
                  <p className={styles.errorText}>{errors.role}</p>
                )}
              </div>

              <button
                className={`${styles.submitBtn} ${
                  errors.username ||
                  errors.email ||
                  errors.password ||
                  errors.role ||
                  isSubmitting
                    ? styles.disabledBtn
                    : ""
                }`}
                type="submit"
                disabled={
                  isSubmitting ||
                  (touched.username && errors.username) ||
                  (touched.email && errors.email) ||
                  (touched.password && errors.password) ||
                  (touched.role && errors.role)
                }
              >
                {isSubmitting ? (
                  <div className={styles.loadingContainer}>
                    <svg
                      className={styles.loadingSpinner}
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
                    Registering...
                  </div>
                ) : (
                  "Register"
                )}
              </button>

              <div className={styles.loginLinkContainer}>
                <p>
                  If you have account{" "}
                  <button
                    onClick={() => navigate("/login")}
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
