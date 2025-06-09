import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import styled from "styled-components";

const DashboardPage = () => {
    const [userName, setUserName] = useState("Estudiante");

    // Simulación de carga del nombre (idealmente vendrá del backend o token)
    useEffect(() => {
        const nombre = localStorage.getItem("nombreUsuario") || "Estudiante";
        setUserName(nombre);
    }, []);

    return (
        <DashboardContainer>
            <WelcomeSection>
                <h1>¡Hola, {userName}!</h1>
                <p>Bienvenido a tu panel de orientación vocacional en <strong>PREDU</strong>.</p>
            </WelcomeSection>

            <CardContainer>
                <StyledCard title="Test Vocacional">
                    <p>Completa el test RIASEC para descubrir tu perfil profesional.</p>
                    <Button label="Ir al Test" icon="pi pi-pencil" className="p-button-sm p-button-info" />
                </StyledCard>

                <StyledCard title="Explorar Carreras">
                    <p>Conoce las distintas opciones de carreras según tus intereses.</p>
                    <Button label="Ver Carreras" icon="pi pi-search" className="p-button-sm p-button-help" />
                </StyledCard>

                <StyledCard title="Mi Historial">
                    <p>Revisa tus resultados, carreras guardadas y evaluaciones anteriores.</p>
                    <Button label="Ver Historial" icon="pi pi-list" className="p-button-sm p-button-secondary" />
                </StyledCard>
            </CardContainer>
        </DashboardContainer>
    );
};

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StyledCard = styled(Card)`
  text-align: center;
`;

export default DashboardPage;
