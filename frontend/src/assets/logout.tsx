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
    navigate("/login",{replace:true});
  };

  return (
    <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="logout-title">
      <section className="modal-card modal-card-danger">
        <div className="danger-mark" aria-hidden="true">↗</div><p className="eyebrow">Session</p><h2 id="logout-title">Leave your workspace?</h2><p className="modal-description">You can sign back in whenever you are ready to pick up where you left off.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate('/projects')}>Stay here</button><button className="button-danger" type="button" onClick={LogoutFunc}>Log out</button></div>
      </section>
    </main>
  );
}
