import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import styled from "styled-components";

const todasLasCarreras = [
    { nombre: "Ingeniería Ambiental", riasec: "IR", area: "Ciencias", universidad: "UNALM", tags: ["Ecología", "Sostenibilidad"] },
    { nombre: "Medicina", riasec: "IS", area: "Salud", universidad: "UPCH", tags: ["Anatomía", "Clínica"] },
    { nombre: "Derecho", riasec: "ES", area: "Humanidades", universidad: "PUCP", tags: ["Leyes", "Justicia"] },
    { nombre: "Contabilidad", riasec: "CE", area: "Negocios", universidad: "UNMSM", tags: ["Cálculo", "Finanzas"] },
    { nombre: "Diseño Industrial", riasec: "AR", area: "Arte", universidad: "PUCP", tags: ["Creatividad", "Diseño"] },
];

const areas = [...new Set(todasLasCarreras.map(c => c.area))];

const ExploradorPage = () => {
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroArea, setFiltroArea] = useState(null);

    const filtrarCarreras = () => {
        return todasLasCarreras.filter(c =>
            c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
            (!filtroArea || c.area === filtroArea)
        );
    };

    return (
        <ExploradorContainer>
            <h2>Explorador de Carreras</h2>
            <Filtros>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        placeholder="Buscar carrera"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </span>

                <Dropdown
                    value={filtroArea}
                    options={areas}
                    onChange={(e) => setFiltroArea(e.value)}
                    placeholder="Filtrar por área"
                    className="p-inputtext-sm"
                />
            </Filtros>

            <GridCarreras>
                {filtrarCarreras().map((carrera, idx) => (
                    <Card key={idx} title={carrera.nombre}>
                        <p><strong>Área:</strong> {carrera.area}</p>
                        <p><strong>Universidad sugerida:</strong> {carrera.universidad}</p>
                        <p><strong>Perfil RIASEC:</strong> {carrera.riasec}</p>
                        <TagsBox>
                            {carrera.tags.map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))}
                        </TagsBox>
                        <Button
                            label="Ver más"
                            icon="pi pi-info-circle"
                            className="p-button-sm p-mt-2"
                        />
                    </Card>
                ))}
            </GridCarreras>
        </ExploradorContainer>
    );
};

const ExploradorContainer = styled.div`
    padding: 2rem;
`;

const Filtros = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const GridCarreras = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
`;

const TagsBox = styled.div`
    margin-top: 0.5rem;
    .tag {
        display: inline-block;
        background: #dcdcdc;
        padding: 0.3rem 0.6rem;
        border-radius: 1rem;
        margin: 0 0.3rem 0.5rem 0;
        font-size: 0.8rem;
    }
`;

export default ExploradorPage;
