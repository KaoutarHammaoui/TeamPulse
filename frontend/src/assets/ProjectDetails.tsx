import { useState,useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Project{
    id: number,
    title: string,
    description: string,
    created_at: string
}
export function ProjectDetails() {
    const navigate= useNavigate()
    const [errror, setErrror] = useState('')
    const [project, setProject] = useState<Project | null>(null)
    
    const { id } = useParams();

    useEffect(() => {   
        const resFn = async () => {
            const res = await fetch(`http://localhost:8080/GetProject/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!res.ok) {
                setErrror('cannot get details')
                return
            }
            const data = await res.json()
            setProject(data)
        }
        resFn()
    },[id])
    return (
        <div>
          <button onClick={()=>{navigate('/projects')}}>Go Back</button>
        {errror && <p> {errror} </p>}
        {project && (
                <table border={1}>
                    <tr><td>Project Name</td> <td>Description</td> <td>Creation Date</td></tr>
            <tr>
              <td> {project.title} </td>
              <td> {project.description} </td>
              <td> {new Date(project.created_at).toLocaleDateString()}</td>
            </tr>
          </table>
        )}
      </div>
    );
}