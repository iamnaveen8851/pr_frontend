import { useState } from "react";
import styles from "../styles/login.module.css"; // Updated import path
import { axiosInstance } from "../utils/axiosInstance";

// eslint-disable-next-line react/prop-types
const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 100) return "Email must be less than 100 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await axiosInstance.post("/password/forgot-password", {
        email,
      });

      console.log("res", response)
      setMessage(response.data.message);

      // Optionally close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className={styles.inputBoxes}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
