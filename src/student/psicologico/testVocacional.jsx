import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import { Timeline } from "primereact/timeline";
import styled from "styled-components";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const bloques = [
    {
        nombre: "Actividades",
        color: "#42A5F5",
        preguntas: [
            { id: "R01", texto: "Reparar artículos eléctricos", tipo: "R" },
            { id: "R02", texto: "Reparar automóviles", tipo: "R" },
            { id: "R03", texto: "Reparar artículos mecánicos", tipo: "R" },
            { id: "R04", texto: "Hacer artículos de madera", tipo: "R" },
            { id: "R05", texto: "Conducir camiones y tractores", tipo: "R" },
            { id: "R06", texto: "Utilizar herramientas de herrería o mecánicas", tipo: "R" },
            { id: "R07", texto: "Acondicionar un automóvil o Motocicleta para las carreras", tipo: "R" },
            { id: "R08", texto: "Tomar un curso de taller", tipo: "R" },
            { id: "R09", texto: "Tomar un curso de dibujo mecánico", tipo: "R" },
            { id: "R10", texto: "Tomar un curso de labrado en madera", tipo: "R" },
            { id: "R11", texto: "Tomar un curso de mecánica Automotriz", tipo: "R" },

            { id: "I01", texto: "Leer libros o revistas científicas", tipo: "I" },
            { id: "I02", texto: "Trabajar en un laboratorio", tipo: "I" },
            { id: "I03", texto: "Trabajar en un proyecto científico", tipo: "I" },
            { id: "I04", texto: "Construir modelos de cohetes", tipo: "I" },
            { id: "I05", texto: "Trabajar con un equipo de química", tipo: "I" },
            { id: "I06", texto: "Leer sobre temas especiales por sí mismo", tipo: "I" },
            { id: "I07", texto: "Resolver problemas de matemáticas o de ajedrez", tipo: "I" },
            { id: "I08", texto: "Tomar un curso de Física", tipo: "I" },
            { id: "I09", texto: "Tomar un curso de Química", tipo: "I" },
            { id: "I10", texto: "Tomar un curso de Geometría", tipo: "I" },
            { id: "I11", texto: "Tomar un curso de Biología", tipo: "I" },

            { id: "A01", texto: "Bosquejar, dibujar o pintar", tipo: "A" },
            { id: "A02", texto: "Asistir a conciertos", tipo: "A" },
            { id: "A03", texto: "Diseñar muebles o edificios", tipo: "A" },
            { id: "A04", texto: "Tocar una banda, conjunto o orquesta", tipo: "A" },
            { id: "A05", texto: "Tocar un instrumento musical", tipo: "A" },
            { id: "A06", texto: "Ir a recitales, conciertos o comedias musicales", tipo: "A" },
            { id: "A07", texto: "Leer novelas o temas de actualidad", tipo: "A" },
            { id: "A08", texto: "Hacer retratos o fotografía creativa", tipo: "A" },
            { id: "A09", texto: "Leer teatro", tipo: "A" },
            { id: "A10", texto: "Leer o escribir poesía", tipo: "A" },
            { id: "A11", texto: "Tomar un curso de arte", tipo: "A" },

            { id: "S01", texto: "Escribir cartas a los amigos", tipo: "S" },
            { id: "S02", texto: "Ir a la iglesia", tipo: "S" },
            { id: "S03", texto: "Pertenecer a clubes sociales", tipo: "S" },
            { id: "S04", texto: "Ayudar a otros en sus problemas personales", tipo: "S" },
            { id: "S05", texto: "Cuidar a los niños", tipo: "S" },
            { id: "S06", texto: "Asistir a fiestas", tipo: "S" },
            { id: "S07", texto: "Bailar", tipo: "S" },
            { id: "S08", texto: "Leer libros de psicología", tipo: "S" },
            { id: "S09", texto: "Asistir a reuniones y conferencias", tipo: "S" },
            { id: "S10", texto: "Asistir a eventos deportivos", tipo: "S" },
            { id: "S11", texto: "Hacer nuevos amigos", tipo: "S" },

            { id: "E01", texto: "Influir en los demás", tipo: "E" },
            { id: "E02", texto: "Vender", tipo: "E" },
            { id: "E03", texto: "Discutir sobre la política", tipo: "E" },
            { id: "E04", texto: "Administrar mi propio servicio o negocio", tipo: "E" },
            { id: "E05", texto: "Asistir a conferencias", tipo: "E" },
            { id: "E06", texto: "Ofrecer pláticas", tipo: "E" },
            { id: "E07", texto: "Ser oficial de cualquier grupo", tipo: "E" },
            { id: "E08", texto: "Supervisar el trabajo de otros", tipo: "E" },
            { id: "E09", texto: "Conocer a gente importante", tipo: "E" },
            { id: "E10", texto: "Dirigir a un grupo para la consecución de algún fin", tipo: "E" },
            { id: "E11", texto: "Participar en una campaña política", tipo: "E" },

            { id: "C01", texto: "Mantener el orden en el escritorio y mi habitación", tipo: "C" },
            { id: "C02", texto: "Mecanografiar documentos o cartas para mí mismo o para otros", tipo: "C" },
            { id: "C03", texto: "Sumar, restar, multiplicar y dividir números en negocios de cualquier tipo", tipo: "C" },
            { id: "C04", texto: "Manejar máquinas de negocio de cualquier tipo", tipo: "C" },
            { id: "C05", texto: "Llevar un registro pormenorizado de gastos", tipo: "C" },
            { id: "C06", texto: "Tomar un curso mecanográfico", tipo: "C" },
            { id: "C07", texto: "Tomar un curso de comercio", tipo: "C" },
            { id: "C08", texto: "Tomar un curso de teneduría de libros", tipo: "C" },
            { id: "C09", texto: "Tomar un curso de matemáticas comerciales", tipo: "C" },
            { id: "C10", texto: "Archivar cartas, informes, registros, etc.", tipo: "C" },
            { id: "C11", texto: "Escribir cartas de negocio", tipo: "C" },
        ],
    },
    {
        nombre: "Habilidades",
        color: "#66BB6A",
        preguntas: [
            { id: "R02", texto: "Usar herramientas eléctricas", tipo: "R" },
            { id: "I02", texto: "Entender cómo funciona una lavadora", tipo: "I" },
            { id: "A02", texto: "Tocar un instrumento musical", tipo: "A" },
            { id: "S02", texto: "Explicar cosas a otras personas", tipo: "S" },
            { id: "E02", texto: "Organizar equipos", tipo: "E" },
            { id: "C02", texto: "Hacer cálculos contables", tipo: "C" },
        ],
    },
    {
        nombre: "Ocupaciones",
        color: "#FFA726",
        preguntas: [
            { id: "R03", texto: "Ser mecánico aeronáutico", tipo: "R" },
            { id: "I03", texto: "Ser astrónomo", tipo: "I" },
            { id: "A03", texto: "Ser director de teatro", tipo: "A" },
            { id: "S03", texto: "Ser orientador vocacional", tipo: "S" },
            { id: "E03", texto: "Ser ejecutivo de ventas", tipo: "E" },
            { id: "C03", texto: "Ser auditor financiero", tipo: "C" },
        ],
    },
];

const TestCompletoRIASEC = () => {
    const [bloqueIndex, setBloqueIndex] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [bloqueFinalizado, setBloqueFinalizado] = useState(false);
    const [testFinalizado, setTestFinalizado] = useState(false);

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
            console.error('Error al cargar resultados anteriores del test RIASEC: ', err);
            setShowTest(true);
        } finally {
            setLoading(false);
        }
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
            console.log("Respuesta del backend:", data);
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

    const bloqueActual = bloques[bloqueIndex];
    const pregunta = bloqueActual.preguntas[preguntaActual];

    const responder = (valor) => {
        setRespuestas({
            ...respuestas,
            [pregunta.id]: { tipo: pregunta.tipo, valor },
        });

        if (preguntaActual + 1 < bloqueActual.preguntas.length) {
            setPreguntaActual(preguntaActual + 1);
        } else {
            setBloqueFinalizado(true);
        }
    };

    const avanzarBloque = () => {
        if (bloqueIndex + 1 < bloques.length) {
            setBloqueIndex(bloqueIndex + 1);
            setPreguntaActual(0);
            setBloqueFinalizado(false);
        } else {
            setTestFinalizado(true);
        }
    };

    const timelineData = bloqueActual.preguntas.map((_, i) => {
        const respondida = i < preguntaActual || bloqueFinalizado;
        const actual = i === preguntaActual && !bloqueFinalizado;
        return {
            numero: i + 1,
            color: respondida ? "#2E7D32" : actual ? bloqueActual.color : "#BDBDBD",
        };
    });

    const resumenRIASECporBloque = () => {
        const resumen = { R: [0, 0], I: [0, 0], A: [0, 0], S: [0, 0], E: [0, 0], C: [0, 0] };
        bloqueActual.preguntas.forEach(({ id, tipo }) => {
            if (respuestas[id]) {
                respuestas[id].valor === 1 ? resumen[tipo][0]++ : resumen[tipo][1]++;
            }
        });
        return resumen;
    };

    const resumenFinalRIASEC = () => {
        const resumen = { R: [0, 0], I: [0, 0], A: [0, 0], S: [0, 0], E: [0, 0], C: [0, 0] };
        bloques.forEach((bloque) => {
            bloque.preguntas.forEach(({ id, tipo }) => {
                if (respuestas[id]) {
                    respuestas[id].valor === 1 ? resumen[tipo][0]++ : resumen[tipo][1]++;
                }
            });
        });
        return resumen;
    };

    const handleRetake = () => {
        setLastResult(null);
        setBloqueIndex(0);
        setPreguntaActual(0);
        setRespuestas({});
        setBloqueFinalizado(false);
        setTestFinalizado(false);
        setResultado(null);
        setProcesando(false);
        setShowTest(true);
    };

    if (loading) {
        return <Container><p>Cargando información...</p></Container>;
    }

    return (
        <Container>
            {lastResult && !showTest ? (
                <div className="last-result-container">
                    <h2>Tu último resultado del test RIASEC</h2>
                    <p>Fecha del test: {lastResult.creadoEl instanceof Date ? lastResult.creadoEl.toLocaleString() : new Date(lastResult.creadoEl.seconds * 1000).toLocaleString()}</p>
                    <h4>Carrera sugerida:</h4>
                    <p><strong>{lastResult.carrera}</strong></p>
                    <Button
                        label="Hacer el test de nuevo"
                        icon="pi pi-refresh"
                        onClick={handleRetake}
                        className="p-button-secondary mt-3"
                    />
                </div>
            ) : (
                <>
                    <Steps model={bloques.map((b) => ({ label: b.nombre }))} activeIndex={bloqueIndex} readOnly />
                    <Layout>
                        <Sidebar>
                            <h4>Preguntas</h4>
                            <Timeline
                                value={timelineData}
                                align="left"
                                marker={(item) => (
                                    <span
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "1.6rem",
                                            height: "1.6rem",
                                            borderRadius: "50%",
                                            backgroundColor: item.color,
                                            fontSize: "0.8rem",
                                            color: "#fff",
                                        }}
                                    >
                                        {item.numero}
                                    </span>
                                )}
                                content={() => null}
                            />
                        </Sidebar>

                        <Content>
                            {testFinalizado ? (
                                <Resultado>
                                    <h3>Test completado!</h3>
                                    <p>Resumen total por perfil RIASEC:</p>
                                    <table className="resumen-table">
                                        <thead>
                                            <tr>
                                                <th>Letra</th>
                                                <th>Me gusta</th>
                                                <th>No me gusta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(resumenFinalRIASEC()).map(([letra, [si, no]]) => (
                                                <tr key={letra}>
                                                    <td>{letra}</td>
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
                                                className="p-button-primary mt-3"
                                                disabled={procesando || !currentUser}
                                            />
                                            {procesando && <p className="mt-2">Procesando predicción...</p>}
                                            {!currentUser && <p className="mt-2" style={{ color: 'red' }}>Inicia sesión para procesar la información.</p>}
                                        </>
                                    ) : (
                                        <div className="mt-3">
                                            <h4>Carrera sugerida:</h4>
                                            <p><strong>{resultado}</strong></p>
                                        </div>
                                    )}
                                </Resultado>
                            ) : bloqueFinalizado ? (
                                <Resultado>
                                    <h3>Has completado el bloque: {bloqueActual.nombre}!</h3>
                                    <table className="resumen-table">
                                        <thead>
                                            <tr>
                                                <th>Letra</th>
                                                <th>Me gusta</th>
                                                <th>No me gusta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(resumenRIASECporBloque()).map(([letra, [si, no]]) => (
                                                <tr key={letra}>
                                                    <td>{letra}</td>
                                                    <td>{si}</td>
                                                    <td>{no}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Button
                                        label={
                                            bloqueIndex === bloques.length - 2
                                                ? "Pasar a Ocupaciones"
                                                : bloqueIndex === bloques.length - 1
                                                    ? "Finalizar"
                                                    : "Pasar a Habilidades"
                                        }
                                        onClick={avanzarBloque}
                                        className="p-button-primary mt-3"
                                    />
                                </Resultado>
                            ) : (
                                <Card title={`Pregunta ${preguntaActual + 1}`}>
                                    <p>{pregunta.texto}</p>
                                    <div className="flex justify-content-around mt-4">
                                        <Button
                                            label="Me gusta"
                                            className="p-button-success"
                                            onClick={() => responder(1)}
                                        />
                                        <Button
                                            label="No me gusta"
                                            className="p-button-secondary"
                                            onClick={() => responder(0)}
                                        />
                                    </div>
                                </Card>
                            )}
                        </Content>
                    </Layout>
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
  padding: 2rem;

  .last-result-container {
      border: 1px solid #ddd;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f9f9f9;
      text-align: center;
  }
`;

const Layout = styled.div`
  display: flex;
  margin-top: 2rem;
`;

const Sidebar = styled.div`
  width: 220px;
  padding-right: 1rem;
`;

const Content = styled.div`
  flex: 1;
  padding-left: 2rem;
`;

const Resultado = styled.div`
  text-align: center;
  margin-top: 2rem;

  .resumen-table {
    margin: 1rem auto;
    border-collapse: collapse;
    width: 100%;
    max-width: 400px;

    th, td {
      border: 1px solid #ccc;
      padding: 0.5rem;
    }

    th {
      background-color: #f5f5f5;
    }
  }
`;

export default TestCompletoRIASEC;