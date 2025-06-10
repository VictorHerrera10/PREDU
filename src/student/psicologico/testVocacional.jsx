import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import styled from "styled-components";
import { useLoader} from "../../Home/componentes/LoaderContext";

const preguntasRIASEC = [
    { id: 1, texto: "Me gusta reparar objetos mecánicos.", tipo: "R" },
    { id: 2, texto: "Disfruto investigar cómo funcionan las cosas.", tipo: "I" },
    { id: 3, texto: "Me gusta dibujar o diseñar cosas.", tipo: "A" },
    { id: 4, texto: "Disfruto ayudar a otras personas.", tipo: "S" },
    { id: 5, texto: "Soy bueno para organizar y seguir reglas.", tipo: "C" },
    { id: 6, texto: "Me gusta liderar y convencer a otros.", tipo: "E" }
];

const TestVocacional = () => {
    const [respuestas, setRespuestas] = useState({});
    const [finalizado, setFinalizado] = useState(false);
    const [loadingLocal, setLoadingLocal] = useState(true);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        showLoader();
        setTimeout(() => {
            setLoadingLocal(false);
            hideLoader();
        }, 1000);
    }, []);

    const responder = (id, tipo, valor) => {
        const nuevasRespuestas = { ...respuestas, [id]: { tipo, valor } };
        setRespuestas(nuevasRespuestas);
        if (Object.keys(nuevasRespuestas).length === preguntasRIASEC.length) {
            setFinalizado(true);
        }
    };

    const calcularPerfil = () => {
        const conteo = {};
        Object.values(respuestas).forEach(({ tipo, valor }) => {
            if (!conteo[tipo]) conteo[tipo] = 0;
            conteo[tipo] += valor;
        });

        const top2 = Object.entries(conteo)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([letra]) => letra)
            .join("");

        return top2;
    };

    return (
        <Container>
            <h2>🧠 Test Vocacional RIASEC</h2>
            <p>Responde las siguientes afirmaciones para identificar tu perfil profesional.</p>

            {loadingLocal ? (
                <Grid>
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} style={{ padding: "1rem" }}>
                            <Skeleton width="90%" height="1.5rem" className="mb-2" />
                            <Skeleton width="100%" height="2rem" />
                        </Card>
                    ))}
                </Grid>
            ) : (
                <>
                    {!finalizado ? (
                        <Grid>
                            {preguntasRIASEC.map((p) => (
                                <Card key={p.id} title={`Pregunta ${p.id}`}>
                                    <p>{p.texto}</p>
                                    <div className="flex justify-content-around mt-3">
                                        <Button
                                            label="Me identifica"
                                            className="p-button-success p-ripple"
                                            onClick={() => responder(p.id, p.tipo, 1)}
                                        />
                                        <Button
                                            label="No me identifica"
                                            className="p-button-secondary p-ripple"
                                            onClick={() => responder(p.id, p.tipo, 0)}
                                        />
                                    </div>
                                    <Ripple />
                                </Card>
                            ))}
                        </Grid>
                    ) : (
                        <Resultado>
                            <h3>✅ ¡Test completado!</h3>
                            <p>Tu perfil dominante es: <strong>{calcularPerfil()}</strong></p>
                            <Button label="Ir al Dashboard" icon="pi pi-home" className="p-ripple" />
                            <Ripple />
                        </Resultado>
                    )}
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const Resultado = styled.div`
    margin-top: 2rem;
    text-align: center;
`;

export default TestVocacional;
