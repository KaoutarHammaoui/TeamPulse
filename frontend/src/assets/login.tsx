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
        <main className="login-page">
            <section className="login-intro">
                <span className="login-mark">TM</span>
                <p className="eyebrow">Team momentum</p>
                <h1>Make good work feel effortless.</h1>
                <p className="subtitle">A calm command centre for projects, tasks, and the people moving everything forward.</p>
            </section>
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <p className="eyebrow">Welcome back</p>
                    <h2>Sign in to your workspace</h2>
                </div>
                <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input id="email" type="email" autoComplete="email" placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit">Enter workspace <span aria-hidden="true">-&gt;</span></button>
            </form>
        </main>
    )
}