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
            const res = await fetch(`https://teampulse.velixir.run/GetProject/${id}`, {
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
        <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="project-details-title">
          <section className="modal-card">
            <div className="modal-heading"><div><p className="eyebrow">Project snapshot</p><h2 id="project-details-title">Project details</h2><p className="modal-description">A quick look at the brief and when it was created.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => navigate('/projects')}>×</button></div>
            {errror && <p className="form-error" role="alert">{errror}</p>}
            {project && <dl className="details-list"><div><dt>Project name</dt><dd>{project.title}</dd></div><div><dt>Description</dt><dd>{project.description || 'No description yet.'}</dd></div><div><dt>Created</dt><dd>{new Date(project.created_at).toLocaleDateString()}</dd></div></dl>}
          </section>
        </main>
    );
}