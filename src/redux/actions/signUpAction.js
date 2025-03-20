import { axiosInstance } from "../../utils/axiosInstance";

const signUpData = (data) => {
  return {
    type: "SIGN_UP_SUCCESS",
    payload: data,
  };
};

export const handleSignUp = (formState, navigate) => {
  return async (dispatch) => {
    dispatch({ type: "SIGN_UP_REQUEST" });
    try {
      const res = await axiosInstance.post(
        import.meta.env.VITE_SIGNUP,
        formState
      );
      if (res.status === 201) {
        setTimeout(() => {
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(signUpData(res.data));
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "These Credentials Exists";
      setTimeout(() => {
        dispatch({ type: "SIGN_UP_ERROR", payload: errorMessage });
      }, 1000);

      console.error(error);
    }
  };
};
