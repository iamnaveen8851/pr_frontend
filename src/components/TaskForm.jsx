// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { createTask } from "../redux/actions/taskAction";
// import { axiosInstance } from "../utils/axiosInstance";

// const TaskForm = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { loading: taskLoading } = useSelector((state) => state.tasks);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [taskData, setTaskData] = useState({
//     title: "",
//     description: "",
//     priority: "Medium",
//     status: "Pending",
//     assignedTo: "",
//     assignedBy: user?.id || "",
//     estimatedTime: "",
//     deadline: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Fetch users for assignment
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get("/users");
//         setUsers(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!taskData.title.trim()) newErrors.title = "Title is required";
//     if (!taskData.description.trim())
//       newErrors.description = "Description is required";
//     if (!taskData.assignedTo)
//       newErrors.assignedTo = "Please assign this task to someone";
//     if (!taskData.assignedBy)
//       newErrors.assignedBy = "Please select who is assigning this task";
//     if (!taskData.deadline) newErrors.deadline = "Deadline is required";
//     if (!taskData.estimatedTime)
//       newErrors.estimatedTime = "Estimated time is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       console.log("Task data to submit:", taskData);
//       dispatch(createTask(taskData))
//         .unwrap()
//         .then(() => {
//           onClose();
//         })
//         .catch((error) => {
//           console.error("Failed to create task:", error);
//         });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData({
//       ...taskData,
//       [name]: value,
//     });
//   };

//   const priorityOptions = ["Low", "Medium", "High"];
//   const statusOptions = ["Pending", "In Progress", "Review", "Completed"];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Create New Task</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FontAwesomeIcon icon={faTimes} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Title */}
//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Task Title*
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={taskData.title}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded-md ${
//                   errors.title ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter task title"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-xs mt-1">{errors.title}</p>
//               )}
//             </div>

//             {/* Description */}
//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description*
//               </label>
//               <textarea
//                 name="description"
//                 value={taskData.description}
//                 onChange={handleChange}
//                 rows="3"
//                 className={`w-full p-2 border rounded-md ${
//                   errors.description ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Describe the task"
//               ></textarea>
//               {errors.description && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* Assigned To */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Assign To*
//               </label>
//               <select
//                 name="assignedTo"
//                 value={taskData.assignedTo}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded-md ${
//                   errors.assignedTo ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select Team Member</option>
//                 {loading ? (
//                   <option disabled>Loading users...</option>
//                 ) : (
//                   users.map((user) => (
//                     <option key={user._id} value={user._id}>
//                       {user.username} ({user.role})
//                     </option>
//                   ))
//                 )}
//               </select>
//               {errors.assignedTo && (
//                 <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>
//               )}
//             </div>

//             {/* Assigned By */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Assigned By*
//               </label>
//               <select
//                 name="assignedBy"
//                 value={taskData.assignedBy}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded-md ${
//                   errors.assignedBy ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select Assigner</option>
//                 {loading ? (
//                   <option disabled>Loading users...</option>
//                 ) : (
//                   users.map((user) => (
//                     <option key={user._id} value={user._id}>
//                       {user.username} ({user.role})
//                     </option>
//                   ))
//                 )}
//               </select>
//               {errors.assignedBy && (
//                 <p className="text-red-500 text-xs mt-1">{errors.assignedBy}</p>
//               )}
//             </div>

//             {/* Deadline */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Deadline*
//               </label>
//               <input
//                 type="date"
//                 name="deadline"
//                 value={taskData.deadline}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded-md ${
//                   errors.deadline ? "border-red-500" : "border-gray-300"
//                 }`}
//                 min={new Date().toISOString().split("T")[0]}
//               />
//               {errors.deadline && (
//                 <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
//               )}
//             </div>

//             {/* Priority */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 name="priority"
//                 value={taskData.priority}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 {priorityOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={taskData.status}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 {statusOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Estimated Time */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Estimated Time (hours)*
//               </label>
//               <input
//                 type="number"
//                 name="estimatedTime"
//                 value={taskData.estimatedTime}
//                 onChange={handleChange}
//                 min="0.5"
//                 step="0.5"
//                 className={`w-full p-2 border rounded-md ${
//                   errors.estimatedTime ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter estimated hours"
//               />
//               {errors.estimatedTime && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.estimatedTime}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Create Task
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskForm;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createTask, updateTask } from "../redux/actions/taskAction";
import { axiosInstance } from "../utils/axiosInstance";

const TaskForm = ({ onClose, isEditing = false, initialData = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: taskLoading } = useSelector((state) => state.tasks);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    assignedTo: "",
    assignedBy: user?.id || "",
    estimatedTime: "",
    deadline: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        // Make sure we have the task ID before dispatching the update action
        if (!taskData._id) {
          console.error("Task ID is missing for update operation");
          return;
        }

        // Pass the task ID and task data to the updateTask action
        dispatch(updateTask({ id: taskData._id, taskData }))
          .unwrap()
          .then(() => {
            onClose();
          })
          .catch((error) => {
            console.error("Failed to update task:", error);
          });
      } else {
        dispatch(createTask(taskData))
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
    // Special handling for assignedTo and assignedBy to store both ID and username
    if (name === 'assignedTo' || name === 'assignedBy') {
      const selectedUser = users.find(user => user._id === value);
      if (selectedUser) {
        // Store username in the task data
        setTaskData({
          ...taskData,
          [name]: value,
          [`${name}Name`]: selectedUser.username
        });
        
        // Also store in localStorage for reference
        localStorage.setItem(`${name}Name`, selectedUser.username);
        localStorage.setItem(`${name}Role`, selectedUser.role);
      } else {
        setTaskData({
          ...taskData,
          [name]: value
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Update Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title{!isEditing && "*"}
              </label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              {!isEditing && errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{!isEditing && "*"}
              </label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe the task"
              ></textarea>
              {!isEditing && errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To{!isEditing && "*"}
              </label>
              <select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.assignedTo ? "border-red-500" : "border-gray-300"
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
                <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>
              )}
            </div>

            {/* Assigned By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned By{!isEditing && "*"}
              </label>
              <select
                name="assignedBy"
                value={taskData.assignedBy}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.assignedBy ? "border-red-500" : "border-gray-300"
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
                <p className="text-red-500 text-xs mt-1">{errors.assignedBy}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline{!isEditing && "*"}
              </label>
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.deadline ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {!isEditing && errors.deadline && (
                <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (hours){!isEditing && "*"}
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={taskData.estimatedTime}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                className={`w-full p-2 border rounded-md ${
                  errors.estimatedTime ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter estimated hours"
              />
              {!isEditing && errors.estimatedTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.estimatedTime}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
