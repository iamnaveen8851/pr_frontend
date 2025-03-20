import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
// import { signUpReducer } from "./reducers/signupReducer";
// import { loginReducer } from "./reducers/loginReducer";
import { authReducer } from "./reducers/authReducer";

const reducers = combineReducers({
  // loginReducer,
  //   logoutReducer,
  // signUpReducer,
  authReducer,
});

export const store = legacy_createStore(reducers, applyMiddleware(thunk));
