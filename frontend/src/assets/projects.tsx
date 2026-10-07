import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
}

export function Projects() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const DAtaFetching = async () => {
      const response = await fetch("http://localhost:8080/GetProjects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        setError("error in fetch response");
        return;
      }
      const data = await response.json();
      setProjects(data.reverse() ?? []);
    };
    DAtaFetching();
  }, []);

  const Editroject = (pr: Project) => {
    navigate(`/editProject/${pr.id}`);
  };

  const AddProject = () => {
    navigate("/AddProject");
  };

  const ProjectDetail = (pr: Project) => {
    navigate(`/ProjectDetails/${pr.id}`);
  };
  const DeletePR = (pr: Project) => {
    navigate(`/DeletePR/${pr.id}`);
  };

  const ProjectTasks = (pr: Project) => {
    navigate(`/ProjectTasks/${pr.id}`);
  };

  const Users = () => {
    navigate("/Users");
  };

  return (
    <div>
      <button onClick={AddProject}>Add new Project</button>
      <button onClick={Users}>Update a role</button>
      Projets
      <table border={1}>
        {projects.map((pr) => (
          <tr key={pr.id}>
            <td
              onClick={() => {
                ProjectDetail(pr);
              }}
            >
              {pr.title}
            </td>
            <td
              onClick={() => {
                ProjectTasks(pr);
              }}
            >
              Tasks
            </td>
            <td onClick={() => Editroject(pr)}>Edit</td>
            <td onClick={() => DeletePR(pr)}>Delete</td>
          </tr>
        ))}
      </table>
      {error && <p>{error}</p>}
    </div>
  );
}
