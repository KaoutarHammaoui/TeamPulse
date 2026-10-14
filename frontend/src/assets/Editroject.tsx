import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function Editroject() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('')
  const [msgOnSuccess, setMsgOnSuccess] = useState('')
  
  useEffect(() => {
    const fetchedPr = async () => {
      const res = await fetch(`https://teampulse.velixir.run/GetProject/${id}`, {
        method: "GET",
        headers: {
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        setError("cannot load project")
          return
      }
      const data = await res.json()
      setTitle(data.title)
      setDesc(data.description)
    }
    fetchedPr()
  },[id])

  const SubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`https://teampulse.velixir.run/UpdateProject/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${localStorage.getItem('token')}`
      },
      body:JSON.stringify({title:title,content:desc})
    });
    if (!res.ok) {
      setError('cannot edit this project')
      return
    }
    setMsgOnSuccess('project edited succesfully');
    setTimeout(() => {
      navigate('/projects')
    }, 3000);
  }
    return (
      <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="edit-project-title">
        <section className="modal-card">
          <div className="modal-heading"><div><p className="eyebrow">Project settings</p><h2 id="edit-project-title">Edit project</h2><p className="modal-description">Shape the project brief as the work evolves.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => navigate('/projects')}>×</button></div>
          <form className="modal-form" onSubmit={SubmitEdit}>
            <div className="field"><label htmlFor="project-title">Project title</label><input type="text" id="project-title" value={title} onChange={(e)=>setTitle(e.target.value)} required /></div>
            <div className="field"><label htmlFor="project-description">Description</label><textarea id="project-description" value={desc} onChange={(e)=>setDesc(e.target.value)} /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {msgOnSuccess && <p className="success" role="status">{msgOnSuccess}</p>}
            <div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate('/projects')}>Cancel</button><button type="submit">Save changes</button></div>
          </form>
        </section>
      </main>
    );
}