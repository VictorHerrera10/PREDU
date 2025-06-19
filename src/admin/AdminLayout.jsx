// src/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="flex h-screen">
            <aside className="w-60 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Panel Admin</h2>
                <nav className="space-y-2">
                    <Link to="/admin/usuarios">Usuarios</Link>
                    <Link to="/admin/preguntas">Preguntas</Link>
                </nav>
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
