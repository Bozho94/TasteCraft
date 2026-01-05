import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditCategoryPage({ isAdmin }) {
    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCategory() {
            try {
                const res = await axios.get(`/api/categories/${id}`);
                setName(res.data.name);
                setDescription(res.data.description);
            } catch (err) {
                console.error(err);
                setError("Категорията не може да бъде заредена.");
            } finally {
                setLoading(false);
            }
        }

        loadCategory();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Моля, въведете име на категория.");
            return;
        }

        try {
            setError(null);

            await axios.put(`/api/categories/${id}`, {
                name: name,
                description: description
            });

            // пълен reload, за да се обнови и dropdown менюто
            window.location.href = `/categories/${id}`;
        } catch (err) {
            console.error(err);
            setError("Грешка при записа на категорията.");
        }
    }

    if (!isAdmin) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Нямате права да редактирате категории.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Зареждане на категорията...</p>
            </div>
        );
    }

    if (error && !name) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Редакция на категория</h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Име на категория</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Въведете новото име..."
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

                <button type="submit" className="btn btn-primary w-100">
                    Запази промените
                </button>
            </form>
        </div>
    );
}
