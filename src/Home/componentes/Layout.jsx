import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Outlet, useNavigate } from "react-router-dom";
import PerfilModal from "./perfil";
import ConfiguracionModal from "./ConfiguracionModal";

const Layout = () => {
    const navigate = useNavigate();
    const [showPerfil, setShowPerfil] = useState(false);
    const [showConfig, setShowConfig] = useState(false);

    const user = {
        nombre: "Estudiante Demo",
        email: "demo@predu.pe",
        riasec: "IA",
        favoritas: ["Psicología", "Diseño Gráfico"]
    };

    const items = [
        {
            label: "Inicio",
            icon: "pi pi-home",
            command: () => navigate("/dashboard"),
        },
        {
            label: "Evaluación",
            icon: "pi pi-pencil",
            command: () => navigate("/test"),
        },
        {
            label: "Notas",
            icon: "pi pi-book",
            command: () => navigate("/notas"),
        },
        {
            label: "Resultados",
            icon: "pi pi-chart-bar",
            command: () => navigate("/resultados"),
        },
        {
            label: "Explorador",
            icon: "pi pi-compass",
            command: () => navigate("/explorador"),
        },
        {
            label: "Perfil",
            icon: "pi pi-user",
            command: () => setShowPerfil(true),
        },
        {
            label: "Configuración",
            icon: "pi pi-cog",
            command: () => setShowConfig(true),
        }
    ];

    return (
        <>
            <Menubar model={items} start={<img src="/logo.png" alt="logo" height="40" />} />
            <div style={{ padding: "2rem" }}>
                <Outlet />
            </div>
            <PerfilModal visible={showPerfil} onHide={() => setShowPerfil(false)} userData={user} />
            <ConfiguracionModal visible={showConfig} onHide={() => setShowConfig(false)} onLogout={() => navigate("/login")} />
        </>
    );
};

export default Layout;
