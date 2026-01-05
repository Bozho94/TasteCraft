import { useEffect, useState } from "react";
import axios from "axios";

const STATUSES = ["Pending", "Shipped", "Cancelled"];

const STATUS_BG = {
    Pending: "В обработка",
    Shipped: "Изпратена",
    Cancelled: "Отказана",
};

export default function AdminOrdersPage({ isAdmin }) {
    const [status, setStatus] = useState("Pending");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await axios.get(`/api/orders/admin/details?status=${status}`);
            setOrders(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAdmin) load();
    }, [status, isAdmin]);

    async function changeStatus(orderId, newStatus) {
        await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
        load();
    }

    if (!isAdmin) return <p>Нямаш права.</p>;
    if (loading) return <p>Зареждане...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Поръчки (детайли)</h2>

            <div className="btn-group mb-3">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        className={`btn btn-sm ${status === s ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setStatus(s)}
                    >
                        {STATUS_BG[s] ?? s}
                    </button>
                ))}
            </div>

            {orders.length === 0 ? (
                <p>Няма поръчки със статус {STATUS_BG[status] ?? status}.</p>
            ) : (
                orders.map((o) => (
                    <div key={o.id} className="card mb-3 p-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="fw-bold">№ {o.orderNumber} (ID: {o.id})</div>
                                <div className="small text-muted">
                                    {o.orderDate} • {STATUS_BG[o.status] ?? o.status} • {o.totalPrice.toFixed(2)} €
                                </div>

                                <hr />

                                <div><b>Име:</b> {o.fullName}</div>
                                <div><b>Телефон:</b> {o.phoneNumber}</div>
                                <div><b>Адрес:</b> {o.deliveryAddress}</div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                {o.status !== "Shipped" && (
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => changeStatus(o.id, "Shipped")}
                                    >
                                        Изпрати
                                    </button>
                                )}
                                {o.status !== "Cancelled" && (
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => changeStatus(o.id, "Cancelled")}
                                    >
                                        Откажи
                                    </button>
                                )}
                            </div>
                        </div>

                        <hr />

                        <div className="fw-semibold mb-2">Продукти:</div>
                        <ul className="list-group">
                            {o.items.map((i, idx) => (
                                <li key={idx} className="list-group-item d-flex justify-content-between">
                                    <span>{i.productName} — {i.quantity} бр × {i.unitPrice.toFixed(2)} €</span>
                                    <span>{i.lineTotal.toFixed(2)} €</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}
