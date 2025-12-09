// Configuración de MockAPI
const API_BASE_URL = 'https://6937a8bc4618a71d77cd2acc.mockapi.io/apio/v1';
const USUARIOS_ENDPOINT = '/usuarios';

// Servicio API para gestión de usuarios
const UsuariosAPI = {
    // Obtener todos los usuarios (READ)
    async obtenerTodos() {
        try {
            const response = await fetch(`${API_BASE_URL}${USUARIOS_ENDPOINT}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    // Obtener un usuario por ID (READ)
    async obtenerPorId(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${USUARIOS_ENDPOINT}/${id}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    },

    // Crear un nuevo usuario (CREATE)
    async crear(usuario) {
        try {
            const response = await fetch(`${API_BASE_URL}${USUARIOS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },

    // Actualizar un usuario existente (UPDATE)
    async actualizar(id, usuario) {
        try {
            const response = await fetch(`${API_BASE_URL}${USUARIOS_ENDPOINT}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    },

    // Eliminar un usuario (DELETE)
    async eliminar(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${USUARIOS_ENDPOINT}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    },

    // Buscar usuarios por campo y valor
    async buscar(campo, valor) {
        try {
            const usuarios = await this.obtenerTodos();
            const valorBusqueda = valor.toLowerCase().trim();
            
            const resultados = usuarios.filter(usuario => {
                switch(campo) {
                    case 'cedula':
                        return usuario.cedula && usuario.cedula.toString().includes(valorBusqueda);
                    case 'nombre':
                        return usuario.nombre && usuario.nombre.toLowerCase().includes(valorBusqueda);
                    case 'apellido':
                        return usuario.apellido && usuario.apellido.toLowerCase().includes(valorBusqueda);
                    case 'email':
                        return usuario.email && usuario.email.toLowerCase().includes(valorBusqueda);
                    default:
                        return false;
                }
            });
            
            return resultados;
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            throw error;
        }
    }
};
