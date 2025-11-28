//-----------------------------------------------------------
//CLASE ENEMIGO
// Aquí hice la base creando a los enemigos del juego para usarlo después 
//-------------------------------------------------------------

export class Enemigo {
    constructo({nombre, imagen, ataque, vida }) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.ataque = ataque;
        this.vida = vida;
    }
}