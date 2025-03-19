import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { signUpReducer } from "./reducers/signupReducer";
import { loginReducer } from "./reducers/loginReducer";

const reducers = combineReducers({
    loginReducer,
  //   logoutReducer,
  signUpReducer,
});

export const store = legacy_createStore(reducers, applyMiddleware(thunk));
