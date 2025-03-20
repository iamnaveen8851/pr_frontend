const initialState = {
  loading: false,
  isSignedUp: false,
  isLoggedIn: false,
  message: "",
  user: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_UP_REQUEST":
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
        isSignedUp: false,
        isLoggedIn: false,
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
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        message: action.payload.message,
        user: action.payload.user,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        loading: false,
        isSignedUp: false,
        isLoggedIn: false,
        message: null,
        user: null,
      };
    case "SIGN_UP_ERROR":
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isSignedUp: false,
        isLoggedIn: false,
        message: action.payload,
      };
    default:
      return state;
  }
};