import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children, cartKey }) {
    const normalizedKey = cartKey ? String(cartKey).toLowerCase() : null;
    const storageKey = normalizedKey ? `tastecraft_cart_${normalizedKey}` : null;

    const [items, setItems] = useState([]);

    const skipNextPersistRef = useRef(false);

    // 1) Load cart when storageKey changes (login/logout or different user)
    useEffect(() => {
        skipNextPersistRef.current = true; // ✅ много важно: да не запишем празното items веднага

        if (!storageKey) {
            setItems([]);
            return;
        }

        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            setItems([]);
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            setItems(Array.isArray(parsed) ? parsed : []);
        } catch {
            setItems([]);
        }
    }, [storageKey]);

    // 2) Persist cart on items change (but skip first run after storageKey change)
    useEffect(() => {
        if (!storageKey) return;

        if (skipNextPersistRef.current) {
            skipNextPersistRef.current = false; // ✅ пропускаме само първия път
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    function addItem(product, quantity) {
        const qty = Number(quantity) || 1;

        setItems((prev) => {
            const existing = prev.find((i) => i.productId === product.id);

            if (existing) {
                return prev.map((i) =>
                    i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
                );
            }

            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    pricePerUnit: product.pricePerUnit,
                    quantity: qty,
                },
            ];
        });
    }

    function removeItem(productId) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }

    function clearCart() {
        setItems([]);
        if (storageKey) localStorage.removeItem(storageKey);
    }

    const total = useMemo(() => {
        return items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider value={{ items, total, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
