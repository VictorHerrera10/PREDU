// Estilos globales de PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Puedes cambiar a otro tema si deseas
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Rutas públicas
import Login from "./Home/login";
import Register from "./Home/register";

// Rutas protegidas
import AppRoutes from "./routes/AppRoutes";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Redirección por defecto al dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>

            {/* Rutas internas con Layout y Menubar */}
            <AppRoutes />
        </Router>
    );
};

export default App;
