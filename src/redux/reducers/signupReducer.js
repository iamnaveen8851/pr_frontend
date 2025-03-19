const initialState = {
  loading: false,
  isSignedUp: false,
  message: "",
  user: null,
};

export const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_UP_REQUEST":
      return {
        ...state,
        loading: true,
        isSignedUp: false,
        message: null,
      };
    case "SIGN_UP_SUCCESS":
      return {
        ...state,
        loading: false,
        isSignedUp: true,
        message: action.payload.message,
        user: action.payload.user.username,
      };

    case "SIGN_UP_ERROR":
      return {
        ...state,
        loading: false,
        isSignedUp: false,
        message: action.payload,
      };
    default:
      return state;
  }
};
