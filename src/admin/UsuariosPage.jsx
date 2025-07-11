import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Ripple } from 'primereact/ripple';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';

const roles = [
    { label: 'Usuario', value: 'user' },
    { label: 'Admin', value: 'admin' },
];

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [form, setForm] = useState({ nombre: '', email: '', role: '', password: '' });

    const fetchUsers = async () => {
        setLoading(true);
        const usersCollectionRef = collection(db, 'usuarios');
        const data = await getDocs(usersCollectionRef);
        setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const abrirCrear = () => {
        setForm({ nombre: '', email: '', role: 'user', password: '' });
        setUsuarioSeleccionado(null);
        setVisible(true);
    };

    const abrirEditar = (usuario) => {
        setForm({ nombre: usuario.nombre, email: usuario.email, role: usuario.role, password: '' });
        setUsuarioSeleccionado(usuario);
        setVisible(true);
    };

    const eliminarUsuario = async (usuario) => {
        setGlobalLoading(true);
        try {
            await deleteDoc(doc(db, 'usuarios', usuario.id));
            setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        } finally {
            setGlobalLoading(false);
        }
    };

    const guardarUsuario = async () => {
        setGlobalLoading(true);
        try {
            if (usuarioSeleccionado) {
                const userDocRef = doc(db, 'usuarios', usuarioSeleccionado.id);
                await updateDoc(userDocRef, {
                    nombre: form.nombre,
                    email: form.email,
                    role: form.role,
                });
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === usuarioSeleccionado.id ? { ...u, nombre: form.nombre, email: form.email, role: form.role } : u))
                );
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
                const newUserUid = userCredential.user.uid;
                const newUserDoc = {
                    nombre: form.nombre,
                    email: form.email,
                    role: form.role,
                    uid: newUserUid,
                    creadoEn: new Date(),
                };
                const docRef = await addDoc(collection(db, 'usuarios'), newUserDoc);
                setUsuarios((prev) => [...prev, { ...newUserDoc, id: docRef.id }]);
            }
            setVisible(false);
        } catch (error) {
            console.error("Error al guardar usuario:", error);
        } finally {
            setGlobalLoading(false);
        }
    };

    const footerDialog = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" onClick={() => setVisible(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarUsuario}>
                <Ripple />
            </Button>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>

            {globalLoading && (
                <div className="flex justify-center my-4">
                    <ProgressSpinner />
                </div>
            )}

            {!globalLoading && (
                <>
                    <div className="mb-4 flex justify-between">
                        <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={abrirCrear}>
                            <Ripple />
                        </Button>
                    </div>

                    {loading ? (
                        <Skeleton width="100%" height="300px" />
                    ) : (
                        <DataTable value={usuarios} paginator rows={5} stripedRows responsiveLayout="scroll">
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="email" header="Correo" sortable />
                            <Column field="role" header="Rol" sortable />
                            <Column
                                header="Acciones"
                                body={(rowData) => (
                                    <div className="flex gap-2">
                                        <Button icon="pi pi-pencil" severity="info" rounded onClick={() => abrirEditar(rowData)} />
                                        <Button icon="pi pi-trash" severity="danger" rounded onClick={() => eliminarUsuario(rowData)} />
                                    </div>
                                )}
                            />
                        </DataTable>
                    )}
                </>
            )}

            <Dialog
                header={usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
                visible={visible}
                onHide={() => setVisible(false)}
                footer={footerDialog}
                style={{ width: '30rem' }}
                modal
            >
                <div className="flex flex-col gap-4">
                    <span className="p-float-label">
                        <InputText
                            id="nombre"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </span>

                    <span className="p-float-label">
                        <InputText
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            disabled={!!usuarioSeleccionado}
                        />
                        <label htmlFor="email">Correo</label>
                    </span>

                    {!usuarioSeleccionado && (
                        <span className="p-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <label htmlFor="password">Contraseña</label>
                        </span>
                    )}

                    <span className="p-float-label">
                        <Dropdown
                            id="role"
                            value={form.role}
                            options={roles}
                            onChange={(e) => setForm({ ...form, role: e.value })}
                            placeholder="Seleccione un rol"
                        />
                        <label htmlFor="role">Rol</label>
                    </span>
                </div>
            </Dialog>
        </div>
    );
}