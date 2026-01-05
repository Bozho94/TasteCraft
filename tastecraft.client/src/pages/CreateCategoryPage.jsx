import { useState } from "react";
import axios from "axios";

export default function CreateCategoryPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Моля, въведете име на категория.");
            return;
        }

        try {
            setError(null);

            const res = await axios.post("/api/categories", {
                name: name,
                description: description,
            });

            const newCategoryId = res.data;

            // reload за да презареди dropdown менюто
            window.location.href = `/categories/${newCategoryId}`;
        } catch (err) {
            console.error(err);
            setError("Грешка при създаване на категория.");
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Добавяне на категория</h2>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Име на категория</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Въведете име..."
                    />

                    <label className="form-label">Описание</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Въведете описание..."
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    ➕ Създай категория
                </button>
            </form>
        </div>
    );
}
