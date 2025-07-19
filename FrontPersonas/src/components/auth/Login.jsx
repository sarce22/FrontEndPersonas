import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al empezar a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validaciones básicas
    if (!formData.correo || !formData.contraseña) {
      setError('Todos los campos son requeridos');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Datos enviados:', formData);
      const result = await login(formData.correo, formData.contraseña);

      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading si está verificando sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              regístrate aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                correo
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="correo"
                required
                className="input-field mt-1"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                autoComplete="current-password"
                required
                className="input-field mt-1"
                placeholder="Tu contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Usuarios de prueba: admin@test.com (admin123), juan@test.com (123456)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};



export default Login;