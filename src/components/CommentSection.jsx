import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "./SocketContext";
import { createComment, getComments } from "../redux/actions/commentAction";
import { addNewComment, resetComments } from "../redux/reducers/commentSlice";
import { fetchTasks } from "../redux/actions/taskAction";
import { fetchProjects } from "../redux/actions/projectAction";

const CommentSection = ({ taskId: initialTaskId, projectId: initialProjectId }) => {
  const [newComment, setNewComment] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || "");
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || "");
  
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  console.log(comments, "commeet...........")
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const { socket, joinTaskRoom, joinProjectRoom } = useSocket();

  // Fetch tasks and projects
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Join appropriate room based on context and fetch comments
  useEffect(() => {
    const taskId = selectedTaskId || initialTaskId;
    const projectId = selectedProjectId || initialProjectId;
    
    if (taskId) {
      joinTaskRoom(taskId);
      dispatch(getComments({ taskId }));
      console.log("Fetching comments for task:", taskId);
    } else if (projectId) {
      joinProjectRoom(projectId);
      dispatch(getComments({ projectId }));
      console.log("Fetching comments for project:", projectId);
    }

    // Cleanup function
    return () => {
      if (!taskId && !projectId) {
        dispatch(resetComments());
      }
    };
  }, [initialTaskId, initialProjectId, selectedTaskId, selectedProjectId, dispatch, joinTaskRoom, joinProjectRoom]);

  // Listen for new comments via socket
  useEffect(() => {
    if (socket) {
      socket.on("new-comment", (comment) => {
        // Only add if it's not from the current user (to avoid duplicates)
        if (comment.author._id !== user._id) {
          dispatch(addNewComment(comment));
        }
      });

      return () => {
        socket.off("new-comment");
      };
    }
  }, [socket, user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      content: newComment,
      taskId: selectedTaskId || initialTaskId,
      projectId: selectedProjectId || initialProjectId,
      attachments: [],
    };

    dispatch(createComment(commentData));
    setNewComment("");
  };

  return (
    <div className="container w-[90%] mx-auto mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Comments
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Task
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">None</option>
              {tasks && tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">None</option>
              {projects && projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!newComment.trim() || (!selectedTaskId && !selectedProjectId)}
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start">
                {comment.author?.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {comment.author?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium text-gray-800 dark:text-white mr-2">
                      {comment.author?.username || "Unknown User"}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                  
                  {/* Display task or project info if available */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {comment.task && tasks && tasks.length > 0 && (
                      <div className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">
                        Task: {tasks.find(t => t._id === comment.task)?.title || 'Unknown Task'}
                      </div>
                    )}
                    {comment.project && projects && projects.length > 0 && (
                      <div className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded">
                        Project: {projects.find(p => p._id === comment.project)?.name || 'Unknown Project'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentSection;
