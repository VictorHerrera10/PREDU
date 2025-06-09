import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import styled from "styled-components";

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

const ResultadosPage = () => {
    const [carreras, setCarreras] = useState([]);

    useEffect(() => {
        // Simular carga de resultados desde backend
        setTimeout(() => {
            setCarreras(recomendacionesMock);
        }, 800);
    }, []);

    return (
        <ResultadosContainer>
            <h2>🎓 Tus Carreras Recomendadas</h2>
            <p>Basado en tus notas académicas y perfil RIASEC.</p>

            <CardGrid>
                {carreras.map((item, index) => (
                    <StyledCard key={index} title={item.carrera}>
                        <p><strong>Puntaje:</strong> {item.puntaje} / 100</p>
                        <p><strong>Perfil RIASEC:</strong> {item.riasec}</p>
                        <p><strong>Universidades sugeridas:</strong> {item.universidad}</p>
                        <TagBox>
                            {item.tags.map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))}
                        </TagBox>
                        <Button label="Guardar como favorita" icon="pi pi-heart" className="p-button-sm p-button-secondary" />
                    </StyledCard>
                ))}
            </CardGrid>
        </ResultadosContainer>
    );
};

const ResultadosContainer = styled.div`
    padding: 2rem;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const StyledCard = styled(Card)`
    text-align: left;
    .p-card-title {
        font-size: 1.3rem;
        color: #2c3e50;
    }
`;

const TagBox = styled.div`
    margin-top: 1rem;
    .tag {
        display: inline-block;
        background: #e0e0e0;
        color: #333;
        padding: 0.3rem 0.6rem;
        border-radius: 999px;
        margin: 0 0.3rem 0.5rem 0;
        font-size: 0.85rem;
    }
`;

export default ResultadosPage;
