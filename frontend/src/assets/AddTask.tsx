import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function AddTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projectName, setProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("low");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProjectName = async () => {
      const res = await fetch(`http://localhost:8080/GetProject/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        setError("cannot load project");
        return;
      }
      const data = await res.json();
      setProjectName(data.title);
    };
    fetchProjectName();
  }, [id]);

  const AddNewTask = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/AddTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        projectname: projectName,
        title: title,
        description: description,
        status: status,
        priority: priority,
      }),
    });
    if (!res.ok) {
      setError("cannot add task");
      return;
    }
    setSuccess("task added successfully");
    setTimeout(() => navigate(`/ProjectTasks/${id}`), 1500);
  };

  return (
    <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
      <section className="modal-card">
        <div className="modal-heading"><div><p className="eyebrow">Task planning</p><h2 id="add-task-title">Add a task</h2><p className="modal-description">Turn the next important step into something the team can own.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => navigate(`/ProjectTasks/${id}`)}>×</button></div>
        <form className="modal-form" onSubmit={AddNewTask}>
          <div className="field"><label htmlFor="task-project">Project</label><input id="task-project" type="text" value={projectName} readOnly /></div>
          <div className="field"><label htmlFor="new-task-title">Task title</label><input id="new-task-title" type="text" placeholder="e.g. Review homepage copy" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="field"><label htmlFor="new-task-description">Description</label><textarea id="new-task-description" placeholder="Add useful context" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="modal-fields"><div className="field"><label htmlFor="new-task-status">Status</label><select id="new-task-status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></div><div className="field"><label htmlFor="new-task-priority">Priority</label><select id="new-task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div></div>
          {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="success" role="status">{success}</p>}
          <div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate(`/ProjectTasks/${id}`)}>Cancel</button><button type="submit">Add task</button></div>
        </form>
      </section>
    </main>
  );
}
