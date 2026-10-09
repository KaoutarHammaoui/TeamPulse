import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  username: string;
  role: string;
};

export function GetUsers() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const GetThem = async () => {
      const res = await fetch("http://localhost:8080/Users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        setError("cannot load users");
        return;
      }
      const body = await res.json();
      setData(body);
    };
    GetThem();
  }, []);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workspace access</p>
          <h1>Users</h1>
          <p className="subtitle">Manage the people and permissions connected to this workspace.</p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate("/projects")}>Back to projects</button>
          <button onClick={() => navigate("/logout")}>Logout</button>
        </div>
      </header>
      <table>
        <thead><tr><th>User</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
        {data.map((us) => (
          <tr key={us.id}>
            <td> {us.username} </td>
            <td><span className={`role-badge role-${us.role}`}>{us.role}</span></td>
            <td><button className="table-action" onClick={() => navigate(`/UpdateRole/${us.id}`)}>Update role</button></td>
          </tr>
        ))}
        </tbody>
      </table>
      {error && <p className="form-error" role="alert">{error}</p>}
    </main>
  );
}
