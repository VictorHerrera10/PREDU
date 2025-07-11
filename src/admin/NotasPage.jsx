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

export default function NotasPage() {
    const toast = useRef(null);
    const emptyNota = {
        id: null,
        uid: '',
        nombre: '',  
        carrera: '',
        artistico: 0,
        convencional: 0,
        emprendedor: 0,
        investigador: 0,
        realista: 0,
        social: 0
    };

    const [notas, setNotas] = useState([]);
    const [notaDialog, setNotaDialog] = useState(false);
    const [deleteNotaDialog, setDeleteNotaDialog] = useState(false);
    const [nota, setNota] = useState(emptyNota);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const fetchNotas = async () => {
        setLoading(true);
        try {
            const psicologicaCollectionRef = collection(db, 'psicologica');
            const usuariosCollectionRef = collection(db, 'usuarios');
 
            const psicologicaSnapshot = await getDocs(query(psicologicaCollectionRef, orderBy('creadoEl', 'desc')));
            const allPsicologicaResults = psicologicaSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                creadoEl: doc.data().creadoEl.toDate()  
            }));
 
            const latestResultsMap = new Map();
            allPsicologicaResults.forEach(result => {
                if (!latestResultsMap.has(result.uid) || result.creadoEl > latestResultsMap.get(result.uid).creadoEl) {
                    latestResultsMap.set(result.uid, result);
                }
            });

            const processedNotas = [];
            for (const [uid, latestResult] of latestResultsMap.entries()) {
                const userDocRef = doc(usuariosCollectionRef, uid);
                const userDocSnap = await getDoc(userDocRef);

                let userName = 'Usuario Desconocido';
                if (userDocSnap.exists()) {
                    userName = userDocSnap.data().nombre;
                }

                processedNotas.push({
                    id: latestResult.id,
                    uid: latestResult.uid,
                    nombre: userName,
                    carrera: latestResult.carrera,
                    artistico: latestResult.respuestas?.artistico || 0,
                    convencional: latestResult.respuestas?.convencional || 0,
                    emprendedor: latestResult.respuestas?.emprendedor || 0,
                    investigador: latestResult.respuestas?.investigador || 0,
                    realista: latestResult.respuestas?.realista || 0,
                    social: latestResult.respuestas?.social || 0,
                });
            }
            setNotas(processedNotas);
        } catch (error) {
            console.error("Error al obtener notas:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las notas', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotas();
    }, []);

    const openNew = () => {
        setNota(emptyNota);
        setSubmitted(false);
        setNotaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setNotaDialog(false);
    };

    const hideDeleteNotaDialog = () => {
        setDeleteNotaDialog(false);
    };

    const saveNota = async () => {
        setSubmitted(true);
        setGlobalLoading(true);

        if (nota.nombre.trim() && nota.uid.trim()) {
            try {
                const notasData = {
                    carrera: nota.carrera,
                    respuestas: {
                        artistico: Number(nota.artistico),
                        convencional: Number(nota.convencional),
                        emprendedor: Number(nota.emprendedor),
                        investigador: Number(nota.investigador),
                        realista: Number(nota.realista),
                        social: Number(nota.social),
                    },
                    uid: nota.uid,
                    creadoEl: new Date(),
                };

                if (nota.id) {
                    const docRef = doc(db, 'psicologica', nota.id);
                    await updateDoc(docRef, notasData);
                    toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Notas actualizadas', life: 3000 });
                } else {
                    await addDoc(collection(db, 'psicologica'), notasData);
                    toast.current.show({ severity: 'success', summary: 'Agregado', detail: 'Notas agregadas', life: 3000 });
                }
                await fetchNotas();  
                setNotaDialog(false);
                setNota(emptyNota);
            } catch (error) {
                console.error("Error al guardar notas:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar las notas', life: 3000 });
            } finally {
                setGlobalLoading(false);
            }
        } else {
            setGlobalLoading(false);
        }
    };

    const editNota = (nota) => {
        setNota({ ...nota });
        setNotaDialog(true);
    };

    const confirmDeleteNota = (nota) => {
        setNota(nota);
        setDeleteNotaDialog(true);
    };

    const deleteNota = async () => {
        setGlobalLoading(true);
        try {
            await deleteDoc(doc(db, 'psicologica', nota.id));
            setNotas((prev) => prev.filter((val) => val.id !== nota.id));
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Notas eliminadas', life: 3000 });
        } catch (error) {
            console.error("Error al eliminar nota:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la nota', life: 3000 });
        } finally {
            setDeleteNotaDialog(false);
            setNota(emptyNota);
            setGlobalLoading(false);
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _nota = { ...nota };
        _nota[name] = val;
        setNota(_nota);
    };

    const notaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveNota} />
        </>
    );

    const deleteNotaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteNotaDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteNota} />
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

    const notaFields = Object.keys(emptyNota).filter(key => key !== "id" && key !== "nombre" && key !== "uid");

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
                    value={notas}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    globalFilter={globalFilter}
                    emptyMessage="No se encontraron notas"
                    header="Listado de Notas Psicológicas"
                >
                    <Column field="nombre" header="Nombre" sortable filter />
                    <Column field="carrera" header="Carrera Sugerida" sortable filter />
                    {notaFields.filter(field => field !== 'carrera').map((field) => (
                        <Column key={field} field={field} header={field.replace(/_/g, ' ').toUpperCase()} sortable />
                    ))}
                    <Column
                        header="Acciones"
                        body={(rowData) => (
                            <>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editNota(rowData)} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteNota(rowData)} />
                            </>
                        )}
                    />
                </DataTable>
            )}

            <Dialog visible={notaDialog} style={{ width: '600px' }} header="Notas del Estudiante" modal className="p-fluid" footer={notaDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={nota.nombre} onChange={(e) => onInputChange(e, 'nombre')} required disabled={!!nota.id} />
            
                    {submitted && !nota.nombre.trim() && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="uid">UID del Usuario</label>
                    <InputText id="uid" value={nota.uid} onChange={(e) => onInputChange(e, 'uid')} required disabled={!!nota.id} />
                    {submitted && !nota.uid.trim() && <small className="p-error">El UID es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="carrera">CARRERA SUGERIDA</label>
                    <InputText id="carrera" value={nota.carrera} onChange={(e) => onInputChange(e, 'carrera')} />
                </div>
                {notaFields.filter(field => field !== 'carrera').map((field) => (
                    <div key={field} className="field">
                        <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</label>
                        <InputText id={field} value={nota[field]} onChange={(e) => onInputChange(e, field)} type="number" />
                    </div>
                ))}
            </Dialog>

            <Dialog visible={deleteNotaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteNotaDialogFooter} onHide={hideDeleteNotaDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {nota && <span>¿Seguro que deseas eliminar las notas de <b>{nota.nombre}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}