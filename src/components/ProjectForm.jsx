import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../utils/axiosInstance';
import { useSelector } from 'react-redux';

const ProjectForm = ({ onClose, isEditing = false, initialData = null, onSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectData, setProjectData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    workflow: initialData?.workflow || ['To Do', 'In Progress', 'Review', 'Completed'],
    createdBy: initialData?.createdBy || user?.id,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!projectData.name.trim()) newErrors.name = "Project name is required";
    if (!projectData.description.trim()) newErrors.description = "Description is required";
    if (!projectData.deadline) newErrors.deadline = "Deadline is required";
    if (!projectData.workflow.length) newErrors.workflow = "At least one workflow stage is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const handleWorkflowChange = (index, value) => {
    const newWorkflow = [...projectData.workflow];
    newWorkflow[index] = value;
    setProjectData({
      ...projectData,
      workflow: newWorkflow,
    });
  };

  const addWorkflowStage = () => {
    setProjectData({
      ...projectData,
      workflow: [...projectData.workflow, ''],
    });
  };

  const removeWorkflowStage = (index) => {
    const newWorkflow = [...projectData.workflow];
    newWorkflow.splice(index, 1);
    setProjectData({
      ...projectData,
      workflow: newWorkflow,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        let response;
        if (isEditing) {
          response = await axiosInstance.put(`/projects/${initialData._id}`, projectData);
        } else {
          response = await axiosInstance.post('/projects', projectData);
        }
        onSuccess(response.data.data);
      } catch (error) {
        console.error('Error saving project:', error);
        setErrors({ submit: error.response?.data?.message || 'Failed to save project' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">
            {isEditing ? 'Edit Project' : 'Create New Project'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name*
              </label>
              <input
                type="text"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the project"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline*
              </label>
              <input
                type="date"
                name="deadline"
                value={projectData.deadline}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && (
                <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Workflow Stages */}
            <div>
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
                    value={stage}
                    onChange={(e) => handleWorkflowChange(index, e.target.value)}
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder={`Stage ${index + 1}`}
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
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;