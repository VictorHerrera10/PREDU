import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const PrediccionAcademica = () => {
    // Estado para las calificaciones y la predicción
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
    const [visible, setVisible] = useState(false); // Estado para controlar la visibilidad del modal

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCalificaciones({
            ...calificaciones,
            [name]: value,
        });
    };

    // Función para enviar los datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/prediccion/academico/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calificaciones),
            });

            if (!response.ok) {
                throw new Error('Error en la predicción');
            }

            const data = await response.json();
            setCarreraPredicha(data.carrera_predicha);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Abrir el modal
    const showModal = () => setVisible(true);

    // Cerrar el modal
    const hideModal = () => setVisible(false);

    return (
        <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Arte y Cultura:</label>
                        <input
                            type="text"
                            name="arte_y_cultura"
                            value={calificaciones.arte_y_cultura}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Castellano como Segunda Lengua:</label>
                        <input
                            type="text"
                            name="castellano_como_segunda_lengua"
                            value={calificaciones.castellano_como_segunda_lengua}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Ciencia y Tecnología:</label>
                        <input
                            type="text"
                            name="ciencia_y_tecnologia"
                            value={calificaciones.ciencia_y_tecnologia}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Ciencias Sociales:</label>
                        <input
                            type="text"
                            name="ciencias_sociales"
                            value={calificaciones.ciencias_sociales}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Comunicación:</label>
                        <input
                            type="text"
                            name="comunicacion"
                            value={calificaciones.comunicacion}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Desarrollo Personal:</label>
                        <input
                            type="text"
                            name="desarrollo_personal"
                            value={calificaciones.desarrollo_personal}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Educación Física:</label>
                        <input
                            type="text"
                            name="educacion_fisica"
                            value={calificaciones.educacion_fisica}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Educación para el Trabajo:</label>
                        <input
                            type="text"
                            name="educacion_para_el_trabajo"
                            value={calificaciones.educacion_para_el_trabajo}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Educación Religiosa:</label>
                        <input
                            type="text"
                            name="educacion_religiosa"
                            value={calificaciones.educacion_religiosa}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Inglés:</label>
                        <input
                            type="text"
                            name="ingles"
                            value={calificaciones.ingles}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Matemática:</label>
                        <input
                            type="text"
                            name="matematica"
                            value={calificaciones.matematica}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Predecir Carrera'}
                    </button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {carreraPredicha && !loading && (
                    <div>
                        <h3>Carrera recomendada: {carreraPredicha}</h3>
                    </div>
                )}
        </div>
    );
};

export default PrediccionAcademica;
