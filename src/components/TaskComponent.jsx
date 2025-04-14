import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEllipsisH,
  faMicrochip,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchTasks,
  updateTaskStatus,
  deleteTask,
  assignTask,
} from "../redux/actions/taskAction";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskForm from "./TaskForm";
import AIRecommendationModal from "./AiRecommendationModal";

import { applyAIPriority } from "../redux/actions/aiPriorityAction";
import * as avatars from "@dicebear/avatars";
// Change this import to use initials sprites
import * as style from "@dicebear/avatars-initials-sprites";
import { avataaarsNeutral, bottts, funEmoji } from "@dicebear/collection";

const TaskComponent = () => {
  const dispatch = useDispatch();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [selectedTaskForAI, setSelectedTaskForAI] = useState(null);

  // Use tasks from Redux store
  const { tasks, loading } = useSelector((state) => state.tasks);

  // Add a loading state for each task
  const [loadingTasks, setLoadingTasks] = useState({});

  // Add state for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    taskId: null,
    taskTitle: "",
  });

  const [columns, setColumns] = useState({
    Pending: { id: "Pending", title: "To Do", tasks: [] },
    "In Progress": { id: "In Progress", title: "In Progress", tasks: [] },
    Review: { id: "Review", title: "Review", tasks: [] },
    Completed: { id: "Completed", title: "Done", tasks: [] },
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleShowAIRecommendations = (task) => {
    setSelectedTaskForAI(task);
    setShowAIRecommendations(true);
    setMenuOpen(null);
  };

  const handleAssignTask = (userId) => {
    if (selectedTaskForAI && userId) {
      dispatch(assignTask({ taskId: selectedTaskForAI._id, userId }))
        .then(() => {
          dispatch(fetchTasks());
        })
        .catch((error) => {
          console.error("Error assigning task:", error);
        });
    }
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Organize tasks into columns by status
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const newColumns = {
        Pending: { id: "Pending", title: "To Do", tasks: [] },
        "In Progress": { id: "In Progress", title: "In Progress", tasks: [] },
        Review: { id: "Review", title: "Review", tasks: [] },
        Completed: { id: "Completed", title: "Done", tasks: [] },
      };

      tasks.forEach((task) => {
        if (newColumns[task.status]) {
          newColumns[task.status].tasks.push(task);
        } else {
          newColumns["Pending"].tasks.push(task);
        }
      });

      setColumns(newColumns);
    }
  }, [tasks]); // Ensure this effect runs when tasks change

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const task = columns[source.droppableId].tasks.find(
      (task) => task._id === draggableId
    );

    if (!task) return;

    const newColumns = { ...columns };

    newColumns[source.droppableId].tasks = newColumns[
      source.droppableId
    ].tasks.filter((t) => t._id !== draggableId);

    const updatedTask = { ...task, status: destination.droppableId };
    newColumns[destination.droppableId].tasks.splice(
      destination.index,
      0,
      updatedTask
    );

    setColumns(newColumns);

    dispatch(
      updateTaskStatus({ taskId: draggableId, status: destination.droppableId })
    );
  };

  // Custom droppable component to avoid defaultProps warning
  // eslint-disable-next-line react/prop-types
  const StrictModeDroppable = ({ children, ...props }) => {
    // Validate props
    // eslint-disable-next-line react/prop-types

    // Validate that children is provided and is a function
    if (!children || typeof children !== "function") {
      throw new Error("StrictModeDroppable requires children to be a function");
    }

    return <Droppable {...props}>{children}</Droppable>;
  };

  // Modified to show confirmation popup
  const handleDeleteClick = (taskId, taskTitle) => {
    setDeleteConfirmation({
      show: true,
      taskId,
      taskTitle,
    });
    setMenuOpen(null);
  };

  // Actual delete function that will be called after confirmation
  const handleDeleteTask = () => {
    dispatch(deleteTask(deleteConfirmation.taskId));
    setDeleteConfirmation({ show: false, taskId: null, taskTitle: "" });
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, taskId: null, taskTitle: "" });
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditTask = (task) => {
    handleEditClick(task);
    setMenuOpen(null);
  };

  const toggleMenu = (taskId) => {
    setMenuOpen(menuOpen === taskId ? null : taskId);
  };

  const handleApplyAIPriority = (taskId) => {
    // Set loading state for the task
    setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));

    dispatch(applyAIPriority(taskId)).finally(() => {
      // Clear loading state for the task
      setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
    });
  };

  const avatarSvg = avatars.createAvatar(bottts, {
    dataUri: true,
    eyes: ["roundFrame02"],
  });
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Tasks
        </h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks && tasks.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.values(columns).map((column) => (
              <div
                key={column.id}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2"
              >
                <h2 className="font-semibold text-sm mb-2 text-gray-800 dark:text-white">
                  {column.title} ({column.tasks.length})
                </h2>
                <StrictModeDroppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : ""
                      }`}
                      style={{ minHeight: "150px" }} // Explicit inline style for production
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-md shadow mb-2 ${
                                snapshot.isDragging ? "opacity-75" : ""
                              } group relative ${
                                task.status === "Pending"
                                  ? "bg-white dark:bg-gray-700"
                                  : task.status === "In Progress"
                                  ? "bg-blue-50 dark:bg-blue-900/30"
                                  : task.status === "Review"
                                  ? "bg-yellow-50 dark:bg-yellow-900/30"
                                  : task.status === "Completed"
                                  ? "bg-green-50 dark:bg-green-900/30"
                                  : "bg-white dark:bg-gray-700"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div
                                  className={`font-medium text-gray-800 dark:text-gray-200 ${
                                    task.status === "Completed"
                                      ? "line-through text-gray-500 dark:text-gray-400"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </div>
                                <div className="flex flex-col items-center relative">
                                  <FontAwesomeIcon
                                    icon={faEllipsisH}
                                    className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMenu(task._id);
                                    }}
                                  />

                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/11184/11184109.png"
                                    alt="Avatar"
                                    onClick={() =>
                                      handleApplyAIPriority(task._id)
                                    }
                                    title="Ask AI to set priority"
                                    className={`w-7 h-8 cursor-pointer text-gray-600 dark:text-gray-300 mt-2 hover:text-gray-800 dark:hover:text-gray-100 transition-transform ${
                                      loadingTasks[task._id]
                                        ? "animate-spin"
                                        : "hover:scale-110"
                                    }`}
                                  />

                                  {/* Improved positioning for the menu */}
                                  {menuOpen === task._id && (
                                    <div
                                      ref={menuRef}
                                      className="absolute top-6 right-0 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50"
                                      style={{
                                        minWidth: "200px",
                                        position: "absolute",
                                        top: "100%",
                                        right: "0",
                                      }}
                                    >
                                      <div className="py-1">
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTask(task);
                                          }}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowAIRecommendations(task);
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faUserPlus}
                                            className="mr-2"
                                          />
                                          AI Recommendations
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(
                                              task._id,
                                              task.title
                                            );
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Project name with highlight */}
                              {task.project && task.project.name && (
                                <div className="mt-1 mb-1">
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-md">
                                    {task.project.name}
                                  </span>
                                </div>
                              )}

                              {/* Task content */}
                              <div
                                className={`text-sm text-gray-600 dark:text-gray-300 truncate ${
                                  task.status === "Completed"
                                    ? "line-through"
                                    : ""
                                }`}
                              >
                                {task.description}
                              </div>

                              {/* Assignment information */}
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-2">
                                {task.assignedTo && (
                                  <div className="flex items-center">
                                    <span className="font-semibold mr-1">
                                      Assigned to:
                                    </span>
                                    <span>
                                      {task.assignedToName ||
                                        (typeof task.assignedTo === "object" &&
                                          task.assignedTo.username) ||
                                        "Unknown"}{" "}
                                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full text-xs">
                                        {task.assignedTo.role ||
                                          (typeof task.assignedTo ===
                                            "object" &&
                                            task.assignedTo.role) ||
                                          ""}
                                      </span>
                                    </span>
                                  </div>
                                )}{" "}
                                {task.assignedBy && (
                                  <div className="flex items-center">
                                    <span className="font-semibold mr-1">
                                      Assigned by:
                                    </span>
                                    <span>
                                      {task.assignedByName ||
                                        (typeof task.assignedBy === "object" &&
                                          task.assignedBy.username) ||
                                        "Unknown"}{" "}
                                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded-full text-xs">
                                        {task.assignedBy.role ||
                                          (typeof task.assignedBy ===
                                            "object" &&
                                            task.assignedBy.role) ||
                                          ""}
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-2">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${
                                    loadingTasks[task._id]
                                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                      : task.priority === "High" ||
                                        task.priority === "Urgent"
                                      ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                                      : task.priority === "Medium"
                                      ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                                      : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                                  }`}
                                >
                                  {loadingTasks[task._id]
                                    ? "Checking..."
                                    : task?.priority}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(task.deadline).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Your Tasks
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            No tasks available. Create a new task to get started.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete task "
              {deleteConfirmation.taskTitle}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskForm && (
        <TaskForm
          onClose={() => {
            setShowTaskForm(false);
            setTaskToEdit(null);
          }}
          taskToEdit={taskToEdit}
        />
      )}

      {isEditModalOpen && (
        <TaskForm
          onClose={() => {
            setIsEditModalOpen(false);
            dispatch(fetchTasks());
          }}
          isEditing={true}
          initialData={currentTask}
        />
      )}

      {showAIRecommendations && (
        <AIRecommendationModal
          isOpen={showAIRecommendations}
          onClose={() => setShowAIRecommendations(false)}
          taskId={selectedTaskForAI?._id}
          onAssign={handleAssignTask}
        />
      )}
    </>
  );
};

export default TaskComponent;
