import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Паролите не съвпадат.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await axios.post("/api/auth/register", {
                email,
                password,
                confirmPassword,
            });

            // УСПЕШНА РЕГИСТРАЦИЯ:
            // API-то вече логва потребителя -> правим reload и отиваме на /
            window.location.href = "/";
        } catch (err) {
            console.error(err);

            // ако backend върне текст с грешка
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Грешка при регистрация.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "400px" }}>
            <h2>Регистрация</h2>

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

                <div className="mb-3">
                    <label className="form-label">Повтори паролата</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                >
                    {loading ? "Регистрация..." : "Регистрирай се"}
                </button>
            </form>
        </div>
    );
}
