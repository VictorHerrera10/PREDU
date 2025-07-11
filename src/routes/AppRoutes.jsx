import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout general estudiante
import Layout from "../Home/componentes/Layout";
import Dashboard from "../student/dashboard";
import TestVocacional from "../student/psicologico/testVocacional";
import NotasAcademicas from "../student/academico/notasAcademicas";
import Recomendaciones from "../student/recomendaciones";
import ExploradorCarreras from "../carreras/exploradorCarreras";
import PerfilModal from "../Home/componentes/perfil";
import ConfiguracionPerfil from "../Home/componentes/ConfiguracionPerfil";

// Layout y páginas admin
import AdminLayout from "../admin/AdminLayout";
import UsuariosPage from "../admin/UsuariosPage";
import TestPage from "../admin/TestPage";
import NotasPage from "../admin/NotasPage";
import PsicologicoComponente from "../admin/componente/psicologico-componente";
import AcademicoComponente from "../admin/componente/academico-componente";
import PredecirCarreraPage from "../admin/Predecir-Carrera-Page";

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
                <Route path="/perfil" element={<PerfilModal />} />
                <Route path="/configuracion" element={<ConfiguracionPerfil />} />
            </Route>

            {/* Rutas del panel Admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="test" element={<TestPage />} />
                <Route path="notas" element={<NotasPage />} />
                <Route path="val-psicologico" element={<PsicologicoComponente />} />
                <Route path="val-academico" element={<AcademicoComponente />} />
                <Route path="predecir" element={<PredecirCarreraPage />} /> {/* opcional, si deseas que el botón 'Predecir Carrera' abra una ruta */}
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    );
};

export default AppRoutes;
