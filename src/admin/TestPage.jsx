import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';

import { collection, getDocs, doc, query, orderBy, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function TestPage() {
    const toast = useRef(null);
    const emptyAcademico = {
        id: null,
        uid: '',
        nombre: '',  
        carrera: '',
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

    const [academicos, setAcademicos] = useState([]);
    const [academicoDialog, setAcademicoDialog] = useState(false);
    const [deleteAcademicoDialog, setDeleteAcademicoDialog] = useState(false);
    const [academico, setAcademico] = useState(emptyAcademico);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const fetchAcademicos = async () => {
        setLoading(true);
        try {
            const academicoCollectionRef = collection(db, 'academico');
            const usuariosCollectionRef = collection(db, 'usuarios');

            const academicoSnapshot = await getDocs(query(academicoCollectionRef, orderBy('creadoEl', 'desc')));
            const allAcademicoResults = academicoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                creadoEl: doc.data().creadoEl.toDate()
            }));

            const latestResultsMap = new Map();
            allAcademicoResults.forEach(result => {
                if (!latestResultsMap.has(result.uid) || result.creadoEl > latestResultsMap.get(result.uid).creadoEl) {
                    latestResultsMap.set(result.uid, result);
                }
            });

            const processedAcademicos = [];
            for (const [uid, latestResult] of latestResultsMap.entries()) {
                const userDocRef = doc(usuariosCollectionRef, uid);
                const userDocSnap = await getDoc(userDocRef);

                let userName = 'Usuario Desconocido';
                if (userDocSnap.exists()) {
                    userName = userDocSnap.data().nombre;
                }

                processedAcademicos.push({
                    id: latestResult.id,
                    uid: latestResult.uid,
                    nombre: userName,
                    carrera: latestResult.carrera,
                    arte_y_cultura: latestResult.respuestas?.arte_y_cultura || '',
                    castellano_como_segunda_lengua: latestResult.respuestas?.castellano_como_segunda_lengua || '',
                    ciencia_y_tecnologia: latestResult.respuestas?.ciencia_y_tecnologia || '',
                    ciencias_sociales: latestResult.respuestas?.ciencias_sociales || '',
                    comunicacion: latestResult.respuestas?.comunicacion || '',
                    desarrollo_personal: latestResult.respuestas?.desarrollo_personal || '',
                    educacion_fisica: latestResult.respuestas?.educacion_fisica || '',
                    educacion_para_el_trabajo: latestResult.respuestas?.educacion_para_el_trabajo || '',
                    educacion_religiosa: latestResult.respuestas?.educacion_religiosa || '',
                    ingles: latestResult.respuestas?.ingles || '',
                    matematica: latestResult.respuestas?.matematica || ''
                });
            }
            setAcademicos(processedAcademicos);
        } catch (error) {
            console.error("Error al obtener datos académicos:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos académicos', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicos();
    }, []);

    const openNew = () => {
        setAcademico(emptyAcademico);
        setSubmitted(false);
        setAcademicoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAcademicoDialog(false);
    };

    const hideDeleteAcademicoDialog = () => {
        setDeleteAcademicoDialog(false);
    };

    const saveAcademico = async () => {
        setSubmitted(true);
        setGlobalLoading(true);

        if (academico.uid.trim()) {
            try {
                const academicoData = {
                    carrera: academico.carrera,
                    respuestas: {
                        arte_y_cultura: academico.arte_y_cultura,
                        castellano_como_segunda_lengua: academico.castellano_como_segunda_lengua,
                        ciencia_y_tecnologia: academico.ciencia_y_tecnologia,
                        ciencias_sociales: academico.ciencias_sociales,
                        comunicacion: academico.comunicacion,
                        desarrollo_personal: academico.desarrollo_personal,
                        educacion_fisica: academico.educacion_fisica,
                        educacion_para_el_trabajo: academico.educacion_para_el_trabajo,
                        educacion_religiosa: academico.educacion_religiosa,
                        ingles: academico.ingles,
                        matematica: academico.matematica
                    },
                    uid: academico.uid,
                    creadoEl: new Date(),
                };

                if (academico.id) {
                    const docRef = doc(db, 'academico', academico.id);
                    await updateDoc(docRef, academicoData);
                    toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Datos académicos actualizados', life: 3000 });
                } else {
                    await addDoc(collection(db, 'academico'), academicoData);
                    toast.current.show({ severity: 'success', summary: 'Agregado', detail: 'Datos académicos agregados', life: 3000 });
                }
                await fetchAcademicos();
                setAcademicoDialog(false);
                setAcademico(emptyAcademico);
            } catch (error) {
                console.error("Error al guardar datos académicos:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los datos académicos', life: 3000 });
            } finally {
                setGlobalLoading(false);
            }
        } else {
            setGlobalLoading(false);
        }
    };

    const editAcademico = (data) => {
        setAcademico({ ...data });
        setAcademicoDialog(true);
    };

    const confirmDeleteAcademico = (data) => {
        setAcademico(data);
        setDeleteAcademicoDialog(true);
    };

    const deleteAcademico = async () => {
        setGlobalLoading(true);
        try {
            await deleteDoc(doc(db, 'academico', academico.id));
            setAcademicos((prev) => prev.filter((val) => val.id !== academico.id));
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Datos académicos eliminados', life: 3000 });
        } catch (error) {
            console.error("Error al eliminar datos académicos:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar los datos académicos', life: 3000 });
        } finally {
            setDeleteAcademicoDialog(false);
            setAcademico(emptyAcademico);
            setGlobalLoading(false);
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _academico = { ...academico };
        _academico[name] = val;
        setAcademico(_academico);
    };

    const academicoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveAcademico} />
        </>
    );

    const deleteAcademicoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAcademicoDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteAcademico} />
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

    const academicoFields = Object.keys(emptyAcademico).filter(key => key !== "id" && key !== "nombre" && key !== "uid");

    return (
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

            {globalLoading && (
                <div className="flex justify-content-center my-4">
                    <ProgressSpinner />
                </div>
            )}

            {loading ? (
                <Skeleton width="100%" height="300px" />
            ) : (
                <DataTable
                    value={academicos}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    globalFilter={globalFilter}
                    emptyMessage="No se encontraron datos académicos"
                    header="Listado de Datos Académicos"
                >
                    <Column field="nombre" header="Nombre" sortable filter />
                    <Column field="carrera" header="Carrera Sugerida" sortable filter />
                    {academicoFields.filter(field => field !== 'carrera').map((field) => (
                        <Column key={field} field={field} header={field.replace(/_/g, ' ').toUpperCase()} sortable />
                    ))}
                    <Column
                        header="Acciones"
                        body={(rowData) => (
                            <>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editAcademico(rowData)} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteAcademico(rowData)} />
                            </>
                        )}
                    />
                </DataTable>
            )}

            <Dialog visible={academicoDialog} style={{ width: '600px' }} header="Datos Académicos del Estudiante" modal className="p-fluid" footer={academicoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="uid">UID del Usuario</label>
                    <InputText id="uid" value={academico.uid} onChange={(e) => onInputChange(e, 'uid')} required disabled={!!academico.id} />
                    {submitted && !academico.uid.trim() && <small className="p-error">El UID es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="carrera">CARRERA SUGERIDA</label>
                    <InputText id="carrera" value={academico.carrera} onChange={(e) => onInputChange(e, 'carrera')} />
                </div>
                {academicoFields.filter(field => field !== 'carrera').map((field) => (
                    <div key={field} className="field">
                        <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</label>
                        <InputText id={field} value={academico[field]} onChange={(e) => onInputChange(e, field)} />
                    </div>
                ))}
            </Dialog>

            <Dialog visible={deleteAcademicoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteAcademicoDialogFooter} onHide={hideDeleteAcademicoDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {academico && <span>¿Seguro que deseas eliminar los datos académicos de <b>{academico.nombre || academico.uid}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}