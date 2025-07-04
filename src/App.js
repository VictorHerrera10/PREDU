import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoaderProvider} from "./Home/componentes/LoaderContext";

// Rutas públicas
import Login from "./Home/login";
import Register from "./Home/register";

// Rutas protegidas
import AppRoutes from "./routes/AppRoutes";

const App = () => {
    return (
        <LoaderProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <AppRoutes />
            </Router>
        </LoaderProvider>
    );
};

export default App;
