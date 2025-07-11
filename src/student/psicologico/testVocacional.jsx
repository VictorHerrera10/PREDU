import React, { useState, useEffect } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { FaHammer, FaFlask, FaPalette, FaUserFriends, FaBusinessTime, FaCogs } from 'react-icons/fa';

import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const bloques = [
    {
        nombre: "Actividades",
        color: "#42A5F5",
        preguntas: [
            { id: "R01", texto: "Reparar artículos eléctricos", tipo: "R", gif: "/pregunta-1.gif"},
            { id: "I01", texto: "Leer libros o revistas científicas", tipo: "I", gif: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=I01" },
            { id: "A01", texto: "Bosquejar, dibujar o pintar", tipo: "A", gif: "https://via.placeholder.com/150/00FF00/FFFFFF?Text=A01" },
            { id: "S01", texto: "Escribir cartas a los amigos", tipo: "S", gif: "https://via.placeholder.com/150/FFFF00/000000?Text=S01" },
            { id: "E01", texto: "Influir en los demás", tipo: "E", gif: "https://via.placeholder.com/150/000000/FFFFFF?Text=E01" },
            { id: "C01", texto: "Mantener el orden en el escritorio y mi habitación", tipo: "C", gif: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=C01" },
            { id: "R02", texto: "Reparar artículos eléctricos", tipo: "R", gif: "https://via.placeholder.com/150/0000FF/808080?Text=R01" },
        ],
    },
    {
        nombre: "Habilidades",
        color: "#66BB6A",
        preguntas: [
            { id: "R02", texto: "Usar herramientas eléctricas", tipo: "R", gif: "https://via.placeholder.com/150/0000FF/808080?Text=R02" },
            { id: "I02", texto: "Entender cómo funciona una lavadora", tipo: "I", gif: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=I02" },
            { id: "A02", texto: "Tocar un instrumento musical", tipo: "A", gif: "https://via.placeholder.com/150/00FF00/FFFFFF?Text=A02" },
            { id: "S02", texto: "Explicar cosas a otras personas", tipo: "S", gif: "https://via.placeholder.com/150/FFFF00/000000?Text=S02" },
            { id: "E02", texto: "Organizar equipos", tipo: "E", gif: "https://via.placeholder.com/150/000000/FFFFFF?Text=E02" },
            { id: "C02", texto: "Hacer cálculos contables", tipo: "C", gif: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=C02" },
        ],
    },
    {
        nombre: "Ocupaciones",
        color: "#FFA726",
        preguntas: [
            { id: "R03", texto: "Ser mecánico aeronáutico", tipo: "R", gif: "https://via.placeholder.com/150/0000FF/808080?Text=R03" },
            { id: "I03", texto: "Ser astrónomo", tipo: "I", gif: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=I03" },
            { id: "A03", texto: "Ser director de teatro", tipo: "A", gif: "https://via.placeholder.com/150/00FF00/FFFFFF?Text=A03" },
            { id: "S03", texto: "Ser orientador vocacional", tipo: "S", gif: "https://via.placeholder.com/150/FFFF00/000000?Text=S03" },
            { id: "E03", texto: "Ser ejecutivo de ventas", tipo: "E", gif: "https://via.placeholder.com/150/000000/FFFFFF?Text=E03" },
            { id: "C03", texto: "Ser auditor financiero", tipo: "C", gif: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=C03" },
        ],
    },
];

const TestCompletoRIASEC = () => {
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [progress, setProgress] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [sectionResults, setSectionResults] = useState({
        Actividades: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } },
        Habilidades: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } },
        Ocupaciones: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } }
    });
    const [testCompleted, setTestCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [procesando, setProcesando] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastResult, setLastResult] = useState(null);
    const [showTest, setShowTest] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchAllResultsAndFilter(user.uid);
            } else {
                setLoading(false);
                setLastResult(null);
                setShowTest(true);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchAllResultsAndFilter = async (uid) => {
        try {
            const querySnapshot = await getDocs(collection(db, "psicologica"));
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
                setShowTest(false);
            } else {
                setShowTest(true);
            }
        } catch (err) {
            setErrorMessage('Error al cargar resultados anteriores del test RIASEC: ' + err.message);
            setShowTest(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (questionId, value, section, tipo) => {
        setSelectedQuestions((prev) => ({
            ...prev,
            [questionId]: value,
        }));

        setAnsweredQuestions(prev => new Set(prev).add(questionId));

        const updatedResults = { ...sectionResults };
        updatedResults[section][tipo][value === 1 ? "yes" : "no"] += 1;
        setSectionResults(updatedResults);

        const totalAnswered = answeredQuestions.size + 1;
        const totalQuestions = bloques.reduce((acc, bloque) => acc + bloque.preguntas.length, 0);
        setProgress(Math.round((totalAnswered / totalQuestions) * 100));
    };

    const openQuestionDialog = (question) => {
        if (answeredQuestions.has(question.id)) {
            setErrorMessage("Ya has respondido esta pregunta.");
            return;
        }

        setErrorMessage("");
        setCurrentQuestion(question);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAnswer = (answer) => {
        const section = getSection(currentQuestion.id);
        const tipo = currentQuestion.tipo;
        handleCheckboxChange(currentQuestion.id, answer, section, tipo);

        const nextQuestion = getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
        } else {
            setOpenDialog(false);
        }
    };

    const getNextQuestion = () => {
        const allQuestions = bloques.flatMap(block => block.preguntas);
        const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
        
        for (let i = currentIndex + 1; i < allQuestions.length; i++) {
            if (!answeredQuestions.has(allQuestions[i].id)) {
                return allQuestions[i];
            }
        }
        return null;
    };

    const resumenFinalRIASEC = () => {
        const resumen = { R: [0, 0], I: [0, 0], A: [0, 0], S: [0, 0], E: [0, 0], C: [0, 0] };
        Object.values(sectionResults).forEach(section => {
            for (const tipo in section) {
                resumen[tipo][0] += section[tipo].yes;
                resumen[tipo][1] += section[tipo].no;
            }
        });
        return resumen;
    };

    const procesarResultado = async () => {
        setProcesando(true);
        const resumen = resumenFinalRIASEC();

        const payload = {
            realista: resumen.R[0],
            investigador: resumen.I[0],
            artistico: resumen.A[0],
            social: resumen.S[0],
            emprendedor: resumen.E[0],
            convencional: resumen.C[0],
        };

        if (!currentUser) {
            setResultado("Error: No hay usuario autenticado.");
            setProcesando(false);
            return;
        }

        try {
            const res = await fetch("http://192.168.18.15:8000/prediccion/psicologica/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setResultado(data.facultad_predicha ?? data.carrera ?? JSON.stringify(data));

            await addDoc(collection(db, "psicologica"), {
                uid: currentUser.uid,
                respuestas: payload,
                carrera: data.facultad_predicha,
                creadoEl: new Date(),
            });

            setLastResult({
                uid: currentUser.uid,
                respuestas: payload,
                carrera: data.facultad_predicha,
                creadoEl: new Date(),
            });
            setShowTest(false);
        } catch (err) {
            setResultado("Error al procesar la predicción.");
        } finally {
            setProcesando(false);
        }
    };

    const handleFinalizar = () => {
        setTestCompleted(true);
    };

    const getSection = (questionId) => {
        for (const block of bloques) {
            if (block.preguntas.some(q => q.id === questionId)) {
                return block.nombre;
            }
        }
        return null;
    };

    const isFinalizarEnabled = bloques.every(b => b.preguntas.every(q => answeredQuestions.has(q.id)));

    const handleRetake = () => {
        setLastResult(null);
        setSelectedQuestions({});
        setOpenDialog(false);
        setCurrentQuestion(null);
        setProgress(0);
        setAnsweredQuestions(new Set());
        setSectionResults({
            Actividades: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } },
            Habilidades: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } },
            Ocupaciones: { R: { yes: 0, no: 0 }, I: { yes: 0, no: 0 }, A: { yes: 0, no: 0 }, S: { yes: 0, no: 0 }, E: { yes: 0, no: 0 }, C: { yes: 0, no: 0 } }
        });
        setTestCompleted(false);
        setErrorMessage("");
        setProcesando(false);
        setResultado(null);
        setShowTest(true);
    };

    if (loading) {
        return <div className="test-container p-d-flex p-flex-column p-align-center p-mt-4"><p>Cargando información...</p></div>;
    }

    return (
        <div className="test-container p-d-flex p-flex-column p-align-center p-mt-4">
            {lastResult && !showTest ? (
                <div className="last-result-container p-shadow-2">
                    <h2>Tu último resultado del test RIASEC</h2>
                    <p>Fecha del test: {lastResult.creadoEl instanceof Date ? lastResult.creadoEl.toLocaleString() : new Date(lastResult.creadoEl.seconds * 1000).toLocaleString()}</p>
                    <h4>Carrera sugerida:</h4>
                    <p><strong>{lastResult.carrera}</strong></p>
                    <Button
                        label="Hacer el test de nuevo"
                        icon="pi pi-refresh"
                        onClick={handleRetake}
                        className="p-button-secondary p-mt-3"
                    />
                </div>
            ) : (
                <>
                    {testCompleted ? (
                        <div className="p-d-flex p-flex-column p-align-center p-mt-4" style={{ width: '100%', maxWidth: '800px' }}>
                            <table className="p-d-table p-shadow-2" style={{ width: '100%', textAlign: 'center' }}>
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Sí</th>
                                        <th>No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(resumenFinalRIASEC()).map(([tipo, [si, no]]) => (
                                        <tr key={tipo}>
                                            <td>{tipo}</td>
                                            <td>{si}</td>
                                            <td>{no}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!resultado ? (
                                <>
                                    <Button
                                        label="Procesar información"
                                        onClick={procesarResultado}
                                        className="p-button-primary p-mt-3"
                                        disabled={procesando || !currentUser}
                                    />
                                    {procesando && <p className="p-mt-2">Procesando predicción...</p>}
                                    {!currentUser && <p className="p-mt-2" style={{ color: 'red' }}>Inicia sesión para procesar la información.</p>}
                                </>
                            ) : (
                                <div className="p-mt-3">
                                    <h4>Carrera sugerida:</h4>
                                    <p><strong>{resultado}</strong></p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-grid p-justify-center" style={{ width: '80%', margin: 'auto', marginTop: '20px' }}>
                            <Accordion style={{ width: '100%' }}>
                                {bloques.map((bloque) => (
                                    <AccordionTab key={bloque.nombre} header={bloque.nombre}>
                                        <div className="flex flex-wrap justify-content-center gap-3 mb-4">
                                            {bloque.preguntas.map((pregunta, idx) => (
                                                <div key={pregunta.id} className="p-col-12 p-md-4" style={{ textAlign: 'center' }}>
                                                    <Button
                                                        icon={pregunta.tipo === "R" ? <FaHammer /> :
                                                            pregunta.tipo === "I" ? <FaFlask /> :
                                                                pregunta.tipo === "A" ? <FaPalette /> :
                                                                    pregunta.tipo === "S" ? <FaUserFriends /> :
                                                                        pregunta.tipo === "E" ? <FaBusinessTime /> : <FaCogs />}
                                                        aria-label="Pregunta"
                                                        onClick={() => openQuestionDialog(pregunta)}
                                                        disabled={answeredQuestions.has(pregunta.id)}
                                                        className={answeredQuestions.has(pregunta.id) ? "p-button-secondary" : "p-button-primary"}
                                                    />
                                                    <div>{idx + 1}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionTab>
                                ))}
                            </Accordion>

                            <ProgressBar value={progress} showValue={true} style={{ width: "100%", marginTop: "30px" }} />
                        </div>
                    )}

                    {!testCompleted && isFinalizarEnabled && (
                        <div className="p-d-flex p-justify-center" style={{ width: "100%", marginTop: "20px" }}>
                            <Button label="Finalizar" onClick={handleFinalizar} className="p-button-success p-mt-4" />
                        </div>
                    )}
                </>
            )}

            <Dialog
                visible={openDialog}
                style={{ width: '400px' }}
                onHide={handleCloseDialog}
                header={
                    currentQuestion
                        ? `Pregunta ${
                            bloques
                                .flatMap(b => b.preguntas)
                                .findIndex(p => p.id === currentQuestion.id) + 1
                        }`
                        : ""
                }
            >
                <div>
                    <p style={{ textAlign: 'center' }}>
                        {currentQuestion ? currentQuestion.texto : "Cargando pregunta..."}
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        {currentQuestion ? (
                            <img
                                src={currentQuestion.gif}
                                alt="gif de la pregunta"
                                style={{ maxWidth: '150px', maxHeight: '150px', width: '100%', height: 'auto' }}
                            />
                        ) : null}
                    </div>
                    {errorMessage && (
                        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        {answeredQuestions.has(currentQuestion?.id) ? (
                            <Button label="Siguiente pregunta" onClick={handleAnswer} className="p-button-primary" />
                        ) : (
                            <>
                                <Button label="Sí" onClick={() => handleAnswer(1)} className="p-button-success p-mr-2" />
                                <Button label="No" onClick={() => handleAnswer(0)} className="p-button-danger" />
                            </>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TestCompletoRIASEC;