import React, { useState, useRef } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Importamos el icono de 'sign out'
import PerfilModal from "./perfil";
import { useLoader } from "./LoaderContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Outlet } from "react-router-dom"; // Asegúrate de importar Outlet
import "./Layout.css"; // create this file for custom styles

const Layout = () => {
    const navigate = useNavigate();
    const [showPerfil, setShowPerfil] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { loading } = useLoader();
    const toastBC = useRef(null); // Referencia para el Toast

    const user = {
        nombre: "Estudiante Demo",
        email: "AGGGG@predu.pe",
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
    ];

    // Función para mostrar el Toast de confirmación
    const confirmExit = () => {
        toastBC.current.clear();
        toastBC.current.show({
            severity: "warn",
            summary: "¿Estás seguro que quieres salir?",
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="flex align-items-center justify-content-center gap-2" style={{ marginBottom: "0.7rem" }}>
                        <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
                        <span className="font-bold text-900" style={{ fontWeight: 900, lineHeight: 'normal' }}>Amy Elsner</span>
                    </div>
                    <div className="font-medium text-lg my-3 text-900" style={{ textAlign: "center" }}>{props.message.summary}</div>
                    <Button className="p-button-sm" label="Sí" severity="danger" onClick={() => {
                        navigate("/login");
                        toastBC.current.clear();
                    }} />
                </div>
            ),
            position: "center"  // Esto centra el Toast en la pantalla (vertical y horizontalmente)
        });
    };

    return (
        <>
            {/* Menubar con el logo a la izquierda y las opciones de menú a la derecha */}
            <Menubar
                model={[]}
                start={<img src="/PREDU.png" alt="logo" height="50" />}
                end={
                    <div className="menu-end">
                        <div className="menu-buttons">
                            {items.map((item) => (
                                <Button
                                    key={item.label}
                                    label={item.label}
                                    icon={item.icon}
                                    className="p-button-text"
                                    onClick={item.command}
                                    style={{ fontWeight: 500 }}
                                />
                            ))}
                        </div>
                        <Button
                            className="menu-toggle"
                            icon={<FaBars />}
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        />
                        <Button
                            className="menu-signout p-button-rounded p-button-text"
                            icon={<FaSignOutAlt color="red" />} // Red icon
                            onClick={confirmExit}
                            style={{ marginLeft: "10px" }}
                        />
                        {mobileMenuOpen && (
                            <div className="mobile-menu">
                                {items.map((item) => (
                                    <Button
                                        key={item.label}
                                        label={item.label}
                                        icon={item.icon}
                                        className="p-button-text"
                                        onClick={() => {
                                            item.command();
                                            setMobileMenuOpen(false);
                                        }}
                                        style={{ width: "100%", textAlign: "left" }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                }
            />

            <div style={{ padding: "0.1rem 0.5rem", marginTop: "0" }}>
                <Outlet /> {/* Aquí se renderiza el contenido de las rutas hijas */}
            </div>

            <PerfilModal visible={showPerfil} onHide={() => setShowPerfil(false)} userData={user} />

            {loading && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <ProgressSpinner />
                </div>
            )}

            {/* Toast para confirmar la salida */}
            <Toast ref={toastBC} position="center" onRemove={() => toastBC.current.clear()} />
        </>
    );
};

export default Layout;
