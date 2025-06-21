import React, { useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import styled from "styled-components";
 
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [lastResult, setLastResult] = useState(null);  
    const [showForm, setShowForm] = useState(false);  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchLastResult(user.uid);
            } else {
                setLoading(false);
                setLastResult(null);
                setShowForm(true);  
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchLastResult = async (uid) => {
        try {
            const q = query(
                collection(db, "academico"), 
                orderBy("creadoEl", "desc"),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                setLastResult(doc.data());
                setShowForm(false);  
            } else {
                setShowForm(true);  
            }
        } catch (err) {
            setError('Error al cargar resultados anteriores: ' + err.message);
            setShowForm(true);  
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCalificaciones({ ...calificaciones, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!currentUser) {
            setError('No hay usuario autenticado para guardar el resultado.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://192.168.18.15:8000/prediccion/academico/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calificaciones),
            });

            if (!response.ok) throw new Error('Error en la predicción');
 
            const data = await response.json();
            setCarreraPredicha(data.carrera_predicha);
        
            await addDoc(collection(db, "academico"), {
                uid: currentUser.uid,
                respuestas: calificaciones,
                carrera: data.carrera_predicha,
                creadoEl: new Date(),
            });

            setLastResult({ 
                uid: currentUser.uid,
                respuestas: calificaciones,
                carrera: data.carrera_predicha,
                creadoEl: new Date(),
            });
            setShowForm(false); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRetake = () => {
        setLastResult(null);  
        setCalificaciones({ 
            arte_y_cultura: '', castellano_como_segunda_lengua: '', ciencia_y_tecnologia: '',
            ciencias_sociales: '', comunicacion: '', desarrollo_personal: '',
            educacion_fisica: '', educacion_para_el_trabajo: '', educacion_religiosa: '',
            ingles: '', matematica: '',
        });
        setCarreraPredicha(''); 
        setShowForm(true);  
        setError('');  
    };

    if (loading) {
        return <NotasContainer><p>Cargando información...</p></NotasContainer>;
    }

    return (
        <NotasContainer>
            {lastResult && !showForm ? (
                <div className="last-result-container">
                    <h2>Tu último resultado</h2>
                    <p>Fecha del test: {lastResult.creadoEl instanceof Date ? lastResult.creadoEl.toLocaleString() : new Date(lastResult.creadoEl.seconds * 1000).toLocaleString()}</p>
                    <h4>Carrera recomendada:</h4>
                    <p><strong>{lastResult.carrera}</strong></p>
                    <Button
                        label="Hacer el cuestionario de nuevo"
                        icon="pi pi-refresh"
                        onClick={handleRetake}
                        className="p-button-secondary mt-3"
                    />
                </div>
            ) : (
                <>
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
                            <h4>Carrera recomendada:</h4>
                            <p><strong>{carreraPredicha}</strong></p>
                        </div>
                    )}
                </>
            )}

            {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    {error}
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

    .last-result-container {
        border: 1px solid #ddd;
        padding: 1.5rem;
        border-radius: 8px;
        background-color: #f9f9f9;
        text-align: center;
    }
`;

export default NotasAcademicas;