// src/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from 'primereact/button'; // Importar el botón de PrimeReact
import { Dialog } from 'primereact/dialog'; // Importar el componente Dialog
import PrediccionAcademica from "../admin/componente/PrediccionAcademica";
export default function AdminLayout() {
    // Estado para controlar el modal
    const [visible, setVisible] = React.useState(false);

    // Función para abrir el modal
    const showModal = () => setVisible(true);

    // Función para cerrar el modal
    const hideModal = () => setVisible(false);

    return (
        <div className="flex h-screen">
            <aside className="w-60 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Panel Admin</h2>
                <nav className="space-y-2">
                    <Link to="/admin/usuarios">Usuarios</Link>
                    <Link to="/admin/preguntas">Preguntas</Link>
                </nav>

                {/* Botón para abrir el modal */}
                <Button label="Predecir Carrera Académica" icon="pi pi-check" onClick={showModal} className="mt-4" />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                {/* Modal de predicción académica */}
                <Dialog
                    header="Formulario de Predicción Académica"
                    visible={visible}
                    style={{ width: '50vw' }}
                    onHide={hideModal}
                >
                    <PrediccionAcademica />
                </Dialog>

                <Outlet />
            </main>
        </div>
    );
}
