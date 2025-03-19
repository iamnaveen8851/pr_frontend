import "./App.css";

import PublicRoute from "./components/PublicRoute";
import {Toaster} from "react-hot-toast";
function App() {
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
