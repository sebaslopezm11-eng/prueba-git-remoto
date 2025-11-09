# BuildBox - Sistema de Gestión de Construcción con React.js

## Descripción

BuildBox es una aplicación web moderna desarrollada con React.js para la gestión de proyectos de construcción. Incluye sistema de autenticación completo con conexión a MySQL.

## Características Principales

### 🏠 Inicio (Dashboard)
- Vista general del estado de la obra
- Alertas recientes con niveles de prioridad
- Resumen de actividades y estadísticas clave
- Acceso rápido a funciones principales

### 📁 Proyectos
- Lista de proyectos activos con estado y progreso
- Vista detallada de cada proyecto
- Información general, cronograma y avances
- Filtros por estado y búsqueda por nombre/ubicación
- Modal para agregar nuevos proyectos

### 👥 Recursos
- **Personal**: Gestión de empleados con roles y horarios
- **Equipos**: Control de maquinaria y equipos de construcción
- **Materiales**: Inventario y control de insumos
- Estado de disponibilidad y próximas entregas
- Sistema de pestañas para navegación

### 📊 Reportes
- Generación de informes técnicos
- Filtros por fecha, proyecto o recurso
- Exportación en PDF y Excel
- Historial de reportes generados
- Modal para generar nuevos reportes

### ⚙️ Administración
- Gestión de usuarios y roles
- Configuración general del sistema
- Sincronización de datos
- Configuración de permisos

## Tecnologías Utilizadas

### Frontend
- **React 18.2.0**: Biblioteca principal para la interfaz de usuario
- **React Router DOM 6.8.0**: Navegación entre páginas
- **React Context API**: Gestión de estado global
- **CSS3**: Diseño responsivo con Flexbox y Grid
- **Font Awesome 6.0.0**: Iconografía consistente

### Herramientas de Desarrollo
- **Create React App**: Configuración inicial del proyecto
- **React Scripts**: Scripts de desarrollo y construcción
- **Styled Components**: Componentes de estilo (opcional)

## Estructura del Proyecto

```
BuildX.Pro.REACT.JS.V.0.2/
├── public/
│   └── index.html              # Plantilla HTML principal
├── src/
│   ├── components/             # Componentes React
│   │   ├── Header.js           # Componente de encabezado
│   │   ├── BottomNavigation.js # Navegación inferior
│   │   ├── Dashboard.js        # Panel principal
│   │   ├── Projects.js         # Gestión de proyectos
│   │   ├── Resources.js        # Gestión de recursos
│   │   ├── Reports.js          # Generación de reportes
│   │   ├── Administration.js   # Panel de administración
│   │   ├── Login.js            # Formulario de login
│   │   ├── Register.js         # Formulario de registro
│   │   ├── ProtectedRoute.js   # Protección de rutas
│   │   └── modals/             # Componentes modales
│   ├── context/
│   │   ├── AppContext.js       # Contexto de la aplicación
│   │   └── AuthContext.js      # Contexto de autenticación
│   ├── services/
│   │   └── apiService.js       # Servicio de API
│   ├── App.js                  # Componente principal
│   ├── App.css                 # Estilos principales
│   ├── index.js                # Punto de entrada
│   └── index.css               # Estilos globales
├── Servicios_Web/              # Backend PHP
│   ├── api/                    # Endpoints de API
│   │   ├── auth.php
│   │   ├── proyectos.php
│   │   ├── recursos.php
│   │   └── reportes.php
│   └── database/               # Base de datos
│       ├── connection.php
│       ├── schema.sql
│       ├── crear_bd.sql
│       └── datos_prueba.sql
├── package.json                # Dependencias y scripts
├── package-lock.json           # Lock de dependencias
└── README.md                   # Documentación
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes el proyecto en un repositorio
   git clone <url-del-repositorio>
   cd buildbox-react
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   # o
   yarn start
   ```

4. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`

### Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo

# Construcción
npm run build      # Construye la aplicación para producción

# Testing
npm test           # Ejecuta las pruebas

# Eject (no recomendado)
npm run eject      # Expone la configuración de webpack
```

## Arquitectura de la Aplicación

### Gestión de Estado
La aplicación utiliza React Context API para la gestión del estado global:

```javascript
// AppContext.js
const AppContext = createContext();

const initialState = {
  currentSection: 'inicio',
  projects: [...],
  resources: {...},
  reports: [...]
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    // ... más casos
  }
};
```

### Componentes Principales

#### 1. App Component
- Configuración del Router
- Provider del Context
- Estructura principal de la aplicación

#### 2. Dashboard Component
- Estadísticas en tiempo real
- Alertas del sistema
- Accesos rápidos

#### 3. Projects Component
- Lista de proyectos con filtros
- Modal para agregar proyectos
- Vista detallada de proyectos

#### 4. Resources Component
- Sistema de pestañas (Personal, Equipos, Materiales)
- Gestión de recursos por categoría

#### 5. Reports Component
- Generación de reportes
- Filtros avanzados
- Exportación en múltiples formatos

### Navegación
La aplicación utiliza React Router para la navegación:

```javascript
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/proyectos" element={<Projects />} />
  <Route path="/recursos" element={<Resources />} />
  <Route path="/reportes" element={<Reports />} />
  <Route path="/administracion" element={<Administration />} />
</Routes>
```

## Diseño Responsivo

La aplicación está optimizada para los siguientes tamaños de pantalla:

- **Mobile**: 360x640px, 375x812px, 414x896px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Características del Diseño

- **Navegación inferior**: Acceso rápido a secciones principales
- **Tarjetas informativas**: Presentación clara de datos
- **Filtros y búsqueda**: Localización rápida de información
- **Botones de acción flotantes (FAB)**: Acciones principales destacadas
- **Modales**: Formularios y confirmaciones sin interrumpir el flujo
- **Indicadores visuales**: Barras de progreso, badges de estado, alertas

## Funcionalidades Implementadas

### ✅ Completadas
- [x] Estructura React con componentes modulares
- [x] React Router para navegación
- [x] Context API para gestión de estado
- [x] Diseño CSS responsivo con Mobile-First
- [x] Dashboard con estadísticas en tiempo real
- [x] Gestión de proyectos con vista detallada
- [x] Sistema de recursos con pestañas
- [x] Generación y exportación de reportes
- [x] Panel de administración
- [x] Modales interactivos
- [x] Búsqueda y filtros
- [x] Estados de carga y feedback visual

### 🔄 Características Interactivas
- Navegación fluida entre secciones
- Búsqueda en tiempo real
- Filtros dinámicos
- Modales responsivos
- Estados de carga
- Notificaciones toast
- Navegación por teclado (ESC para cerrar modales)

## Cómo Usar la Aplicación

1. **Iniciar la aplicación**: Ejecutar `npm start`
2. **Navegar**: Usar la barra de navegación inferior para cambiar entre secciones
3. **Buscar**: Usar los campos de búsqueda para encontrar información específica
4. **Filtrar**: Aplicar filtros para ver datos específicos
5. **Agregar contenido**: Usar los botones FAB (+) para agregar nuevos elementos
6. **Ver detalles**: Hacer clic en las tarjetas para ver información detallada
7. **Generar reportes**: Usar la sección de reportes para exportar datos

## Paleta de Colores

- **Primario**: Gradiente azul-púrpura (#667eea → #764ba2)
- **Secundario**: Grises neutros (#f5f7fa, #2c3e50, #7f8c8d)
- **Éxito**: Verde (#28a745)
- **Advertencia**: Amarillo (#ffc107)
- **Error**: Rojo (#dc3545)
- **Información**: Azul (#007bff)

## Tipografía

- **Fuente principal**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Jerarquía clara**: Diferentes tamaños para títulos, subtítulos y texto
- **Legibilidad**: Alto contraste y espaciado adecuado

## Accesibilidad

- Navegación por teclado
- Contraste de colores adecuado
- Etiquetas semánticas
- Estados de foco visibles
- Texto alternativo para iconos

## Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles iOS/Android

## Desarrollo y Contribución

### Estructura de Componentes
Cada componente sigue la estructura estándar de React:

```javascript
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './ComponentName.css';

const ComponentName = () => {
  // Estado local
  const [state, setState] = useState(initialValue);
  
  // Contexto global
  const { state: globalState, dispatch } = useApp();
  
  // Renderizado
  return (
    <div className="component-name">
      {/* Contenido del componente */}
    </div>
  );
};

export default ComponentName;
```

### Convenciones de Nomenclatura
- **Componentes**: PascalCase (ej: `ProjectCard`)
- **Archivos**: PascalCase para componentes (ej: `ProjectCard.js`)
- **CSS**: kebab-case (ej: `project-card.css`)
- **Funciones**: camelCase (ej: `handleSubmit`)

## Sistema de Autenticación

✅ **Integración con base de datos MySQL**  
✅ **Sistema de login/registro**  
✅ **Rutas protegidas**  
✅ **Gestión de sesiones**

### Credenciales por Defecto
- Usuario: `admin`
- Contraseña: `password`

## Configuración Base de Datos

### Requisitos
- XAMPP/WAMP/Laragon (Apache y MySQL)
- Apache configurado en puerto 80 (por defecto)

### Pasos de Configuración

1. **Instalar base de datos:**
   - Abrir phpMyAdmin: `http://localhost/phpmyadmin`
   - Crear base de datos: `buildxpro`
   - Importar: `Servicios_Web/database/schema.sql`

2. **Configurar conexión:**
   - Editar: `Servicios_Web/database/connection.php`
   - Ajustar credenciales si es necesario (por defecto: root sin password)

3. **Copiar carpeta a htdocs:**
   ```bash
   # La carpeta Servicios_Web DEBE estar en:
   C:\xampp\htdocs\Servicios_Web\
   ```

4. **Verificar API:**
   ```
   http://localhost/Servicios_Web/api/auth.php
   ```

## Uso de la Aplicación

1. **Iniciar servidores:**
   ```bash
   # XAMPP Control Panel → Start Apache y MySQL
   ```

2. **Iniciar aplicación:**
   ```bash
   npm start
   ```

3. **Acceder:**
   - URL: `http://localhost:3001` (o el puerto que asigne React)
   - Login: `admin` / `password`

## Despliegue

### Construcción para Producción
```bash
npm run build
```

### Despliegue en Netlify
1. Conectar el repositorio a Netlify
2. Configurar el comando de build: `npm run build`
3. Directorio de publicación: `build`

### Despliegue en Vercel
1. Conectar el repositorio a Vercel
2. Configuración automática detectada
3. Despliegue automático en cada push

## Contacto

Para consultas sobre el desarrollo o implementación de BuildBox, contactar al equipo de desarrollo.

---

**BuildBox** - Optimizando la gestión de obras de construcción con React.js desde 2024.