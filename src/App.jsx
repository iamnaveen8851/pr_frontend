import "./App.css";

import PublicRoute from "./components/PublicRoute";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./components/SocketContext";

function App() {
  return (
    <>
      <SocketProvider>
        <PublicRoute />
        {/* Toast for message */}
        <Toaster
          color={"green"}
          position={"top-right"}
          reverseOrder={false}
        />
      </SocketProvider>
    </>
  );
}

export default App;
