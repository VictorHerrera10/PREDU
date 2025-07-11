import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../Home/componentes/LoaderContext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import styled from "styled-components";
import { Message } from "primereact/message";

const Dashboard = () => {
    const [loadingLocal, setLoadingLocal] = useState(true);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    // Simulación: obtener el estado de evaluación y notas
    const [evaluacionCompletada, setEvaluacionCompletada] = useState(false);
    const [notasSubidas, setNotasSubidas] = useState(false);
    const [combinacion, setCombinacion] = useState(null); // ej: { test: "Biomedicas", notas: "Sociales" }

    // Lógica de combinación -> consejo
    const obtenerConsejo = (test, notas) => {
        const combinacionClave = `${test}|${notas}`;
        const consejos = {
            "Ingenierías|Ingenierías": {
                consejo: "Explora carreras de ingeniería como sistemas, electrónica o mecánica, ideales para entornos tecnológicos y de innovación.",
                carreras: "Ingeniería en sistemas, electrónica, civil, industrial, telecomunicaciones."
            },
            "Sociales|Sociales": {
                consejo: "Puedes estudiar comunicación, trabajo social, educación o psicología para impactar positivamente en la sociedad.",
                carreras: "Psicología, trabajo social, comunicación, sociología, educación."
            },
            "Biomedicas|Biomedicas": {
                consejo: "Carreras del área de salud como medicina, enfermería o nutrición pueden ser adecuadas para ti.",
                carreras: "Medicina, enfermería, nutrición, tecnología médica, obstetricia."
            },
            "Ingenierías|Sociales": {
                consejo: "Carreras que integran tecnología y gestión social son una gran opción.",
                carreras: "Ingeniería industrial, marketing tecnológico, gestión de proyectos."
            },
            "Ingenierías|Biomedicas": {
                consejo: "Podrías formarte en áreas donde se integra salud y tecnología, como la ingeniería biomédica.",
                carreras: "Ingeniería biomédica, tecnología médica, biotecnología."
            },
            "Sociales|Ingenierías": {
                consejo: "La docencia en áreas técnicas o la divulgación científica podrían interesarte.",
                carreras: "Educación científica, periodismo técnico, comunicación STEM."
            },
            "Sociales|Biomedicas": {
                consejo: "Puedes enfocarte en carreras que mezclen salud comunitaria y apoyo social.",
                carreras: "Psicología social, terapia ocupacional, promoción en salud."
            },
            "Biomedicas|Sociales": {
                consejo: "Explora carreras como educación en ciencia o comunicación en salud.",
                carreras: "Educación en ciencia, divulgación médica, psicología educativa."
            }
        };
        return consejos[combinacionClave] || null;
    };

    useEffect(() => {
        showLoader();

        // Simulación de carga de datos del backend o localStorage
        setTimeout(() => {
            // Simular datos del usuario
            const evaluacion = true;
            const notas = true;
            const testResult = "Biomedicas"; // Simulado
            const notasResult = "Sociales"; // Simulado

            setEvaluacionCompletada(evaluacion);
            setNotasSubidas(notas);

            if (evaluacion && notas) {
                setCombinacion(obtenerConsejo(testResult, notasResult));
            }

            setLoadingLocal(false);
            hideLoader();
        }, 1500);
    }, [showLoader, hideLoader]);

    return (
        <Container>
            <h2>👋 Bienvenido a tu Panel PREDU</h2>
            <p>Explora tus opciones y sigue avanzando en tu camino vocacional.</p>

            <Splitter style={{ height: "calc(100vh - 50px)", marginTop: "2rem" }}>
                <SplitterPanel size={20} minSize={10} style={{ padding: "10px", borderRight: "1px solid #ddd" }}>
                    <h3>Información del Modelo ML 1</h3>
                    {loadingLocal ? (
                        <Skeleton width="80%" height="100%" />
                    ) : (
                        <div>
                            <p>Aquí se mostrará información o gráficos relacionados con el primer modelo de ML.</p>
                            <Button label="Ver detalles" icon="pi pi-search" className="p-button-sm" onClick={() => navigate("/ml1")} />
                        </div>
                    )}
                    <Ripple />
                </SplitterPanel>

                <SplitterPanel size={60} minSize={30} style={{ padding: "10px" }}>
                    {loadingLocal ? (
                        <Grid>
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} style={{ padding: "1.5rem" }}>
                                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                                    <Skeleton width="60%" height="1rem" className="mb-2" />
                                    <Skeleton width="40%" height="2rem" />
                                </Card>
                            ))}
                        </Grid>
                    ) : (!evaluacionCompletada || !notasSubidas) ? (
                        <Message severity="warn" text="Para recibir recomendaciones, primero completa el Test Vocacional y sube tus Notas Académicas." />
                    ) : (
                        <Grid>
                            <StyledCard title="Resultado de Orientación Vocacional">
                                <p><strong>Consejo Vocacional:</strong> {combinacion?.consejo}</p>
                                <p><strong>Carreras sugeridas:</strong> {combinacion?.carreras}</p>
                            </StyledCard>
                        </Grid>
                    )}
                </SplitterPanel>

                <SplitterPanel size={20} minSize={10} style={{ padding: "10px", borderLeft: "1px solid #ddd" }}>
                    <h3>Información del Modelo ML 2</h3>
                    {loadingLocal ? (
                        <Skeleton width="80%" height="100%" />
                    ) : (
                        <div>
                            <p>Aquí se mostrará información o gráficos relacionados con el segundo modelo de ML.</p>
                            <Button label="Ver detalles" icon="pi pi-search" className="p-button-sm" onClick={() => navigate("/ml2")} />
                        </div>
                    )}
                    <Ripple />
                </SplitterPanel>
            </Splitter>
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

const StyledCard = styled(Card)`
    text-align: left;
    padding: 1.5rem;
`;

export default Dashboard;
