var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
};

socket.on('connect', function() {
    socket.emit('entrarChat', usuario, function(res){
        console.log('Usuarios conectados', res);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log(personas);

});

socket.on('mensajePrivado', function(mensaje){
    console.log('Tienes un mensaje:', mensaje)
})