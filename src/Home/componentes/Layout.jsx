import React, { useState, useRef, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import PerfilModal from "./perfil";
import { useLoader } from "./LoaderContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Outlet } from "react-router-dom";
import { auth, db } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import "./Layout.css";

const Layout = () => {
    const navigate = useNavigate();
    const [showPerfil, setShowPerfil] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { loading } = useLoader();
    const toastBC = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const userDocRef = doc(db, "usuarios", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUserData(userDocSnap.data());
                    } else {
                        console.log("No user data found in Firestore.");
                        setUserData({ email: user.email, nombre: "Usuario" });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData({ email: user.email, nombre: "Usuario" });
                }
            } else {
                setCurrentUser(null);
                setUserData(null);
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toastBC.current.show({
                severity: "success",
                summary: "Sesión cerrada",
                detail: "Has cerrado sesión exitosamente.",
                life: 3000,
            });
            navigate("/login");
        } catch (error) {
            toastBC.current.show({
                severity: "error",
                summary: "Error al cerrar sesión",
                detail: error.message,
                life: 3000,
            });
        }
    };

    const confirmExit = () => {
        toastBC.current.clear();
        toastBC.current.show({
            severity: "warn",
            summary: "¿Estás seguro que quieres salir?",
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="flex align-items-center justify-content-center gap-2" style={{ marginBottom: "0.7rem" }}>
                        <Avatar image={userData?.profilePic || "/images/avatar/amyelsner.png"} shape="circle" />
                        <span className="font-bold text-900" style={{ fontWeight: 900, lineHeight: 'normal' }}>{userData?.nombre || currentUser?.email}</span>
                    </div>
                    <div className="font-medium text-lg my-3 text-900" style={{ textAlign: "center" }}>{props.message.summary}</div>
                    <Button className="p-button-sm" label="Sí" severity="danger" onClick={handleLogout} />
                </div>
            ),
            position: "center"
        });
    };

    const items = [
        { label: "Inicio", icon: "pi pi-home", command: () => navigate("/dashboard") },
        { label: "Evaluación", icon: "pi pi-pencil", command: () => navigate("/test") },
        { label: "Notas", icon: "pi pi-book", command: () => navigate("/notas") },
        { label: "Resultados", icon: "pi pi-chart-bar", command: () => navigate("/resultados") },
        { label: "Explorador", icon: "pi pi-compass", command: () => navigate("/explorador") },
        { label: "Perfil", icon: "pi pi-user", command: () => setShowPerfil(true) },
    ];

    return (
        <>
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
                            icon={<FaSignOutAlt color="red" />}
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
                <Outlet />
            </div>

            <PerfilModal visible={showPerfil} onHide={() => setShowPerfil(false)} userData={userData || { email: currentUser?.email, nombre: "Usuario" }} />

            {loading && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <ProgressSpinner />
                </div>
            )}

            <Toast ref={toastBC} position="center" onRemove={() => toastBC.current.clear()} />
        </>
    );
};

export default Layout;