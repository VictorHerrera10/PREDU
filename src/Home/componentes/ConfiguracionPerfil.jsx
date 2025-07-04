import React, { useState } from "react";
import {InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";

const ConfiguracionPerfil = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSave = () => {
        // Aquí podrías enviar los datos a la API para actualizar el perfil
        console.log("Datos guardados:", { name, email, currentPassword, newPassword });

        // Después de guardar, redirigimos al usuario al perfil
        navigate("/perfil");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Configuración de Perfil</h2>

            <div className="p-field">
                <label htmlFor="name">Nombre</label>
                <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="p-field">
                <label htmlFor="email">Correo Electrónico</label>
                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="p-field">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <Password
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    toggleMask
                />
            </div>

            <div className="p-field">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <Password
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    toggleMask
                />
            </div>

            <Button label="Guardar" icon="pi pi-save" onClick={handleSave} />
        </div>
    );
};

export default ConfiguracionPerfil;
