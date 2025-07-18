import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { personasService, authService, generalService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  
  const [recentPersonas, setRecentPersonas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Cargar estadísticas de personas
      const statsResponse = await personasService.getStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Cargar usuarios registrados
     

      // Cargar personas recientes
      const personasResponse = await personasService.getAll();
      if (personasResponse.success) {
        // Tomar las últimas 5 personas
        const recent = personasResponse.data.personas?.slice(0, 5) || [];
        setRecentPersonas(recent);
      }

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    try {
      const response = await generalService.healthCheck();
      alert(`✅ API Status: ${response.data.status}\nTimestamp: ${new Date(response.data.timestamp).toLocaleString()}`);
    } catch (error) {
      alert('❌ Error al conectar con la API');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido, {user?.nombre}. Aquí tienes un resumen de la actividad.
          </p>
        </div>
        <div className="mt-4 flex mobile-row md:mt-0 md:ml-4">
          <button
            onClick={handleHealthCheck}
            className="btn-secondary text-sm"
          >
            🔍 Test API
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">👥</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Personas
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats?.total || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📱</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Con Teléfono
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats?.conTelefono || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">🏠</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Con Dirección
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats?.conDireccion || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/personas/new"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Agregar Persona
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Crear una nueva persona en el sistema
              </p>
            </div>
          </Link>

          <Link
            to="/personas"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Ver Personas
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Gestionar todas las personas registradas
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Personas recientes */}
      {recentPersonas.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personas Recientes
            </h3>
            <Link to="/personas" className="text-sm text-blue-600 hover:text-blue-500">
              Ver todas →
            </Link>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {recentPersonas.map((persona) => (
                <li key={persona.id} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {persona.nombre.charAt(0)}{persona.apellido.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {persona.nombre} {persona.apellido}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {persona.correo}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(persona.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;