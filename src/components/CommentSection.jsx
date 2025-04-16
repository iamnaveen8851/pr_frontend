import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "./SocketContext";
import { createComment, getComments } from "../redux/actions/commentAction";
import { addNewComment, resetComments } from "../redux/reducers/commentSlice";
import { fetchTasks } from "../redux/actions/taskAction";
import { fetchProjects } from "../redux/actions/projectAction";

import NavigationTabs from "./NavigationTabs"; // Import the NavigationTabs component
import { axiosInstance } from "../utils/axiosInstance";
import PropTypes from "prop-types";

const CommentSection = ({
  taskId: initialTaskId,
  projectId: initialProjectId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || "");
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || ""
  );

  // New state variables for mentions feature
  const [users, setUsers] = useState([]);

  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);
  const commentInputRef = useRef(null);

  const dispatch = useDispatch();
  const { comments, commentsLoading } = useSelector((state) => state.comments);
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const { socket, joinTaskRoom, joinProjectRoom } = useSocket();

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch tasks, projects, and users
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    fetchUsers();
  }, [dispatch]);

  // Join appropriate room based on context and fetch comments
  useEffect(() => {
    const taskId = selectedTaskId || initialTaskId;
    const projectId = selectedProjectId || initialProjectId;

    if (taskId) {
      joinTaskRoom(taskId);
      dispatch(getComments({ taskId }));
    } else if (projectId) {
      joinProjectRoom(projectId);
      dispatch(getComments({ projectId }));
    }

    // Cleanup function
    return () => {
      if (!taskId && !projectId) {
        dispatch(resetComments());
      }
    };
  }, [
    initialTaskId,
    initialProjectId,
    selectedTaskId,
    selectedProjectId,
    dispatch,
    joinTaskRoom,
    joinProjectRoom,
  ]);

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

  // Handle text input and detect @ mentions
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for mention
    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1 && lastAtSymbol >= 0) {
      const textAfterAt = value.substring(lastAtSymbol + 1);
      // Only show mention suggestions if there's no space after @ or if query is continuing
      if (!textAfterAt.includes(" ")) {
        setMentionQuery(textAfterAt.toLowerCase());
        setMentionPosition(lastAtSymbol);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Filter users based on mention query
  const filteredUsers = useMemo(() => {
    if (!mentionQuery) return users;
    return users
      .filter((user) => user.username.toLowerCase().includes(mentionQuery))
      .slice(0, 5); // Limit to 5 suggestions
  }, [mentionQuery, users]);

  // Handle user selection from mention dropdown
  const handleUserSelect = (selectedUser) => {
    const beforeMention = newComment.substring(0, mentionPosition);
    const afterMention = newComment.substring(
      mentionPosition + mentionQuery.length + 1
    );

    // Replace with the mention format
    const updatedComment = `${beforeMention}@${selectedUser.username} ${afterMention}`;
    setNewComment(updatedComment);
    setShowMentions(false);

    // Focus back on the input
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Extract mentions from the comment
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(newComment)) !== null) {
      const mentionedUsername = match[1];
      const mentionedUser = users.find((u) => u.username === mentionedUsername);
      if (mentionedUser) {
        mentions.push(mentionedUser._id);
      }
    }

    const commentData = {
      content: newComment,
      taskId: selectedTaskId || initialTaskId,
      projectId: selectedProjectId || initialProjectId,
      attachments: [],
      mentions: mentions, // Add mentions to the comment data
    };

    dispatch(createComment(commentData));
    setNewComment("");
  };

  return (
    <div className="w-[90%] lg:w-[97%] mx-auto px-4 py-6 m-auto md:m-auto   bg-white-300 dark:bg-gray-900   ">
      <NavigationTabs />

      <h3 className="text-2xl text-center md:text-left lg:text-left font-semibold text-gray-800 dark:text-white mb-6">
        Comments
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3  relative">
          <textarea
            ref={commentInputRef}
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment... (Use @ to mention users)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows="3"
          />

          {/* Mention suggestions dropdown */}
          {showMentions && filteredUsers.length > 0 && (
            <div className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center mr-2">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
              {tasks &&
                tasks.map((task) => (
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
              {projects &&
                projects.map((project) => (
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
            disabled={
              !newComment.trim() || (!selectedTaskId && !selectedProjectId)
            }
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      {commentsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 mr-3"></div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mr-2"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                    {/* Display formatted comment with highlighted mentions */}
                    {formatCommentWithMentions(comment.content, users)}
                  </p>

                  {/* Display task or project info if available */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {comment.task && tasks && tasks.length > 0 && (
                      <div className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">
                        Task:{" "}
                        {tasks.find((t) => t._id === comment.task)?.title ||
                          "Unknown Task"}
                      </div>
                    )}
                    {comment.project && projects && projects.length > 0 && (
                      <div className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded">
                        Project:{" "}
                        {projects.find((p) => p._id === comment.project)
                          ?.name || "Unknown Project"}
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

// Helper function to format comments with highlighted mentions
const formatCommentWithMentions = (content, users) => {
  if (!content) return "";

  // Split the content by mention pattern
  const parts = content.split(/(@\w+)/g);

  return parts.map((part, index) => {
    // Check if this part is a mention
    if (part.startsWith("@")) {
      const username = part.substring(1);
      const mentionedUser = users.find((u) => u.username === username);

      if (mentionedUser) {
        // Return highlighted mention
        return (
          <span
            key={index}
            className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-1 rounded"
          >
            {part}
          </span>
        );
      }
    }

    // Return regular text
    return <span key={index}>{part}</span>;
  });
};

export default CommentSection;
CommentSection.propTypes = {
  taskId: PropTypes.string,
  projectId: PropTypes.string,
};
