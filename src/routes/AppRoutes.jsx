import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../Home/componentes/Layout"; // Asegúrate de tener este archivo
import Dashboard from "../student/dashboard";
import TestVocacional from "../student/psicologico/testVocacional";
import NotasAcademicas from "../student/academico/notasAcademicas";
import Recomendaciones from "../student/recomendaciones";
import ExploradorCarreras from "../carreras/exploradorCarreras";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/test" element={<TestVocacional />} />
                <Route path="/notas" element={<NotasAcademicas />} />
                <Route path="/resultados" element={<Recomendaciones />} />
                <Route path="/explorador" element={<ExploradorCarreras />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;

