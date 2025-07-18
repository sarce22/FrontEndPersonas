/**
 * Formatea una fecha en formato legible en español
 * @param {string|Date} dateString - Fecha a formatear
 * @param {boolean} includeTime - Si incluir la hora
 * @returns {string} - Fecha formateada
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'No especificada';
  
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha en formato corto
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} - Fecha en formato DD/MM/YYYY
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Calcula la edad basada en la fecha de nacimiento
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number|null} - Edad en años o null si no se puede calcular
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} - Teléfono formateado o mensaje por defecto
 */
export const formatPhone = (phone) => {
  return phone?.trim() || 'No especificado';
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Valida si un correo es válido
 * @param {string}correo -correo a validar
 * @returns {boolean} - True si es válido
 */
export const isValidEmail = (email) => {
  constcorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  returncorreoRegex.test(email);
};

/**
 * Genera iniciales a partir de un nombre completo
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} - Iniciales en mayúscula
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función con debounce
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Maneja errores de API de forma consistente
 * @param {Error} error - Error de la API
 * @returns {string} - Mensaje de error legible
 */
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 404) {
    return 'Recurso no encontrado';
  }
  
  if (error.response?.status === 500) {
    return 'Error interno del servidor';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }
  
  return error.message || 'Error inesperado';
};

/**
 * Formatea un nombre completo
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} - Nombre completo formateado
 */
export const formatFullName = (firstName, lastName) => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  return `${first} ${last}`.trim();
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};