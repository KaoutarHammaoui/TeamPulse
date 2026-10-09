import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectTasks } from "./ProjectTasks.js";

interface Project {
  id: number;
  title: string;
  description: string;
}

export function Projects() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskProject, setTaskProject] = useState<Project | null>(null);
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

  const openProjectTasks = (pr: Project) => {
    setTaskProject(pr);
  };

  const Users = () => {
    navigate("/Users");
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1>Projects</h1>
          <p className="subtitle">Keep the whole team moving in the same direction.</p>
        </div>
        <div className="page-actions">
          <button onClick={AddProject}>+ New project</button>
          <button onClick={Users}>Users</button>
          <button onClick={()=>{navigate('/logout')}}>Logout</button>
        </div>
      </header>
      <table>
        <thead><tr><th>Project</th><th>Tasks</th><th>Edit</th><th>Delete</th></tr></thead>
        <tbody>
        {projects.map((pr) => (
          <tr key={pr.id}>
            <td>{pr.title}</td>
            <td><button className="table-action" onClick={() => openProjectTasks(pr)}>Tasks</button></td>
            <td><button className="table-action" onClick={() => Editroject(pr)}>Edit</button></td>
            <td><button className="table-action table-action-danger" onClick={() => DeletePR(pr)}>Delete</button></td>
          </tr>
        ))}
        </tbody>
      </table>
      {!projects.length && !error && <div className="panel"><h3>No projects yet</h3><p className="subtitle">Create your first project to give your team a place to focus.</p></div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {taskProject && (
        <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="project-tasks-title" onMouseDown={(event) => event.target === event.currentTarget && setTaskProject(null)}>
          <section className="tasks-modal-card">
            <div className="modal-heading tasks-modal-heading">
              <div><p className="eyebrow">Project workspace</p><h2 id="project-tasks-title">{taskProject.title} tasks</h2><p className="modal-description">Plan, prioritize, and keep the next steps visible.</p></div>
              <button className="modal-close" type="button" aria-label="Close project tasks" onClick={() => setTaskProject(null)}>×</button>
            </div>
            <ProjectTasks projectId={taskProject.id} onClose={() => setTaskProject(null)} />
          </section>
        </main>
      )}
    </main>
  );
}
