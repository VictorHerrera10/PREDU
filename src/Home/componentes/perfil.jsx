import React from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const PerfilModal = ({ visible, onHide, userData }) => {
    return (
        <Dialog header="👤 Mi Perfil" visible={visible} style={{ width: '30vw' }} onHide={onHide} modal>
            <p><strong>Nombre:</strong> {userData.nombre}</p>
            <p><strong>Correo:</strong> {userData.email}</p>
            <p><strong>Perfil RIASEC:</strong> {userData.riasec || "No disponible"}</p>
            <p><strong>Carreras guardadas:</strong></p>
            <ul>
                {userData.favoritas?.length > 0 ? (
                    userData.favoritas.map((carrera, idx) => (
                        <li key={idx}><Tag value={carrera} severity="info" /></li>
                    ))
                ) : <p>No hay favoritas aún.</p>}
            </ul>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
        </Dialog>
    );
};

export default PerfilModal;
