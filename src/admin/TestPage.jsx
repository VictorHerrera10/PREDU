import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function TestPage() {
    const [tests, setTests] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [testDialog, setTestDialog] = useState(false);
    const [form, setForm] = useState(initialForm());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);

    function initialForm() {
        return {
            id: null,
            estudianteId: null,
            realista: 0,
            investigador: 0,
            artistico: 0,
            social: 0,
            emprendedor: 0,
            convencional: 0,
            fecha: new Date().toISOString().split('T')[0]
        };
    }

    useEffect(() => {
        setEstudiantes([
            { id: 1, nombre: 'Juan Pérez' },
            { id: 2, nombre: 'María Gómez' }
        ]);
        setTests([]);
    }, []);

    const openNew = () => {
        setForm(initialForm());
        setTestDialog(true);
    };

    const editTest = (rowData) => {
        setForm({ ...rowData });
        setTestDialog(true);
    };

    const saveTest = () => {
        let _tests = [...tests];
        if (form.id) {
            const index = _tests.findIndex(t => t.id === form.id);
            _tests[index] = form;
            toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Test actualizado' });
        } else {
            form.id = new Date().getTime();
            _tests.push(form);
            toast.current.show({ severity: 'success', summary: 'Creado', detail: 'Nuevo test registrado' });
        }
        setTests(_tests);
        setTestDialog(false);
    };

    const confirmDelete = (test) => {
        confirmDialog({
            message: '¿Eliminar este test?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteTest(test)
        });
    };

    const deleteTest = (test) => {
        let _tests = tests.filter(t => t.id !== test.id);
        setTests(_tests);
        toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Test eliminado' });
    };

    const testDialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setTestDialog(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveTest} autoFocus />
        </div>
    );

    const actionTemplate = (rowData) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => editTest(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDelete(rowData)} />
        </>
    );

    const getNombreEstudiante = (id) => {
        const estudiante = estudiantes.find(e => e.id === id);
        return estudiante ? estudiante.nombre : '—';
    };

    const estudianteBodyTemplate = (rowData) => getNombreEstudiante(rowData.estudianteId);

    const leftToolbarTemplate = () => (
        <Button label="Nuevo Test" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
    );

    const rightToolbarTemplate = () => (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
                placeholder="Buscar..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
        </IconField>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

            <DataTable
                value={tests}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                globalFilter={globalFilter}
                emptyMessage="Sin registros"
                header="Tests Psicológicos"
            >
                <Column field="estudianteId" header="Estudiante" body={estudianteBodyTemplate} sortable />
                <Column field="realista" header="R" sortable />
                <Column field="investigador" header="I" sortable />
                <Column field="artistico" header="A" sortable />
                <Column field="social" header="S" sortable />
                <Column field="emprendedor" header="E" sortable />
                <Column field="convencional" header="C" sortable />
                <Column field="fecha" header="Fecha" sortable />
                <Column body={actionTemplate} header="Acciones" />
            </DataTable>

            <Dialog visible={testDialog} style={{ width: '450px' }} header="Detalles del Test" modal className="p-fluid" footer={testDialogFooter} onHide={() => setTestDialog(false)}>
                <Dropdown
                    value={form.estudianteId}
                    options={estudiantes}
                    onChange={(e) => setForm({ ...form, estudianteId: e.value })}
                    optionLabel="nombre"
                    placeholder="Seleccionar estudiante"
                    className="mb-3"
                />
                {['realista', 'investigador', 'artistico', 'social', 'emprendedor', 'convencional'].map((campo) => (
                    <div key={campo} className="mb-2">
                        <label className="block mb-1 capitalize">{campo}</label>
                        <InputNumber
                            value={form[campo]}
                            onValueChange={(e) => setForm({ ...form, [campo]: e.value })}
                            showButtons min={0} max={10}
                        />
                    </div>
                ))}
            </Dialog>
        </div>
    );
}
