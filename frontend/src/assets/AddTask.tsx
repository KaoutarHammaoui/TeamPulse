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
    <div>
      <button onClick={() => navigate(`/ProjectTasks/${id}`)}>Go Back</button>
      add new task
      <form onSubmit={AddNewTask}>
        <input type="text" value={projectName} readOnly />
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">ToDo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
