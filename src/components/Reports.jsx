import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getTeamPerformance,
  getPendingTasks,
  getTimeSpent,
} from "../redux/actions/reportAction";
import NavigationTabs from "./NavigationTabs";

const Reports = () => {
  const dispatch = useDispatch();
  const { teamPerformance, pendingTasks, timeSpent, loading, error } =
    useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(getTeamPerformance());
    dispatch(getPendingTasks());
    dispatch(getTimeSpent());
  }, [dispatch]);

  return (
    <div className="container w-[88%] mx-auto mt-12 px-4 py-8 dark:bg-gray-800">
      <NavigationTabs />

      {/* Team Performance Section */}
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Team Performance Report
      </h1>

      {loading && !teamPerformance && (
        <div className="text-center dark:text-gray-300">
          Loading team performance data...
        </div>
      )}
      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {teamPerformance && teamPerformance.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-lg mb-12">
          <table className="min-w-full bg-white dark:bg-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-600">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                  Team Member
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  Tasks Completed
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  On-Time Completion (%)
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  Tasks On Time
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  Est. Time (hrs)
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  Actual Time (hrs)
                </th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
              {teamPerformance.map((member) => (
                <tr
                  key={member.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">
                    {member.username}
                  </td>
                  <td className="py-3 px-4 text-center dark:text-gray-200">
                    {member.tasksCompleted}
                  </td>
                  <td className="py-3 px-4 text-center dark:text-gray-200">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-500 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${member.onTimeCompletion}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{member.onTimeCompletion}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center dark:text-gray-200">
                    {member.tasksCompletedOnTime}
                  </td>
                  <td className="py-3 px-4 text-center dark:text-gray-200">
                    {member.totalEstimatedTime.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center dark:text-gray-200">
                    {member.totalActualTime.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {member.efficiency > 1 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {member.efficiency.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {member.efficiency.toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {teamPerformance && teamPerformance.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mb-12">
          Loading team performance data...
        </div>
      )}

      <br />
      <br />
      {/* Pending Tasks Section */}
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Pending Tasks Report
      </h1>

      {loading && !pendingTasks && (
        <div className="text-center dark:text-gray-300">
          Loading pending tasks data...
        </div>
      )}

      {pendingTasks && pendingTasks.length > 0 && (
        <div className="space-y-8">
          {pendingTasks.map((userTasks) => (
            <div
              key={userTasks.userId}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gray-100 dark:bg-gray-600 p-4 flex justify-between items-center">
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  {userTasks.username}
                </h2>
                <div className="flex space-x-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Total: {userTasks.totalTasks}
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
                    High Priority: {userTasks.highPriorityTasks}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Est. Time (hrs)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userTasks.tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                          {task.title}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === "High"
                                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                : task.priority === "Medium"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === "Pending"
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                : task.status === "In Progress"
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                          {new Date(task.deadline).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                          {task.estimatedTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingTasks && pendingTasks.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No pending tasks data available
        </div>
      )}
      <br />
      <br />
      {/* Time Spent Section */}
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Time Spent Report
      </h1>

      {loading && !timeSpent && (
        <div className="text-center dark:text-gray-300">
          Loading time spent data...
        </div>
      )}

      {timeSpent && timeSpent.length > 0 && (
        <div className="space-y-8">
          {timeSpent.map((userData) => (
            <div
              key={userData.userId}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gray-100 dark:bg-gray-600 p-4 flex justify-between items-center">
                <h2 className="text-nd font-semibold text-gray-800 dark:text-gray-200">
                  {userData.username}
                </h2>
                <div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Total Time: {userData.totalDuration.toFixed(2)} hrs
                  </span>
                </div>
              </div>

              {userData.tasks && userData.tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Task Title
                        </th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Time Spent (hrs)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {userData.tasks.map((task) => (
                        <tr
                          key={task.taskId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                            {task.title}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === "Completed"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : task.status === "In Progress"
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                  : task.status === "Review"
                                  ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === "High"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : task.priority === "Medium"
                                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                            {task.totalDuration.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No task time data available
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {timeSpent && timeSpent.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No time spent data available
        </div>
      )}
    </div>
  );
};

export default Reports;
