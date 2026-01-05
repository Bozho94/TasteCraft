import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function CreateProductPage({ isAdmin } = {}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Взимаме categoryId от URL-а: /products/create?categoryId=3
    const categoryIdFromQuery = searchParams.get("categoryId") || "";

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!name || !description || !pricePerUnit || !imageUrl) {
            setError("Моля, попълни всички полета.");
            return;
        }

        const price = parseFloat(pricePerUnit);
        const catId = parseInt(categoryIdFromQuery, 10);

        if (isNaN(price) || price <= 0) {
            setError("Цената трябва да е положително число.");
            return;
        }

        if (isNaN(catId) || catId <= 0) {
            setError(
                "Липсва валидна категория. Отвори тази страница от бутона 'Добави продукт' в категорията."
            );
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/products", {
                name: name,
                description: description,
                pricePerUnit: price,
                imageUrl: imageUrl,
                categoryId: catId, // подаваме го към DTO-то, но не го показваме във формата
            });

            // Връщаме се към продуктите за тази категория
            navigate(`/categories/${catId}`);
        } catch (err) {
            console.error(err);

            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Възникна грешка при създаване на продукта.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Ако не е админ – не показваме формата
    if (isAdmin === false) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Нямаш права да създаваш продукти.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mb-4">Създаване на продукт</h2>

                    <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Име</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Описание</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Цена на брой (Евро)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={pricePerUnit}
                                onChange={(e) =>
                                    setPricePerUnit(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Image URL</label>
                            <input
                                type="text"
                                className="form-control"
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading ? "Записване..." : "Създай продукт"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
