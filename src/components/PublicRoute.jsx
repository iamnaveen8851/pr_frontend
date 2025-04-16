import Dashboard from "./Dashboard";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import Calendar from "./Calendar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Project from "./Project";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import TaskAnalytics from "./TaskAnalytics";
import Reports from "./Reports";
import ResetPassword from "./ResetPassword";

// const PublicRoute = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const token = localStorage.getItem("accessToken");
//   const location = useLocation();

//   // Define sidebar expanded state
//   const [sidebarExpanded, setSidebarExpanded] = useState(
//     localStorage.getItem("sidebarExpanded") === "true"
//   );

//   useEffect(() => {
//     // Short timeout to ensure token is properly checked
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   // Wrapper component for layout consistency
//   const AppLayout = ({ children }) => {
//     // Determine if we're on desktop
//     const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

//     useEffect(() => {
//       const handleResize = () => {
//         setIsDesktop(window.innerWidth >= 1024);
//       };

//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     return (
//       <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//         <Navbar />
//         <div className="flex flex-1 w-full pt-4">
//           <Sidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
//           <main
//             className={`flex-1 transition-all duration-150 ease-in-out ${
//               isDesktop
//                 ? sidebarExpanded
//                   ? "w-[calc(100%-12rem)] ml-48"
//                   : "w-[calc(100%-4rem)] ml-16"
//                 : "w-full ml-0"
//             }`}
//           >
//             {children}
//           </main>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <Dashboard />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/calendar"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <Calendar />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/projects"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <Project />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/comments"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <CommentSection />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />

//         {/* Add Analytics route */}
//         <Route
//           path="/analytics"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <TaskAnalytics />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />
//         {/* Add Analytics route */}
//         <Route
//           path="/reports"
//           element={
//             <PrivateRoute>
//               <AppLayout>
//                 <Reports />
//               </AppLayout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/login"
//           element={token ? <Navigate to="/" /> : <Login />}
//         />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         <Route
//           path="/signup"
//           element={token ? <Navigate to="/" /> : <SignUp />}
//         />
//         {/* Catch-all route for any undefined routes */}
//         {/* <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} /> */}
//       </Routes>
//     </>
//   );
// };
const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDesktop = windowWidth >= 1024;

  // Define sidebar expanded state with proper initialization
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // On mobile/tablet, sidebar should always be collapsed initially
    if (window.innerWidth < 1024) return false;
    // On desktop, respect user preference
    return localStorage.getItem("sidebarExpanded") === "true";
  });

  // Update window width state on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar and persist state
  const toggleSidebar = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  useEffect(() => {
    // Short timeout to ensure token is properly checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 w-full pt-4 relative">
        <Sidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
        <div
          className={`transition-all duration-150 ease-in-out ${
            isDesktop
              ? sidebarExpanded
                ? "w-[calc(100%-12rem)] ml-48" // Adjusted width and margin for expanded sidebar
                : "w-[calc(100%-4rem)] ml-16"  // Adjusted width and margin for collapsed sidebar
              : "w-full ml-0"
          } absolute top-0 right-0`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <AppLayout>
                <Project />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/comments"
          element={
            <PrivateRoute>
              <AppLayout>
                <CommentSection />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AppLayout>
                <TaskAnalytics />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
    </>
  );
};

export default PublicRoute;
