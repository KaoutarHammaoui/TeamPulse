import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function EditTask() {
  const { id } = useParams(); 
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("low");
  const [success, setSuccess] = useState("");
  const [projectId, setProjectId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`https://teampulse.velixir.run/tasks/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        setError("cannot fetch the task");
        return;
      }
      const data = await res.json();
      setTitle(data.title);
      setStatus(data.status);
      setPriority(data.priority);
      setProjectId(data.projectid);
    };
    fetchTask();
  }, [id]);

  const EditFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`https://teampulse.velixir.run/UpdateTask/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: title,
        status: status,
        priority: priority,
      }),
    });
    if (!res.ok) {
      setError("cannot edit this task");
      return;
    }
    setSuccess("edited successfully");
    setTimeout(() => {
      navigate(`/ProjectTasks/${projectId}`);
    }, 3000);
  };

  return (
    <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="edit-task-title">
      <section className="modal-card">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Task settings</p>
            <h2 id="edit-task-title">Edit task</h2>
            <p className="modal-description">Keep the task details clear so everyone knows what happens next.</p>
          </div>
          <button className="modal-close" type="button" aria-label="Close edit task" onClick={() => navigate(projectId ? `/ProjectTasks/${projectId}` : "/projects")}>×</button>
        </div>
        <form className="modal-form" onSubmit={EditFunc}>
          <div className="field">
            <label htmlFor="task-title">Task title</label>
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="modal-fields">
            <div className="field">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="success" role="status">{success}</p>}
          <div className="modal-actions">
            <button className="button-quiet" type="button" onClick={() => navigate(projectId ? `/ProjectTasks/${projectId}` : "/projects")}>Cancel</button>
            <button type="submit">Save changes</button>
          </div>
        </form>
      </section>
    </main>
  );
}
