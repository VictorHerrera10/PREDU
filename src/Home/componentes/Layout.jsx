import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Outlet, useNavigate } from "react-router-dom";
import PerfilModal from "./perfil";
import ConfiguracionModal from "./ConfiguracionModal";
import { useLoader} from "./LoaderContext";
import { ProgressSpinner } from "primereact/progressspinner";

const Layout = () => {
    const navigate = useNavigate();
    const [showPerfil, setShowPerfil] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const { loading } = useLoader(); // 🚨 Aquí usas el loading global

    const user = {
        nombre: "Estudiante Demo",
        email: "demo@predu.pe",
        riasec: "IA",
        favoritas: ["Psicología", "Diseño Gráfico"]
    };

    const items = [
        { label: "Inicio", icon: "pi pi-home", command: () => navigate("/dashboard") },
        { label: "Evaluación", icon: "pi pi-pencil", command: () => navigate("/test") },
        { label: "Notas", icon: "pi pi-book", command: () => navigate("/notas") },
        { label: "Resultados", icon: "pi pi-chart-bar", command: () => navigate("/resultados") },
        { label: "Explorador", icon: "pi pi-compass", command: () => navigate("/explorador") },
        { label: "Perfil", icon: "pi pi-user", command: () => setShowPerfil(true) },
        { label: "Configuración", icon: "pi pi-cog", command: () => setShowConfig(true) }
    ];

    return (
        <>
            <Menubar model={items} start={<img src="../../PREDU.png" alt="logo" height="40" />} />
            <div style={{ padding: "2rem" }}>
                <Outlet />
            </div>

            <PerfilModal visible={showPerfil} onHide={() => setShowPerfil(false)} userData={user} />
            <ConfiguracionModal visible={showConfig} onHide={() => setShowConfig(false)} onLogout={() => navigate("/login")} />

            {/* 🚀 Spinner visible mientras loading = true */}
            {loading && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <ProgressSpinner />
                </div>
            )}
        </>
    );
};

export default Layout;
