import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { createProject } from "../redux/actions/projectAction";
import { axiosInstance } from "../utils/axiosInstance";

const ProjectForm = ({
  onClose,
  isEditing = false,
  initialData = null,
  onSuccess,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [manager, setManager] = useState([]); // State for all users
  const [employee, setEmployee] = useState([]); // State for all users
  const [selectedEmployee, setSelectedEmployee] = useState([]); // State for all users

  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectData, setProjectData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    manager: initialData?.manager || "",
    team: initialData?.team || [], // Array of selected team member IDs
    workflow: initialData?.workflow || [
      { name: "Pending", order: 1 },
      { name: "In Progress", order: 2 },
      { name: "Completed", order: 3 },
    ],
    createdBy: initialData?.createdBy || user?.id,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!projectData.name.trim()) newErrors.name = "Project name is required";
    if (!projectData.description.trim())
      newErrors.description = "Description is required";
    if (!projectData.startDate) newErrors.startDate = "Start date is required";
    if (!projectData.endDate) newErrors.endDate = "End date is required";
    if (!projectData.status) newErrors.status = "Status is required";
    if (!projectData.manager) newErrors.manager = "Manager is required";
    if (!projectData.team || projectData.team.length === 0)
      newErrors.team = "At least one team member is required";
    if (!projectData.workflow.length)
      newErrors.workflow = "At least one workflow stage is required";

    // Check if end date is before start date
    if (projectData.startDate && projectData.endDate) {
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate dates whenever either date changes
  const validateDates = () => {
    const dateErrors = {};

    if (projectData.startDate && projectData.endDate) {
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.endDate);

      if (endDate < startDate) {
        dateErrors.endDate = "End date cannot be before start date";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      endDate: dateErrors.endDate || undefined,
    }));
  };

  // Update this function to handle date changes specifically
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If changing dates, validate immediately after state update
    if (name === "startDate" || name === "endDate") {
      // Use a setTimeout to ensure state is updated before validation
      setTimeout(() => {
        validateDates();
      }, 0);
    }
  };

  // Handle team member selection
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    // Add newly selected members to the existing team array
    const updatedTeam = [
      ...projectData.team,
      ...selectedOptions.filter((id) => !projectData.team.includes(id)),
    ];

    setProjectData({
      ...projectData,
      team: updatedTeam,
    });
    setSelectedEmployee(updatedTeam);
  };

  // Handle removing a team member
  const removeTeamMember = (memberId) => {
    const updatedTeam = projectData.team.filter((id) => id !== memberId);
    setProjectData({
      ...projectData,
      team: updatedTeam,
    });
    setSelectedEmployee(updatedTeam);
  };

  const handleWorkflowChange = (index, field, value) => {
    const newWorkflow = [...projectData.workflow];
    newWorkflow[index] = { ...newWorkflow[index], [field]: value };
    setProjectData({
      ...projectData,
      workflow: newWorkflow,
    });
  };

  const addWorkflowStage = () => {
    setProjectData({
      ...projectData,
      workflow: [
        ...projectData.workflow,
        { name: "", order: projectData.workflow.length + 1 },
      ],
    });
  };

  // Helper function to reorder workflow stages
  const reorderWorkflowStages = (stages) => {
    return stages.map((stage, index) => ({
      ...stage,
      order: index + 1,
    }));
  };

  const removeWorkflowStage = (index) => {
    const newWorkflow = [...projectData.workflow];
    newWorkflow.splice(index, 1);

    // Reorder the remaining workflow stages
    const reorderedWorkflow = reorderWorkflowStages(newWorkflow);

    setProjectData({
      ...projectData,
      workflow: reorderedWorkflow,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        dispatch(createProject(projectData))
          .unwrap()
          .then((response) => {
            onSuccess(response);
          });
      } catch (error) {
        console.error("Error saving project:", error);
        setErrors({
          submit: error.response?.data?.message || "Failed to save project",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Fetch users (both managers and employees)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users?role=Manager`); // Fetch all users
        setManager(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users?role=Employee`); // Fetch all users
        setEmployee(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Re-validate dates when either date changes
  useEffect(() => {
    if (projectData.startDate || projectData.endDate) {
      validateDates();
    }
  }, [projectData.startDate, projectData.endDate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Project Name */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Project Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  className={`w-3/4 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter project name"
                />
              </div>
              {errors.name && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.name}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <div className="flex items-start">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-3/4 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the project"
                ></textarea>
              </div>
              {errors.description && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.description}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Status*
                </label>
                <select
                  name="status"
                  value={projectData.status}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select-Status</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              {errors.status && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.status}
                  </p>
                </div>
              )}
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Start Date*
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={projectData.startDate}
                  onChange={handleChange}
                  className={`w-3/4 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.startDate && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.startDate}
                  </p>
                </div>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  End Date*
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={projectData.endDate}
                  onChange={handleChange}
                  className={`w-3/4 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.endDate && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.endDate}
                  </p>
                </div>
              )}
            </div>

            {/* Manager */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Manager*
                </label>
                <select
                  name="manager"
                  value={projectData.manager}
                  onChange={handleChange}
                  className={`w-3/4 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white ${
                    errors.manager
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">Select Manager</option>
                  {loading ? (
                    <option disabled>Loading users...</option>
                  ) : (
                    manager.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.role})
                      </option>
                    ))
                  )}
                </select>
              </div>
              {errors.manager && (
                <div className="flex">
                  <div className="w-1/4"></div>
                  <p className="text-red-500 text-xs mt-1 w-3/4">
                    {errors.manager}
                  </p>
                </div>
              )}
            </div>

            {/* Team Members */}
            <div className="flex flex-col">
              <div className="flex items-start">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-1/4">
                  Team Members
                </label>
                <div className="w-3/4">
                  <select
                    multiple
                    name="team"
                    value={projectData.team}
                    onChange={handleTeamChange}
                    className="w-full  p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white mb-2"
                    size="4"
                  >
                    {loading ? (
                      <option disabled>Loading users...</option>
                    ) : (
                      employee.map((user) => (
                        <option
                          key={user._id}
                          value={user._id}
                          className="mb-2"
                        >
                          {user.username}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.team && (
                    <p className="text-red-500 text-xs mt-1">{errors.team}</p>
                  )}

                  {/* Selected Team Members Box */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {projectData.team.map((memberId) => {
                      const member = employee.find((u) => u._id === memberId);
                      return member ? (
                        <div
                          key={memberId}
                          className="flex items-center bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm text-gray-700 dark:text-gray-200"
                        >
                          {member.username}
                          <button
                            type="button"
                            onClick={() => removeTeamMember(memberId)}
                            className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Stages */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Workflow Stages*
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Define the stages that tasks will move through in this project
              </p>
              {projectData.workflow.map((stage, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) =>
                      handleWorkflowChange(index, "name", e.target.value)
                    }
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder={`Stage ${index + 1} Name`}
                  />
                  <input
                    type="number"
                    value={stage.order}
                    readOnly
                    className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white ml-2 bg-gray-100 dark:bg-gray-600"
                    placeholder="Order"
                  />
                  <button
                    type="button"
                    onClick={() => removeWorkflowStage(index)}
                    className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    disabled={projectData.workflow.length <= 1}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addWorkflowStage}
                className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add Stage
              </button>
              {errors.workflow && (
                <p className="text-red-500 text-xs mt-1">{errors.workflow}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

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
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditing ? "Updating..." : "Creating..."}
                </span>
              ) : isEditing ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProjectForm;
