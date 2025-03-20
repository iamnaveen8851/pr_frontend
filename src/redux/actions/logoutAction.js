import { axiosInstance } from "../../utils/axiosInstance";

export const clearCookie = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(`/users/logout`);
      if (res.status === 200) {
        dispatch({
          type: "LOGOUT_SUCCESS",
        });
        localStorage.removeItem("accessToken");
      }

      dispatch({
        type: "LOGOUT_SUCCESS",
      });
    } catch (error) {
      console.log("Error while logging out", error.message);
    }
  };
};
