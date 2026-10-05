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
        <div>
            deletion page
            <p>r u sure u wanna delete this task?</p>
            <button onClick={()=>{DeleteTask()}}>YES</button>
            <button onClick={() => { navigate(`/ProjectTasks/${prId}`)}} >Not</button>
            {error && <p>{error}</p>}
            {success && <p>{ success}</p> }
        </div>
    )
}