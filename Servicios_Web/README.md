# BuildX.Pro - Servicios Web

## 📋 Descripción

Sistema de servicios web en PHP para la gestión de proyectos de construcción BuildX.Pro.

## 🚀 Instalación Rápida

### Manual
1. Crea la base de datos `buildxpro` en phpMyAdmin
2. Importa `database/schema.sql`
3. Configura credenciales en `database/connection.php`
4. Copia la carpeta `Servicios_Web` a `C:\xampp\htdocs\`

## 📁 Estructura

```
Servicios_Web/
├── api/
│   ├── auth.php          # Autenticación
│   ├── proyectos.php     # Gestión de proyectos
│   ├── recursos.php       # Gestión de recursos
│   └── reportes.php      # Gestión de reportes
├── database/
│   ├── connection.php    # Conexión a BD
│   ├── schema.sql        # Estructura completa + datos de prueba
│   ├── crear_bd.sql      # Solo estructura
│   └── datos_prueba.sql  # Datos de prueba adicionales
└── .htaccess             # Configuración Apache
```

## ⚙️ Configuración

### Base de Datos

Edita `database/connection.php`:

```php
private $host = "localhost";
private $db_name = "buildxpro";
private $username = "root";
private $password = "";
```

### API Base URL

En la aplicación React, la URL base de la API está configurada en:
- `src/context/AuthContext.js`
- `src/services/apiService.js`

## 🧪 Pruebas

### Probar API
```
http://localhost/Servicios_Web/api/proyectos.php
```

### Credenciales de Prueba
- Usuario: `admin`
- Contraseña: `password`

## 📚 Documentación

Ver el archivo README.md en la raíz del proyecto para documentación completa.

## 🔑 Endpoints

### Proyectos
```
GET    /api/proyectos.php           # Listar todos
GET    /api/proyectos.php?id=X      # Obtener uno
POST   /api/proyectos.php           # Crear
PUT    /api/proyectos.php           # Actualizar
DELETE /api/proyectos.php?id=X      # Eliminar
```

### Recursos
```
GET    /api/recursos.php?type=personal
POST   /api/recursos.php
PUT    /api/recursos.php
DELETE /api/recursos.php?type=X&id=Y
```

### Autenticación
```
POST   /api/auth.php?action=login
POST   /api/auth.php?action=register
POST   /api/auth.php?action=verify
```

## 🐛 Solución de Problemas

### Error de conexión
- Verifica que MySQL está corriendo
- Revisa credenciales en `connection.php`

### Error CORS
- Verifica `.htaccess`
- Reinicia Apache

### 404 en rutas
- Verifica que `Servicios_Web` está en `htdocs`
- Revisa `mod_rewrite` en Apache

## 📄 Licencia

MIT

---

**BuildX.Pro** - Sistema de Gestión de Construcción v0.2
