import { axiosInstance } from "../../utils/axiosInstance";

export const clearCookie = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(`/users/logout`);
    //   localStorage.removeItem("accessToken");
    //   if (res.status === 200) {
    // }
    localStorage.removeItem("accessToken");
    dispatch({
      type: "LOGOUT_SUCCESS",
    });

      dispatch({
        type: "LOGOUT_SUCCESS",
      });
    } catch (error) {
      console.log("Error while logging out", error.message);
    }
  };
};
