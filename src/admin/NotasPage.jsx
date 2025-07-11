import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

export default function NotasPage() {
    const toast = useRef(null);
    const emptyEstudiante = {
        id: null,
        nombre: '',
        arte_y_cultura: '',
        castellano_como_segunda_lengua: '',
        ciencia_y_tecnologia: '',
        ciencias_sociales: '',
        comunicacion: '',
        desarrollo_personal: '',
        educacion_fisica: '',
        educacion_para_el_trabajo: '',
        educacion_religiosa: '',
        ingles: '',
        matematica: ''
    };

    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteDialog, setEstudianteDialog] = useState(false);
    const [deleteEstudianteDialog, setDeleteEstudianteDialog] = useState(false);
    const [estudiante, setEstudiante] = useState(emptyEstudiante);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const openNew = () => {
        setEstudiante(emptyEstudiante);
        setSubmitted(false);
        setEstudianteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstudianteDialog(false);
    };

    const hideDeleteEstudianteDialog = () => {
        setDeleteEstudianteDialog(false);
    };

    const saveEstudiante = () => {
        setSubmitted(true);
        if (estudiante.nombre.trim()) {
            let _estudiantes = [...estudiantes];
            let _estudiante = { ...estudiante };
            if (estudiante.id) {
                const index = _estudiantes.findIndex((e) => e.id === estudiante.id);
                _estudiantes[index] = _estudiante;
                toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Notas actualizadas', life: 3000 });
            } else {
                _estudiante.id = createId();
                _estudiantes.push(_estudiante);
                toast.current.show({ severity: 'success', summary: 'Agregado', detail: 'Estudiante agregado', life: 3000 });
            }

            setEstudiantes(_estudiantes);
            setEstudianteDialog(false);
            setEstudiante(emptyEstudiante);
        }
    };

    const editEstudiante = (estudiante) => {
        setEstudiante({ ...estudiante });
        setEstudianteDialog(true);
    };

    const confirmDeleteEstudiante = (estudiante) => {
        setEstudiante(estudiante);
        setDeleteEstudianteDialog(true);
    };

    const deleteEstudiante = () => {
        let _estudiantes = estudiantes.filter((val) => val.id !== estudiante.id);
        setEstudiantes(_estudiantes);
        setDeleteEstudianteDialog(false);
        setEstudiante(emptyEstudiante);
        toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Estudiante eliminado', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _estudiante = { ...estudiante };
        _estudiante[name] = val;
        setEstudiante(_estudiante);
    };

    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const estudianteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveEstudiante} />
        </>
    );

    const deleteEstudianteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEstudianteDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteEstudiante} />
        </>
    );

    const leftToolbarTemplate = () => (
        <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
    );

    const rightToolbarTemplate = () => (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
                type="search"
                placeholder="Buscar estudiante..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
        </IconField>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

            <DataTable
                value={estudiantes}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                globalFilter={globalFilter}
                emptyMessage="No se encontraron estudiantes"
                header="Listado de Notas"
            >
                <Column field="nombre" header="Nombre" sortable filter />
                {Object.keys(emptyEstudiante).filter(key => key !== "id" && key !== "nombre").map((field) => (
                    <Column key={field} field={field} header={field.replace(/_/g, ' ').toUpperCase()} sortable />
                ))}
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editEstudiante(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteEstudiante(rowData)} />
                        </>
                    )}
                />
            </DataTable>

            <Dialog visible={estudianteDialog} style={{ width: '600px' }} header="Notas del Estudiante" modal className="p-fluid" footer={estudianteDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={estudiante.nombre} onChange={(e) => onInputChange(e, 'nombre')} required />
                </div>
                {Object.keys(emptyEstudiante).filter(key => key !== "id" && key !== "nombre").map((field) => (
                    <div key={field} className="field">
                        <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</label>
                        <InputText id={field} value={estudiante[field]} onChange={(e) => onInputChange(e, field)} />
                    </div>
                ))}
            </Dialog>

            <Dialog visible={deleteEstudianteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteEstudianteDialogFooter} onHide={hideDeleteEstudianteDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {estudiante && <span>¿Seguro que deseas eliminar a <b>{estudiante.nombre}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
