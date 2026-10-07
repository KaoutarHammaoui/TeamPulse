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
    const [data, setData] = useState<User |null>(null);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [sucess, setSuccess] = useState("");
    
  const navigate = useNavigate();
  useEffect(() => {
    const getUSer = async () => {
      const res = await fetch(`http://localhost:8080/GetUser/${id}`, {
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
    const res = await fetch(`http://localhost:8080/UpdateUserRole/${id}`, {
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
        <div>
            update a role page
            <input type="text" value={username} readOnly />  
            <select name="" id="" value={role} onChange={(e)=>{setRole(e.target.value)}}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <button onClick={UpdateRoleFunc}>Update</button>
            {error && <p>{error}</p>}
            {sucess && <p>{sucess}</p>  }
      </div>
  );
}
