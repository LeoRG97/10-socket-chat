const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if( !data.nombre || !data.sala){
            return callback({
                error: true,
                message: 'El nombre/sala es necesario',
            });
        }

        //unirse a una sala
        client.join(data.sala);

        //agrega al usuario en el arreglo de personas
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //recibir los mensajes del cliente
    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', 
            crearMensaje('Administrador', `${personaBorrada.nombre} salió pitando`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Mensajes privados
    client.on('mensajePrivado', data => {

        // obtener al emisor del mensaje
        let persona = usuarios.getPersona(client.id);

        // especificar el receptor
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});