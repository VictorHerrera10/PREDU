import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLoader} from "../Home/componentes/LoaderContext";

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
    }, []);

    return (
        <Container>
            <h2>👋 Bienvenido a tu Panel PREDU</h2>
            <p>Explora tus opciones y sigue avanzando en tu camino vocacional.</p>

            <Grid>
                {loadingLocal
                    ? [...Array(3)].map((_, i) => (
                        <Card key={i} style={{ padding: "1.5rem" }}>
                            <Skeleton width="80%" height="1.5rem" className="mb-2" />
                            <Skeleton width="60%" height="1rem" className="mb-2" />
                            <Skeleton width="40%" height="2rem" />
                        </Card>
                    ))
                    : (
                        <>
                            <StyledCard title="Test Vocacional">
                                <p>Completa el test RIASEC para descubrir tu perfil.</p>
                                <Button label="Ir al Test" icon="pi pi-pencil" className="p-button-sm p-ripple" onClick={() => navigate("/test")} />
                                <Ripple />
                            </StyledCard>

                            <StyledCard title="Ver Mis Notas">
                                <p>Sube o consulta tus notas académicas para recibir recomendaciones más precisas.</p>
                                <Button label="Subir Certificado" icon="pi pi-upload" className="p-button-sm p-ripple" onClick={() => navigate("/notas")} />
                                <Ripple />
                            </StyledCard>

                            <StyledCard title="Carreras Recomendadas">
                                <p>Visualiza las opciones de carrera más afines a ti.</p>
                                <Button label="Ver Resultados" icon="pi pi-chart-bar" className="p-button-sm p-ripple" onClick={() => navigate("/resultados")} />
                                <Ripple />
                            </StyledCard>
                        </>
                    )
                }
            </Grid>
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
