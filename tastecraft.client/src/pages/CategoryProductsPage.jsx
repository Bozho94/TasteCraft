import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext"

export default function CategoryProductsPage({ isAdmin } = {}) {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategorydescription] = useState("");

    useEffect(() => {
        async function load() {
            const cat = await axios.get(`/api/categories/${id}`);
            setCategoryName(cat.data.name);
            setCategorydescription(cat.data.description || "")

            const prods = await axios.get(`/api/products/byCategory/${id}`);
            setProducts(prods.data.map(p => ({
                ...p,
                quantity: 1,
            })));
            
        }
        load();
    }, [id]);

    async function handleDelete(productId) {
        if (!window.confirm("Сигурни ли сте, че искате да изтриете този продукт?")) {
            return;
        }

        try {
            await axios.delete(`/api/products/${productId}`);

            // Презареждаме списъка
            setProducts(products.filter((p) => p.id !== productId));

        } catch (err) {
            console.error(err);
            alert("Грешка при изтриване на продукта.");
        }
    }

    function increaseQty(productId) {
        setProducts(products.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    quantity: p.quantity + 1,
                };
            }

            return p;
        }));
    }

    function decreaseQty(productId) {
        setProducts(products.map(p => {
            if (p.id === productId) {
                const newQuantity = p.quantity - 1;
                return {
                    ...p,
                    quantity: newQuantity < 1 ? 1 : newQuantity,
                };
            }

            return p;
        }));
    }

    const { addItem } = useCart();

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h2 className="mb-0">{categoryName}</h2>
                        {categoryDescription && (
                        <p className="fw-bold mt-3 mb-0">
                        {categoryDescription}
                        </p>
                        )}
                </div>

                {isAdmin && (
                    <Link
                        to={`/products/create?categoryId=${id}`}
                        className="btn btn-sm btn-success"
                    >
                        ➕ Добави продукт
                    </Link>
                )}
            </div>

            {products.length === 0 ? (
                <p>Няма продукти.</p>
            ) : (
                <div className="row g-4">
                    {products.map((p) => (
                        <div key={p.id} className="col-6 col-md-4 col-lg-3">
                            <div className="card shadow-sm h-100">
                                <img
                                    src={p.imageUrl}
                                    className="card-img-top"
                                    alt={p.name}
                                    style={{
                                        height: "220px",
                                        objectFit: "contain",
                                        backgroundColor: "#f8f8f8",
                                        borderRadius: "4px",
                                    }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title" style={{ fontSize: "1rem" }}>
                                        {p.name}</h5>

                                    {p.description && (
                                        <p>{p.description}</p>
                                    )}

                                    <p className="card-text text-muted mb-2">
                                        {p.pricePerUnit.toFixed(2)} Евро/бр
                                    </p>

                                    <div className="d-flex align-items-center mb-3">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => decreaseQty(p.id)}
                                        >
                                            -
                                        </button>

                                        <span className="mx-3 fs-5">
                                            {p.quantity}
                                        </span>

                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => increaseQty(p.id)}
                                        >
                                            +
                                        </button>
                                    </div>


                                    <button
                                        className="btn btn-primary mt-auto"
                                        onClick={() => {
                                            addItem(p, p.quantity); 
                                        }}
                                    >
                                        Купи
                                    </button>


                                    {isAdmin && (
                                        <div className="d-flex gap-2 mt-2">

                                            <Link
                                                to={`/products/edit/${p.id}`}
                                                className="btn btn-warning btn-sm w-50"
                                            >
                                                Редактирай
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm w-50"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                Изтрий
                                            </button>

                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
