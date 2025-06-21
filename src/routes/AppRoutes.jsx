import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout general estudiante
import Layout from "../Home/componentes/Layout";
import Dashboard from "../student/dashboard";
import TestVocacional from "../student/psicologico/testVocacional";
import NotasAcademicas from "../student/academico/notasAcademicas";
import Recomendaciones from "../student/recomendaciones";
import ExploradorCarreras from "../carreras/exploradorCarreras";

// Layout y páginas admin
import AdminLayout from "../admin/AdminLayout";
import UsuariosPage from "../admin/UsuariosPage";
import PreguntasTestPage from "../admin/PreguntasTestPage";
import PrediccionAcademica from "../admin/componente/PrediccionAcademica";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Redirige la raíz al panel admin temporalmente */}
            <Route path="/" element={<Navigate to="/admin/usuarios" replace />} />

            {/* Rutas de estudiante con Layout general */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/test" element={<TestVocacional />} />
                <Route path="/notas" element={<NotasAcademicas />} />
                <Route path="/resultados" element={<Recomendaciones />} />
                <Route path="/explorador" element={<ExploradorCarreras />} />
            </Route>

            {/* Rutas del panel Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="preguntas" element={<PreguntasTestPage />} />
                <Route path="prediccion-academica" element={<PrediccionAcademica />} />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    );
};

export default AppRoutes;
