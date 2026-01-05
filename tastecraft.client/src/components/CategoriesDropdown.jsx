import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CategoriesDropdown({ isAdmin }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadCategories() {
            const res = await axios.get("/api/categories");
            setCategories(res.data);
        }

        loadCategories();
    }, []);

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Наистина ли искате да изтриете тази категория?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/categories/${id}`);

            // махаме я от списъка в dropdown-а
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Грешка при изтриване на категория.");
        }
    }

    return (
        <div className="dropdown ms-3">
            <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Категории
            </button>

            <ul className="dropdown-menu">
                {categories.map((c) => (
                    <li
                        key={c.id}
                        className="d-flex justify-content-between align-items-center px-2"
                    >
                        <Link
                            to={`/categories/${c.id}`}
                            className="dropdown-item flex-grow-1"
                        >
                            {c.name}
                        </Link>

                        {isAdmin && (

                            <>
                                <Link
                                    to={`/categories/edit/${c.id}`}
                                    className="btn btn-sm btn-outline-secondary ms-2"
                                >
                                    ✏️
                                </Link>

                                <button
                                    className="btn btn-sm btn-danger ms-2"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    🗑
                                </button>
                            </>
                        )}
                    </li>
                ))}

                {isAdmin && (
                    <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <Link
                                to="/categories/create"
                                className="dropdown-item"
                            >
                                ➕ Добави категория
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
