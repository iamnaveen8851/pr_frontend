import { useSelector } from "react-redux";
import "./App.css";

import PublicRoute from "./components/PublicRoute";
import {Toaster} from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect } from "react";
function App() {
   const { isLoggedIn } = useSelector((state) => state.auth);
   const navigate = useNavigate();


  return (
    <>
      <PublicRoute />
      {/* <Loader/> */}
      {/* Toast for message */}
      <Toaster color={"green"} position={"bottom-right"} reverseOrder={false} />
    </>
  );
}

export default App;
