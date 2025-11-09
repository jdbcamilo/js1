document.addEventListener('DOMContentLoaded', function() {
    
    function obtenerUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function buscarUsuarios(tipo, valor) {
        const usuarios = obtenerUsuarios();
        
        const valorBusqueda = valor.toLowerCase().trim();
        
        const resultados = usuarios.filter(usuario => {
            switch(tipo) {
                case 'cedula':
                    return usuario.cedula.toString().includes(valorBusqueda);
                case 'nombre':
                    return usuario.nombre.toLowerCase().includes(valorBusqueda);
                case 'apellido':
                    return usuario.apellido.toLowerCase().includes(valorBusqueda);
                case 'email':
                    return usuario.email.toLowerCase().includes(valorBusqueda);
                default:
                    return false;
            }
        });
        
        return resultados;
    }

    function mostrarResultados(usuarios) {
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
            
            const todosUsuarios = obtenerUsuarios();
            const indiceReal = todosUsuarios.findIndex(u => 
                u.cedula === usuario.cedula && 
                u.email === usuario.email
            );
            
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
                    <button class="btnEditar" data-index="${indiceReal}">✏️ Editar</button>
                    <button class="btnEliminar" data-index="${indiceReal}">🗑️ Eliminar</button>
                </td>
            `;
            
            cuerpoTabla.appendChild(fila);
        });
        
        agregarEventListeners();
    }

    function agregarEventListeners() {
        document.querySelectorAll('.btnEditar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                abrirModalEditar(index);
            });
        });
        
        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                eliminarUsuario(index);
            });
        });
    }

    function eliminarUsuario(index) {
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            let usuarios = obtenerUsuarios();
            const usuarioEliminado = usuarios[index];
            usuarios.splice(index, 1);
            guardarUsuarios(usuarios);
            
            const tipo = document.getElementById('tipoBusqueda').value;
            const valor = document.getElementById('valorBusqueda').value;
            
            if (tipo && valor) {
                const resultados = buscarUsuarios(tipo, valor);
                mostrarResultados(resultados);
            } else {
                mostrarResultados(obtenerUsuarios());
            }
            
            alert(`✅ Usuario ${usuarioEliminado.nombre} ${usuarioEliminado.apellido} eliminado exitosamente`);
        }
    }

    function abrirModalEditar(index) {
        const usuarios = obtenerUsuarios();
        const usuario = usuarios[index];
        
        const modal = document.getElementById('modalEditar');
        if (!modal) return;
        
        document.getElementById('editIndex').value = index;
        document.getElementById('editCedula').value = usuario.cedula;
        document.getElementById('editNombre').value = usuario.nombre;
        document.getElementById('editApellido').value = usuario.apellido;
        document.getElementById('editEmail').value = usuario.email;
        document.getElementById('editFecha').value = usuario.fecha || '';
        document.getElementById('editTelefono').value = usuario.telefono;
        document.getElementById('editGenero').value = usuario.genero;
        document.getElementById('editRol').value = usuario.rol;
        
        modal.style.display = 'block';
    }

    function cerrarModal() {
        const modal = document.getElementById('modalEditar');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    const formBuscar = document.getElementById('formBuscar');
    if (formBuscar) {
        formBuscar.addEventListener('submit', function(e) {
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
            
            const resultados = buscarUsuarios(tipo, valor);
            mostrarResultados(resultados);
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
        btnMostrarTodos.addEventListener('click', function() {
            const usuarios = obtenerUsuarios();
            mostrarResultados(usuarios);
        });
    }

    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const index = document.getElementById('editIndex').value;
            let usuarios = obtenerUsuarios();
            
            usuarios[index] = {
                cedula: document.getElementById('editCedula').value,
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                email: document.getElementById('editEmail').value,
                fecha: document.getElementById('editFecha').value,
                telefono: document.getElementById('editTelefono').value,
                genero: document.getElementById('editGenero').value,
                rol: document.getElementById('editRol').value
            };
            
            guardarUsuarios(usuarios);
            cerrarModal();
            
            const tipo = document.getElementById('tipoBusqueda').value;
            const valor = document.getElementById('valorBusqueda').value;
            
            if (tipo && valor) {
                const resultados = buscarUsuarios(tipo, valor);
                mostrarResultados(resultados);
            }
            
            alert('✅ Usuario actualizado exitosamente');
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