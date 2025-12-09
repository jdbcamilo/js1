# Sistema de Gestión de Usuarios con CRUD y MockAPI

Este proyecto implementa un sistema completo de gestión de usuarios con operaciones CRUD (Create, Read, Update, Delete) utilizando MockAPI como backend.

## Características

- ✅ **CREATE**: Registro de nuevos usuarios
- ✅ **READ**: Visualización y búsqueda de usuarios
- ✅ **UPDATE**: Edición de información de usuarios existentes
- ✅ **DELETE**: Eliminación de usuarios

## Configuración de MockAPI

### Paso 1: Crear un proyecto en MockAPI

1. Visita [mockapi.io](https://mockapi.io/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Crea un recurso llamado "usuarios" con los siguientes campos:
   - `cedula` (string)
   - `nombre` (string)
   - `apellido` (string)
   - `email` (string)
   - `fecha` (string)
   - `telefono` (string)
   - `genero` (string)
   - `rol` (string)

### Paso 2: Configurar la URL de tu API

1. Abre el archivo `Js/api.js`
2. Actualiza la constante `API_BASE_URL` con la URL de tu proyecto MockAPI:

```javascript
const API_BASE_URL = 'https://TU_ID_DE_PROYECTO.mockapi.io/api/v1';
```

Por ejemplo:
```javascript
const API_BASE_URL = 'https://673609c75995834c8a931e38.mockapi.io/api/v1';
```

## Estructura del Proyecto

```
js1/
├── index.html          # Página de registro de usuarios
├── listado.html        # Página de listado de usuarios
├── buscar.html         # Página de búsqueda de usuarios
├── Js/
│   ├── api.js         # Módulo de servicios API
│   ├── registro.js    # Lógica de registro
│   ├── listado.js     # Lógica de listado
│   └── buscar.js      # Lógica de búsqueda
└── Styles/
    └── Formulario.css # Estilos de la aplicación
```

## Uso

### Registro de Usuarios (CREATE)

1. Abre `index.html` en tu navegador
2. Completa el formulario con la información del usuario
3. Haz clic en "Guardar Usuario"
4. El usuario se guardará en MockAPI

### Listado de Usuarios (READ)

1. Abre `listado.html` en tu navegador
2. Verás todos los usuarios registrados en una tabla
3. Usa el botón "Actualizar Listado" para recargar los datos

### Editar Usuarios (UPDATE)

1. En el listado o búsqueda, haz clic en el botón "✏️ Editar"
2. Modifica los campos en el modal
3. Haz clic en "Guardar Cambios"

### Eliminar Usuarios (DELETE)

1. En el listado o búsqueda, haz clic en el botón "🗑️ Eliminar"
2. Confirma la eliminación

### Buscar Usuarios (READ)

1. Abre `buscar.html` en tu navegador
2. Selecciona el tipo de búsqueda (cédula, nombre, apellido o email)
3. Ingresa el valor a buscar
4. Haz clic en "Buscar"

## Servicios API Disponibles

El módulo `api.js` proporciona los siguientes servicios:

- `UsuariosAPI.obtenerTodos()` - Obtiene todos los usuarios
- `UsuariosAPI.obtenerPorId(id)` - Obtiene un usuario específico
- `UsuariosAPI.crear(usuario)` - Crea un nuevo usuario
- `UsuariosAPI.actualizar(id, usuario)` - Actualiza un usuario existente
- `UsuariosAPI.eliminar(id)` - Elimina un usuario
- `UsuariosAPI.buscar(campo, valor)` - Busca usuarios por campo

## Ejecución Local

Para ejecutar el proyecto localmente:

```bash
# Usando Python 3
python3 -m http.server 8000

# O usando Node.js con http-server
npx http-server -p 8000
```

Luego abre tu navegador en `http://localhost:8000`

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- MockAPI (Backend REST API)
- Fetch API para peticiones HTTP

## Características Técnicas

- Arquitectura basada en servicios
- Manejo de errores con try-catch
- Async/await para operaciones asíncronas
- Validación de duplicados por cédula
- Interfaz responsive
- Mensajes de confirmación y error

## Autores

Diseñado por Juan Camilo Diaz y Natalia Sofia Durango
