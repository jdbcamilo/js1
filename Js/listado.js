document.addEventListener('DOMContentLoaded', function() {
    
    function obtenerUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function generarTabla() {
        const usuarios = obtenerUsuarios();
        
        const cuerpoTabla = document.getElementById('cuerpoTabla');
        const mensajeSinDatos = document.getElementById('mensajeSinDatos');
        const tabla = document.getElementById('tablaUsuarios');
        
        if (!cuerpoTabla || !mensajeSinDatos || !tabla) return;
        
        cuerpoTabla.innerHTML = '';
        
        if (usuarios.length === 0) {
            tabla.style.display = 'none';
            mensajeSinDatos.style.display = 'block';
            mensajeSinDatos.innerHTML = '📋 No hay usuarios registrados. <a href="registro.html" style="color: #667eea;">¡Registra uno ahora!</a>';
            return;
        }
        
        tabla.style.display = 'table';
        mensajeSinDatos.style.display = 'none';

        usuarios.forEach((usuario, index) => {
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
                    <button class="btnEditar" data-index="${index}">✏️ Editar</button>
                    <button class="btnEliminar" data-index="${index}">🗑️ Eliminar</button>
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
            generarTabla();
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
            generarTabla();
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

    const btnActualizar = document.getElementById('btnActualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function() {
            generarTabla();
            alert('🔄 Listado actualizado');
        });
    }

    const btnLimpiarTodo = document.getElementById('btnLimpiarTodo');
    if (btnLimpiarTodo) {
        btnLimpiarTodo.addEventListener('click', function() {
            if (confirm('⚠️ ¿Está seguro de eliminar TODOS los usuarios? Esta acción no se puede deshacer.')) {
                localStorage.removeItem('usuarios');
                generarTabla();
                alert('✅ Todos los datos han sido eliminados');
            }
        });
    }

    generarTabla();
    
});