import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { personasService } from '../../services/api';

const PersonaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadPersona();
  }, [id]);

  const loadPersona = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await personasService.getById(id);
      if (response.success) {
        setPersona(response.data);
      } else {
        setError('Persona no encontrada');
      }
    } catch (error) {
      console.error('Error cargando persona:', error);
      setError('Error al cargar la persona');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${persona.nombre} ${persona.apellido}?`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await personasService.delete(id);
      if (response.success) {
        navigate('/personas');
      } else {
        alert('Error al eliminar la persona: ' + response.message);
      }
    } catch (error) {
      alert('Error al eliminar la persona');
      console.error('Error eliminando persona:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando persona...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/personas" className="btn-primary">
          Volver a Personas
        </Link>
      </div>
    );
  }

  if (!persona) {
    return null;
  }

  const age = calculateAge(persona.fecha_nacimiento);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/personas" className="text-gray-700 hover:text-blue-600">
                  Personas
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-500">{persona.nombre} {persona.apellido}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {persona.nombre} {persona.apellido}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Información detallada de la persona
          </p>
        </div>
        <div className="mt-4 flex mobile-row space-x-3 md:mt-0 md:ml-4">
          <Link
            to={`/personas/${persona.id}/edit`}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="btn-danger"
          >
            {deleteLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tarjeta de información */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Avatar y información básica */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {persona.nombre.charAt(0)}{persona.apellido.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                {persona.nombre} {persona.apellido}
              </h3>
              <p className="mt-1 max-w-2xl text-lg text-gray-500">
                {persona.email}
              </p>
              {age && (
                <p className="mt-1 text-sm text-gray-600">
                  {age} años
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {persona.nombre} {persona.apellido}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={`mailto:${persona.email}`} className="text-blue-600 hover:text-blue-500">
                  {persona.email}
                </a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {persona.telefono ? (
                  <a href={`tel:${persona.telefono}`} className="text-blue-600 hover:text-blue-500">
                    {persona.telefono}
                  </a>
                ) : (
                  <span className="text-gray-400">No especificado</span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fecha de nacimiento</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(persona.fecha_nacimiento)}
                {age && (
                  <span className="ml-2 text-gray-500">({age} años)</span>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {persona.direccion || (
                  <span className="text-gray-400">No especificada</span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fecha de registro</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(persona.created_at)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(persona.updated_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Acciones adicionales */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/personas"
          className="btn-secondary"
        >
          ← Volver a la lista
        </Link>
      </div>
    </div>
  );
};

export default PersonaDetail;