import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { personasService } from '../../services/api';

const PersonasList = () => {
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async (search = '') => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await personasService.getAll(search);
      if (response.success) {
        setPersonas(response.data.personas || []);
      } else {
        setError('Error al cargar las personas');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error cargando personas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadPersonas(searchTerm);
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await personasService.delete(id);
      if (response.success) {
        // Recargar la lista
        await loadPersonas(searchTerm);
      } else {
        alert('Error al eliminar la persona: ' + response.message);
      }
    } catch (error) {
      alert('Error al eliminar la persona');
      console.error('Error eliminando persona:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatPhone = (phone) => {
    return phone || 'No especificado';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando personas...</p>
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
            Gestión de Personas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Total de personas: {personas.length}
          </p>
        </div>
        <div className="mt-4 flex mobile-row md:mt-0 md:ml-4">
          <Link
            to="/personas/new"
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Persona
          </Link>
        </div>
      </div>

      {/* Buscador */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex mobile-row gap-2">
            <button
              type="submit"
              className="btn-primary"
            >
              🔍 Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                loadPersonas('');
              }}
              className="btn-secondary"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de personas */}
      <div className="card">
        {personas.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay personas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron personas con ese término de búsqueda.' : 'Comienza agregando una nueva persona.'}
            </p>
            <div className="mt-6">
              <Link
                to="/personas/new"
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Persona
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Persona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Nacimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {personas.map((persona) => (
                  <tr key={persona.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {persona.nombre.charAt(0)}{persona.apellido.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {persona.nombre} {persona.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {persona.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        📱 {formatPhone(persona.telefono)}
                      </div>
                      {persona.direccion && (
                        <div className="text-sm text-gray-500">
                          📍 {persona.direccion}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(persona.fecha_nacimiento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(persona.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/personas/${persona.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </Link>
                        <Link
                          to={`/personas/${persona.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(persona.id, `${persona.nombre} ${persona.apellido}`)}
                          disabled={deleteLoading === persona.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading === persona.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonasList;