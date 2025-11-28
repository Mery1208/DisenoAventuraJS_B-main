//-----------------------------------------------------------
//CLASE RANKING
// Determina el nivel del jugador (NovatO o Veterano) según su puntuación total.
//Recibe la 'puntuacion' final y un umbral, que es la puntuación mínima para ser Veterano, por defecto 500.
// y muestra el texto con el rango del jugador.
//-------------------------------------------------------------

export function distinguirJugador(puntuacion, umbral = 500) {
// Si la puntuación es igual o mayor al umbral, devuelve Veterano, si no, devuelve Novato.
return puntuacion >= umbral ? 'Veterano' : 'Novato';
}