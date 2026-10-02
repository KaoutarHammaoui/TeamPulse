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
      const res = await fetch(`http://localhost:8080/GetProject/${id}`, {
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

  const SubmitEdit = async (e) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:8080/UpdateProject/${id}`, {
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
      <div>
        <form action="" onSubmit={SubmitEdit}>
          <input type="text" name="" id="" value={title} onChange={(e)=>{setTitle(e.target.value)}} /> <br />
          <textarea id="" value={desc} onChange={(e)=>{setDesc(e.target.value)}}/>
          <button type="submit">Edit</button>
        </form>

        <button
          onClick={() => {
            navigate("/projects");
          }}
        >Cancel
        </button>
        {error && <p> {error} </p>}
        {msgOnSuccess && <p>{ msgOnSuccess}</p> }
      </div>
    );
}