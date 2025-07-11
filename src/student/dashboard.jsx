import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Splitter, SplitterPanel } from "primereact/splitter";
import styled from "styled-components";
import { Message } from "primereact/message";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
    const [loadingLocal, setLoadingLocal] = useState(true);
    const [academicResult, setAcademicResult] = useState(null);
    const [psychologicalResult, setPsychologicalResult] = useState(null);
    const [combinedAdvice, setCombinedAdvice] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const obtenerConsejo = (test, notas) => {
        const combinacionClave = `${test}|${notas}`;
        const consejos = {
            "Ingenierias|Ingenierias": {
                consejoAcademico: "Considera ingresar a carreras técnicas o universitarias enfocadas en resolver problemas estructurados, trabajar con herramientas, sistemas o máquinas, y usar las matemáticas y la lógica para crear soluciones útiles.",
                consejoPsicologico: "Opta por una carrera que te permita desarrollar soluciones prácticas en sectores como infraestructura, tecnología o industria.",
                carreras: [
                    "Ingeniería en sistemas",
                    "Ingeniería mecánica",
                    "Ingeniería electrónica",
                    "Ingeniería civil",
                    "Ingeniería industrial",
                    "Ingeniería en telecomunicaciones",
                    "Mecatrónica"
                ],
                consejoCompatibilidad: "Las carreras de ingeniería te ofrecen una base sólida para desenvolverte en sectores tecnológicos, industriales y productivos con alta demanda laboral."
            },
            "Sociales|Sociales": {
                consejoAcademico: "Puedes seguir una formación centrada en el análisis de los fenómenos sociales, el trabajo con personas y comunidades, o la educación y comunicación.",
                consejoPsicologico: "Elige una carrera que te permita aportar en el desarrollo humano, la mejora social o la gestión de relaciones humanas.",
                carreras: [
                    "Psicología",
                    "Trabajo social",
                    "Educación inicial",
                    "Educación secundaria",
                    "Comunicación social",
                    "Sociología",
                    "Gestión pública"
                ],
                consejoCompatibilidad: "Estas carreras permiten generar un impacto positivo en la sociedad y participar activamente en la transformación de tu entorno."
            },
            "Biomedicas|Biomedicas": {
                consejoAcademico: "Dirige tu formación hacia carreras del área de salud o ciencias biológicas, donde puedas aprender sobre el cuerpo humano, el bienestar y la investigación científica.",
                consejoPsicologico: "Busca una carrera que te permita mejorar la calidad de vida de las personas mediante el diagnóstico, la atención médica o el desarrollo científico.",
                carreras: [
                    "Medicina",
                    "Enfermería",
                    "Nutrición",
                    "Tecnología médica",
                    "Obstetricia",
                    "Farmacia",
                    "Laboratorio clínico"
                ],
                consejoCompatibilidad: "Las ciencias de la salud te ofrecen una ruta vocacional con sentido humano y compromiso con el cuidado de los demás."
            },
            "Ingenierías|Sociales": {
                consejoAcademico: "Considera carreras que combinen tecnología y gestión, donde puedas trabajar en proyectos, comunicar ideas técnicas o liderar equipos interdisciplinarios.",
                consejoPsicologico: "Elige un camino que te permita unir el uso de herramientas tecnológicas con la capacidad de comunicar, liderar o coordinar personas.",
                carreras: [
                    "Ingeniería industrial",
                    "Marketing tecnológico",
                    "Gestión de proyectos",
                    "Administración",
                    "Comunicación digital"
                ],
                consejoCompatibilidad: "Las carreras híbridas permiten unir la eficiencia de lo técnico con el impacto de lo social, abriendo múltiples oportunidades en empresas y organizaciones."
            },
            "Ingenierías|Biomedicas": {
                consejoAcademico: "Puedes formarte en áreas donde la tecnología se aplica a la salud y al cuidado de las personas, integrando conocimiento técnico con innovación médica.",
                consejoPsicologico: "Opta por programas que combinen salud y tecnología para diseñar dispositivos, sistemas o servicios relacionados al cuidado clínico.",
                carreras: [
                    "Ingeniería biomédica",
                    "Tecnología médica",
                    "Biotecnología",
                    "Informática médica",
                    "Salud digital"
                ],
                consejoCompatibilidad: "Este tipo de formación te permite trabajar en hospitales, centros de investigación o empresas que desarrollan soluciones para mejorar la atención en salud."
            },
            "Sociales|Ingenierías": {
                consejoAcademico: "Puedes explorar carreras donde lo humano y lo técnico se complementen, como la enseñanza de ciencias, la gestión educativa o la divulgación científica.",
                consejoPsicologico: "Busca formarte en áreas donde puedas traducir el conocimiento técnico en herramientas útiles para la educación, la comunicación o el servicio social.",
                carreras: [
                    "Educación secundaria en matemática o ciencia",
                    "Comunicación científica",
                    "Periodismo especializado",
                    "Docencia técnica"
                ],
                consejoCompatibilidad: "Esta combinación puede llevarte a ser un puente entre la ciencia y la sociedad, facilitando el aprendizaje, la inclusión y la innovación educativa."
            },
            "Sociales|Biomedicas": {
                consejoAcademico: "Dirige tu formación a campos donde la salud y la intervención social se cruzan, como el apoyo comunitario, el acompañamiento emocional o la educación en salud.",
                consejoPsicologico: "Elige carreras orientadas a atender las necesidades de grupos vulnerables, fomentar la prevención o guiar procesos terapéuticos.",
                carreras: [
                    "Psicología",
                    "Trabajo social en salud",
                    "Terapia ocupacional",
                    "Promoción comunitaria en salud",
                    "Salud pública"
                ],
                consejoCompatibilidad: "Estas áreas te preparan para acompañar a las personas desde lo emocional, lo educativo y lo comunitario, con una mirada integral del bienestar."
            },
            "Biomedicas|Sociales": {
                consejoAcademico: "Considera estudiar programas orientados a la educación científica, la divulgación médica o la gestión social en temas de salud.",
                consejoPsicologico: "Puedes combinar el conocimiento biológico con la habilidad de explicar, guiar o liderar proyectos en beneficio de comunidades.",
                carreras: [
                    "Educación en ciencia y tecnología",
                    "Comunicación científica",
                    "Promoción de salud",
                    "Psicología educativa"
                ],
                consejoCompatibilidad: "Esta combinación es útil para generar conciencia pública sobre salud, trabajar en campañas educativas o diseñar estrategias de prevención y bienestar."
            },
            "Biomedicas|Ingenierías": {
                consejoAcademico: "Puedes explorar una carrera que combine el enfoque analítico y científico de la salud con el diseño, desarrollo o mejora de sistemas técnicos.",
                consejoPsicologico: "Elige una ruta donde la investigación biomédica se apoye en herramientas tecnológicas para crear soluciones de alto impacto.",
                carreras: [
                    "Bioingeniería",
                    "Ingeniería clínica",
                    "Simulación médica",
                    "Investigación y desarrollo en dispositivos médicos",
                    "Inteligencia artificial aplicada a la salud"
                ],
                consejoCompatibilidad: "Esta combinación permite vincular la ciencia de la vida con la ingeniería para resolver retos del sector salud desde la innovación tecnológica."
            }
        };

        return consejos[combinacionClave] || null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserResults(user.uid);
            } else {
                setLoadingLocal(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (academicResult && psychologicalResult) {
            setCombinedAdvice(obtenerConsejo(academicResult.carrera, psychologicalResult.carrera));
        }
    }, [academicResult, psychologicalResult]);

    const fetchUserResults = async (uid) => {
        try {
            const academicQuery = query(
                collection(db, "academico"),
                orderBy("creadoEl", "desc"),
                limit(1)
            );
            const academicSnapshot = await getDocs(academicQuery);
            if (!academicSnapshot.empty) {
                setAcademicResult(academicSnapshot.docs[0].data());
            }

            const psychologicalQuery = query(
                collection(db, "psicologica"),
                orderBy("creadoEl", "desc"),
                limit(1)
            );
            const psychologicalSnapshot = await getDocs(psychologicalQuery);
            if (!psychologicalSnapshot.empty) {
                setPsychologicalResult(psychologicalSnapshot.docs[0].data());
            }
        } catch (error) {
            console.error("Error fetching user results:", error);
        } finally {
            setLoadingLocal(false);
        }
    };

    return (
        <Container>
            <h2>👋 Bienvenido a tu Panel PREDU</h2>
            <p>Explora tus opciones y sigue avanzando en tu camino vocacional.</p>

            <Splitter style={{ height: "calc(100vh - 50px)", marginTop: "2rem" }}>
                <SplitterPanel size={20} minSize={10} style={{ padding: "10px", borderRight: "1px solid #ddd" }}>
                    <h3>Información del Modelo ML 1</h3>
                    {loadingLocal ? (
                        <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    ) : academicResult ? (
                        <div>
                            <p>Carrera Académica Sugerida:</p>
                            <p><strong>{academicResult.carrera}</strong></p>
                        </div>
                    ) : (
                        <Message severity="info" text="No se encontraron resultados académicos." />
                    )}
                </SplitterPanel>

                <SplitterPanel size={60} minSize={30} style={{ padding: "10px" }}>
                    {loadingLocal ? (
                        <Grid>
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} style={{ padding: "1.5rem" }}>
                                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                                    <Skeleton width="60%" height="1rem" className="mb-2" />
                                    <Skeleton width="40%" height="2rem" />
                                </Card>
                            ))}
                        </Grid>
                    ) : (!academicResult || !psychologicalResult) ? (
                        <Message severity="warn" text="Para recibir recomendaciones, asegúrate de tener resultados tanto académicos como psicológicos." />
                    ) : (
                        <Grid>
                            <StyledCard title="Resultado de Orientación Vocacional">
                                {combinedAdvice ? (
                                    <>
                                        <p><strong>Consejo Académico:</strong> {combinedAdvice.consejoAcademico}</p>
                                        <p><strong>Consejo Psicológico:</strong> {combinedAdvice.consejoPsicologico}</p>
                                        <p><strong>Consejo de Compatibilidad:</strong> {combinedAdvice.consejoCompatibilidad}</p>
                                        <p><strong>Carreras sugeridas:</strong></p>
                                        <ul>
                                            {combinedAdvice.carreras.map((carrera, index) => (
                                                <li key={index}>{index + 1}. {carrera}</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Message severity="info" text="No hay un consejo disponible para la combinación de resultados actual." />
                                )}
                            </StyledCard>
                        </Grid>
                    )}
                </SplitterPanel>

                <SplitterPanel size={20} minSize={10} style={{ padding: "10px", borderLeft: "1px solid #ddd" }}>
                    <h3>Información del Modelo ML 2</h3>
                    {loadingLocal ? (
                        <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    ) : psychologicalResult ? (
                        <div>
                            <p>Carrera Psicológica Sugerida:</p>
                            <p><strong>{psychologicalResult.carrera}</strong></p>
                        </div>
                    ) : (
                        <Message severity="info" text="No se encontraron resultados psicológicos." />
                    )}
                </SplitterPanel>
            </Splitter>
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const StyledCard = styled(Card)`
    text-align: left;
    padding: 1.5rem;
`;

export default Dashboard;