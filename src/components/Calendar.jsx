import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/actions/taskAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faSync,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import {
  listCalendarEvents,
  createCalendarEvent,
  taskToGoogleEvent,
} from "../services/googleCalendarService";
import NavigationTabs from "./NavigationTabs"; // Import the NavigationTabs component
const Calendar = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});

  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  // Add a new state for sync message
  const [syncMessage, setSyncMessage] = useState("");

  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login successful", tokenResponse);
      localStorage.setItem("googleToken", tokenResponse.access_token);
      setIsGoogleAuthenticated(true);
      fetchGoogleCalendarEvents();
    },
    onError: (error) => {
      console.error("Google login failed", error);
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  // Fetch tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks());

    // Check if already authenticated with Google
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsGoogleAuthenticated(true);
      fetchGoogleCalendarEvents();
      // console.log("Token", token)
    }
  }, []);

  // Fetch Google Calendar events
  const fetchGoogleCalendarEvents = async () => {
    setIsLoadingEvents(true);
    setSyncMessage("Syncing..."); // Set sync message when starting

    try {
      // Calculate first and last day of the month for the API request

      dispatch(fetchTasks());

      // Set success message after syncing
      setSyncMessage("Sync complete!");
      // Clear message after 3 seconds
      setTimeout(() => setSyncMessage(""), 3000);
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      setSyncMessage("Sync failed"); // Set error message
      setTimeout(() => setSyncMessage(""), 3000);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Add task to Google Calendar
  const addTaskToGoogleCalendar = async (task) => {
    if (!isGoogleAuthenticated) {
      googleLogin();
      return;
    }

    const googleEvent = taskToGoogleEvent(task);
    if (!googleEvent) return;

    try {
      const createdEvent = await createCalendarEvent(googleEvent);
      if (createdEvent) {
        console.log("Event created in Google Calendar", createdEvent);
        fetchGoogleCalendarEvents(); // Refresh events
      }
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
    }
  };

  // Process tasks and organize them by date
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const taskMap = {};

      tasks.forEach((task) => {
        if (task.deadline) {
          const dateKey = new Date(task.deadline).toDateString();
          if (!taskMap[dateKey]) {
            taskMap[dateKey] = [];
          }
          taskMap[dateKey].push(task);
        }
      });

      setTasksByDate(taskMap);
    }
  }, [tasks]);

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();

    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7);

    // Generate calendar days
    const days = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (
      let i = prevMonthLastDay - daysFromPrevMonth + 1;
      i <= prevMonthLastDay;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Add days from next month to fill the last row
    const remainingDays = rows * 7 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendarDays(days);

    // Refresh Google Calendar events when month changes
    if (isGoogleAuthenticated) {
      fetchGoogleCalendarEvents();
    }
  }, [currentDate, isGoogleAuthenticated]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date selection
  const handleDateClick = (day) => {
    setSelectedDate(day.date);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateKey = date.toDateString();
    return tasksByDate[dateKey] || [];
  };

  // Check if a date has tasks
  const hasTasksOnDate = (date) => {
    const dateKey = date.toDateString();
    return tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
  };

  return (
    <div className="w-[90%] lg:w-[100%] px-6 m-auto  md:m-auto transition-all duration-300">
      <NavigationTabs />
      <div className="bg-white-300 dark:bg-gray-900  px-3 py-6">
        <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-2 mb-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Calendar
          </h1>
          <div className="flex flex-wrap gap-1">
            <div className="flex space-x-1">
              <button
                onClick={goToPreviousMonth}
                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={goToToday}
                className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xs"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            {/* Google Calendar integration button with sync message */}
            {isGoogleAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchGoogleCalendarEvents}
                  className="p-5 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center text-xs"
                  disabled={isLoadingEvents}
                >
                  <FontAwesomeIcon
                    icon={isLoadingEvents ? faSpinner : faSync}
                    className={isLoadingEvents ? "animate-spin mr-1" : "mr-1"}
                  />
                  {isLoadingEvents ? "Syncing..." : "Sync"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => googleLogin()}
                className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-xs"
              >
                Connect
              </button>
            )}
          </div>
        </div>
        <h2 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">
          {formatDate(currentDate)}
        </h2>
        {loading || isLoadingEvents ? (
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers skeleton */}
            {[...Array(7)].map((_, index) => (
              <div key={index} className="text-center p-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}

            {/* Calendar days skeleton */}
            {[...Array(35)].map((_, index) => (
              <div key={index} className="min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div
                key={index}
                className="text-center font-medium text-gray-500 dark:text-gray-400 p-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-md 
                  ${
                    day.isCurrentMonth
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  } 
                  ${day.isToday ? "ring-2 ring-blue-500" : ""} 
                  ${
                    selectedDate &&
                    day.date.toDateString() === selectedDate.toDateString()
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : ""
                  }
                  cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors
                `}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`
                    font-medium 
                    ${
                      day.isToday
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  `}
                  >
                    {day.date.getDate()}
                  </span>

                  {hasTasksOnDate(day.date) && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </div>

                <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
                  {getTasksForDate(day.date)
                    .slice(0, 2)
                    .map((task, idx) => (
                      <div
                        key={idx}
                        className={`
                        text-xs p-1 rounded truncate
                        ${
                          task.isGoogleEvent
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                            : task.priority === "High"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                            : task.priority === "Medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        }
                      `}
                      >
                        {task.isGoogleEvent ? "🗓️ " : ""}
                        {task.title}
                      </div>
                    ))}

                  {getTasksForDate(day.date).length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{getTasksForDate(day.date).length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Task details for selected date */}
        {selectedDate && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Tasks for {selectedDate.toLocaleDateString()}
              </h3>
            </div>

            {getTasksForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task, index) => (
                  <div
                    key={index}
                    className={`p-3 ${
                      task.isGoogleEvent
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "bg-gray-50 dark:bg-gray-700"
                    } rounded-md border border-gray-200 dark:border-gray-600`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {task.isGoogleEvent ? "🗓️ " : ""}
                        {task.title}
                      </h4>
                      {!task.isGoogleEvent && (
                        <span
                          className={`
                            px-2 py-1 text-xs rounded-full font-medium
                            ${
                              task.priority === "High"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                : task.priority === "Medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            }
                          `}
                        >
                          {task.priority}
                        </span>
                      )}
                      {task.isGoogleEvent && (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                          Google Event
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {task.description || "No description"}
                    </p>

                    {!task.isGoogleEvent && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {task.assignedTo && (
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">
                              Assigned to:
                            </span>
                            <span>
                              {task.assignedToName ||
                                (typeof task.assignedTo === "object" &&
                                  task.assignedTo.username) ||
                                "Unknown"}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center mt-1">
                          <span className="font-semibold mr-1">Status:</span>
                          <span
                            className={`
                            px-1.5 py-0.5 rounded-full
                            ${
                              task.status === "Completed"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                : task.status === "In Progress"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                : task.status === "Review"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            }
                          `}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {task.isGoogleEvent && task.deadline && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="font-semibold mr-1">Time:</span>
                          <span>
                            {new Date(task.deadline).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No tasks scheduled for this date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
