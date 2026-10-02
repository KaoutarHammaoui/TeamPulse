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
      <div>
            <p>Are u sure u wanna delete this project?</p>
            <button onClick={deletion}>YES</button>
        <button
          onClick={() => {
            navigate("/projects");
          }}
        >
          Cancel
            </button>
            {error && <p>{error}</p>}
            {success && <p>{success}</p> }
      </div>
    );
}