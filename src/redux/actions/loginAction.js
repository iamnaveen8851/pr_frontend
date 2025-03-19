import { axiosInstance } from "../../utils/axiosInstance";

const getLoginData = (data) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: data,
  };
};

export const handleLogin = (formState, navigate) => {
  return async (dispatch) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const res = await axiosInstance.post(
        import.meta.env.VITE_LOGIN,
        formState
      );

      if (res.status === 200) {
        // To add a delay before the dashboard is visible to show the loading
        setTimeout(() => {
          dispatch(getLoginData(res.data));
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      // Extract error message safely
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      console.log(errorMessage, "............error");
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };
};
