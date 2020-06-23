//Funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);

var nombreUsuario = params.get('nombre');
var sala = params.get('sala');

//Referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


function renderizarUsuarios(personas) {

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);


}

function renderizarMensajes(mensaje, yo) {
    //mensajes en azul: otros usuarios
    //mensajes en gris: mensajes propios
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes(); //obtener la hora de envío del mensaje
    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">'
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"/>'
            html += '</div>'
        }

        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>';
    }




    divChatbox.append(html);
}

//deslizar el chat hasta abajo automáticamente
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// LISTENERS DE JQUERY

// Recuperar el ID del usuario
divUsuarios.on('click', 'a', function () {

    //recupera el parámetro personalizado "data-id"
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

// Enviar la información del formulario
formEnviar.on('submit', function (e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    //en "chat.html" se tiene importado el script de "socket.io", por eso se
    //puede utilizar el objeto "socket" ya configurado

    socket.emit('crearMensaje', {
        nombre: nombreUsuario,
        mensaje: txtMensaje.val(),
    }, function (mensaje) {
        //cuando se ejecuta el callback, se renderiza el mensaje propio
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});

// EJERCICIOS
/*
- Implementar un filtro de contacts
- Abrir una pantalla de chat del usuario seleccionado
*/ 