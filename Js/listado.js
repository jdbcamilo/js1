document.addEventListener('DOMContentLoaded', function() {
    
    async function generarTabla() {
        try {
            const usuarios = await UsuariosAPI.obtenerTodos();
            
            const cuerpoTabla = document.getElementById('cuerpoTabla');
            const mensajeSinDatos = document.getElementById('mensajeSinDatos');
            const tabla = document.getElementById('tablaUsuarios');
            
            if (!cuerpoTabla || !mensajeSinDatos || !tabla) return;
            
            cuerpoTabla.innerHTML = '';
            
            if (usuarios.length === 0) {
                tabla.style.display = 'none';
                mensajeSinDatos.style.display = 'block';
                mensajeSinDatos.innerHTML = '📋 No hay usuarios registrados. <a href="index.html" style="color: #667eea;">¡Registra uno ahora!</a>';
                return;
            }
            
            tabla.style.display = 'table';
            mensajeSinDatos.style.display = 'none';

            usuarios.forEach((usuario) => {
                const fila = document.createElement('tr');
                
                fila.innerHTML = `
                    <td>${usuario.cedula}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.fecha || 'N/A'}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.genero}</td>
                    <td>${usuario.rol}</td>
                    <td class="acciones">
                        <button class="btnEditar" data-id="${usuario.id}">✏️ Editar</button>
                        <button class="btnEliminar" data-id="${usuario.id}">🗑️ Eliminar</button>
                    </td>
                `;
                
                cuerpoTabla.appendChild(fila);
            });
            
            agregarEventListeners();
        } catch (error) {
            console.error('Error al generar tabla:', error);
            alert('❌ Error al cargar los usuarios. Por favor, intente nuevamente.');
        }
    }

    function agregarEventListeners() {

        document.querySelectorAll('.btnEditar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                abrirModalEditar(id);
            });
        });
        
        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                eliminarUsuario(id);
            });
        });
    }

    async function eliminarUsuario(id) {
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                const usuario = await UsuariosAPI.obtenerPorId(id);
                await UsuariosAPI.eliminar(id);
                await generarTabla();
                alert(`✅ Usuario ${usuario.nombre} ${usuario.apellido} eliminado exitosamente`);
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                alert('❌ Error al eliminar el usuario. Por favor, intente nuevamente.');
            }
        }
    }

    async function abrirModalEditar(id) {
        try {
            const usuario = await UsuariosAPI.obtenerPorId(id);
            
            const modal = document.getElementById('modalEditar');
            if (!modal) return;
            
            document.getElementById('editIndex').value = id;
            document.getElementById('editCedula').value = usuario.cedula;
            document.getElementById('editNombre').value = usuario.nombre;
            document.getElementById('editApellido').value = usuario.apellido;
            document.getElementById('editEmail').value = usuario.email;
            document.getElementById('editFecha').value = usuario.fecha || '';
            document.getElementById('editTelefono').value = usuario.telefono;
            document.getElementById('editGenero').value = usuario.genero;
            document.getElementById('editRol').value = usuario.rol;
            
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            alert('❌ Error al cargar el usuario. Por favor, intente nuevamente.');
        }
    }

    function cerrarModal() {
        const modal = document.getElementById('modalEditar');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const id = document.getElementById('editIndex').value;
            
            const usuarioActualizado = {
                cedula: document.getElementById('editCedula').value,
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                email: document.getElementById('editEmail').value,
                fecha: document.getElementById('editFecha').value,
                telefono: document.getElementById('editTelefono').value,
                genero: document.getElementById('editGenero').value,
                rol: document.getElementById('editRol').value
            };
            
            try {
                await UsuariosAPI.actualizar(id, usuarioActualizado);
                cerrarModal();
                await generarTabla();
                alert('✅ Usuario actualizado exitosamente');
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                alert('❌ Error al actualizar el usuario. Por favor, intente nuevamente.');
            }
        });
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }

    const btnCancelar = document.querySelector('.btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModal);
    }

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalEditar');
        if (e.target === modal) {
            cerrarModal();
        }
    });

    const btnActualizar = document.getElementById('btnActualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async function() {
            await generarTabla();
            alert('🔄 Listado actualizado');
        });
    }

    const btnLimpiarTodo = document.getElementById('btnLimpiarTodo');
    if (btnLimpiarTodo) {
        btnLimpiarTodo.addEventListener('click', async function() {
            if (confirm('⚠️ ¿Está seguro de eliminar TODOS los usuarios? Esta acción no se puede deshacer.')) {
                try {
                    const usuarios = await UsuariosAPI.obtenerTodos();
                    
                    // Eliminar todos los usuarios uno por uno
                    for (const usuario of usuarios) {
                        await UsuariosAPI.eliminar(usuario.id);
                    }
                    
                    await generarTabla();
                    alert('✅ Todos los datos han sido eliminados');
                } catch (error) {
                    console.error('Error al eliminar todos los usuarios:', error);
                    alert('❌ Error al eliminar los usuarios. Por favor, intente nuevamente.');
                }
            }
        });
    }

    generarTabla();
    
});