import  { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faProjectDiagram, 
  faCalendarAlt, 
  faChevronLeft, 
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false); // Changed to false to be closed by default
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");  
  
  // Rest of the component remains unchanged
  useEffect(() => {
    // Function to update theme state
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    
    // Create a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });
    
    // Also listen for storage events for cross-tab synchronization
    window.addEventListener('storage', updateTheme);
    
    // Initial check
    updateTheme();
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  return (
    <div 
      className={`h-[calc(100vh-4rem)] fixed top-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} 
      ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-all duration-300 ${
        expanded ? 'w-64' : 'w-16'
      } left-0 z-20 shadow-lg`}
    >
      <div className="p-4 flex justify-between items-center">
        {expanded && <h2 className="text-xl font-bold">Menu</h2>}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
        </button>
      </div>
      
      <nav className="mt-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
        <ul>
          <li className={`mb-2 ${location.pathname === '/' ? 'bg-blue-600 text-white' : ''}`}>
            <Link 
              to="/" 
              className={`flex items-center p-4 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}
            >
              <FontAwesomeIcon icon={faTasks} className={expanded ? "mr-3" : "mx-auto"} />
              {expanded && <span>Tasks</span>}
            </Link>
          </li>
          
          <li className={`mb-2 ${location.pathname === '/projects' ? 'bg-blue-600 text-white' : ''}`}>
            <Link 
              to="/projects" 
              className={`flex items-center p-4 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className={expanded ? "mr-3" : "mx-auto"} />
              {expanded && <span>Projects</span>}
            </Link>
          </li>
          
          <li className={`mb-2 ${location.pathname === '/calendar' ? 'bg-blue-600 text-white' : ''}`}>
            <Link 
              to="/calendar" 
              className={`flex items-center p-4 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className={expanded ? "mr-3" : "mx-auto"} />
              {expanded && <span>Google Calendar</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;