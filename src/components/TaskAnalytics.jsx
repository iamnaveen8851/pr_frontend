import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../redux/actions/taskAction";
import { fetchProjects } from "../redux/actions/projectAction";
import NavigationTabs from "./NavigationTabs"; // Import the NavigationTabs component

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const TaskAnalytics = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState({
    statusCounts: {},
    priorityCounts: {},
    projectTaskCounts: {},
    assigneeTaskCounts: {},
  });

  // Add project data state
  const [projectData, setProjectData] = useState({
    statusCounts: {},
    teamSizeCounts: {},
    projectDurations: {},
    workflowCounts: {},
  });

  // Fetch tasks and projects when the component mounts
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Process task data when tasks or projects change
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Count tasks by status - fixing the status values to match what's in your data
      const statusCounts = {};

      tasks.forEach((task) => {
        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
      });

      // Count tasks by priority
      const priorityCounts = {
        Low: tasks.filter((task) => task.priority === "Low").length,
        Medium: tasks.filter((task) => task.priority === "Medium").length,
        High: tasks.filter((task) => task.priority === "High").length,
      };

      // Count tasks by project
      const projectTaskCounts = {};
      if (projects && projects.length > 0) {
        projects.forEach((project) => {
          // Debug the project data
          // console.log("Project:", project.name, "ID:", project._id);

          // Check if tasks have project IDs and count them properly
          const tasksInProject = tasks.filter((task) => {
            // Debug task project relationship

            // Check for both string and object ID comparison
            return (
              task.project === project._id ||
              (task.project && task.project._id === project._id) ||
              (typeof task.project === "object" &&
                task.project &&
                task.project.toString() === project._id)
            );
          });

          projectTaskCounts[project.name] = tasksInProject.length;
          // console.log(`Found ${tasksInProject.length} tasks for project ${project.name}`);
        });
      }

      // Count tasks by assignee
      const assigneeTaskCounts = {};
      tasks.forEach((task) => {
        if (task.assignedTo && task.assignedTo.username) {
          const assignee = task.assignedTo.username;
          assigneeTaskCounts[assignee] =
            (assigneeTaskCounts[assignee] || 0) + 1;
        }
      });

      setTaskData({
        statusCounts,
        priorityCounts,
        projectTaskCounts,
        assigneeTaskCounts,
      });
    }

    // Process project data
    if (projects && projects.length > 0) {
      // Count projects by status
      const statusCounts = {
        Planning: projects.filter((project) => project.status === "Planning")
          .length,
        "In Progress": projects.filter(
          (project) => project.status === "In Progress"
        ).length,
        "On Hold": projects.filter((project) => project.status === "On Hold")
          .length,
        Completed: projects.filter((project) => project.status === "Completed")
          .length,
      };

      // Count projects by team size
      const teamSizeCounts = {};
      projects.forEach((project) => {
        const teamSize = project.team ? project.team.length : 0;
        const sizeCategory =
          teamSize <= 2
            ? "Small (1-2)"
            : teamSize <= 5
            ? "Medium (3-5)"
            : "Large (6+)";
        teamSizeCounts[sizeCategory] = (teamSizeCounts[sizeCategory] || 0) + 1;
      });

      // Calculate project durations in months
      const projectDurations = {};
      projects.forEach((project) => {
        if (project.startDate && project.endDate) {
          const start = new Date(project.startDate);
          const end = new Date(project.endDate);
          const durationMonths = Math.round(
            (end - start) / (30 * 24 * 60 * 60 * 1000)
          );
          const durationCategory =
            durationMonths <= 3
              ? "Short (≤3 months)"
              : durationMonths <= 6
              ? "Medium (4-6 months)"
              : "Long (>6 months)";
          projectDurations[project.name] = durationMonths;
        }
      });

      // Count workflow stages across projects
      const workflowCounts = {};
      projects.forEach((project) => {
        if (project.workflow && project.workflow.length) {
          project.workflow.forEach((stage) => {
            workflowCounts[stage.name] = (workflowCounts[stage.name] || 0) + 1;
          });
        }
      });

      setProjectData({
        statusCounts,
        teamSizeCounts,
        projectDurations,
        workflowCounts,
      });
    }
  }, [tasks, projects]);

  // Prepare data for task status distribution
  const statusData = {
    labels: Object.keys(taskData.statusCounts),
    datasets: [
      {
        label: "Tasks by Status",
        data: Object.values(taskData.statusCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for task priority distribution
  const priorityData = {
    labels: Object.keys(taskData.priorityCounts),
    datasets: [
      {
        label: "Tasks by Priority",
        data: Object.values(taskData.priorityCounts),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  // Prepare data for tasks per project
  const projectTasksData = {
    labels: Object.keys(taskData.projectTaskCounts),
    datasets: [
      {
        label: "Tasks per Project",
        data: Object.values(taskData.projectTaskCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for tasks per assignee
  const assigneeTasksData = {
    labels: Object.keys(taskData.assigneeTaskCounts),
    datasets: [
      {
        label: "Tasks per Assignee",
        data: Object.values(taskData.assigneeTaskCounts),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for project status distribution
  const projectStatusData = {
    labels: Object.keys(projectData.statusCounts),
    datasets: [
      {
        label: "Projects by Status",
        data: Object.values(projectData.statusCounts),
        backgroundColor: [
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for project team size
  const teamSizeData = {
    labels: Object.keys(projectData.teamSizeCounts),
    datasets: [
      {
        label: "Projects by Team Size",
        data: Object.values(projectData.teamSizeCounts),
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for project durations
  const projectDurationData = {
    labels: Object.keys(projectData.projectDurations),
    datasets: [
      {
        label: "Project Duration (months)",
        data: Object.values(projectData.projectDurations),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for workflow stages
  const workflowData = {
    labels: Object.keys(projectData.workflowCounts),
    datasets: [
      {
        label: "Workflow Stages Usage",
        data: Object.values(projectData.workflowCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tasks per Project",
      },
    },
  };

  // Options for assignee chart
  const assigneeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tasks per Assignee",
      },
    },
  };

  // Options for project charts
  const projectOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="w-[90%] lg:w-[92%] m-auto mx-auto py-6  p-5 md:m-auto lg:ml-[6%]">
      <NavigationTabs />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Task Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Task Status Distribution
          </h3>
          <div className="h-64">
            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Task Priority Distribution
          </h3>
          <div className="h-64">
            <Pie data={priorityData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Tasks per Project
          </h3>
          <div className="h-64">
            <Bar options={barOptions} data={projectTasksData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Tasks per Assignee
          </h3>
          <div className="h-64">
            <Bar options={assigneeOptions} data={assigneeTasksData} />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Project Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Project Status Distribution
          </h3>
          <div className="h-64">
            <Pie
              data={projectStatusData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Projects by Team Size
          </h3>
          <div className="h-64">
            <Pie data={teamSizeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Project Durations (months)
          </h3>
          <div className="h-64">
            <Bar options={projectOptions} data={projectDurationData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Workflow Stages Usage
          </h3>
          <div className="h-64">
            <Bar options={projectOptions} data={workflowData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
