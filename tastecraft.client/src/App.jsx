import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { CartProvider } from "./CartContext";

import CreateCategoryPage from "./pages/CreateCategoryPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import CategoriesDropdown from "./components/CategoriesDropdown";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateProductPage from "./pages/CreateProductPage";
import SplashScreen from "./components/SplashScreen";
import EditProductPage from "./pages/EditProductPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import CartDropdown from "./components/CartDropdown";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
function App() {
    const [user, setUser] = useState({
        isAuthenticated: false,
        email: null,
        roles: [],
    });

    const navigate = useNavigate();
    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/api/auth/me");
                setUser(res.data);
            } catch {
                setUser({ isAuthenticated: false, email: null, roles: [] });
            } finally {
                setUserLoaded(true);
            }
        }

        loadUser();
    }, []);

    async function handleLogout() {
        try {
            await axios.post("/api/auth/logout");
        } catch {
        } finally {
            setUser({ isAuthenticated: false, email: null, roles: [] });
            navigate("/");
        }
    }

    if (!userLoaded) {
        return <SplashScreen />;
    }

    const isAdmin =
        user.isAuthenticated && user.roles && user.roles.includes("Admin");

    const cartKey = user.isAuthenticated && user.email
        ? user.email.toLowerCase()
        : null;

    return (
        <CartProvider cartKey={cartKey}>
            <div className="d-flex flex-column min-vh-100">
                {/* NAVBAR */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand me-2" to="/">
                            TasteCraft
                        </Link>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainNavbar"
                            aria-controls="mainNavbar"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="mainNavbar">
                            <div className="d-flex align-items-center w-100 mt-2 mt-lg-0 justify-content-between">
                                {/* Ляво */}
                                <div className="d-flex align-items-center gap-2">
                                    <CategoriesDropdown isAdmin={isAdmin} />
                                </div>

                                {/* Дясно */}
                                <div className="d-flex align-items-center gap-2">
                                    {/* Количка само за логнат */}
                                    {user.isAuthenticated && <CartDropdown />}

                                    {isAdmin && (
                                        <Link
                                            to="/admin/orders"
                                            className="btn btn-outline-light btn-sm me-2"
                                        >
                                            🧾 Поръчки
                                        </Link>
                                    )}


                                    {!user.isAuthenticated ? (
                                        <>
                                            <Link
                                                className="btn btn-outline-light btn-sm"
                                                to="/login"
                                            >
                                                Вход
                                            </Link>

                                            <Link
                                                className="btn btn-warning btn-sm"
                                                to="/register"
                                            >
                                                Регистрация
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-outline-light btn-sm dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        Здравей, {user.email}
                                                    </button>

                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                        <li>
                                                            <Link className="dropdown-item" to="/orders">
                                                                📦 Моите поръчки
                                                            </Link>
                                                        </li>

                                                        {isAdmin && (
                                                            <li>
                                                                <Link className="dropdown-item" to="/admin/orders">
                                                                    🧾 Админ поръчки
                                                                </Link>
                                                            </li>
                                                        )}

                                                        <li><hr className="dropdown-divider" /></li>

                                                        <li>
                                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                                Изход
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>

                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <div className="container-fluid flex-grow-1 mt-3">
                    <Routes>
                        <Route
                            path="/"
                            element={<p>Добре дошли в TasteCraft!</p>}
                        />

                        <Route
                            path="/categories/:id"
                            element={<CategoryProductsPage isAdmin={isAdmin} />}
                        />

                        <Route
                            path="/categories/edit/:id"
                            element={<EditCategoryPage isAdmin={isAdmin} />}
                        />

                        <Route
                            path="/categories/create"
                            element={<CreateCategoryPage />}
                        />

                        <Route path="/login" element={<LoginPage />} />

                        <Route path="/register" element={<RegisterPage />} />

                        <Route
                            path="/products/create"
                            element={<CreateProductPage isAdmin={isAdmin} />}
                        />

                        <Route
                            path="/products/edit/:id"
                            element={<EditProductPage isAdmin={isAdmin} />}
                        />

                        <Route
                            path="/admin/orders"
                            element={<AdminOrdersPage isAdmin={isAdmin} />}
                        />

                        <Route
                            path="/checkout"
                            element={<CheckoutPage />}
                        />
                        <Route
                            path="/orders"
                            element={<MyOrdersPage />}
                        />
                        <Route
                            path="/orders/:id"
                            element={<OrderDetailsPage />}
                        />



                    </Routes>
                </div>
            </div>
        </CartProvider>
    );
}

export default App;
