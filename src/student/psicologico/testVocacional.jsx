import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import styled from "styled-components";

const preguntasRIASEC = [
    { id: 1, texto: "Me gusta reparar objetos mecánicos.", tipo: "R" },
    { id: 2, texto: "Disfruto investigar cómo funcionan las cosas.", tipo: "I" },
    { id: 3, texto: "Me gusta dibujar o diseñar cosas.", tipo: "A" },
    { id: 4, texto: "Disfruto ayudar a otras personas.", tipo: "S" },
    { id: 5, texto: "Soy bueno para organizar y seguir reglas.", tipo: "C" },
    { id: 6, texto: "Me gusta liderar y convencer a otros.", tipo: "E" }
];

const TestVocacionalPage = () => {
    const [respuestas, setRespuestas] = useState({});
    const [finalizado, setFinalizado] = useState(false);

    const responder = (id, tipo, valor) => {
        setRespuestas(prev => {
            const nuevo = { ...prev, [id]: { tipo, valor } };
            if (Object.keys(nuevo).length === preguntasRIASEC.length) setFinalizado(true);
            return nuevo;
        });
    };

    const calcularPerfil = () => {
        const conteo = {};
        Object.values(respuestas).forEach(({ tipo, valor }) => {
            if (!conteo[tipo]) conteo[tipo] = 0;
            conteo[tipo] += valor;
        });

        const ordenado = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
        const top2 = ordenado.slice(0, 2).map(([letra]) => letra).join("");
        return top2;
    };

    return (
        <TestContainer>
            <h2>Test Vocacional RIASEC</h2>
            {!finalizado ? (
                <PreguntasContainer>
                    {preguntasRIASEC.map((p) => (
                        <Card key={p.id} title={`Pregunta ${p.id}`}>
                            <p>{p.texto}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <Button
                                    label="Me identifica"
                                    className="p-button-success p-button-sm"
                                    onClick={() => responder(p.id, p.tipo, 1)}
                                />
                                <Button
                                    label="No me identifica"
                                    className="p-button-secondary p-button-sm"
                                    onClick={() => responder(p.id, p.tipo, 0)}
                                />
                            </div>
                        </Card>
                    ))}
                </PreguntasContainer>
            ) : (
                <ResultadoContainer>
                    <h3>✅ ¡Test completado!</h3>
                    <p>Tu perfil dominante es: <strong>{calcularPerfil()}</strong></p>
                    <Button label="Ir al Dashboard" icon="pi pi-home" />
                </ResultadoContainer>
            )}
        </TestContainer>
    );
};

const TestContainer = styled.div`
  padding: 2rem;
`;

const PreguntasContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ResultadoContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

export default TestVocacionalPage;
