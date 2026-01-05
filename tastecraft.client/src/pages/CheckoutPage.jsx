import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();

    const [fullName, setFullName] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (items.length === 0) {
            setError("Количката е празна.");
            return;
        }

        if (!fullName.trim() || !deliveryAddress.trim() || !phoneNumber.trim()) {
            setError("Моля, попълни име, адрес и телефон.");
            return;
        }

        const dto = {
            fullName,
            deliveryAddress,
            phoneNumber,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            }))
        };

        setLoading(true);
        try {
            const res = await axios.post("/api/orders", dto); 
            const orderId = res.data;

            clearCart();
            navigate(`/orders/${orderId}`);
        } catch (err) {
            console.error(err);
            setError("Грешка при създаване на поръчката.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "700px" }}>
            <h2 className="mb-3">Поръчка</h2>

            {items.length === 0 ? (
                <div className="alert alert-warning">Количката е празна.</div>
            ) : (
                <>
                    <div className="card p-3 mb-3">
                        <div className="fw-bold mb-2">Продукти</div>
                        {items.map(i => (
                            <div key={i.productId} className="d-flex justify-content-between">
                                <div>{i.name} — {i.quantity} бр</div>
                                <div>{(i.pricePerUnit * i.quantity).toFixed(2)} €</div>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Общо:</span>
                            <span>{total.toFixed(2)} €</span>
                        </div>
                    </div>

                    <form className="card p-3" onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label">Име и фамилия</label>
                            <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Адрес за доставка</label>
                            <input className="form-control" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Телефон</label>
                            <input className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>

                        <button className="btn btn-success" disabled={loading}>
                            {loading ? "Изпращане..." : "Потвърди поръчката"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
