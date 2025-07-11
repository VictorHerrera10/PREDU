import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AcademicoComponente = () => {
    const [visible, setVisible] = useState(true);
    const [formData, setFormData] = useState({
        arte_y_cultura: "",
        castellano_como_segunda_lengua: "",
        ciencia_y_tecnologia: "",
        ciencias_sociales: "",
        comunicacion: "",
        desarrollo_personal: "",
        educacion_fisica: "",
        educacion_para_el_trabajo: "",
        educacion_religiosa: "",
        ingles: "",
        matematica: ""
    });

    const [facultadSugerida, setFacultadSugerida] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e, key) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    const handleSubmit = async () => {
        setCargando(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/prediccion/academico/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            const data = await response.json();
            setFacultadSugerida(data.recomendacion || "Facultad no encontrada");
        } catch (error) {
            console.error("Error al predecir:", error);
            setFacultadSugerida("Error al obtener predicción.");
        } finally {
            setCargando(false);
        }
    };

    const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

    const renderFormInputs = () =>
        Object.keys(formData).map((key) => (
            <div key={key} className="p-fluid mb-3">
                <label htmlFor={key} className="text-sm font-semibold capitalize mb-1 block">
                    {key.replaceAll("_", " ")}
                </label>
                <InputText
                    id={key}
                    value={formData[key]}
                    onChange={(e) => handleChange(e, key)}
                    className="w-full"
                />
            </div>
        ));

    return (
        <Dialog
            header="Validación Académica"
            visible={visible}
            style={{ width: "50vw", maxWidth: "600px" }}
            onHide={() => setVisible(false)}
            closable={false}
            modal
        >
            {facultadSugerida ? (
                <div className="text-center">
                    <h3 className="text-green-700">✅ Facultad recomendada:</h3>
                    <h2 className="text-xl font-bold text-primary my-2">{facultadSugerida}</h2>
                    <img
                        src="https://media.giphy.com/media/xT5LMDMCFzu2dhgBa0/giphy.gif"
                        alt="Éxito"
                        style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                    />
                    <Button label="Cerrar" className="mt-4" onClick={() => setVisible(false)} />
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{renderFormInputs()}</div>
                    <div className="text-center mt-4">
                        <Button
                            label={cargando ? "Procesando..." : "Predecir Facultad"}
                            icon="pi pi-check"
                            disabled={!isFormComplete || cargando}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default AcademicoComponente;
