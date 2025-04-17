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
import NavigationTabs from "./NavigationTabs"; // Import the NavigationTabs component
import { axiosInstance } from "../utils/axiosInstance";

const Project = () => {
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [projectsByStatus, setProjectsByStatus] = useState({
    Planning: [],
    "In Progress": [],
    "On Hold": [],
    Completed: [],
  });
  // Add state for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    projectId: null,
    projectName: "",
  });

  // console.log(projects, "Project state");

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/users`);
      // console.log("Users fetched successfully", response.data.data);
      setUsers(response.data.data);
    } catch (error) {
      console.log("Error while fething users", error);
    }
  };
  useEffect(() => {
    fetchUsers();

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

  useEffect(() => {
    if (deleteConfirmation.show || showProjectForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [deleteConfirmation.show, showProjectForm]);

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
      return `Invalid date ${error}`;
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

  // Modified to show confirmation popup first
  const handleDeleteClick = (projectId, projectName) => {
    setDeleteConfirmation({
      show: true,
      projectId,
      projectName,
    });
  };

  // Actual delete function that will be called after confirmation
  const handleDeleteProject = () => {
    // console.log("Delete project:", deleteConfirmation.projectId);
    const isManager = projects.find((p) =>
      users.some((user) => user._id === p.manager._id)
    );

    console.log(isManager, "isManager");
    dispatch(deleteProject({ id: deleteConfirmation.projectId }));
    // Close the confirmation dialog
    setDeleteConfirmation({ show: false, projectId: null, projectName: "" });
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, projectId: null, projectName: "" });
  };

  // Add this function to get workflow stages from projects
  const getWorkflowStages = () => {
    // Default workflow if no projects have workflow data
    const defaultWorkflow = [
      { name: "Planning", order: 1 },
      { name: "In Progress", order: 2 },
      { name: "On Hold", order: 3 },
      { name: "Completed", order: 4 },
    ];

    // Try to get workflow from the first project that has it
    if (projects && projects.length > 0) {
      const projectWithWorkflow = projects.find(
        (p) => p.workflow && p.workflow.length > 0
      );
      if (projectWithWorkflow && projectWithWorkflow.workflow) {
        const workflow = [...projectWithWorkflow.workflow].sort(
          (a, b) => a.order - b.order
        );

        // Check if "On Hold" is missing and add it if needed
        if (!workflow.some((stage) => stage.name === "On Hold")) {
          // Find the position to insert "On Hold" (typically between "In Progress" and "Completed")
          const inProgressIndex = workflow.findIndex(
            (stage) => stage.name === "In Progress"
          );
          const completedIndex = workflow.findIndex(
            (stage) => stage.name === "Completed"
          );

          // Calculate the appropriate order value
          let order = 3;
          if (inProgressIndex !== -1 && completedIndex !== -1) {
            // Place between In Progress and Completed
            order =
              workflow[inProgressIndex].order +
              (workflow[completedIndex].order -
                workflow[inProgressIndex].order) /
                2;
          } else if (inProgressIndex !== -1) {
            // Place after In Progress
            order = workflow[inProgressIndex].order + 1;
          }

          // Insert "On Hold" at the appropriate position
          workflow.push({
            name: "On Hold",
            order: order,
            _id: "custom-on-hold",
          });
          // Re-sort the workflow after adding the new stage
          workflow.sort((a, b) => a.order - b.order);
        }

        return workflow;
      }
    }

    return defaultWorkflow;
  };

  return (
    <div
      className={`w-[98%] lg:w-[100%] mx-auto px-6 py-5 m-auto md:m-auto bg-white dark:bg-gray-900 ${
        showProjectForm || deleteConfirmation.show
          ? "overflow-hidden h-screen"
          : ""
      }`}
    >
      <NavigationTabs />

      <div className="flex justify-between items-center px-2  mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Projects
        </h1>
        {/* if no projects data then hide the button for users only */}
        {loading ? (
          ""
        ) : projects.length === 0 ? (
          ""
        ) : (
          <button
            disabled={
              !users.some(
                (user) => user.role === "Manager" || user.role === "Admin"
              )
            }
            onClick={
              users.some(
                (user) => user.role === "Manager" || user.role === "Admin"
              )
                ? handleCreateProject
                : undefined
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Create Project
          </button>
        )}
      </div>

      {/* Workflow Graph - Only show skeleton OR graph, not both */}
      {loading ? (
        /* Workflow Skeleton */
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="flex justify-center items-center p-2 sm:p-5">
            <div className="flex items-center justify-center w-full max-w-3xl">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center flex-grow">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <div className="rounded-full p-2 sm:p-3 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                    <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  {index < 4 - 1 && (
                    <div className="flex-grow mx-2 sm:mx-4 relative">
                      <div className="h-0.5 bg-gray-200 dark:bg-gray-700 w-full absolute top-4 sm:top-5"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        ""
      ) : (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
            Project Workflow
          </h2>

          <div className="flex justify-center items-center p-2 sm:p-5">
            <div className="flex items-center justify-center w-full max-w-3xl">
              {getWorkflowStages().map((stage, index, array) => {
                const stageName = stage.name;
                // Check if the stage is "Planning" and count both "Planning" and "Pending" projects
                const count =
                  stageName === "Planning"
                    ? (projectsByStatus["Planning"]?.length || 0) +
                      (projectsByStatus["Pending"]?.length || 0)
                    : projectsByStatus[stageName]
                    ? projectsByStatus[stageName].length
                    : 0;

                return (
                  <div
                    key={stage._id || index}
                    className="flex items-center flex-grow"
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <div
                        className={`rounded-full p-2 sm:p-3 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 ${
                          stageName === "Planning"
                            ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                            : stageName === "In Progress"
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                            : stageName === "On Hold"
                            ? "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200"
                            : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                        }`}
                      >
                        <span className="font-medium text-xs sm:text-sm">
                          {count}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 sm:mt-2 text-center">
                        {stageName}
                      </span>
                      <span className="text-xs text-gray-500 hidden xs:block">
                        Stage {stage.order}
                      </span>
                    </div>
                    {index < array.length - 1 && (
                      <div className="flex-grow mx-2 sm:mx-4 relative">
                        <div className="h-0.5 bg-gray-300 dark:bg-gray-600 w-full absolute top-4 sm:top-5"></div>
                        <div className="absolute right-0 top-3 sm:top-3.5 transform translate-x-1/2">
                          <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        /* Projects Grid Skeleton */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((columnIndex) => (
            <div
              key={columnIndex}
              className="rounded-lg p-4 shadow-md bg-gray-50 dark:bg-gray-800"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-4"></div>
              <div className="space-y-4">
                {[1, 2].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-3"></div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                      <div className="flex space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <>
          <h1 className="text-center pt-[15%] pb-[15%] text-xl md:text-2xl lg:text-3xl font-normal dark:text-gray-300">
            No projects assigned to you yet.
          </h1>
        </>
      ) : (
        // display Project
        <>
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
                                      handleDeleteClick(
                                        project._id,
                                        project.name
                                      );
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
                                    {project.team &&
                                      project.team.length > 3 && (
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete project "
              {deleteConfirmation.projectName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
