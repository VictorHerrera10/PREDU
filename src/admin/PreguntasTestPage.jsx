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

// Tipos de preguntas para el test
const tiposPregunta = [
    { label: 'RIASEC', value: 'riasec' },
    { label: 'Inteligencia', value: 'inteligencia' },
    { label: 'Personalidad', value: 'personalidad' },
];

// Preguntas de prueba
const mockPreguntas = [
    { _id: '1', enunciado: 'Disfruto resolver problemas matemáticos', tipo: 'riasec' },
    { _id: '2', enunciado: 'Me gusta ayudar a otros a aprender', tipo: 'inteligencia' },
];

export default function PreguntasTestPage() {
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);

    const [form, setForm] = useState({ enunciado: '', tipo: '' });

    useEffect(() => {
        setTimeout(() => {
            setPreguntas(mockPreguntas);
            setLoading(false);
        }, 1000);
    }, []);

    const abrirCrear = () => {
        setForm({ enunciado: '', tipo: '' });
        setPreguntaSeleccionada(null);
        setVisible(true);
    };

    const abrirEditar = (pregunta) => {
        setForm({ ...pregunta });
        setPreguntaSeleccionada(pregunta);
        setVisible(true);
    };

    const eliminarPregunta = (pregunta) => {
        setGlobalLoading(true);
        setTimeout(() => {
            setPreguntas((prev) => prev.filter((p) => p._id !== pregunta._id));
            setGlobalLoading(false);
        }, 800);
    };

    const guardarPregunta = () => {
        setGlobalLoading(true);
        setTimeout(() => {
            if (preguntaSeleccionada) {
                setPreguntas((prev) =>
                    prev.map((p) => (p._id === preguntaSeleccionada._id ? { ...form, _id: p._id } : p))
                );
            } else {
                setPreguntas((prev) => [...prev, { ...form, _id: String(Date.now()) }]);
            }
            setVisible(false);
            setGlobalLoading(false);
        }, 800);
    };

    const footerDialog = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" onClick={() => setVisible(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarPregunta}>
                <Ripple />
            </Button>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Gestión de Preguntas del Test</h2>

            {globalLoading && (
                <div className="flex justify-center my-4">
                    <ProgressSpinner />
                </div>
            )}

            {!globalLoading && (
                <>
                    <div className="mb-4 flex justify-between">
                        <Button label="Nueva Pregunta" icon="pi pi-plus" onClick={abrirCrear}>
                            <Ripple />
                        </Button>
                    </div>

                    {loading ? (
                        <Skeleton width="100%" height="300px" />
                    ) : (
                        <DataTable value={preguntas} paginator rows={5} stripedRows responsiveLayout="scroll">
                            <Column field="enunciado" header="Enunciado" />
                            <Column field="tipo" header="Tipo" />
                            <Column
                                header="Acciones"
                                body={(rowData) => (
                                    <div className="flex gap-2">
                                        <Button icon="pi pi-pencil" severity="info" rounded onClick={() => abrirEditar(rowData)} />
                                        <Button icon="pi pi-trash" severity="danger" rounded onClick={() => eliminarPregunta(rowData)} />
                                    </div>
                                )}
                            />
                        </DataTable>
                    )}
                </>
            )}

            <Dialog
                header={preguntaSeleccionada ? 'Editar Pregunta' : 'Nueva Pregunta'}
                visible={visible}
                onHide={() => setVisible(false)}
                footer={footerDialog}
                style={{ width: '30rem' }}
                modal
            >
                <div className="flex flex-col gap-4">
          <span className="p-float-label">
            <InputText
                id="enunciado"
                value={form.enunciado}
                onChange={(e) => setForm({ ...form, enunciado: e.target.value })}
            />
            <label htmlFor="enunciado">Enunciado</label>
          </span>

                    <span className="p-float-label">
            <Dropdown
                id="tipo"
                value={form.tipo}
                options={tiposPregunta}
                onChange={(e) => setForm({ ...form, tipo: e.value })}
                placeholder="Seleccione el tipo"
            />
            <label htmlFor="tipo">Tipo</label>
          </span>
                </div>
            </Dialog>
        </div>
    );
}

