import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

type ModalMode = "details" | "add" | "edit" | "delete" | null;

const priorityClass = (priority: string) => `priority-badge priority-${priority.toLowerCase()}`;
const statusLabel = (status: string) => status === "todo" ? "To do" : status === "in_progress" ? "In progress" : status === "done" ? "Done" : status;
const statusClass = (status: string) => `status-badge status-${status.toLowerCase()}`;

interface ProjectTasksProps {
  projectId?: number;
  onClose?: () => void;
}

export function ProjectTasks({ projectId, onClose }: ProjectTasksProps) {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = projectId?.toString() ?? routeId;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("low");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(
        `http://localhost:8080/GetTasks?project_id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (!res.ok) {
        setError("cannot load tasks");
        return;
      }
      const data = await res.json();
      setTasks(data ?? []);
    };
    fetchTasks();
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`http://localhost:8080/GetProject/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjectName(data.title);
      }
    };
    fetchProject();
  }, [id]);

  const openModal = (mode: Exclude<ModalMode, null>, task?: Task) => {
    setModalError("");
    setSelectedTask(task ?? null);
    if (mode === "edit" && task) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);
    } else if (mode === "add") {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("low");
    }
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTask(null);
  };

  const refreshTasks = async () => {
    const res = await fetch(`http://localhost:8080/GetTasks?project_id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) setTasks((await res.json()) ?? []);
  };

  const submitTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEditing = modalMode === "edit" && selectedTask;
    const res = await fetch(
      isEditing ? `http://localhost:8080/UpdateTask/${selectedTask.id}` : "http://localhost:8080/AddTask",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(isEditing ? { title, status, priority } : { projectname: projectName, title, description, status, priority }),
      },
    );
    if (!res.ok) {
      setModalError(isEditing ? "cannot edit this task" : "cannot add task");
      return;
    }
    await refreshTasks();
    closeModal();
  };

  const deleteTask = async () => {
    if (!selectedTask) return;
    const res = await fetch(`http://localhost:8080/DeleteTask/${selectedTask.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) {
      setModalError("cannot delete this task");
      return;
    }
    await refreshTasks();
    closeModal();
  };

  return (
    <div>
      <div className="tasks-toolbar">
        <button onClick={() => openModal("add")}>Add new Task</button>
        <button onClick={() => onClose ? onClose() : navigate("/projects")}>Go Back</button>
      </div>
      <table>
        <thead><tr>
          <th>Task</th>
          <th>Status</th>
          <th>Priority</th>
          <th colSpan={2}>Actions</th>
        </tr></thead>
        <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td><button className="task-title-button" type="button" onClick={() => openModal("details", t)}>{t.title}</button></td>
            <td><span className={statusClass(t.status)}>{statusLabel(t.status)}</span></td>
            <td><span className={priorityClass(t.priority)}>{t.priority}</span></td>
            <td><button className="table-action" onClick={() => openModal("edit", t)}>Edit</button></td>
            <td><button className="table-action table-action-danger" onClick={() => openModal("delete", t)}>Delete</button></td>
          </tr>
        ))}
        </tbody>
      </table>
      {error && <p>{error}</p>}
      {modalMode && (
        <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <section className={`modal-card${modalMode === "delete" ? " modal-card-danger" : ""}`}>
            {modalMode === "delete" ? (
              <>
                <div className="danger-mark" aria-hidden="true">!</div>
                <p className="eyebrow">This action cannot be undone</p>
                <h2 id="task-modal-title">Delete this task?</h2>
                <p className="modal-description">&quot;{selectedTask?.title}&quot; will be permanently removed from this project.</p>
                {modalError && <p className="form-error" role="alert">{modalError}</p>}
                <div className="modal-actions"><button className="button-quiet" type="button" onClick={closeModal}>Keep task</button><button className="button-danger" type="button" onClick={deleteTask}>Delete task</button></div>
              </>
            ) : modalMode === "details" ? (
              <>
                <div className="modal-heading"><div><p className="eyebrow">Task details</p><h2 id="task-modal-title">{selectedTask?.title}</h2><p className="modal-description">Everything the team needs to keep this task moving.</p></div><button className="modal-close" type="button" aria-label="Close task details" onClick={closeModal}>×</button></div>
                <dl className="details-list">
                  <div><dt>Description</dt><dd>{selectedTask?.description || "No description provided."}</dd></div>
                  <div><dt>Status</dt><dd><span className={statusClass(selectedTask?.status ?? "")}>{statusLabel(selectedTask?.status ?? "")}</span></dd></div>
                  <div><dt>Priority</dt><dd><span className={priorityClass(selectedTask?.priority ?? "")}>{selectedTask?.priority}</span></dd></div>
                </dl>
                <div className="modal-actions"><button className="button-quiet" type="button" onClick={closeModal}>Close</button><button type="button" onClick={() => selectedTask && openModal("edit", selectedTask)}>Edit task</button><button className="button-danger" type="button" onClick={() => selectedTask && openModal("delete", selectedTask)}>Delete</button></div>
              </>
            ) : (
              <>
                <div className="modal-heading"><div><p className="eyebrow">Task planning</p><h2 id="task-modal-title">{modalMode === "add" ? "Add a task" : "Edit task"}</h2><p className="modal-description">Keep the next step clear and actionable.</p></div><button className="modal-close" type="button" aria-label="Close task dialog" onClick={closeModal}>×</button></div>
                <form className="modal-form" onSubmit={submitTask}>
                  {modalMode === "add" && <div className="field"><label htmlFor="modal-project">Project</label><input id="modal-project" value={projectName} readOnly /></div>}
                  <div className="field"><label htmlFor="modal-task-title">Task title</label><input id="modal-task-title" value={title} onChange={(event) => setTitle(event.target.value)} required /></div>
                  {modalMode === "add" && <div className="field"><label htmlFor="modal-task-description">Description</label><textarea id="modal-task-description" value={description} onChange={(event) => setDescription(event.target.value)} /></div>}
                  <div className="modal-fields"><div className="field"><label htmlFor="modal-task-status">Status</label><select className={`status-select status-${status}`} id="modal-task-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></div><div className="field"><label htmlFor="modal-task-priority">Priority</label><select className={`priority-select priority-${priority}`} id="modal-task-priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div></div>
                  {modalError && <p className="form-error" role="alert">{modalError}</p>}
                  <div className="modal-actions"><button className="button-quiet" type="button" onClick={closeModal}>Cancel</button><button type="submit">{modalMode === "add" ? "Add task" : "Save changes"}</button></div>
                </form>
              </>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
