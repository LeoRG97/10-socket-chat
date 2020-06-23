class Usuarios {

    constructor() {
        this.personas = []; //personas conectadas al chat
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala};
        this.personas.push(persona);
        return this.personas;
    }

    getPersona( id ){
        let persona = this.personas.filter(p => p.id === id)[0];
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala( sala ){
        //obtener personas por salas de chat
        let personasEnSala = this.personas.filter(p => p.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(p => p.id !== id);
        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}