import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";


export default function CartDropdown() {
    const { items, total, removeItem, clearCart } = useCart();
    const navigate = useNavigate();


    return (
        <div className="dropdown me-2">
            <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                🛒 Количка ({items.length})
            </button>

            <div
                className="dropdown-menu dropdown-menu-end p-3"
                style={{
                    minWidth: "260px",
                    maxWidth: "90vw",
                    maxHeight: "60vh",
                    overflowY: "auto",
                }}
            >
                {items.length === 0 ? (
                    <span className="text-muted">Количката е празна.</span>
                ) : (
                    <>
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="d-flex justify-content-between align-items-center mb-2"
                            >
                                <div>
                                    <div className="fw-semibold">
                                        {item.name}
                                    </div>
                                    <div className="small text-muted">
                                        {item.quantity} бр ×{" "}
                                        {item.pricePerUnit.toFixed(2)} €
                                    </div>
                                </div>

                                <div className="text-end">
                                    <div className="fw-semibold">
                                        {(
                                            item.quantity *
                                            item.pricePerUnit
                                        ).toFixed(2)}{" "}
                                        €
                                    </div>
                                    <button
                                        className="btn btn-sm btn-link text-danger p-0"
                                        onClick={() =>
                                            removeItem(item.productId)
                                        }
                                    >
                                        Премахни
                                    </button>
                                </div>
                            </div>
                        ))}

                        <hr className="my-2" />
                        
                        <div className="d-flex justify-content-between fw-bold mb-2">
                            <span>Общо:</span>
                            <span>{total.toFixed(2)} €</span>
                        </div>

                        <div className="d-flex flex-column gap-2">
                                <button
                                    className="btn btn-success w-100"
                                    disabled={items.length === 0}
                                    onClick={() => navigate("/checkout")}
                                >
                                    Поръчай
                                </button>


                            <button
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={clearCart}
                            >
                               Премахни всички продукти
                            </button>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}
