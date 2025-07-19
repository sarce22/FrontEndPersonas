import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',  // ✅ AGREGADO
    correo: '',
    contraseña: '',
    confirmContraseña: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes al empezar a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Validar que todos los campos están llenos
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.contraseña || !formData.confirmContraseña) {
      setError('Todos los campos son requeridos');
      return false;
    }

    // Validar nombre
    if (formData.nombre.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    // ✅ Validar apellido
    if (formData.apellido.length < 2) {
      setError('El apellido debe tener al menos 2 caracteres');
      return false;
    }

    // Validar correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(formData.correo)) {
      setError('Ingresa un correo válido');
      return false;
    }

    // Validar contraseña
    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar confirmación
    if (formData.contraseña !== formData.confirmContraseña) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        nombre: formData.nombre,
        apellido: formData.apellido,  // ✅ AGREGADO
        correo: formData.correo,
        contraseña: formData.contraseña,
        rol_id: 2  // Por defecto cliente
      });

      if (result.success) {
        setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setFormData({
          nombre: '',
          apellido: '',  // ✅ AGREGADO
          correo: '',
          contraseña: '',
          confirmContraseña: ''
        });
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado. Inténtalo de nuevo.');
      console.error('Error en registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-lg">
            <span className="text-white text-xl font-bold">👥</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta nueva
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              inicia sesión con tu cuenta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Campos del formulario */}
          <div className="space-y-4">
            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="input-field"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="input-field"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                value={formData.contraseña}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmContraseña" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmContraseña"
                name="confirmContraseña"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="Repite tu contraseña"
                value={formData.confirmContraseña}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
              style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;