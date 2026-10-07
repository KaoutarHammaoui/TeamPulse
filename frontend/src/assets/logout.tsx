import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const LogoutFunc = async () => {
    const res = await fetch("http://localhost:8080/logout", {
      method: "POST",
      headers: {
       "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    if (!res.ok) {
      setError("cannotlog out");
      return;
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <p>U sure u wanna leave</p>
      <button onClick={LogoutFunc}>YES</button>
      <button
        onClick={() => {
          navigate("/projects");
        }}
      >
        NO
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
