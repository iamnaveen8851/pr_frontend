/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
// No need to import PropTypes since we'll use TypeScript-like prop validation

import { axiosInstance } from "../utils/axiosInstance";

const AIRecommendationModal = ({ isOpen, onClose, taskId, onAssign }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
 

  useEffect(() => {
    if (isOpen && taskId) {
      fetchRecommendations();
    }
  }, [isOpen, taskId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      console.log(taskId, "TaskId");
      const response = await axiosInstance.get(
        `/task-allocation/${taskId}/recommendations`
      );
      // console.log(response, "Res");
      console.log("");
      setRecommendations(response.data.data.recommendations);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch recommendations"
      );
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;

    try {
      onAssign(selectedUserId);
      onClose();
    } catch (error) {
      setError("Failed to assign task", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              AI Recommended Team Members
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Getting AI recommendations...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Select a team member to assign this task based on AI
                recommendations:
              </p>
              <div className="space-y-2 mb-6">
                {recommendations.map((user) => (
                  <div
                    key={user.userId}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUserId === user.userId
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedUserId(user.userId)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                        {user.username.charAt(0)}
                      </div>
                      <span className="ml-3 text-gray-800 dark:text-gray-200">
                        {user.username}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedUserId}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedUserId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-400 cursor-not-allowed"
                  }`}
                >
                  Assign Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};



export default AIRecommendationModal;
