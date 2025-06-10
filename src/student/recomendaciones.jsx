import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Skeleton } from "primereact/skeleton";
import styled from "styled-components";
import { useLoader} from "../Home/componentes/LoaderContext";

const recomendacionesMock = [
    {
        carrera: "Ingeniería de Sistemas",
        puntaje: 92,
        riasec: "IC",
        tags: ["Tecnología", "Lógica", "Sistemas"],
        universidad: "UNI, PUCP"
    },
    {
        carrera: "Psicología",
        puntaje: 87,
        riasec: "SA",
        tags: ["Empatía", "Comunicación", "Conducta Humana"],
        universidad: "UNMSM, UPCH"
    },
    {
        carrera: "Diseño Gráfico",
        puntaje: 83,
        riasec: "AE",
        tags: ["Creatividad", "Diseño", "Comunicación Visual"],
        universidad: "Toulouse, PUCP"
    }
];

const Recomendaciones = () => {
    const [carreras, setCarreras] = useState([]);
    const [loadingLocal, setLoadingLocal] = useState(true);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        showLoader();
        setTimeout(() => {
            setCarreras(recomendacionesMock);
            setLoadingLocal(false);
            hideLoader();
        }, 1800); // Simulando tiempo real de carga
    }, []);

    return (
        <Container>
            <h2>🎓 Carreras Recomendadas</h2>
            <p>Estas son tus recomendaciones personalizadas basadas en tus notas y perfil RIASEC.</p>

            <Grid>
                {loadingLocal
                    ? [...Array(3)].map((_, i) => (
                        <Card key={i} style={{ padding: "1.5rem" }}>
                            <Skeleton width="80%" height="1.5rem" className="mb-2" />
                            <Skeleton width="60%" height="1rem" className="mb-2" />
                            <Skeleton width="90%" height="1.2rem" className="mb-3" />
                            <Skeleton width="40%" height="2rem" />
                        </Card>
                    ))
                    : carreras.map((item, index) => (
                        <Card key={index} title={item.carrera} subTitle={`Puntaje: ${item.puntaje}`}>
                            <p><strong>Perfil RIASEC:</strong> {item.riasec}</p>
                            <p><strong>Universidades:</strong> {item.universidad}</p>
                            <TagBox>
                                {item.tags.map((tag, i) => (
                                    <span key={i} className="tag p-ripple">
                                          {tag}
                                        <Ripple />
                                      </span>
                                ))}
                            </TagBox>
                            <div className="p-mt-2">
                                <Button label="Guardar como favorita" icon="pi pi-heart" className="p-button-sm p-ripple" />
                                <Ripple />
                            </div>
                        </Card>
                    ))}
            </Grid>
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const TagBox = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
        background: #dfe6e9;
        padding: 0.4rem 0.8rem;
        border-radius: 1rem;
        font-size: 0.9rem;
        position: relative;
        overflow: hidden;
        cursor: default;
    }
`;

export default Recomendaciones;
