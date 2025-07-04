import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message'; // Importamos el componente Message para los mensajes de error
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import './NotasAcademicas.css';  // Asegúrate de usar './' si está en el mismo directorio

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

    const [errorMessage, setErrorMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [carreraPredicha, setCarreraPredicha] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [disabledFields, setDisabledFields] = useState({}); // Controla qué campos están deshabilitados

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

    const getIconForCourse = (course) => {
        switch(course) {
            case 'arte_y_cultura':
                return 'pi-palette';
            case 'castellano_como_segunda_lengua':
                return 'pi-book';
            case 'ciencia_y_tecnologia':
                return 'pi-chart-bar';
            case 'ciencias_sociales':
                return 'pi-globe';
            case 'comunicacion':
                return 'pi-comments';
            case 'desarrollo_personal':
                return 'pi-user';
            case 'educacion_fisica':
                return 'pi-heart';
            case 'educacion_para_el_trabajo':
                return 'pi-briefcase';
            case 'educacion_religiosa':
                return 'pi-address-book';
            case 'ingles':
                return 'pi-language';
            case 'matematica':
                return 'pi-calculator';
            default:
                return 'pi-question';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación que solo permita AD, A, B, C
        const regex = /^(AD|A|B|C)$/i;

        if (!regex.test(value) && value !== '') {
            setErrorMessage('Solo se permiten las letras AD, A, B, C.');
            // Deshabilitar todos los campos, excepto el que tiene el error
            setDisabledFields((prevState) => {
                const newDisabledFields = { ...prevState };
                newDisabledFields[name] = false; // El campo con error se habilita
                return newDisabledFields;
            });
        } else {
            setErrorMessage('');
            // Habilitar todos los campos cuando no haya error
            setDisabledFields({});
        }

        setCalificaciones({ ...calificaciones, [name]: value.toUpperCase() });
    };

    const validateForm = () => {
        const allFieldsValid = Object.values(calificaciones).every(
            (value) => /^(AD|A|B|C)$/i.test(value)
        );
        setIsFormValid(allFieldsValid);
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
        setDisabledFields({});
    };

    if (loading) {
        return <div><p>🔄 Cargando información...</p></div>;
    }

    return (
        <div className="container">
            {lastResult && !showForm ? (
                <Card className="result-card">
                    <div className="center-result">
                        <h2>📊 Tu último resultado</h2>
                        <p>📅 Fecha del test: {lastResult.creadoEl instanceof Date ? lastResult.creadoEl.toLocaleString() : new Date(lastResult.creadoEl.seconds * 1000).toLocaleString()}</p>
                        <h4>🎓 Carrera recomendada:</h4>
                        <h2><strong>{lastResult.carrera}</strong></h2>
                        <Button
                            label="Hacer el cuestionario de nuevo"
                            icon="pi pi-refresh"
                            onClick={handleRetake}
                            className="p-button-secondary mt-3"
                        />
                    </div>
                </Card>
            ) : (
                <>
                    <h2 className="center-text">✍️ Ingresa tus calificaciones</h2>
                    <p className="center-text">🔍 Completa los campos con tus notas para obtener una recomendación vocacional.</p>

                    <Card className="form-card">
                        <form onSubmit={handleSubmit} className="grid gap-2">
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
                                                onBlur={validateForm}
                                                disabled={disabledFields[key]} // Deshabilitar todos los campos, excepto el que tiene el error
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {errorMessage && <Message severity="error" text={errorMessage} className="mt-3" />}

                            <div className="center-btn">
                                <Button
                                    type="submit"
                                    label={loading ? "🔄 Procesando..." : "Procesar Carrera"}
                                    icon="pi pi-check"
                                    loading={loading}
                                    disabled={!isFormValid} // Desactivamos el botón si el formulario no es válido
                                />
                            </div>
                        </form>

                        {carreraPredicha && !loading && (
                            <div className="mt-4">
                                <h4>🎯 Carrera recomendada:</h4>
                                <p><strong>{carreraPredicha}</strong></p>
                            </div>
                        )}
                    </Card>
                </>
            )}

            {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

export default NotasAcademicas;
