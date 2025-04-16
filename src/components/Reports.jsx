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

  // Add loading state check
  if (loading) {
    return (
      <div className="w-full md:w-[90%] lg:w-[92%] mx-auto py-6 px-4 md:m-auto lg:ml-[6%] dark:bg-gray-800">
        <NavigationTabs />
        <div>
          <h1 className="text-xl md:text-[25px] text-left underline text-red-500 font-semibold mb-6 md:mb-8 dark:text-white">
            Reports
          </h1>
        </div>

        {/* Team Performance Skeleton */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Team Performance Report
          </h1>
        </div>

        <div className="overflow-x-auto relative max-w-full shadow-lg rounded-lg mb-8 md:mb-12">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full bg-white dark:bg-gray-700 table-auto">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                    Team Member
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                    Tasks
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                    On-Time %
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden sm:table-cell">
                    Tasks On Time
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden md:table-cell">
                    Est. (hrs)
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden md:table-cell">
                    Actual (hrs)
                  </th>
                  <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
                {[1, 2, 3].map((index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 text-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-4 md:w-10 lg:w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 md:h-2.5 hidden sm:block"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 ml-2"></div>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 text-center hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 text-center hidden md:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto"></div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 text-center hidden md:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto"></div>
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 text-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Tasks Skeleton */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Pending Tasks Report
          </h1>
        </div>

        <div className="space-y-4 md:space-y-8 animate-pulse">
          {[1, 2].map((index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((taskIndex) => (
                    <div key={taskIndex} className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Spent Skeleton */}
        <div className="pt-4 md:pt-6"></div>
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Time Spent Report
          </h1>
        </div>

        <div className="space-y-4 md:space-y-8 animate-pulse">
          {[1, 2].map((index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((taskIndex) => (
                    <div key={taskIndex} className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if data is initialized
  const hasData = teamPerformance || pendingTasks || timeSpent;
  const hasNoData =
    (!teamPerformance || teamPerformance.length === 0) &&
    (!pendingTasks || pendingTasks.length === 0) &&
    (!timeSpent || timeSpent.length === 0);

  return (
    <div className="w-full md:w-[90%] lg:w-[92%] mx-auto py-6 px-4 md:m-auto lg:ml-[6%] dark:bg-gray-800">
      <NavigationTabs />
      <div>
        <h1 className="text-xl md:text-[25px] text-left underline text-red-500 font-semibold mb-6 md:mb-8 dark:text-white">
          Reports
        </h1>
      </div>

      {!hasData || hasNoData ? (
        <h1 className="text-center pt-[15%] pb-[15%] text-xl md:text-2xl lg:text-3xl font-normal dark:text-gray-300">
          No Reports Data Found.
        </h1>
      ) : (
        <>
          {/* Team Performance Section */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Team Performance Report
            </h1>
          </div>

          {teamPerformance && teamPerformance.length > 0 && (
            <div className="overflow-x-auto relative max-w-full shadow-lg rounded-lg mb-8 md:mb-12">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full bg-white dark:bg-gray-700 table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                        Team Member
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                        Tasks
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
                        On-Time %
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden sm:table-cell">
                        Tasks On Time
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden md:table-cell">
                        Est. (hrs)
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 hidden md:table-cell">
                        Actual (hrs)
                      </th>
                      <th className="py-3 px-3 md:px-4 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500">
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
                        <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {member.username}
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm dark:text-gray-200">
                          {member.tasksCompleted}
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm dark:text-gray-200">
                          <div className="flex items-center justify-center">
                            <div className="w-4 md:w-10 lg:w-16 bg-gray-200 dark:bg-gray-500 rounded-full h-1.5 md:h-2.5 hidden sm:block">
                              <div
                                className="bg-blue-600 h-1.5 md:h-2.5 rounded-full"
                                style={{ width: `${member.onTimeCompletion}%` }}
                              ></div>
                            </div>
                            <span className="ml-0 sm:ml-2">
                              {member.onTimeCompletion}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm dark:text-gray-200 hidden sm:table-cell">
                          {member.tasksCompletedOnTime}
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm dark:text-gray-200 hidden md:table-cell">
                          {member.totalEstimatedTime.toFixed(2)}
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm dark:text-gray-200 hidden md:table-cell">
                          {member.totalActualTime.toFixed(2)}
                        </td>
                        <td className="py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm">
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
            </div>
          )}

          <div className="pt-4 md:pt-6"></div>

          {/* Pending Tasks Section */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Pending Tasks Report
            </h1>
          </div>

          {pendingTasks && pendingTasks.length > 0 && (
            <div className="space-y-4 md:space-y-8">
              {pendingTasks.map((userTasks) => (
                <div
                  key={userTasks.userId}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              colSpan="5"
                              className="py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-gray-700 dark:text-gray-200 text-sm md:text-base">
                                  {userTasks.username}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                    Total: {userTasks.totalTasks}
                                  </span>
                                  <span className="px-2 md:px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs">
                                    High Priority: {userTasks.highPriorityTasks}
                                  </span>
                                </div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                              Title
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                              Priority
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500 hidden sm:table-cell">
                              Status
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500 hidden md:table-cell">
                              Deadline
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500 hidden lg:table-cell">
                              Est. Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {userTasks.tasks.map((task) => (
                            <tr
                              key={task._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200">
                                {task.title}
                              </td>
                              <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">
                                <span
                                  className={`px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
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
                              <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">
                                <span
                                  className={`px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
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
                              <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200 hidden md:table-cell">
                                {new Date(task.deadline).toLocaleDateString()}
                              </td>
                              <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200 hidden lg:table-cell">
                                {task.estimatedTime}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 md:pt-6"></div>

          {/* Time Spent Section */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-[22px] text-left font-semibold dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Time Spent Report
            </h1>
          </div>

          {timeSpent && timeSpent.length > 0 && (
            <div className="space-y-4 md:space-y-8">
              {timeSpent.map((userData) => (
                <div
                  key={userData.userId}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              colSpan="4"
                              className="py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold bg-gray-200 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-gray-700 dark:text-gray-200 text-sm md:text-base">
                                  {userData.username}
                                </span>
                                <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                  Total Time:{" "}
                                  {userData.totalDuration.toFixed(2)} hrs
                                </span>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                              Task
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500 hidden sm:table-cell">
                              Status
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                              Priority
                            </th>
                            <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                              Time (hrs)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {userData.tasks && userData.tasks.length > 0 ? (
                            userData.tasks.map((task) => (
                              <tr
                                key={task.taskId}
                                className="hover:bg-gray-50 dark:hover:bg-gray-600"
                              >
                                <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200">
                                  {task.title}
                                </td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm hidden sm:table-cell">
                                  <span
                                    className={`px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
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
                                <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm">
                                  <span
                                    className={`px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
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
                                <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-800 dark:text-gray-200">
                                  {task.totalDuration.toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="py-4 text-center text-gray-500 dark:text-gray-400"
                              >
                                No task time data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
