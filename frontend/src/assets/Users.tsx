import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type User = {
    id: number
    username:string
}

export function GetUsers() {
    const [data, setData] = useState <User[]>([])
    const [error, setError] = useState('')
    const navigate= useNavigate()
    useEffect(() => {
        const GetThem = async () => {
            const res = await fetch('http://localhost:8080/Users', {
                method:"GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) {
                setError('cannot load users')
                return
            }
            const body = await res.json()
            setData(body)
        }
        GetThem()
    },[])

    return (
        <div>
            <table border={1}>
                
                {data.map((us) => (
                        <tr key={us.id}>
                            <td > {us.username} </td>
                            <td onClick={()=>{navigate(`/UpdateRole/${us.id}`)}} >Update Role</td>
                        </tr>
                    ))}
                
            </table>
            {error && <p>{ error}</p> }

            all users
        </div>
    )
}