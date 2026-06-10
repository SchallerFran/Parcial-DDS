import Navbar from "./components/Navbar"
import AppRouter from "./routes/AppRouter"
import { useAuth } from "./context/AuthContext"

export default function App() {
  const { estaAutenticado } = useAuth()

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {estaAutenticado && <Navbar />}
      <main style={{ flex: 1 }}>
        <AppRouter />
      </main>
    </div>
  )
}