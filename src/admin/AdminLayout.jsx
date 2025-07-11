import React, { useRef, useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // ajusta el path si es necesario

export default function AdminLayout() {
    const navigate = useNavigate();
    const toastBC = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const userDocRef = doc(db, 'usuarios', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUserData(userDocSnap.data());
                    } else {
                        setUserData({ email: user.email, nombre: "Usuario" });
                    }
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
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
                        <span className="font-bold text-900" style={{ fontWeight: 900, lineHeight: 'normal' }}>
                            {userData?.nombre || userData?.email || "Invitado"}
                        </span>
                    </div>
                    <div className="font-medium text-lg my-3 text-900" style={{ textAlign: "center" }}>
                        {props.message.summary}
                    </div>
                    <Button className="p-button-sm" label="Sí" severity="danger" onClick={handleLogout} />
                </div>
            ),
            position: "center"
        });
    };

    const itemRenderer = (item) => (
        <div className="p-menuitem-content">
            <a className="flex align-items-center p-menuitem-link">
                <span className={item.icon} />
                <span className="mx-2">{item.label}</span>
                {item.badge && <Badge className="ml-auto" value={item.badge} />}
                {item.shortcut && (
                    <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                        {item.shortcut}
                    </span>
                )}
            </a>
        </div>
    );

    const items = [
        {
            template: () => (
                <span className="inline-flex align-items-center gap-1 px-2 py-2">
                    <img src="/logo192.png" alt="Logo" width={35} height={35} />
                    <span className="font-medium text-xl font-semibold">
                        PRIME<span className="text-primary">APP</span>
                    </span>
                </span>
            )
        },
        { separator: true },
        {
            label: 'Gestión',
            items: [
                {
                    label: 'Usuarios',
                    icon: 'pi pi-users',
                    template: itemRenderer,
                    command: () => navigate('/admin/usuarios')
                },
                {
                    label: 'Test',
                    icon: 'pi pi-list',
                    template: itemRenderer,
                    command: () => navigate('/admin/test')
                },
                {
                    label: 'Notas',
                    icon: 'pi pi-book',
                    template: itemRenderer,
                    command: () => navigate('/admin/notas')
                }
            ]
        },
        {
            label: 'Validación',
            items: [
                {
                    label: 'Psicológico',
                    icon: 'pi pi-check-circle',
                    template: itemRenderer,
                    command: () => navigate('/admin/val-psicologico')
                },
                {
                    label: 'Académico',
                    icon: 'pi pi-check',
                    template: itemRenderer,
                    command: () => navigate('/admin/val-academico')
                },
                {
                    label: 'Predecir Carrera',
                    icon: 'pi pi-chart-line',
                    template: itemRenderer,
                    command: () => navigate('/admin/predecir')
                }
            ]
        },
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Configuración de perfil',
                    icon: 'pi pi-cog',
                    template: itemRenderer,
                    command: () => navigate('/admin/configuracion-perfil')
                },
                {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    template: itemRenderer,
                    command: confirmExit
                }
            ]
        },
        { separator: true },
        {
            template: (item, options) => (
                <button
                    onClick={(e) => options.onClick(e)}
                    className={classNames(
                        options.className,
                        'w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround'
                    )}
                >
                    <Avatar
                        image={userData?.profilePic || "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"}
                        className="mr-2"
                        shape="circle"
                    />
                    <div className="flex flex-column align">
                        <span className="font-bold">{userData?.nombre || "Usuario"}</span>
                        <span className="text-sm">Admin</span>
                    </div>
                </button>
            )
        }
    ];

    return (
        <div className="flex h-screen">
            <aside className="w-72 bg-white border-r-1 surface-border shadow-1">
                <Menu model={items} className="w-full border-none" />
            </aside>

            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>

            <Toast ref={toastBC} position="center" />
        </div>
    );
}
