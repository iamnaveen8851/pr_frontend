import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createTask, updateTask } from "../redux/actions/taskAction";
import { axiosInstance } from "../utils/axiosInstance";
import { fetchProjects } from "../redux/actions/projectAction";

import PropTypes from "prop-types";

const TaskForm = ({ onClose, isEditing = false, initialData = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { projects } = useSelector((state) => state.projects);
  // console.log("Projects:", projects);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get the current theme from localStorage
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Update theme when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assignedTo: "",
    assignedBy: user?.id || "",
    estimatedTime: "",
    deadline: "",
    project: "", // Add project field
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Add this useEffect to properly handle initialData when editing
  useEffect(() => {
    if (isEditing && initialData) {
      // Format the task data properly for the form
      const formattedTaskData = {
        ...initialData,
        // Handle object references for IDs
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
        assignedBy: initialData.assignedBy?._id || initialData.assignedBy || "",
        project: initialData.project?._id || initialData.project || "",
        // Format the date for the date input (remove time portion)
        deadline: initialData.deadline
          ? initialData.deadline.split("T")[0]
          : "",
      };

      // console.log("Formatted task data for editing:", formattedTaskData);
      setTaskData(formattedTaskData);
    }
  }, [isEditing, initialData]);

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users");
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    dispatch(fetchProjects());
  }, []);

 const validateForm = () => {
   // Skip validation if we're editing
   if (isEditing) return true;

   const newErrors = {};
   if (!taskData.title.trim()) newErrors.title = "Title is required";
   if (!taskData.description.trim())
     newErrors.description = "Description is required";
   if (!taskData.assignedTo)
     newErrors.assignedTo = "Please assign this task to someone";
   if (!taskData.assignedBy)
     newErrors.assignedBy = "Please select who is assigning this task";
   if (!taskData.deadline) newErrors.deadline = "Deadline is required";
   if (!taskData.estimatedTime)
     newErrors.estimatedTime = "Estimated time is required";
   // Only validate project if projects exist
   if (projects.length > 0 && !taskData.project) {
     newErrors.project = "Please select a project";
   }

   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create a new object without the name fields
      const filteredTaskData = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        assignedTo: taskData.assignedTo,
        assignedBy: taskData.assignedBy,
        estimatedTime: taskData.estimatedTime,
        deadline: taskData.deadline,
        // Set project to null if no projects exist
        project: projects.length > 0 ? taskData.project : null,
      };

      // If editing, include the _id
      if (isEditing && taskData._id) {
        filteredTaskData._id = taskData._id;
      }

      // console.log("Filtered task data to submit:", filteredTaskData);

      if (isEditing) {
        // Make sure we have the task ID before dispatching the update action
        if (!taskData._id) {
          console.error("Task ID is missing for update operation");

          return;
        }

        // Pass the task ID and filtered task data to the updateTask action
        dispatch(updateTask({ id: taskData._id, taskData: filteredTaskData }))
          .unwrap()
          .then(() => {
            onClose();
          })
          .catch((error) => {
            console.error("Failed to update task:", error);
          });
      } else {
        dispatch(createTask(filteredTaskData))
          .unwrap()
          .then(() => {
            onClose();
          })
          .catch((error) => {
            console.error("Failed to create task:", error);
          });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field if it was previously showing an error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }

    // Rest of your existing handleChange logic
    if (name === "assignedTo" || name === "assignedBy") {
      const selectedUser = users.find((user) => user._id === value);
      if (selectedUser) {
        setTaskData({
          ...taskData,
          [name]: value,
          [`${name}Name`]: selectedUser.username,
        });
      } else {
        setTaskData({
          ...taskData,
          [name]: value,
        });
      }
    } else {
      setTaskData({
        ...taskData,
        [name]: value,
      });
    }
  };

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["Pending", "In Progress", "Review", "Completed"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? "Update Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title{!isEditing && "*"}
              </label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter task title"
              />
              {!isEditing && errors.title && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description{!isEditing && "*"}
              </label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe the task"
              ></textarea>
              {!isEditing && errors.description && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assign To{!isEditing && "*"}
              </label>
              <select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                  errors.assignedTo
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Team Member</option>
                {loading ? (
                  <option disabled>Loading users...</option>
                ) : (
                  users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.role})
                    </option>
                  ))
                )}
              </select>
              {!isEditing && errors.assignedTo && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.assignedTo}
                </p>
              )}
            </div>

            {/* Assigned By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assigned By{!isEditing && "*"}
              </label>
              <select
                name="assignedBy"
                value={taskData.assignedBy}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                  errors.assignedBy
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Assigner</option>
                {loading ? (
                  <option disabled>Loading users...</option>
                ) : (
                  users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.role})
                    </option>
                  ))
                )}
              </select>
              {!isEditing && errors.assignedBy && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.assignedBy}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline{!isEditing && "*"}
              </label>
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark-date-input ${
                  errors.deadline
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                min={new Date().toISOString().split("T")[0]}
                style={{ colorScheme: theme === "dark" ? "dark" : "light" }}
              />
              {!isEditing && errors.deadline && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Priority</option>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div>
              {projects.length === 0 ? (
                ""
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project{!isEditing && "*"}
                  </label>
                  <select
                    name="project"
                    value={taskData.project}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                      errors.project
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select Project</option>
                    {projects && projects.length > 0 ? (
                      projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No projects available</option>
                    )}
                  </select>
                  {!isEditing && errors.project && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.project}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Time (hours){!isEditing && "*"}
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={taskData.estimatedTime}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                  errors.estimatedTime
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter estimated hours"
              />
              {!isEditing && errors.estimatedTime && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.estimatedTime}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

TaskForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    assignedTo: PropTypes.string,
    assignedBy: PropTypes.string,
    estimatedTime: PropTypes.string,
    deadline: PropTypes.string,
    project: PropTypes.string,
  }),
};
export default TaskForm;
