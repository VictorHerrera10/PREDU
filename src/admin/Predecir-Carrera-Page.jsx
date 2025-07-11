import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function PredecirCarreraPage() {
    const opciones = ["Ingenierías", "Sociales", "Biomedicas"];
    const [facultadTest, setFacultadTest] = useState(null);
    const [facultadNotas, setFacultadNotas] = useState(null);
    const [visible, setVisible] = useState(false);

    const combinaciones = {
        "Ingenierías|Ingenierías": {
            academico: "Considera ingresar a carreras técnicas o universitarias enfocadas en resolver problemas estructurados, trabajar con herramientas, sistemas o máquinas, y usar las matemáticas y la lógica para crear soluciones útiles.",
            psicologico: "Opta por una carrera que te permita desarrollar soluciones prácticas en sectores como infraestructura, tecnología o industria.",
            oportunidades: [
                "Ingeniería en sistemas",
                "Ingeniería mecánica",
                "Ingeniería electrónica",
                "Ingeniería civil",
                "Ingeniería industrial",
                "Ingeniería en telecomunicaciones",
                "Mecatrónica"
            ],
            compatibilidad: "Las carreras de ingeniería te ofrecen una base sólida para desenvolverte en sectores tecnológicos, industriales y productivos con alta demanda laboral."
        },
        "Sociales|Sociales": {
            academico: "Puedes seguir una formación centrada en el análisis de los fenómenos sociales, el trabajo con personas y comunidades, o la educación y comunicación.",
            psicologico: "Elige una carrera que te permita aportar en el desarrollo humano, la mejora social o la gestión de relaciones humanas.",
            oportunidades: [
                "Psicología",
                "Trabajo social",
                "Educación inicial",
                "Educación secundaria",
                "Comunicación social",
                "Sociología",
                "Gestión pública"
            ],
            compatibilidad: "Estas carreras permiten generar un impacto positivo en la sociedad y participar activamente en la transformación de tu entorno."
        },
        "Biomedicas|Biomedicas": {
            academico: "Dirige tu formación hacia carreras del área de salud o ciencias biológicas, donde puedas aprender sobre el cuerpo humano, el bienestar y la investigación científica.",
            psicologico: "Busca una carrera que te permita mejorar la calidad de vida de las personas mediante el diagnóstico, la atención médica o el desarrollo científico.",
            oportunidades: [
                "Medicina",
                "Enfermería",
                "Nutrición",
                "Tecnología médica",
                "Obstetricia",
                "Farmacia",
                "Laboratorio clínico"
            ],
            compatibilidad: "Las ciencias de la salud te ofrecen una ruta vocacional con sentido humano y compromiso con el cuidado de los demás."
        }
        // Agrega las demás combinaciones aquí...
    };

    const clave = facultadTest && facultadNotas ? `${facultadTest}|${facultadNotas}` : null;
    const resultado = clave && combinaciones[clave];

    const tablaData = Object.entries(combinaciones).map(([key, value]) => {
        const [test, notas] = key.split('|');
        return {
            test,
            notas,
            academico: value.academico,
            psicologico: value.psicologico,
            oportunidades: value.oportunidades.join(", "),
            compatibilidad: value.compatibilidad
        };
    });

    return (
        <div className="card">
            <h2 className="text-center mb-4">🔍 Predecir Carrera</h2>
            <p className="text-center text-sm mb-5">Selecciona las carreras a simular para conocer tus oportunidades vocacionales</p>

            <div className="flex flex-column md:flex-row justify-content-center align-items-center gap-4 mb-4">
                <div className="w-full md:w-4">
                    <label className="block mb-2 text-center">Facultad por Test Psicológico 🧠</label>
                    <Dropdown value={facultadTest} options={opciones} onChange={(e) => setFacultadTest(e.value)} placeholder="Selecciona una opción" className="w-full" />
                </div>
                <div className="w-full md:w-4">
                    <label className="block mb-2 text-center">Facultad por Notas Académicas 📝</label>
                    <Dropdown value={facultadNotas} options={opciones} onChange={(e) => setFacultadNotas(e.value)} placeholder="Selecciona una opción" className="w-full" />
                </div>
            </div>


            {resultado && (
                <Card title="🔎 Resultado de Análisis Vocacional" className="mb-4">
                    <Panel header="Consejo Académico (Notas) 📝" toggleable className="mb-3">
                        <p>{resultado.academico}</p>
                    </Panel>
                    <Panel header="Consejo Psicológico (RIASEC) 🧠" toggleable className="mb-3">
                        <p>{resultado.psicologico}</p>
                    </Panel>
                    <Panel header="Oportunidades Profesionales 💼" toggleable className="mb-3">
                        <ul className="pl-3">
                            {resultado.oportunidades.map((item, index) => <li key={index}>✅ {item}</li>)}
                        </ul>
                    </Panel>
                    <Panel header="Consejo de Compatibilidad 💡" toggleable>
                        <p>{resultado.compatibilidad}</p>
                    </Panel>
                    <div className="mt-4 text-center">
                        <img src="/ruta-tu-gif.gif" alt="decoración" style={{ maxWidth: '120px' }} />
                    </div>
                </Card>
            )}

            <Dialog header="📊 Combinaciones Vocacionales" visible={visible} style={{ width: '90vw' }} onHide={() => setVisible(false)}>
                <p className="mb-3 text-sm">
                    Esta tabla muestra las combinaciones posibles entre los resultados del test psicológico (RIASEC) y el rendimiento académico por áreas. Cada fila incluye sugerencias académicas, psicológicas, oportunidades profesionales sugeridas y un consejo de compatibilidad.
                </p>
                <DataTable value={tablaData} paginator rows={5} stripedRows scrollable scrollHeight="400px">
                    <Column field="test" header="TEST 🧠" />
                    <Column field="notas" header="NOTAS 📝" />
                    <Column field="academico" header="Consejo Académico" />
                    <Column field="psicologico" header="Consejo Psicológico" />
                    <Column field="oportunidades" header="Oportunidades Profesionales" />
                    <Column field="compatibilidad" header="Consejo de Compatibilidad" />
                </DataTable>
            </Dialog>

            <div className="flex justify-content-center mb-5">
                <Button label="Ver información de la tabla de combinaciones" icon="pi pi-table" onClick={() => setVisible(true)} />
            </div>

        </div>
    );
}
