import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import styled from "styled-components";
import './NotasAcademicas.css';  // Asegúrate de usar './' si está en el mismo directorio

 
import { collection, addDoc, getDocs } from "firebase/firestore";
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

    // Función que devuelve el ícono correspondiente a cada curso
    const getIconForCourse = (course) => {
        switch(course) {
            case 'arte_y_cultura':
                return 'pi-palette';  // Ícono de pintura o arte
            case 'castellano_como_segunda_lengua':
                return 'pi-book';  // Ícono de libro para castellano
            case 'ciencia_y_tecnologia':
                return 'pi-flask';  // Ícono de laboratorio de ciencias
            case 'ciencias_sociales':
                return 'pi-globe';  // Ícono de globo para ciencias sociales
            case 'comunicacion':
                return 'pi-comments';  // Ícono de comunicación
            case 'desarrollo_personal':
                return 'pi-user';  // Ícono de usuario para desarrollo personal
            case 'educacion_fisica':
                return 'pi-run';  // Ícono de correr para educación física
            case 'educacion_para_el_trabajo':
                return 'pi-briefcase';  // Ícono de maletín para educación para el trabajo
            case 'educacion_religiosa':
                return 'pi-church';  // Ícono de iglesia para educación religiosa
            case 'ingles':
                return 'pi-language';  // Ícono de idioma para inglés
            case 'matematica':
                return 'pi-calculator';  // Ícono de calculadora para matemáticas
            default:
                return 'pi-question';  // Ícono de pregunta para casos desconocidos
        }
    }


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
                await fetchAllResultsAndFilter(user.uid);
            } else {
                setLoading(false);
                setLastResult(null);
                setShowForm(true);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchAllResultsAndFilter = async (uid) => {
        try {
            const querySnapshot = await getDocs(collection(db, "academico"));
            let userResults = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.uid === uid) {
                    userResults.push(data);
                }
            });

            if (userResults.length > 0) {
                userResults.sort((a, b) => b.creadoEl.toDate() - a.creadoEl.toDate());
                setLastResult(userResults[0]);
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
        const {name, value} = e.target;
        setCalificaciones({...calificaciones, [name]: value});
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
            const response = await fetch('http://127.0.0.1:8000/prediccion/academico/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
        return <div><p>🔄 Cargando información...</p></div>;
    }

    return (
        <div className="container">
            {/* Primer bloque: Resultado previo */}
            {lastResult && !showForm ? (
                <Card className="result-card">
                    <h2>📊 Tu último resultado</h2>
                    <p>📅 Fecha del test: {lastResult.creadoEl instanceof Date ? lastResult.creadoEl.toLocaleString() : new Date(lastResult.creadoEl.seconds * 1000).toLocaleString()}</p>
                    <h4>🎓 Carrera recomendada:</h4>
                    <p><strong>{lastResult.carrera}</strong></p>
                    <Button
                        label="🔁 Hacer el cuestionario de nuevo"
                        icon="pi pi-refresh"
                        onClick={handleRetake}
                        className="p-button-secondary mt-3"
                    />
                </Card>
            ) : (
                <>
                    {/* Título fuera del Card */}
                    <h2>✍️ Ingresa tus calificaciones</h2>
                    <p>🔍 Completa los campos con tus notas para obtener una recomendación vocacional.</p>

                    <Card className="form-card">
                        <form onSubmit={handleSubmit} className="grid gap-2">
                            {/* Mapeo de los cursos */}
                            {Object.entries(calificaciones).map(([key, value]) => (
                                <div key={key} className="field">
                                    <div className="input-group">
                                        <label>{key.replaceAll("_", " ").toUpperCase()}:</label>
                                        <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className={`pi ${getIconForCourse(key)}`}></i>
                                        </span>
                                            <InputText
                                                placeholder="Ejemplo: AD, A, B, C"
                                                name={key}
                                                value={value}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </form>
                        <div className="center-btn">
                            <Button type="submit" label={loading ? "🔄 Procesando..." : "Procesar Carrera"} icon="pi pi-check" loading={loading}/>
                        </div>
                        {/* Resultado de la carrera recomendada */}
                        {carreraPredicha && !loading && (
                            <div className="mt-4">
                                <h4>🎯 Carrera recomendada:</h4>
                                <p><strong>{carreraPredicha}</strong></p>
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Sección de errores */}
            {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );


};

    export default NotasAcademicas;