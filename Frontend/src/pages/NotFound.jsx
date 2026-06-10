import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Página no encontrada</p>
            <Link
                to="/entrevistas"
                style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                }}
            >
                Volver a Entrevistas
            </Link>
        </div>
    )
}
