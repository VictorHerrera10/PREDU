import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { auth, db } from "../../firebase";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function ConfiguracionPerfilAdmin() {
    const toast = useRef(null);
    const [perfil, setPerfil] = useState({
        nombre: '',
        email: '',
        profilePic: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const docRef = doc(db, 'usuarios', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPerfil({
                            nombre: data.nombre || '',
                            email: user.email,
                            profilePic: data.profilePic || ''
                        });
                    }
                } catch (error) {
                    console.error('Error al cargar perfil:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo cargar el perfil.',
                        life: 3000
                    });
                }
            }
        };
        cargarDatos();
    }, []);

    const guardarCambios = async () => {
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'usuarios', user.uid);
            await updateDoc(docRef, {
                nombre: perfil.nombre,
                profilePic: perfil.profilePic
            });
            toast.current.show({
                severity: 'success',
                summary: 'Perfil actualizado',
                detail: 'Los cambios se han guardado correctamente.',
                life: 3000
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo guardar el perfil.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast} />
            <Card title="Configuración de Perfil" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="flex flex-column align-items-center mb-4">
                    <Avatar image={perfil.profilePic || '/images/avatar/amyelsner.png'} shape="circle" size="xlarge" />
                    <InputText
                        placeholder="URL de imagen"
                        className="mt-3 w-full"
                        value={perfil.profilePic}
                        onChange={(e) => setPerfil({ ...perfil, profilePic: e.target.value })}
                    />
                </div>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="email">Correo</label>
                        <InputText id="email" value={perfil.email} disabled />
                    </div>
                    <div className="field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={perfil.nombre}
                            onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button label="Guardar Cambios" icon="pi pi-save" onClick={guardarCambios} loading={loading} />
                </div>
            </Card>
        </div>
    );
}
