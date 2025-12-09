document.addEventListener('DOMContentLoaded', function() {
    
    async function mostrarResultados(usuarios) {
        const cuerpoTabla = document.getElementById('cuerpoTabla');
        const mensajeSinResultados = document.getElementById('mensajeSinResultados');
        const tabla = document.getElementById('tablaResultados');
        
        if (!cuerpoTabla || !mensajeSinResultados || !tabla) return;
        
        cuerpoTabla.innerHTML = '';
        
        if (usuarios.length === 0) {
            tabla.style.display = 'none';
            mensajeSinResultados.style.display = 'block';
            mensajeSinResultados.innerHTML = '🔍 No se encontraron resultados para tu búsqueda';
            return;
        }
        
        tabla.style.display = 'table';
        mensajeSinResultados.style.display = 'none';
        
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
                
                // Volver a realizar la búsqueda actual
                const tipo = document.getElementById('tipoBusqueda').value;
                const valor = document.getElementById('valorBusqueda').value;
                
                if (tipo && valor) {
                    const resultados = await UsuariosAPI.buscar(tipo, valor);
                    mostrarResultados(resultados);
                } else {
                    const usuarios = await UsuariosAPI.obtenerTodos();
                    mostrarResultados(usuarios);
                }
                
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

    const formBuscar = document.getElementById('formBuscar');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const tipo = document.getElementById('tipoBusqueda').value;
            const valor = document.getElementById('valorBusqueda').value;
            
            if (!tipo) {
                alert('⚠️ Por favor seleccione un tipo de búsqueda');
                return;
            }
            
            if (!valor) {
                alert('⚠️ Por favor ingrese un valor a buscar');
                return;
            }
            
            try {
                const resultados = await UsuariosAPI.buscar(tipo, valor);
                mostrarResultados(resultados);
            } catch (error) {
                console.error('Error al buscar usuarios:', error);
                alert('❌ Error al buscar usuarios. Por favor, intente nuevamente.');
            }
        });
    }

    const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');
    if (btnLimpiarBusqueda) {
        btnLimpiarBusqueda.addEventListener('click', function() {
            document.getElementById('formBuscar').reset();
            document.getElementById('cuerpoTabla').innerHTML = '';
            document.getElementById('tablaResultados').style.display = 'none';
            document.getElementById('mensajeSinResultados').style.display = 'none';
        });
    }

    const btnMostrarTodos = document.getElementById('btnMostrarTodos');
    if (btnMostrarTodos) {
        btnMostrarTodos.addEventListener('click', async function() {
            try {
                const usuarios = await UsuariosAPI.obtenerTodos();
                mostrarResultados(usuarios);
            } catch (error) {
                console.error('Error al obtener todos los usuarios:', error);
                alert('❌ Error al cargar los usuarios. Por favor, intente nuevamente.');
            }
        });
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
                
                // Volver a realizar la búsqueda actual
                const tipo = document.getElementById('tipoBusqueda').value;
                const valor = document.getElementById('valorBusqueda').value;
                
                if (tipo && valor) {
                    const resultados = await UsuariosAPI.buscar(tipo, valor);
                    mostrarResultados(resultados);
                }
                
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
    
});