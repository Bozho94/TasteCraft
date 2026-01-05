import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const STATUS_BG = {
    Pending: "В обработка",
    Shipped: "Изпратена",
    Cancelled: "Отказана",
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await axios.get("/api/orders/mine"); // :contentReference[oaicite:10]{index=10}
                setOrders(res.data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p className="container mt-4">Зареждане...</p>;

    return (
        <div className="container mt-4" style={{ maxWidth: "800px" }}>
            <h2 className="mb-3">Моите поръчки</h2>

            {orders.length === 0 ? (
                <p>Нямаш поръчки.</p>
            ) : (
                <div className="list-group">
                    {orders.map(o => (
                        <Link
                            key={o.id}
                            to={`/orders/${o.id}`}
                            className="list-group-item list-group-item-action"
                        >
                            <div className="d-flex justify-content-between">
                                <div className="fw-bold">№ {o.orderNumber}</div>
                                <div>{o.totalPrice.toFixed(2)} €</div>
                            </div>
                            <div className="small text-muted">
                                {o.orderDate} • {STATUS_BG[o.status] ?? o.status}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
