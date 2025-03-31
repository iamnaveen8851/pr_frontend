import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProjectForm from "./ProjectForm";
import { useDispatch } from "react-redux";
import {
  deleteProject,
  fetchProjects,
  updateProject,
} from "../redux/actions/projectAction";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Project = () => {
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectsByStatus, setProjectsByStatus] = useState({
    Planning: [],
    "In Progress": [],
    "On Hold": [],
    Completed: [],
  });

  console.log(projects, "Project state");

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  // Group projects by status when projects data changes
  useEffect(() => {
    if (projects && projects.length > 0) {
      const grouped = {
        Planning: [],
        "In Progress": [],
        "On Hold": [],
        Completed: [],
      };

      projects.forEach((project) => {
        if (grouped[project.status]) {
          grouped[project.status].push(project);
        } else {
          grouped.Planning.push(project);
        }
      });

      setProjectsByStatus(grouped);
    }
  }, [projects]);

  // Handle drag end
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item is dropped in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the project that was dragged
    const project = projects.find((p) => p._id === draggableId);
    if (!project) return;

    // Create a copy of the current state
    const newProjectsByStatus = { ...projectsByStatus };

    // Remove from source
    newProjectsByStatus[source.droppableId] = newProjectsByStatus[
      source.droppableId
    ].filter((p) => p._id !== draggableId);

    // Add to destination
    const updatedProject = { ...project, status: destination.droppableId };
    newProjectsByStatus[destination.droppableId].splice(
      destination.index,
      0,
      updatedProject
    );

    // Update state
    setProjectsByStatus(newProjectsByStatus);

    // Here you would typically dispatch an action to update the project status in the backend
    dispatch(
      updateProject({
        id: draggableId,
        projectData: { status: destination.droppableId },
      })
    );
    // dispatch(updateProjectStatus(draggableId, destination.droppableId));
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get background color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600";
      case "In Progress":
        return "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-600";
      case "On Hold":
        return "bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400 dark:border-orange-600";
      case "Completed":
        return "bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-600";
      default:
        return "bg-white dark:bg-gray-700";
    }
  };

  const handleDeleteProject = (projectId) => {
    // Here you would dispatch an action to delete the project
    // For example: dispatch(deleteProject(projectId));
    console.log("Delete project:", projectId);
    dispatch(deleteProject({id: projectId}));
    // After API call succeeds, you would refetch projects
    // dispatch(fetchProjects());
  };

  return (
    <div className="container w-[90%] mx-auto px-4 py-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projects
        </h1>
        <button
          onClick={handleCreateProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(projectsByStatus).map((status) => (
              <div
                key={status}
                className={`rounded-lg p-4 shadow-md ${
                  status === "Planning"
                    ? "bg-yellow-100/50 dark:bg-yellow-900/20"
                    : status === "In Progress"
                    ? "bg-blue-100/50 dark:bg-blue-900/20"
                    : status === "On Hold"
                    ? "bg-orange-100/50 dark:bg-orange-900/20"
                    : "bg-green-100/50 dark:bg-green-900/20"
                }`}
              >
                <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
                  {status} ({projectsByStatus[status].length})
                </h2>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px]"
                    >
                      {projectsByStatus[status].map((project, index) => (
                        <Draggable
                          key={project._id}
                          draggableId={project._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${getStatusColor(
                                project.status
                              )} rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3
                                  className={`font-medium text-lg text-gray-800 dark:text-white ${
                                    project.status === "Completed"
                                      ? "line-through"
                                      : ""
                                  }`}
                                >
                                  {project.name}
                                </h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent drag when clicking delete
                                    handleDeleteProject(project._id);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <p
                                className={`text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 ${
                                  project.status === "Completed"
                                    ? "line-through"
                                    : ""
                                }`}
                              >
                                {project.description}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Start:{" "}
                                  </span>
                                  <span className="dark:text-white">
                                    {formatDate(project.startDate)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-300">
                                    End:{" "}
                                  </span>
                                  <span className="dark:text-white">
                                    {formatDate(project.endDate)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-300 text-xs">
                                    Manager:{" "}
                                  </span>
                                  <span className="text-sm dark:text-white">
                                    {project.manager?.username ||
                                      "Not assigned"}
                                  </span>
                                </div>
                                <div className="flex -space-x-2">
                                  {project.team &&
                                    project.team
                                      .slice(0, 3)
                                      .map((member, idx) => (
                                        <div
                                          key={idx}
                                          className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-700"
                                          title={member.username}
                                        >
                                          {member.username
                                            ?.charAt(0)
                                            .toUpperCase()}
                                        </div>
                                      ))}
                                  {project.team && project.team.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs border-2 border-white dark:border-gray-700">
                                      +{project.team.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showProjectForm && (
        <ProjectForm
          onClose={handleCloseProjectForm}
          onSuccess={(project) => {
            console.log("Project created:", project);
            handleCloseProjectForm();
            dispatch(fetchProjects());
          }}
        />
      )}
    </div>
  );
};

export default Project;
