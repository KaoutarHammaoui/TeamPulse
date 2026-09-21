import { useState } from "react";
// import { useNavigate } from 'react-router-dom';

export function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        console.log(email, password)

    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} /> <br />
                <input type="text" onChange={(e) => setPassword(e.target.value)} value={password} /> <br />
                <input type="text" onChange={(e) => setError(e.target.value)} value={error} hidden />
                <button type="submit" >login</button>
            </form>
        </div>

    )
}