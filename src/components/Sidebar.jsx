import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faProjectDiagram,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faComments,
  faFileAlt, // Add hamburger menu icon
} from "@fortawesome/free-solid-svg-icons";

// const Sidebar = ({ expanded, onToggle }) => {
//   const location = useLocation();
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   const [isMobileOrTablet, setIsMobileOrTablet] = useState(
//     window.innerWidth < 1024
//   );
//   const isMobileOrTabletRef = useRef(window.innerWidth < 1024);
//   const [isVisible, setIsVisible] = useState(window.innerWidth >= 1024);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       const currentIsMobileOrTablet = window.innerWidth < 1024;
//       const wasMobileOrTablet = isMobileOrTabletRef.current;

//       if (currentIsMobileOrTablet && !wasMobileOrTablet) {
//         setIsVisible(false);
//         onToggle(); // Collapse sidebar on transition to mobile
//       } else if (!currentIsMobileOrTablet && wasMobileOrTablet) {
//         setIsVisible(true);
//       }

//       setIsMobileOrTablet(currentIsMobileOrTablet);
//       isMobileOrTabletRef.current = currentIsMobileOrTablet;
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [onToggle]);

//   // Theme detection logic
//   useEffect(() => {
//     const updateTheme = () => {
//       setTheme(localStorage.getItem("theme") || "light");
//     };

//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === "class") {
//           const isDark = document.documentElement.classList.contains("dark");
//           setTheme(isDark ? "dark" : "light");
//         }
//       });
//     });

//     observer.observe(document.documentElement, { attributes: true });
//     window.addEventListener("storage", updateTheme);
//     updateTheme();

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("storage", updateTheme);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         className={`h-[calc(100vh-4rem)] fixed top-16 ${
//           theme === "dark" ? "bg-gray-800" : "bg-white"
//         }
//         ${
//           theme === "dark" ? "text-white" : "text-gray-800"
//         } transition-all duration-400 ease-in-out ${
//           expanded ? "w-48" : "w-16"
//         } ${isVisible ? "left-0" : "-left-20"} z-20 shadow-lg`}
//       >
//         <div className="p-4 flex justify-between items-center">
//           {expanded && <h2 className="text-xl font-bold">Menu</h2>}
//           <button
//             onClick={onToggle}
//             className={`p-2  ${
//               theme === "dark" ? "hover:bg-blue-600" : "hover:bg-gray-200"
//             } transition-colors`}
//             aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
//           >
//             <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
//           </button>
//         </div>

//         <nav
//           className="mt-0 overflow-y-auto"
//           style={{ maxHeight: "calc(100vh - 12rem)" }}
//         >
//           <ul>
//             <li
//               className={`mb-2 ${
//                 location.pathname === "/" ? "bg-orange-500 text-white" : ""
//               }`}
//             >
//               <Link
//                 to="/"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faTasks}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Tasks</span>}
//               </Link>
//             </li>

//             <li
//               className={`mb-2 ${
//                 location.pathname === "/projects"
//                   ? "bg-orange-500 text-white"
//                   : ""
//               }`}
//             >
//               <Link
//                 to="/projects"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faProjectDiagram}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Projects</span>}
//               </Link>
//             </li>

//             {/* Continue updating the rest of the icons in the same way */}
//             <li
//               className={`mb-2 ${
//                 location.pathname === "/calendar"
//                   ? "bg-orange-500 text-white"
//                   : ""
//               }`}
//             >
//               <Link
//                 to="/calendar"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faCalendarAlt}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Google Calendar</span>}
//               </Link>
//             </li>

//             <li
//               className={`mb-2 ${
//                 location.pathname === "/comments"
//                   ? "bg-orange-500 text-white"
//                   : ""
//               }`}
//             >
//               <Link
//                 to="/comments"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faComments}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Comments</span>}
//               </Link>
//             </li>

//             <li
//               className={`mb-2 ${
//                 location.pathname === "/reports"
//                   ? "bg-orange-500 text-white"
//                   : ""
//               }`}
//             >
//               <Link
//                 to="/reports"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faFileAlt}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Reports</span>}
//               </Link>
//             </li>
//             <li
//               className={`mb-2 ${
//                 location.pathname === "/analytics"
//                   ? "bg-orange-500 text-white"
//                   : ""
//               }`}
//             >
//               <Link
//                 to="/analytics"
//                 className={`flex items-center p-4 ${
//                   theme === "dark"
//                     ? "hover:bg-blue-600"
//                     : "hover:bg-blue-600  hover:text-white"
//                 }  transition-colors`}
//               >
//                 <FontAwesomeIcon
//                   icon={faChartBar}
//                   className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
//                 />
//                 {expanded && <span>Analytics</span>}
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {isMobileOrTablet && isVisible && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-10"
//           onClick={onToggle}
//           aria-hidden="true"
//         />
//       )}
//     </>
//   );
// };
const Sidebar = ({ expanded, onToggle }) => {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    window.innerWidth < 1024
  );
  const [isVisible, setIsVisible] = useState(window.innerWidth >= 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const currentIsMobileOrTablet = window.innerWidth < 1024;

      // Update visibility based on screen size
      if (currentIsMobileOrTablet) {
        // On mobile/tablet, sidebar should be hidden by default
        setIsVisible(false);

        // If currently expanded, collapse it when transitioning to mobile/tablet
        if (expanded) {
          // Call the parent's toggle function to update the expanded state
          onToggle();
          // Update localStorage
          localStorage.setItem("sidebarExpanded", "false");
        }
      } else {
        // On desktop, sidebar should always be visible
        setIsVisible(true);
      }

      setIsMobileOrTablet(currentIsMobileOrTablet);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded, onToggle]);

  // Theme detection logic
  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("storage", updateTheme);
    updateTheme();

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  return (
    <>
      <div
        className={`h-[calc(100vh-4rem)] fixed top-16 
        ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }
        transition-all duration-300 ease-in-out 
        ${expanded ? "w-48" : "w-16"}
        ${isVisible ? "translate-x-0" : "-translate-x-full"} 
        z-20 shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center">
          {expanded && (
            <h2 className="text-xl font-bold opacity-100 transition-opacity duration-300">
              Menu
            </h2>
          )}
          <button
            onClick={onToggle}
            className={`p-2 ${
              theme === "dark" ? "hover:bg-blue-600" : "hover:bg-gray-200"
            } rounded transition-colors`}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
          </button>
        </div>

        <nav className="mt-0 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <ul>
            <li
              className={`mb-2 ${
                location.pathname === "/" ? "bg-orange-500 text-white" : ""
              }`}
            >
              <Link
                to="/"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faTasks}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Tasks
                  </span>
                )}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/projects"
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/projects"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faProjectDiagram}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Projects
                  </span>
                )}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/calendar"
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/calendar"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Google Calendar
                  </span>
                )}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/comments"
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/comments"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faComments}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Comments
                  </span>
                )}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/reports"
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/reports"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Reports
                  </span>
                )}
              </Link>
            </li>

            <li
              className={`mb-2 ${
                location.pathname === "/analytics"
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
            >
              <Link
                to="/analytics"
                className={`flex items-center p-4 ${
                  theme === "dark"
                    ? "hover:bg-blue-600"
                    : "hover:bg-blue-600 hover:text-white"
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={expanded ? "mr-3 text-sm" : "mx-auto text-sm"}
                />
                {expanded && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    Analytics
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Transition the overlay for smooth appearance/disappearance */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-10 ${
          isMobileOrTablet && isVisible
            ? "opacity-50"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onToggle}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
