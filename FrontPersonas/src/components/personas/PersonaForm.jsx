import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { personasService } from '../../services/api';

const PersonaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  // Verificar si es administrador
  const isAdmin = user && (user.rol === '1' || user.rol === 1);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    rol_id: '2' // Por defecto cliente
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [roles, setRoles] = useState([]);

  // Verificar permisos de edición
  const canEdit = () => {
    if (!id) return isAdmin;
    if (isAdmin) return true;
    return id === String(user?.id);
  };

  useEffect(() => {
    if (isAdmin) {
      loadRoles();
    }
    if (isEditing) {
      loadPersona();
    }
  }, [id, isEditing, isAdmin]);

  const loadRoles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/roles');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data.roles || []);
      }
    } catch (error) {
      console.error('Error cargando roles:', error);
      setRoles([
        { id: 1, nombre: 'admin' },
        { id: 2, nombre: 'cliente' },
        { id: 3, nombre: 'empleado' }
      ]);
    }
  };

  const loadPersona = async () => {
    try {
      const response = await personasService.getById(id);
      if (response.success) {
        const persona = response.data;
        setFormData({
          nombre: persona.nombre || '',
          apellido: persona.apellido || '',
          correo: persona.correo || '',
          contraseña: '',
          telefono: persona.telefono || '',
          fecha_nacimiento: persona.fecha_nacimiento ? 
            new Date(persona.fecha_nacimiento).toISOString().split('T')[0] : '',
          direccion: persona.direccion || '',
          rol_id: String(persona.rol_id || 2)
        });
      } else {
        alert('Error al cargar la persona');
        navigate('/personas');
      }
    } catch (error) {
      console.error('Error cargando persona:', error);
      alert('Error al cargar la persona');
      navigate('/personas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        newErrors.correo = 'El formato del correo no es válido';
      }
    }

    if (!isEditing || formData.contraseña.trim()) {
      if (!formData.contraseña.trim()) {
        newErrors.contraseña = 'La contraseña es requerida';
      } else if (formData.contraseña.length < 6) {
        newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    if (formData.telefono.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(formData.telefono)) {
        newErrors.telefono = 'El formato del teléfono no es válido';
      }
    }

    if (formData.fecha_nacimiento) {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no es válida';
      }
    }

    if (isAdmin && (!formData.rol_id || formData.rol_id === '')) {
      newErrors.rol_id = 'Debes seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        fecha_nacimiento: formData.fecha_nacimiento || null,
        direccion: formData.direccion.trim(),
        ...(isAdmin && { rol_id: parseInt(formData.rol_id) })
      };

      if (!isEditing || formData.contraseña.trim()) {
        dataToSend.contraseña = formData.contraseña;
      }

      let response;
      if (isEditing) {
        response = await personasService.update(id, dataToSend);
      } else {
        response = await personasService.create(dataToSend);
      }

      if (response.success) {
        if (isAdmin || id === String(user?.id)) {
          navigate('/personas');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(response.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error guardando persona:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al guardar la persona';
      
      if (errorMessage.includes('correo') || errorMessage.includes('email')) {
        setErrors({ correo: 'Ya existe una persona con este correo' });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEdit()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
          <h1 className="text-xl font-bold mb-4">Sin Permisos</h1>
          <p className="text-gray-600 mb-6">
            {!id 
              ? 'Solo los administradores pueden crear nuevas personas.' 
              : 'Solo puedes editar tu propia información.'
            }
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full"
            >
              Ir al Dashboard
            </button>
            {!isAdmin && (
              <button
                onClick={() => navigate(`/personas/${user?.id}/edit`)}
                className="btn-secondary w-full"
              >
                Editar Mi Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" style={{ margin: '0 auto' }}></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  const isEditingOwnProfile = isEditing && id === String(user?.id);

  return (
    <div className="max-w-2xl" style={{ margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {!id 
              ? 'Nueva Persona' 
              : isEditingOwnProfile 
                ? 'Editar Mi Perfil' 
                : 'Editar Persona'
            }
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {!id 
              ? 'Completa los datos para crear una nueva persona' 
              : isEditingOwnProfile 
                ? 'Actualiza tu información personal'
                : 'Actualiza la información de la persona'
            }
          </p>
          {!isAdmin && (
            <p className="mt-1 text-xs text-blue-600">
              Solo puedes editar tu propia información
            </p>
          )}
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className={`input-field ${errors.nombre ? 'border-red-300' : ''}`}
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className={`input-field ${errors.apellido ? 'border-red-300' : ''}`}
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
              )}
            </div>
          </div>

          {/* Correo */}
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className={`input-field ${errors.correo ? 'border-red-300' : ''}`}
              placeholder="persona@ejemplo.com"
              value={formData.correo}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
            )}
          </div>

          {/* Contraseña */}
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña {!isEditing && <span className="text-red-500">*</span>}
              {isEditing && <span className="text-gray-500 text-xs">(dejar vacío para mantener actual)</span>}
            </label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              className={`input-field ${errors.contraseña ? 'border-red-300' : ''}`}
              placeholder={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              value={formData.contraseña}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.contraseña && (
              <p className="mt-1 text-sm text-red-600">{errors.contraseña}</p>
            )}
          </div>

          {/* Teléfono y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '1.5rem' }}>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className={`input-field ${errors.telefono ? 'border-red-300' : ''}`}
                placeholder="+57 300 123 4567"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
              )}
            </div>

            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                className={`input-field ${errors.fecha_nacimiento ? 'border-red-300' : ''}`}
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.fecha_nacimiento && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>
              )}
            </div>
          </div>

          {/* Rol - Solo para administradores */}
          {isAdmin && (
            <div style={{ marginTop: '1.5rem' }}>
              <label htmlFor="rol_id" className="block text-sm font-medium text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="rol_id"
                name="rol_id"
                className={`input-field ${errors.rol_id ? 'border-red-300' : ''}`}
                value={formData.rol_id}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Seleccionar rol...</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)}
                  </option>
                ))}
              </select>
              {errors.rol_id && (
                <p className="mt-1 text-sm text-red-600">{errors.rol_id}</p>
              )}
            </div>
          )}

          {/* Dirección */}
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              id="direccion"
              name="direccion"
              rows={3}
              className={`input-field ${errors.direccion ? 'border-red-300' : ''}`}
              placeholder="Dirección completa..."
              value={formData.direccion}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{ resize: 'vertical' }}
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={() => navigate(isAdmin ? '/personas' : '/dashboard')}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                isEditing ? 'Actualizar' : 'Crear Persona'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonaForm;