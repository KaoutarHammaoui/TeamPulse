import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

export function DEleteTask() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [prId, SetPrId] = useState(0);
    // const[data,setDAte]=useState()
    useEffect(() => {
        const fetchPr = async() => {
            const res = await fetch(`http://localhost:8080/tasks/${id}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!res.ok) {
                setError('cannot fetch project')
                return
            }
            const data = await res.json()
            SetPrId(data.projectid);
        }
        fetchPr()
    },[id])

    const DeleteTask = async() => {
        const res = await fetch(`http://localhost:8080/DeleteTask/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
            setError('cannot delete this task')
            return
        }
        setSuccess('task was deleted successfully');
        setTimeout(() => {
            navigate(`/projects`)
        }, 3000);
    }
    return (
        <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="delete-task-title">
            <section className="modal-card modal-card-danger">
                <div className="danger-mark" aria-hidden="true">!</div>
                <p className="eyebrow">This action cannot be undone</p>
                <h2 id="delete-task-title">Delete this task?</h2>
                <p className="modal-description">The task and its details will be permanently removed from this project.</p>
                {error && <p className="form-error" role="alert">{error}</p>}
                {success && <p className="success" role="status">{success}</p>}
                <div className="modal-actions">
                    <button className="button-quiet" type="button" onClick={() => navigate(`/ProjectTasks/${prId}`)}>Keep task</button>
                    <button className="button-danger" type="button" onClick={DeleteTask}>Delete task</button>
                </div>
            </section>
        </main>
    )
}