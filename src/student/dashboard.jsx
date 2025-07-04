import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../Home/componentes/LoaderContext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import styled from "styled-components";

const Dashboard = () => {
    const [loadingLocal, setLoadingLocal] = useState(true);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    useEffect(() => {
        showLoader();
        setTimeout(() => {
            setLoadingLocal(false);
            hideLoader();
        }, 1500);
    }, [showLoader, hideLoader]);

    return (
        <Container>
            <h2>👋 Bienvenido a tu Panel PREDU</h2>
            <p>Explora tus opciones y sigue avanzando en tu camino vocacional.</p>

            {/* Splitter con tres paneles */}
            <Splitter style={{ height: "calc(100vh - 50px)", marginTop: "2rem" }}>
                {/* Panel izquierdo */}
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

                {/* Panel central */}
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
                    ) : (
                        <Grid>
                            <StyledCard title="Test Vocacional">
                                <p>Completa el test RIASEC para descubrir tu perfil.</p>
                                <Button label="Ir al Test" icon="pi pi-pencil" className="p-button-sm" onClick={() => navigate("/test")} />
                                <Ripple />
                            </StyledCard>

                            <StyledCard title="Ver Mis Notas">
                                <p>Sube o consulta tus notas académicas para recibir recomendaciones más precisas.</p>
                                <Button label="Subir Certificado" icon="pi pi-upload" className="p-button-sm" onClick={() => navigate("/notas")} />
                                <Ripple />
                            </StyledCard>

                            <StyledCard title="Carreras Recomendadas">
                                <p>Visualiza las opciones de carrera más afines a ti.</p>
                                <Button label="Ver Resultados" icon="pi pi-chart-bar" className="p-button-sm" onClick={() => navigate("/resultados")} />
                                <Ripple />
                            </StyledCard>
                        </Grid>
                    )}
                </SplitterPanel>

                {/* Panel derecho */}
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
