import { useEffect, useState } from "react"

export function Projects() {
    const [error, setError] = useState('')
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const DAtaFetching = async () => {
            const response = await fetch('http://localhost:8080/GetProjects', {
                method: "GET",
                headers: {
                    "'Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                setError('error in fetch response')
                return
            }
            const data = await response.json()
            setProjects(data)
        }
        DAtaFetching()
    }, [])
    return (
        <div>
            Projets
            <table>
                {projects.map((pr) => (
                    <tr key={pr.id}> {pr.title} </tr>
                ))}
            </table>
            {projects}.map((k,val)=>{val.name})
            <input type="text" onChange={(e) => setError(e.target.value)} value={error} hidden />

        </div>
    )
}