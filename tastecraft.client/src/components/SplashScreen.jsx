import React from "react";

export default function SplashScreen() {
    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#181818",
                color: "white",
            }}
        >
            {/* Лого (сложете ваше изображение) */}
            <img
                src="/logo.png"
                alt="TasteCraft Logo"
                style={{
                    width: "260px",
                    marginBottom: "30px",
                    animation: "pulse 1.5s infinite",
                    marginBottom: "20px",
                    borderRadius: "16px",
                    objectFit: "cover",
                }}
            />

            {/* Bootstrap spinner */}
            <div className="spinner-border text-light" role="status"></div>

            <p className="mt-3" style={{ opacity: 0.8 }}>
                Зареждане...
            </p>
        </div>
    );
}
