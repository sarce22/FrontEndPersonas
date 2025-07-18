import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personasService } from '../../services/api';

const PersonaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadPersona();
    }
  }, [id, isEditing]);

  const loadPersona = async () => {
    try {
      const response = await personasService.getById(id);
      if (response.success) {
        const persona = response.data;
        setFormData({
          nombre: persona.nombre || '',
          apellido: persona.apellido || '',
          email: persona.email || '',
          telefono: persona.telefono || '',
          fecha_nacimiento: persona.fecha_nacimiento ? 
            new Date(persona.fecha_nacimiento).toISOString().split('T')[0] : '',
          direccion: persona.direccion || ''
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
    // Limpiar error del campo al empezar a escribir
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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Ingresa un email válido';
      }
    }

    if (formData.telefono && formData.telefono.length > 20) {
      newErrors.telefono = 'El teléfono no puede exceder 20 caracteres';
    }

    if (formData.direccion && formData.direccion.length > 500) {
      newErrors.direccion = 'La dirección no puede exceder 500 caracteres';
    }

    if (formData.fecha_nacimiento) {
      const today = new Date();
      const birthDate = new Date(formData.fecha_nacimiento);
      if (birthDate > today) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Preparar datos para envío
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        direccion: formData.direccion.trim() || null
      };

      let response;
      if (isEditing) {
        response = await personasService.update(id, dataToSend);
      } else {
        response = await personasService.create(dataToSend);
      }

      if (response.success) {
        navigate('/personas');
      } else {
        // Manejar errores de validación del servidor
        if (response.error === 'Validation failed' && response.data?.errors) {
          const serverErrors = {};
          response.data.errors.forEach(error => {
            serverErrors[error.field] = error.message;
          });
          setErrors(serverErrors);
        } else {
          alert(response.message || 'Error al guardar la persona');
        }
      }
    } catch (error) {
      console.error('Error guardando persona:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la persona';
      
      if (errorMessage.includes('email')) {
        setErrors({ email: 'Ya existe una persona con este email' });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {isEditing ? 'Editar Persona' : 'Nueva Persona'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? 'Actualiza la información de la persona' : 'Completa los datos para crear una nueva persona'}
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className={`input-field mt-1 ${errors.nombre ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
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
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className={`input-field mt-1 ${errors.apellido ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`input-field mt-1 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="persona@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Teléfono y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className={`input-field mt-1 ${errors.telefono ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
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
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                className={`input-field mt-1 ${errors.fecha_nacimiento ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.fecha_nacimiento && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <textarea
              id="direccion"
              name="direccion"
              rows={3}
              className={`input-field mt-1 ${errors.direccion ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Dirección completa..."
              value={formData.direccion}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex mobile-row justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/personas')}
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