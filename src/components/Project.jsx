import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProjectForm from "./ProjectForm"; // Import ProjectForm
import { useDispatch } from "react-redux";
import { fetchProjects } from "../redux/actions/projectAction";

const Project = () => {
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [showProjectForm, setShowProjectForm] = useState(false);

  console.log(projects, "Project state");
  // console.log("hi i am project component");

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);
  return (
    <div className="text-center m-auto">
      {/* Project form button */}
      <button
        onClick={handleCreateProject}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Create Project
      </button>
      {/* project form component */}
      {showProjectForm && (
        <ProjectForm
          onClose={handleCloseProjectForm}
          onSuccess={(project) => {
            console.log("Project created:", project);
            handleCloseProjectForm();
          }}
        />
      )}
      {/* Render other project-related content here */}
    </div>
  );
};

export default Project;
