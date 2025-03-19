const initialState = {
  isLoggedIn: false,
  message: "",
  loading: false,
  user: null,
  token: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
        message: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        message: action.payload.message,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        message: action.payload,
        token: null,
      };

    // Add a new case for token authentication
    case "SET_AUTH_FROM_TOKEN":
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        user: state.user,
        message: state.message || "Authenticated with token",
        loading: false,
      };
    default:
      return state;
  }
};
