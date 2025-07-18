import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const storedCredentials = localStorage.getItem('credentials');
      
      if (storedUser && storedCredentials) {
        const userData = JSON.parse(storedUser);
        const credentials = JSON.parse(storedCredentials);
        
        // Verificar que las credenciales siguen siendo válidas
        const response = await authService.verify(credentials);
        
        if (response.success) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Limpiar datos inválidos
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const userData = response.data.user;
        const credentials = { email, password };
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('credentials', JSON.stringify(credentials));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      }
      
      return { success: false, message: response.message || 'Error en el login' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        return { success: true, message: response.message };
      }
      
      return { success: false, message: response.message || 'Error en el registro' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};