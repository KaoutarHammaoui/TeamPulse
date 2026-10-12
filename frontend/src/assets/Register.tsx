import { useState } from "react";
import { Link } from "react-router-dom";

export function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const message = (await response.text()).trim();
                setError(message || "We couldn't create your account. Please try again.");
                return;
            }

            setIsRegistered(true);
        } catch {
            setError("We couldn't reach the server. Check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-intro">
                <span className="login-mark">TP</span>
                <p className="eyebrow">TeamPulse</p>
                <h1>Bring your team’s good work together.</h1>
                <p className="subtitle">Create a workspace account to organize projects, keep tasks moving, and make progress visible to everyone.</p>
            </section>
            <form className="login-form" onSubmit={handleSubmit}>
                {isRegistered ? (
                    <>
                        <div>
                            <p className="eyebrow">You’re all set</p>
                            <h2>Your account is ready</h2>
                            <p className="subtitle">Sign in with your new account to enter your workspace.</p>
                        </div>
                        <Link className="register-signin" to="/login">Go to sign in <span aria-hidden="true">-&gt;</span></Link>
                    </>
                ) : (
                    <>
                        <div>
                            <p className="eyebrow">Get started</p>
                            <h2>Create your account</h2>
                        </div>
                        <div className="field">
                            <label htmlFor="register-username">Username</label>
                            <input
                                id="register-username"
                                type="text"
                                autoComplete="username"
                                placeholder="Choose a username"
                                minLength={3}
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="register-email">Email address</label>
                            <input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="register-password">Password</label>
                            <input
                                id="register-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="At least 5 characters"
                                minLength={5}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="form-error" role="alert">{error}</p>}
                        <button className="register-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create account"}
                            {!isSubmitting && <span aria-hidden="true"> -&gt;</span>}
                        </button>
                        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                    </>
                )}
            </form>
        </main>
    );
}
