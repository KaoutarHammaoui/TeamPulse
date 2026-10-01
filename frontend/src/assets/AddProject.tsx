import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddProject() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [error,setError]= useState('')

    const AddProjectInfo = async (e) => {
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
    <div>
          <p>Add a new Project</p>
          <button onClick={()=>{navigate('/projects')}}>Go Back</button>
      <form action="" onSubmit={AddProjectInfo}>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        /> <br />
        
        <textarea
          name="desc"
          id="desc"
          placeholder="description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <br />
        <button type="submit">Add</button>
          </form>
          
          {error && <p>{error}</p>}
    </div>
  );
}
