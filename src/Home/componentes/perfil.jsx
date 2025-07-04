import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const PerfilModal = ({ visible, onHide, userData }) => {
    const navigate = useNavigate(); // Usamos navigate para redirigir

    const handleConfigClick = () => {
        navigate("/configuracion"); // Redirige a la vista de configuración
    };

    return (
        <Dialog header="👤 Mi Perfil" visible={visible} style={{ width: '30vw' }} onHide={onHide} modal>
            <p><strong>Nombre:</strong> {userData.nombre}</p>
            <p><strong>Correo:</strong> {userData.email}</p>

            <Button label="Configuración" icon="pi pi-cog" onClick={handleConfigClick} />
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
        </Dialog>
    );
};

export default PerfilModal;
