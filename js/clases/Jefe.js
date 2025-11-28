import { Enemigo } from './Enemigo.js';

//-----------------------------------------------------------
//CLASE JEFE
//Herencia de Enemigo (extends) tiene sus datos recogidos de Enemigo
//-------------------------------------------------------------

export class Jefe extends Enemigo {
    constructor({ nombre, imagen, ataque, vida, multiplicadorPupa = 1.2}) {
        //llamo al super para darle los datos de la clase enemigo 
        super({ nombre, imagen, ataque, vida});
        // le añado un dato extra que solo tendra Jefe, es hacer ganar más puntos.
        this.multiplicadorPupa = multiplicadorPupa;
    }
}