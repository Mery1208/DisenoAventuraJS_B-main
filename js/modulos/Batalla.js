import { Jefe } from '../clases/Jefe.js';

//-----------------------------------------------------------
//CLASE BATALLALl lo que hago aquí es simular una pelea por turnos.
//Necesito saber quién es el enemigo y quién es el jugador.
//Me entrega quién 'ganador', cuántos puntosGanados hay, y el log historial.
//------------------------------------------------------------
export function combate(enemigo, jugador) {
    // Uso la vida total del jugador incluyendo bonus.
  let vidaJugador = jugador.getVidaTotal(); 
  // Uso la vida del enemigo.
  let vidaEnemigo = enemigo.vida; 

// Una lista para ir apuntando lo que pasa en cada turno.
  const log = []; 
  let turno = 1;

  // El combate sigue con este bucle while mientras los dos sigan vivos.
  while (vidaJugador > 0 && vidaEnemigo > 0) {
    
    // TURNO DEL JUGADOR 
    const dañoJugador = jugador.getAtaqueTotal(); 
    // Le resto el daño a la vida del enemigo. Math es para que la vida no baje de cero.
    vidaEnemigo = Math.max(0, vidaEnemigo - dañoJugador);
    log.push(`Turno ${turno} - Jugador ataca: ${dañoJugador}. Vida enemigo: ${vidaEnemigo}`);

    // Si el enemigo murió en mi turno, paro la pelea aquí.
    if (vidaEnemigo <= 0) break;

    // TURNO DEL ENEMIGO 
    const defensaJugador = jugador.getDefensaTotal(); 
    // Calculo cuánto daño de verdad me quita el enemigo, restando mi defensa.
    const dañoRecibido = Math.max(0, enemigo.ataque - defensaJugador);
    // Le resto ese daño real a mi vida.
    vidaJugador = Math.max(0, vidaJugador - dañoRecibido);
    log.push(`Turno ${turno} - Enemigo ataca: ${enemigo.ataque} (-defensa ${defensaJugador}) = ${dañoRecibido}. Vida jugador: ${vidaJugador}`);

    turno++; // Paso al siguiente turno.
  }

  // CÁLCULO DE PUNTOS 
  let puntosGanados = 0;
  let ganador = 'Enemigo';

  if (vidaEnemigo <= 0) {
    ganador = 'Jugador';
    // Puntos base que doy por ganar: 100 más el ataque del enemigo.
    puntosGanados = 100 + enemigo.ataque;
    
    // Si el enemigo era de la clase Jefe, multiplico los puntos para que gane más.
    if (enemigo instanceof Jefe) {
      puntosGanados = Math.round(puntosGanados * enemigo.multiplicadorPupa);
    }
  }

  // Devuelvo el resultado final de la pelea.
  return { ganador,
     puntosGanados,
      log };
}