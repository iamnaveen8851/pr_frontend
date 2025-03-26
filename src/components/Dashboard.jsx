import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import TaskForm from "./TaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchTasks } from "../redux/actions/taskAction";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [columns, setColumns] = useState({
    Pending: { id: "Pending", title: "To Do", tasks: [] },
    "In Progress": { id: "In Progress", title: "In Progress", tasks: [] },
    Review: { id: "Review", title: "Review", tasks: [] },
    Completed: { id: "Completed", title: "Done", tasks: [] },
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

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
          // Default to Pending if status doesn't match any column
          newColumns["Pending"].tasks.push(task);
        }
      });

      setColumns(newColumns);
    }
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back to its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the task that was dragged
    const task = columns[source.droppableId].tasks.find(
      (task) => task._id === draggableId
    );

    if (!task) return;

    // Create new columns object
    const newColumns = { ...columns };

    // Remove task from source column
    newColumns[source.droppableId].tasks = newColumns[
      source.droppableId
    ].tasks.filter((t) => t._id !== draggableId);

    // Add task to destination column with updated status
    const updatedTask = { ...task, status: destination.droppableId };
    newColumns[destination.droppableId].tasks.splice(
      destination.index,
      0,
      updatedTask
    );

    setColumns(newColumns);

    // Here you would dispatch an action to update the task status in the backend
    // dispatch(updateTaskStatus({ taskId: draggableId, status: destination.droppableId }));
  };

  // Custom droppable component to avoid defaultProps warning
  const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);

    if (!enabled) {
      return null;
    }

    return <Droppable {...props}>{children}</Droppable>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : tasks && tasks.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.values(columns).map((column) => (
                <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-3">
                    {column.title} ({column.tasks.length})
                  </h2>
                  <StrictModeDroppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[200px] transition-colors ${
                          snapshot.isDraggingOver ? "bg-blue-50" : ""
                        }`}
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
                                className={`bg-white p-3 rounded-md shadow mb-2 ${
                                  snapshot.isDragging ? "opacity-75" : ""
                                }`}
                              >
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-gray-600 truncate">
                                  {task.description}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${
                                      task.priority === "High" ||
                                      task.priority === "Urgent"
                                        ? "bg-red-100 text-red-800"
                                        : task.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      task.deadline
                                    ).toLocaleDateString()}
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            <p className="text-gray-500">
              No tasks available. Create a new task to get started.
            </p>
          </div>
        )}
      </div>

      {showTaskForm && (
        <TaskForm
          onClose={() => {
            setShowTaskForm(false);
            // Refresh tasks after creating a new one
            dispatch(fetchTasks());
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
