import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import styled from "styled-components";
import { useLoader} from "../Home/componentes/LoaderContext";

const todasLasCarrerasMock = [
    { nombre: "Ingeniería Ambiental", riasec: "IR", area: "Ciencias", universidad: "UNALM", tags: ["Ecología", "Sostenibilidad"] },
    { nombre: "Medicina", riasec: "IS", area: "Salud", universidad: "UPCH", tags: ["Anatomía", "Clínica"] },
    { nombre: "Derecho", riasec: "ES", area: "Humanidades", universidad: "PUCP", tags: ["Leyes", "Justicia"] },
    { nombre: "Contabilidad", riasec: "CE", area: "Negocios", universidad: "UNMSM", tags: ["Cálculo", "Finanzas"] },
    { nombre: "Diseño Industrial", riasec: "AR", area: "Arte", universidad: "PUCP", tags: ["Creatividad", "Diseño"] },
];

const ExploradorCarreras = () => {
    const [carreras, setCarreras] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroArea, setFiltroArea] = useState(null);
    const [loadingLocal, setLoadingLocal] = useState(true);

    const { showLoader, hideLoader } = useLoader();

    const areas = [...new Set(todasLasCarrerasMock.map(c => c.area))];

    useEffect(() => {
        showLoader();
        setTimeout(() => {
            setCarreras(todasLasCarrerasMock);
            setLoadingLocal(false);
            hideLoader();
        }, 1500);
    }, []);

    const filtrarCarreras = () => {
        return carreras.filter(c =>
            c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
            (!filtroArea || c.area === filtroArea)
        );
    };

    return (
        <Container>
            <h2>🔎 Explorador de Carreras</h2>
            <p>Busca por nombre o filtra por área para descubrir opciones afines a tu perfil.</p>

            <Filtros>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        placeholder="Buscar carrera"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        className="p-ripple"
                    />
                </span>

                <Dropdown
                    value={filtroArea}
                    options={areas}
                    onChange={(e) => setFiltroArea(e.value)}
                    placeholder="Filtrar por área"
                    className="p-inputtext-sm p-ripple"
                />
            </Filtros>

            <GridCarreras>
                {loadingLocal
                    ? [...Array(3)].map((_, i) => (
                        <Card key={i} style={{ padding: "1.5rem" }}>
                            <Skeleton width="80%" height="1.5rem" className="mb-2" />
                            <Skeleton width="60%" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="2rem" />
                        </Card>
                    ))
                    : filtrarCarreras().map((carrera, idx) => (
                        <Card key={idx} title={carrera.nombre}>
                            <p><strong>Área:</strong> {carrera.area}</p>
                            <p><strong>Universidad:</strong> {carrera.universidad}</p>
                            <p><strong>Perfil RIASEC:</strong> {carrera.riasec}</p>
                            <TagBox>
                                {carrera.tags.map((tag, i) => (
                                    <span key={i} className="tag p-ripple">{tag}<Ripple /></span>
                                ))}
                            </TagBox>
                            <div className="p-mt-2">
                                <Button label="Ver más" icon="pi pi-info-circle" className="p-button-sm p-ripple" />
                                <Ripple />
                            </div>
                        </Card>
                    ))}
            </GridCarreras>
        </Container>
    );
};

const Container = styled.div`
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

const TagBox = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
        background: #ecf0f1;
        padding: 0.4rem 0.8rem;
        border-radius: 1rem;
        font-size: 0.85rem;
        position: relative;
        overflow: hidden;
    }
`;

export default ExploradorCarreras;
