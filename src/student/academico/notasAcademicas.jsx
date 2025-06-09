import React, { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import styled from "styled-components";

const materias = [
    "MATEMATICA",
    "CIENCIA Y TECNOLOGIA",
    "COMUNICACION",
    "EDUCACION PARA EL TRABAJO",
    "EDUCACION FISICA",
    "INGLES",
    "ARTE Y CULTURA"
];

const NotasPage = () => {
    const [notas, setNotas] = useState({});
    const [resultado, setResultado] = useState(null);
    const toast = React.useRef(null);

    const actualizarNota = (materia, valor) => {
        setNotas((prev) => ({ ...prev, [materia]: valor }));
    };

    const validarYEnviar = () => {
        const faltantes = materias.filter((m) => !(m in notas));
        if (faltantes.length > 0) {
            toast.current.show({
                severity: "warn",
                summary: "Faltan materias",
                detail: `Completa las notas de: ${faltantes.join(", ")}`,
            });
            return;
        }

        // Aquí podrías enviar a backend o pasar a lógica de recomendación
        setResultado(notas);
        toast.current.show({
            severity: "success",
            summary: "Notas registradas",
            detail: "Tus notas han sido guardadas correctamente",
        });
    };

    return (
        <NotasContainer>
            <Toast ref={toast} />
            <h2>Registro de Notas Académicas</h2>
            <p>Ingresa tus calificaciones en base 20 para cada materia:</p>

            <FormGrid>
                {materias.map((materia) => (
                    <div key={materia} className="p-field">
                        <label>{materia}</label>
                        <InputNumber
                            value={notas[materia] || null}
                            onValueChange={(e) => actualizarNota(materia, e.value)}
                            min={0}
                            max={20}
                            showButtons
                            mode="decimal"
                            step={1}
                            useGrouping={false}
                            className="p-inputtext-sm p-fluid"
                        />
                    </div>
                ))}
            </FormGrid>

            <Button label="Guardar Notas" icon="pi pi-check" className="p-button-success" onClick={validarYEnviar} />

            {resultado && (
                <ResumenBox>
                    <h4>✅ Notas registradas:</h4>
                    <ul>
                        {Object.entries(resultado).map(([materia, nota]) => (
                            <li key={materia}>{materia}: <strong>{nota}</strong></li>
                        ))}
                    </ul>
                </ResumenBox>
            )}
        </NotasContainer>
    );
};

const NotasContainer = styled.div`
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const ResumenBox = styled.div`
    margin-top: 2rem;
    padding: 1rem;
    background: #f6f6f6;
    border-radius: 8px;
`;

export default NotasPage;
