// FrontPersonas/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Componentes principales
import Dashboard from './components/Dashboard';
import PersonasList from './components/personas/PersonasList';
import PersonaForm from './components/personas/PersonaForm';
import PersonaDetail from './components/personas/PersonaDetail';
import UsersList from './components/users/UsersList';

// Componente 404
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
      <a href="/dashboard" className="btn-primary">
        Ir al Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rutas de personas - La validación de roles se hace dentro del componente */}
            <Route path="/personas" element={
              <ProtectedRoute>
                <Layout>
                  <PersonasList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/personas/new" element={
              <ProtectedRoute>
                <Layout>
                  <PersonaForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/personas/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PersonaDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/personas/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <PersonaForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rutas de usuarios */}
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <Layout>
                  <UsersList />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;