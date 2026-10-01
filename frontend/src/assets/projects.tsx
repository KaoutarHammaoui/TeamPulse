import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


interface Project {
    id: number
    title: string
    description: string 
}

export function Projects() {

    const navigate = useNavigate();
    const [error, setError] = useState('')
    const [projects, setProjects] = useState <Project[]> ([]);
    useEffect(() => {
        const DAtaFetching = async () => {
            const response = await fetch('http://localhost:8080/GetProjects', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                setError('error in fetch response')
                return
            }
            const data = await response.json()
            setProjects(data.reverse() ?? [])
        }
        DAtaFetching()
    }, [])

    

    const Editroject = (pr : Project) => {
        navigate(`/editProject/${pr.id}`)
    }

    const AddProject = () => {
        navigate('/AddProject')
    }

    const ProjectDetail=(pr:Project) => {
        navigate(`/ProjectDetails/${pr.id}`)
    }
    return (
        <div>
            <button onClick={AddProject}>Add new Project</button>
            Projets
            <table border={1}>
                {projects.map((pr) => (
                    <tr key={pr.id}><td onClick={()=>{ProjectDetail(pr)}} >{pr.title}</td>
                        <td>Tasks</td>
                        <td onClick={()=>Editroject(pr)}>Edit</td>
                        <td>Delete</td>

                    </tr>
                ))}
            </table>
            {error && <p>{error}</p>}
        </div>
    )
}