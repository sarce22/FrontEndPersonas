# 🚀 Guía Completa de Instalación - PersonasApp

Esta guía te ayudará a configurar y ejecutar tanto el **backend** (Node.js + MySQL) como el **frontend** (React + Vite) de la aplicación de gestión de personas.

## 📋 Prerequisitos

### Software Requerido
- **Node.js** >= 16.0.0 ([Descargar](https://nodejs.org/))
- **MySQL** >= 8.0 ([Descargar](https://dev.mysql.com/downloads/installer/))
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar)

### Verificar Instalaciones
```bash
node --version     # Debe mostrar v16.0.0 o superior
npm --version      # Debe mostrar versión de npm
mysql --version    # Debe mostrar versión de MySQL
```

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos
```sql
-- Conectar a MySQL como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar creación
SHOW DATABASES;

-- Salir de MySQL
EXIT;
```

### 2. Ejecutar Script de Inicialización (Opcional)
```bash
# Si tienes el archivo database/init.sql
mysql -u root -p personas_db < database/init.sql
```

## 🔧 Configuración del Backend

### 1. Navegar al Directorio del Backend
```bash
cd BackendPersonas
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo de configuración
cp .env.example .env

# Editar .env con tus datos
nano .env
```

Contenido del archivo `.env`:
```env
NODE_ENV=development
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=personas_db

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3001

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Compilar TypeScript
```bash
npm run build
```

### 5. Ejecutar el Backend
```bash
# En desarrollo (con hot-reload)
npm run dev

# O en producción
npm start
```

### 6. Verificar Backend
```bash
# Probar health check
curl http://localhost:3000/api/health

# Debe responder con:
# {"success":true,"message":"API funcionando correctamente",...}
```

## 🖥️ Configuración del Frontend

### 1. Abrir Nueva Terminal y Navegar al Frontend
```bash
cd FrontPersonas
```

### 2. Instalar Dependencias
```bash
# Dependencias principales
npm install axios react-router-dom

# Tailwind CSS (recomendado)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Verificar Configuración de Tailwind
Asegúrate de que `tailwind.config.js` contenga:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Ejecutar el Frontend
```bash
npm run dev
```

### 5. Verificar Frontend
- Abrir navegador en `http://localhost:5173`
- Debería mostrar la página de login

## 🎯 Prueba Completa del Sistema

### 1. Verificar Conexiones
```bash
# Backend en terminal 1
cd BackendPersonas
npm run dev
# ✅ Servidor ejecutándose en puerto 3000

# Frontend en terminal 2  
cd FrontPersonas
npm run dev
# ✅ Servidor ejecutándose en puerto 5173
```

### 2. Probar Autenticación
1. Ir a `http://localhost:5173`
2. Usar credenciales de prueba:
   - **Email**: `admin@test.com`
   - **Password**: `admin123`
3. Debería redirigir al dashboard

### 3. Probar CRUD de Personas
1. **Dashboard**: Ver estadísticas
2. **Crear**: Ir a "Personas" → "Nueva Persona"
3. **Listar**: Ver lista de personas
4. **Editar**: Hacer clic en "Editar" en cualquier persona
5. **Eliminar**: Hacer clic en "Eliminar" (confirmar)

### 4. Probar Búsqueda
1. Ir a "Personas"
2. Usar el buscador con términos como "Juan" o "María"

## 🌐 URLs de la Aplicación

### Backend
- **API Base**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`
- **Personas**: `http://localhost:3000/api/personas`
- **Auth**: `http://localhost:3000/api/auth`

### Frontend
- **Aplicación**: `http://localhost:5173`
- **Login**: `http://localhost:5173/login`
- **Dashboard**: `http://localhost:5173/dashboard`
- **Personas**: `http://localhost:5173/personas`

## 👤 Usuarios de Prueba

```javascript
// Usuarios preconfigurados en la base de datos
admin@test.com     // Contraseña: admin123
juan@test.com      // Contraseña: 123456  
maria@test.com     // Contraseña: maria123
```

## 🐛 Solución de Problemas Comunes

### Error de Conexión a MySQL
```bash
# Verificar que MySQL esté ejecutándose
sudo systemctl status mysql

# O en Windows
net start mysql

# Verificar credenciales
mysql -u root -p
```

### Error de Puerto en Uso
```bash
# Verificar qué procesos usan los puertos
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Terminar proceso si es necesario
kill -9 <PID>
```

### Error de CORS
```bash
# Verificar que CORS_ORIGIN incluya el puerto del frontend
CORS_ORIGIN=http://localhost:5173
```

### Error de Dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript (Backend)
```bash
# Compilar explícitamente
npm run build

# Verificar tsconfig.json
npx tsc --noEmit
```

## 📝 Scripts Útiles

### Backend
```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada
npm run clean       # Limpiar carpeta dist
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🔄 Flujo de Desarrollo

### Para Desarrollo Continuo
1. **Terminal 1**: `cd BackendPersonas && npm run dev`
2. **Terminal 2**: `cd FrontPersonas && npm run dev`
3. **Navegador**: `http://localhost:5173`
4. Los cambios se reflejan automáticamente (hot-reload)

### Para Producción
1. **Backend**: `npm run build && npm start`
2. **Frontend**: `npm run build`
3. **Deploy**: Subir `dist/` del frontend y backend compilado

## ✅ Checklist de Verificación

- [ ] MySQL instalado y ejecutándose
- [ ] Base de datos `personas_db` creada
- [ ] Backend ejecutándose en puerto 3000
- [ ] Frontend ejecutándose en puerto 5173
- [ ] Login funciona con usuarios de prueba
- [ ] CRUD de personas funciona completamente
- [ ] Búsqueda de personas funciona
- [ ] No hay errores en consola del navegador

## 🆘 Obtener Ayuda

Si encuentras problemas:

1. **Verificar logs**: Revisar consola del navegador y terminal
2. **Health Check**: `curl http://localhost:3000/api/health`
3. **Limpiar caché**: Ctrl+F5 en el navegador
4. **Reiniciar servicios**: Detener y volver a ejecutar backend/frontend

---

🎉 **¡Listo!** Ahora tienes la aplicación completa funcionando con todas las características de gestión de personas y autenticación básica.
