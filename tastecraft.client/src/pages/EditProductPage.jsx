import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProductPage({ isAdmin }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
            } catch {
                setError("Продуктът не е намерен.");
            }
        }

        load();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await axios.put(`/api/products/${id}`, product);

            navigate(`/categories/${product.categoryId}`);
        } catch (err) {
            setError("Грешка при запис.");
        }
    }

    if (!isAdmin) {
        return <p>Нямате права за редакция.</p>;
    }

    if (!product) {
        return <p>Зареждане...</p>;
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2>Редакция на продукт</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Име</label>
                    <input
                        className="form-control"
                        value={product.name}
                        onChange={(e) =>
                            setProduct({ ...product, name: e.target.value })
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Описание</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={product.description}
                        onChange={(e) =>
                            setProduct({ ...product, description: e.target.value })
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Цена на брой (Евро)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={product.pricePerUnit}
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                pricePerUnit: parseFloat(e.target.value),
                            })
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product.imageUrl}
                        onChange={(e) =>
                            setProduct({ ...product, imageUrl: e.target.value })
                        }
                    />
                </div>

                <button className="btn btn-primary w-100">Запази</button>
            </form>
        </div>
    );
}
