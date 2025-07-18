import React from 'react';

const Loading = ({ 
  message = 'Cargando...', 
  size = 'medium',
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex justify-center items-center py-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClasses[size]}`}></div>
        {message && (
          <p className="mt-4 text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;