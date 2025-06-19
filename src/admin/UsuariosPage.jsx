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

// Datos simulados
const mockUsuarios = [
    { _id: '1', nombre: 'Ana Salazar', correo: 'ana@predu.pe', rol: 'admin' },
    { _id: '2', nombre: 'Carlos Ñahui', correo: 'carlos@predu.pe', rol: 'alumno' },
];

// Opciones de rol
const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Alumno', value: 'alumno' },
    { label: 'Psicólogo', value: 'psicologo' },
];

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [form, setForm] = useState({ nombre: '', correo: '', rol: '' });

    useEffect(() => {
        // Simular carga inicial
        setTimeout(() => {
            setUsuarios(mockUsuarios);
            setLoading(false);
        }, 1000);
    }, []);

    const abrirCrear = () => {
        setForm({ nombre: '', correo: '', rol: '' });
        setUsuarioSeleccionado(null);
        setVisible(true);
    };

    const abrirEditar = (usuario) => {
        setForm({ ...usuario });
        setUsuarioSeleccionado(usuario);
        setVisible(true);
    };

    const eliminarUsuario = (usuario) => {
        setGlobalLoading(true);
        setTimeout(() => {
            setUsuarios((prev) => prev.filter((u) => u._id !== usuario._id));
            setGlobalLoading(false);
        }, 800);
    };

    const guardarUsuario = () => {
        setGlobalLoading(true);
        setTimeout(() => {
            if (usuarioSeleccionado) {
                setUsuarios((prev) =>
                    prev.map((u) => (u._id === usuarioSeleccionado._id ? { ...form, _id: u._id } : u))
                );
            } else {
                setUsuarios((prev) => [...prev, { ...form, _id: String(Date.now()) }]);
            }
            setVisible(false);
            setGlobalLoading(false);
        }, 800);
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
                            <Column field="correo" header="Correo" sortable />
                            <Column field="rol" header="Rol" sortable />
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
                id="correo"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
            <label htmlFor="correo">Correo</label>
          </span>

                    <span className="p-float-label">
            <Dropdown
                id="rol"
                value={form.rol}
                options={roles}
                onChange={(e) => setForm({ ...form, rol: e.value })}
                placeholder="Seleccione un rol"
            />
            <label htmlFor="rol">Rol</label>
          </span>
                </div>
            </Dialog>
        </div>
    );
}
