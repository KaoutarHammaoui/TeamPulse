import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddProject() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [error,setError]= useState('')

    const AddProjectInfo = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await fetch("http://localhost:8080/CreateProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
            body: JSON.stringify({
                title: title,
                content:desc
          }),
        });
        if (!res.ok){
            setError('cannot add project now')
            return
        }
        navigate('/projects')
  };

  return (
    <main className="modal-page" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
      <section className="modal-card">
        <div className="modal-heading"><div><p className="eyebrow">New workspace item</p><h2 id="add-project-title">Create a project</h2><p className="modal-description">Give your team a clear place to collect the work.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => navigate('/projects')}>×</button></div>
        <form className="modal-form" onSubmit={AddProjectInfo}>
          <div className="field"><label htmlFor="title">Project title</label><input type="text" name="title" id="title" placeholder="e.g. Website refresh" onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="field"><label htmlFor="desc">Description</label><textarea name="desc" id="desc" placeholder="What is this project about?" onChange={(e) => setDesc(e.target.value)} /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button-quiet" type="button" onClick={() => navigate('/projects')}>Cancel</button><button type="submit">Create project</button></div>
        </form>
      </section>
    </main>
  );
}
