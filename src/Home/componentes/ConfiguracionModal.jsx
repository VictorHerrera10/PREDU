import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const ConfiguracionModal = ({ visible, onHide, onLogout }) => {
    return (
        <Dialog header="⚙️ Configuración" visible={visible} style={{ width: '25vw' }} onHide={onHide} modal>
            <Button label="Cambiar contraseña" icon="pi pi-lock" className="p-button-text p-mb-2" />
            <Button label="Cerrar sesión" icon="pi pi-sign-out" className="p-button-danger p-mt-2" onClick={onLogout} />
        </Dialog>
    );
};

export default ConfiguracionModal;
