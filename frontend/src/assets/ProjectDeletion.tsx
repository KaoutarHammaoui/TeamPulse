import {useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function DeletePR() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');
    const [success,setSuccess]=useState('')


        const deletion = async () => {
            const res = await fetch(`http://localhost:8080/DeleteProject/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization":`Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) {
                setError('cannot delete this project')
                return
            }
            setSuccess('project deleted successfully')
            setTimeout(() => {
                navigate("/projects");
            }, 2000);
        }
  
    return (
      <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
        <section className="modal-card modal-card-danger">
          <div className="danger-mark" aria-hidden="true">!</div><p className="eyebrow">Permanent action</p><h2 id="delete-project-title">Delete this project?</h2><p className="modal-description">Everything inside this project will be removed. This cannot be undone.</p>
          {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="success" role="status">{success}</p>}
          <div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate('/projects')}>Keep project</button><button className="button-danger" type="button" onClick={deletion}>Delete project</button></div>
        </section>
      </main>
    );
}