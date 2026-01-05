import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const STATUS_BG = {
    Pending: "В обработка",
    Shipped: "Изпратена",
    Cancelled: "Отказана",
};

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await axios.get(`/api/orders/${id}`); 
                setOrder(res.data);
            } catch {
                setError("Поръчката не може да бъде заредена.");
            }
        }
        load();
    }, [id]);

    if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
    if (!order) return <p className="container mt-4">Зареждане...</p>;

    return (
        <div className="container mt-4" style={{ maxWidth: "800px" }}>
            <h2>Поръчка № {order.orderNumber}</h2>
            <div className="small text-muted mb-3">
                {order.orderDate} • {STATUS_BG[order.status] ?? order.status}
            </div>

            <div className="card p-3 mb-3">
                <div><b>Име:</b> {order.fullName}</div>
                <div><b>Телефон:</b> {order.phoneNumber}</div>
                <div><b>Адрес:</b> {order.deliveryAddress}</div>
                <div className="mt-2"><b>Общо:</b> {order.totalPrice.toFixed(2)} €</div>
            </div>

            <div className="fw-bold mb-2">Продукти</div>
            <ul className="list-group">
                {order.items.map((i, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                        <span>{i.productName} — {i.quantity} бр × {i.unitPrice.toFixed(2)} €</span>
                        <span>{i.lineTotal.toFixed(2)} €</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
