import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); // спира презареждането на страницата

        setError(null);
        setLoading(true);

        try {
            await axios.post("/api/auth/login", {
                email: email,
                password: password,
            });

            // УСПЕШЕН LOGIN:
            // правим пълен reload -> App пак ще извика /api/auth/me
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            setError("Невалиден email или парола.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "400px" }}>
            <h2>Вход</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Парола</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Влизане..." : "Влез"}
                </button>
            </form>
        </div>
    );
}
