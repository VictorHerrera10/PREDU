import React, { useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { FaHammer, FaFlask, FaPalette, FaUserFriends, FaBusinessTime, FaCogs } from 'react-icons/fa';

// Definimos las preguntas con el tipo RIASEC y gif asociado
const preguntas = [
    {
        nombre: "Actividades",
        color: "#42A5F5",
        preguntas: [
            { id: "R01", texto: "Reparar artículos eléctricos", tipo: "R", gif: "https://via.placeholder.com/150/0000FF/808080?Text=R01" },
            { id: "I01", texto: "Leer libros o revistas científicas", tipo: "I", gif: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=I01" },
            { id: "A01", texto: "Bosquejar, dibujar o pintar", tipo: "A", gif: "https://via.placeholder.com/150/00FF00/FFFFFF?Text=A01" },
            { id: "S01", texto: "Escribir cartas a los amigos", tipo: "S", gif: "https://via.placeholder.com/150/FFFF00/000000?Text=S01" },
            { id: "E01", texto: "Influir en los demás", tipo: "E", gif: "https://via.placeholder.com/150/000000/FFFFFF?Text=E01" },
            { id: "C01", texto: "Mantener el orden en el escritorio y mi habitación", tipo: "C", gif: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=C01" },
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

    const handleCheckboxChange = (questionId, value, section, tipo) => {
        setSelectedQuestions((prev) => ({
            ...prev,
            [questionId]: value,
        }));

        setAnsweredQuestions(prev => new Set(prev).add(questionId));

        // Actualizar resultados por tipo en cada sección
        const updatedResults = { ...sectionResults };
        updatedResults[section][tipo][value === 1 ? "yes" : "no"] += 1;
        setSectionResults(updatedResults);

        const totalAnswered = answeredQuestions.size + 1;
        const totalQuestions = preguntas.reduce((acc, bloque) => acc + bloque.preguntas.length, 0);
        setProgress(Math.round((totalAnswered / totalQuestions) * 100));
    };

    const openQuestionDialog = (question) => {
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
        setOpenDialog(false);

        // Abre la siguiente pregunta
        const nextQuestion = getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setOpenDialog(true);
        }
    };

    const getNextQuestion = () => {
        // Encuentra la siguiente pregunta en la misma sección
        const currentBlock = preguntas.find(block =>
            block.preguntas.some(q => q.id === currentQuestion.id)
        );
        const currentIndex = currentBlock.preguntas.findIndex(q => q.id === currentQuestion.id);
        if (currentIndex + 1 < currentBlock.preguntas.length) {
            return currentBlock.preguntas[currentIndex + 1];
        }
        return null; // No más preguntas en esta sección
    };

    const handleFinalizar = () => {
        setTestCompleted(true);
    };

    // Determinar la sección de la pregunta
    const getSection = (questionId) => {
        if (preguntas[0].preguntas.some(q => q.id === questionId)) return 'Actividades';
        if (preguntas[1].preguntas.some(q => q.id === questionId)) return 'Habilidades';
        return 'Ocupaciones';
    };

    // Verificar si todas las preguntas han sido respondidas
    const isFinalizarEnabled = preguntas.every(b => b.preguntas.every(q => answeredQuestions.has(q.id)));

    return (
        <div className="test-container p-d-flex p-flex-column p-align-center p-mt-4">
            {testCompleted ? (
                <div>
                    {/* Mostrar resultados por tipo dentro de cada sección */}
                    {Object.keys(sectionResults).map(section => (
                        <Card key={section} title={`Resultados de la sección ${section}`}>
                            {['R', 'I', 'A', 'S', 'E', 'C'].map(tipo => (
                                <div key={tipo}>
                                    <p>{`Tipo ${tipo}: Sí: ${sectionResults[section][tipo].yes}, No: ${sectionResults[section][tipo].no}`}</p>
                                </div>
                            ))}
                        </Card>
                    ))}
                    {/* Mostrar resumen general */}
                    <Card title="Resumen General">
                        <p>Sí: {Object.values(sectionResults).reduce((acc, curr) => acc + Object.values(curr).reduce((subAcc, subCurr) => subAcc + subCurr.yes, 0), 0)}</p>
                        <p>No: {Object.values(sectionResults).reduce((acc, curr) => acc + Object.values(curr).reduce((subAcc, subCurr) => subAcc + subCurr.no, 0), 0)}</p>
                    </Card>
                </div>
            ) : (
                <div className="p-grid p-justify-center" style={{ width: '150vh', margin: 'auto', marginTop: '20px' }}>
                    <Accordion style={{ width: '100%' }}>
                        {/* Render secciones Actividades, Habilidades, Ocupaciones */}
                        {preguntas.map((bloque) => (
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

            {/* Finalizar button */}
            {!testCompleted && isFinalizarEnabled && (
                <div className="p-d-flex p-justify-center" style={{ width: "100%", marginTop: "20px" }}>
                    <Button label="Finalizar" onClick={handleFinalizar} className="p-button-success p-mt-4" />
                </div>
            )}

            {/* Ventana emergente para la pregunta seleccionada */}
            <Dialog
                visible={openDialog}
                style={{ width: '400px' }}
                onHide={handleCloseDialog}
                header={
                    currentQuestion
                        ? `Pregunta ${
                            preguntas
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
                        {currentQuestion ? <img src={currentQuestion.gif} alt="gif de la pregunta" /> : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Button label="Sí" onClick={() => handleAnswer(1)} className="p-button-success p-mr-2" />
                        <Button label="No" onClick={() => handleAnswer(0)} className="p-button-danger" />
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default TestCompletoRIASEC;
