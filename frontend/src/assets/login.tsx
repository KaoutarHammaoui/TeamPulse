import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        try {
            const DataFetching = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            if (!(DataFetching).ok) {
                setError('invalid username or password')
                return
            }
            const data = await DataFetching.json()
            localStorage.setItem("token", data.token);
            navigate('/projects')
        } catch (err) {
            setError('try again later')
        }
    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} /> <br />
                <input type="" onChange={(e) => setPassword(e.target.value)} value={password} /> <br />
                <input type="text" onChange={(e) => setError(e.target.value)} value={error} hidden />
                <button type="submit" >login</button>
            </form>
        </div>
    )
}