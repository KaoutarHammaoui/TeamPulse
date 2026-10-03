import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

export function ProjectTasks() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

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

  const AddNewTask = () => {
    navigate(`/AddTask/${id}`);
  };

  return (
    <div>
      <button
        onClick={() => {
          AddNewTask();
        }}
      >
        Add new Task
      </button>
      <button onClick={() => navigate("/projects")}>Go Back</button>
      <table border={1}>
        <tr>
          <td>Task</td>
          <td>Status</td>
          <td>Priority</td>
          <td colSpan={2}>Actions</td>
        </tr>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td>{t.title}</td>
            <td>{t.status}</td>
                <td>{t.priority}</td>
                <td onClick={() => { navigate(`/editTask/${t.id}`) }}>Edit</td>
                <td onClick={()=>{navigate(`/deleteTask/${t.id}`)}}>Delete</td>
          </tr>
        ))}
      </table>
      {error && <p>{error}</p>}
    </div>
  );
}
