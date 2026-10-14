import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type User = {
  id: number;
    username: string;
  role:string
};

export function UpdateRole() {
  const { id } = useParams();
  const [error, setError] = useState("");
    const [, setData] = useState<User |null>(null);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [sucess, setSuccess] = useState("");
    
  const navigate = useNavigate();
  useEffect(() => {
    const getUSer = async () => {
      const res = await fetch(`https://teampulse.velixir.run/GetUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        setError("erro in getting user");
        return;
      }
      const bd = await res.json();
        setData(bd);
        setUsername(bd.username)
        setRole(bd.role);     
    };
      getUSer()
  }, [id]);

  const UpdateRoleFunc = async () => {
    const res = await fetch(`https://teampulse.velixir.run/UpdateUserRole/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      body:JSON.stringify({id:id,role:role})
    });
    if (!res.ok) {
      setError("cannot update role");
      return;
    }

    setSuccess("updated successfully");
    setTimeout(() => {
      navigate("/Users");
    }, 2000);
  };

    return (
        <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="role-title">
          <section className="modal-card">
            <div className="modal-heading"><div><p className="eyebrow">Team permissions</p><h2 id="role-title">Update role</h2><p className="modal-description">Choose the level of access this teammate should have.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => navigate('/Users')}>×</button></div>
            <div className="modal-form"><div className="field"><label htmlFor="role-user">Teammate</label><input id="role-user" type="text" value={username} readOnly /></div><div className="field"><label htmlFor="role-select">Role</label><select id="role-select" value={role} onChange={(e)=>setRole(e.target.value)}><option value="admin">Admin</option><option value="user">User</option></select></div>{error && <p className="form-error" role="alert">{error}</p>}{sucess && <p className="success" role="status">{sucess}</p>}<div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate('/Users')}>Cancel</button><button type="button" onClick={UpdateRoleFunc}>Update role</button></div></div>
          </section>
        </main>
  );
}
