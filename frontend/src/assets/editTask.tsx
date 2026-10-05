import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function EditTask() {
  const { id } = useParams(); // this is the TASK's id
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("low");
  const [success, setSuccess] = useState("");
  const [projectId, setProjectId] = useState(null); // so we can navigate back correctly
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
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

  const EditFunc = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/UpdateTask/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <div>
      <form onSubmit={EditFunc}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit">Edit</button>
      </form>
      edit a task
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
