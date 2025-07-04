import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ConfiguracionPerfil = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const toast = useRef(null);
    const [displayReauth, setDisplayReauth] = useState(false);
    const [reauthPassword, setReauthPassword] = useState("");
    const [actionType, setActionType] = useState(null); // 'name' or 'password'

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                setEmail(user.email);
                try {
                    const userDocRef = doc(db, "usuarios", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setName(userDocSnap.data().nombre || "");
                    }
                } catch (error) {
                    toast.current.show({ severity: "error", summary: "Error", detail: "Error al cargar los datos del usuario." });
                }
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSaveName = async () => {
        if (!currentUser) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No hay usuario autenticado." });
            return;
        }
        setActionType('name');
        setDisplayReauth(true);
    };

    const handleSavePassword = async () => {
        if (!currentUser) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No hay usuario autenticado." });
            return;
        }
        if (!newPassword || !confirmNewPassword) {
            toast.current.show({ severity: "warn", summary: "Campos vacíos", detail: "Por favor, ingresa y confirma la nueva contraseña." });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Las nuevas contraseñas no coinciden." });
            return;
        }
        setActionType('password');
        setDisplayReauth(true);
    };

    const executeAction = async () => {
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, reauthPassword);
            await reauthenticateWithCredential(currentUser, credential);

            if (actionType === 'name') {
                const userDocRef = doc(db, "usuarios", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                const currentName = userDocSnap.data().nombre;

                if (name !== currentName) {
                    await updateDoc(userDocRef, { nombre: name });
                    toast.current.show({ severity: "success", summary: "Éxito", detail: "Nombre de usuario actualizado." });
                } else {
                    toast.current.show({ severity: "info", summary: "Información", detail: "El nombre no ha cambiado." });
                }
            } else if (actionType === 'password') {
                await updatePassword(currentUser, newPassword);
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Contraseña actualizada." });

                setNewPassword("");
                setConfirmNewPassword("");
            }
            setReauthPassword("");
            setDisplayReauth(false);
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: `Error: ${error.message}` });
        }
    };

    const footerReauthDialog = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayReauth(false)} className="p-button-text" />
            <Button label="Confirmar" icon="pi pi-check" onClick={executeAction} autoFocus />
        </div>
    );

    return (
        <Container>
            <Toast ref={toast} />
            <h2>Configuración de Perfil</h2>

            <div className="form-section">
                <h3>Información de Cuenta</h3>
                <div className="form-group">
                    <FloatLabel>
                        <InputText id="email" value={email} readOnly disabled />
                        <label htmlFor="email">Correo Electrónico</label>
                    </FloatLabel>
                </div>
            </div>

            <div className="form-section">
                <h3>Cambiar Nombre</h3>
                <div className="form-group">
                    <FloatLabel>
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="name">Nombre</label>
                    </FloatLabel>
                </div>
                <Button label="Guardar Nombre" icon="pi pi-save" onClick={handleSaveName} className="p-mt-3" />
            </div>

            <div className="form-section">
                <h3>Cambiar Contraseña</h3> 

                <div className="form-group">
                    <FloatLabel>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            toggleMask
                            feedback={true}
                        />
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                    </FloatLabel>
                </div>

                <div className="form-group">
                    <FloatLabel>
                        <Password
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                        />
                        <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                    </FloatLabel>
                </div>
                <Button label="Guardar Contraseña" icon="pi pi-lock" onClick={handleSavePassword} className="p-mt-3" />
            </div>

            <Dialog header="Confirmar Contraseña" visible={displayReauth} style={{ width: '30vw' }} modal footer={footerReauthDialog} onHide={() => setDisplayReauth(false)}>
                <p>Por favor, ingresa tu contraseña actual para confirmar los cambios en tu {actionType === 'name' ? 'nombre' : 'contraseña'}.</p>
                <div className="p-fluid p-mt-3">
                    <FloatLabel>
                        <Password
                            id="reauthPassword"
                            value={reauthPassword}
                            onChange={(e) => setReauthPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                        />
                        <label htmlFor="reauthPassword">Contraseña Actual</label>
                    </FloatLabel>
                </div>
            </Dialog>
        </Container>
    );
};

const Container = styled.div`
    padding: 3rem;
    max-width: 600px;
    margin: 2rem auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333333;
    }

    .form-section {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eeeeee;

        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        h3 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: #555555;
            text-align: center;
        }
    }

    .form-group {
        margin-bottom: 2rem;
        .p-inputtext, .p-password {
            width: 100%;
        }
    }

    .p-button {
        width: 100%;
        padding: 0.8rem;
        font-size: 1.1rem;
    }
`;

export default ConfiguracionPerfil;