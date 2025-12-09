document.addEventListener('DOMContentLoaded', function() {
    
    function limpiarFormulario() {
        document.getElementById('myForm').reset();
        const mensaje = document.getElementById('mensaje');
        if (mensaje) {
            mensaje.innerHTML = '';
        }
    }

    function mostrarMensaje(mensaje, tipo) {
        const divMensaje = document.getElementById('mensaje');
        if (divMensaje) {
            divMensaje.innerHTML = `<p class="${tipo}">${mensaje}</p>`;
            
            setTimeout(() => {
                divMensaje.innerHTML = '';
            }, 3000);
        }
    }

    const myForm = document.getElementById('myForm');
    if (myForm) {
        myForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const persona = {
                cedula: document.getElementById('cedula').value,
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                email: document.getElementById('email').value,
                fecha: document.getElementById('fecha').value,
                telefono: document.getElementById('telefono').value,
                genero: document.getElementById('genero').value,
                rol: document.getElementById('rol').value
            };
            
            try {
                // Verificar si la cédula ya existe
                const usuarios = await UsuariosAPI.obtenerTodos();
                const cedulaExiste = usuarios.some(user => user.cedula === persona.cedula);
                
                if (cedulaExiste) {
                    mostrarMensaje('❌ Error: La cédula ya está registrada', 'error');
                    return;
                }
                
                // Crear el usuario en MockAPI
                await UsuariosAPI.crear(persona);
                
                mostrarMensaje('✅ Usuario guardado exitosamente', 'exito');
                limpiarFormulario();
            } catch (error) {
                mostrarMensaje('❌ Error al guardar el usuario. Por favor, intente nuevamente.', 'error');
                console.error('Error:', error);
            }
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            limpiarFormulario();
        });
    }

    const btnVerUsuarios = document.getElementById('btnVerUsuarios');
    if (btnVerUsuarios) {
        btnVerUsuarios.addEventListener('click', function() {
            window.location.href = 'listado.html';
        });
    }
    
});