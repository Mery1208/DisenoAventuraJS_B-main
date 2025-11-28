//-----------------------------------------------------------
//CLASE JUGADOR
// Aquí hice la base creando al cazador (jugador principal)
//-------------------------------------------------------------

export class Jugador {
    //añado constructor con sus datos 
     constructo({nombre, avatar, vida= 100, puntos = 100 }) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.vidaBase = vida;
        this.puntos = puntos;
        this.inventario = []; //es el inventario donde estará los productos que compre luego
    }
    
    //Objetivo: Intento añadir un objeto a mi mochila (inventario).
    // Devuelve: 'true' si lo puse, 'false' si ya está lleno.
    añadirObjeto(producto) {
    }


    retirarObjeto(nombreProducto) {

    }

    sumarPuntos() {

    }

    getAtaqueTotal() {

    }

     getDefensaTotal() {
        
    }

     getVidaTotal() {
        
    }






}