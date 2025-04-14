import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user._id) {
      // Use the appropriate URL based on environment
      const baseUrl =
        import.meta.env.VITE_ENV === "development"
          ? import.meta.env.VITE_DEV_URL
          : import.meta.env.VITE_PRO_URL;

      // Connect to socket server
      const newSocket = io(baseUrl, {
        auth: {
          userId: user._id,
        },
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server at:", baseUrl);
      });

      newSocket.on("connect_error", (error) => {
        console.log("Socket connection error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Methods to join/leave rooms
  const joinTaskRoom = (taskId) => {
    if (socket && taskId) {
      socket.emit('join-task', taskId);
      console.log(`Joined task room: ${taskId}`);
    }
  };
  
  const leaveTaskRoom = (taskId) => {
    if (socket && taskId) {
      socket.emit('leave-task', taskId);
      console.log(`Left task room: ${taskId}`);
    }
  };
  
  const joinProjectRoom = (projectId) => {
    if (socket && projectId) {
      socket.emit('join-project', projectId);
      console.log(`Joined project room: ${projectId}`);
    }
  };
  
  const leaveProjectRoom = (projectId) => {
    if (socket && projectId) {
      socket.emit('leave-project', projectId);
      console.log(`Left project room: ${projectId}`);
    }
  };

  return(
    <SocketContext.Provider value={{
        socket,
        joinTaskRoom,
        leaveTaskRoom,
        joinProjectRoom,
        leaveProjectRoom
    }}>
      {children}
    </SocketContext.Provider>
  )
};
