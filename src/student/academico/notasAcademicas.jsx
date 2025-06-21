import React, { useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import styled from "styled-components";

const NotasAcademicas = () => {
    const [calificaciones, setCalificaciones] = useState({
        arte_y_cultura: '',
        castellano_como_segunda_lengua: '',
        ciencia_y_tecnologia: '',
        ciencias_sociales: '',
        comunicacion: '',
        desarrollo_personal: '',
        educacion_fisica: '',
        educacion_para_el_trabajo: '',
        educacion_religiosa: '',
        ingles: '',
        matematica: '',
    });

    const [carreraPredicha, setCarreraPredicha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCalificaciones({ ...calificaciones, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/prediccion/academico/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calificaciones),
            });

            if (!response.ok) throw new Error('Error en la predicción');

            const data = await response.json();
            setCarreraPredicha(data.carrera_predicha);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <NotasContainer>
            <h2>Ingresa tus calificaciones</h2>
            <p>Completa los campos con tus notas para obtener una recomendación vocacional.</p>

            <form onSubmit={handleSubmit} className="grid gap-2">
                {Object.entries(calificaciones).map(([key, value]) => (
                    <div key={key} className="field">
                        <label>{key.replaceAll("_", " ").toUpperCase()}:</label>
                        <input
                            type="text"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            placeholder="Ejemplo: AD, A, B o C"
                            className="p-inputtext"
                        />
                    </div>
                ))}
                <Button type="submit" label={loading ? "Procesando..." : "Predecir Carrera"} icon="pi pi-check" loading={loading} />
            </form>

            {carreraPredicha && !loading && (
                <div className="mt-4">
                    <h4>✅ Carrera recomendada:</h4>
                    <p><strong>{carreraPredicha}</strong></p>
                </div>
            )}

            {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    ❌ {error}
                </div>
            )}
        </NotasContainer>
    );
};

const NotasContainer = styled.div`
    padding: 2rem;
    max-width: 800px;
    margin: auto;

    .field {
        margin-bottom: 1rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .mt-4 {
        margin-top: 2rem;
    }
`;

export default NotasAcademicas;
