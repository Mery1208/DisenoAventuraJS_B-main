import { showScene, inicializarInventarioVacio, cargarInventario } from './modulos/Utils.js';
import { Jugador } from './clases/Jugador.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { Producto } from './clases/Producto.js';
import { PRODUCTOS_BASE, ENEMIGOS_BASE } from './modulos/constants.js';
import { obtenerProductosConDescuentoAleatorio, renderizarProductos, renderizarCesta } from './modulos/mercado.js';
import { MAX_INVENTARIO } from './modulos/constants.js';
import { combate } from './modulos/batalla.js';

//INDICE global
//Es mi almacén de datos que yo uso para guardar la información importante del juego.
const estado = {
    jugador: null, // Aquí guardo todos los datos de mi personaje.
    productosDisponibles: [], // Lista de productos que muestro en el Mercado
    cesta: [],// Productos que seleccioné para comprar
    ennemigos: [], // Lista de todos los enemigos a los que me voy a enfrentar
    indiceEnemigoActual: 0, // Uso esta variable para saber contra qué enemigo me toca pelear ahora , empieza en 0
    inventarioVisual: [null, null, null, null, null, null] //array de los items que hay en el inventario
}

// Función  init
// Lo que hago aquí es preparar todo para que el juego arranque por primera vez.

function init() {
    console.log('Iniciando juego..');
    estado.jugador = new Jugador({ nombre: 'Cazador', avatar: './img/jugador/maria.png', vida: 100, puntos: 0 });
    inicializarInventarioVacio(6);
    pintarStatsInicio();
    wireEvents();
    console.log('Aplicación inicializada correctamente');
}


//-----------------ESCENA 1-------------------------------
function pintarStatsInicio() {
  if (!estado.jugador) return; 
  const inventarioJugador = estado.jugador.inventario || [];
  const bonusArmas = inventarioJugador.filter(p => p.tipo === 'Arma').reduce((a, p) => a + (p.bonus || 0), 0);
  const bonusArmadura = inventarioJugador.filter(p => p.tipo === 'Armadura').reduce((a, p) => a + (p.bonus || 0), 0);
  const vidaTotal = estado.jugador.getVidaTotal();

  document.getElementById('inicio-ataque').textContent = bonusArmas;
  document.getElementById('inicio-defensa').textContent = bonusArmadura;
  document.getElementById('inicio-vida').textContent = vidaTotal;
  document.getElementById('inicio-puntos').textContent = estado.jugador.puntos;
}
  // Navegación y Eventos (wireEvents)
//Aquí es donde defino qué pasa cuando pulso cada botón.

function WireEvents() {
 document.getElementById('btn-iniciar-aventura').addEventListener('click', () => {
    irAMercado();
  });

  const btnComprar = document.getElementById('btn-comprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      renderizarCesta(estado.cesta);
      pintarStatsInicio();
      pintarEstadoActualizado();
      console.log('Compra realizada y stats actualizados');
    });
  }

  document.getElementById('btn-ir-estado').addEventListener('click', () => {
    showScene('escena-estado');
    pintarEstadoActualizado();
  });

  document.getElementById('btn-ir-enemigos-2').addEventListener('click', () => {
    irAEnemigos();
  });


  document.getElementById('btn-empezar-batallas').addEventListener('click', () => {
    estado.indiceEnemigoActual = 0; 
    showScene('escena-batallas');
    iniciarSiguienteCombate(); 
  });

  document.getElementById('btn-siguiente-combate').addEventListener('click', () => {
    
    if (estado.indiceEnemigoActual < estado.enemigos.length) {
      iniciarSiguienteCombate();
    } else {
     
      document.getElementById('resultado-combate').innerHTML = '';
      finalizarJuego(); 
    }
  });

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    
    estado.jugador = new Jugador({ nombre: 'Cazador', avatar: './img/jugador/maria.png', vida: 100, puntos: 0 });
   
    estado.cesta = [];
    estado.inventarioVisual = [null, null, null, null, null, null];
    inicializarInventarioVacio(6);
  
    pintarStatsInicio();
    showScene('escena-inicio');
  });
}

// Función  MostrarNotificacionCarrito
// Lo que hice: creé esta función para mostrar un mensaje visual cuando
// añado un producto al carrito. La notificación aparece durante 2 segundos
// y luego desaparece automáticamente.

function mostrarNotificacionCarrito(nombreProducto) {
  
  const notificacion = document.createElement('div');
  notificacion.className = 'cart-notification';
  notificacion.textContent = ` ${nombreProducto} añadido`;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 2000);
}

//-----------------ESCENA 2-------------------------------
//preparo la tienda y la lógica de compra.

function irAMercado() {
  showScene('escena-mercado');

  estado.productosDisponibles = obtenerProductosConDescuentoAleatorio();
  const seleccionarSet = () => new Set(estado.cesta.map(p => p.nombre));

  
  const onToggleCallback = (producto, seleccionado) => {
    if (seleccionado) {

      const añadido = estado.jugador.añadirObjeto(producto);
      if (!añadido) {
 
        alert(`No puedes tener más de ${MAX_INVENTARIO} productos en el inventario.`);
        const seleccionarSet = () => new Set(estado.cesta.map(p => p.nombre));
        renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
        return;
      }
      estado.cesta.push(new Producto(producto));
      actualizarInventarioVisual(new Producto(producto));
      

      // muestro notificación al añadir producto
      // llamo a la función que muestra el mensaje "Producto añadido"

      mostrarNotificacionCarrito(producto.nombre);
    } else {
      estado.cesta = estado.cesta.filter(p => p.nombre !== producto.nombre);
      estado.jugador.retirarObjeto(producto.nombre);
      quitarDelInventarioVisual(producto.nombre);
    }
    

    if (typeof aplicarDescuentoAutomatico === 'function') aplicarDescuentoAutomatico(0.20);
    actualizarResumenOferta();
    pintarStatsInicio();
    pintarEstadoActualizado();
    

    const buscador = document.getElementById('buscar-producto');
    if (buscador && buscador.value.trim() !== '') {
      const term = buscador.value.trim().toLowerCase();
      const filtrados = estado.productosDisponibles.filter(p => p.nombre.toLowerCase().includes(term));
      renderizarProductos(filtrados, onToggleCallback, seleccionarSet());
    }
  }
  renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
  actualizarResumenOferta();


  const inputBuscar = document.getElementById('buscar-producto');
  const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
  if (inputBuscar) {
    inputBuscar.value = '';
    inputBuscar.addEventListener('input', (e) => {
      const term = e.target.value.trim().toLowerCase();
      const filtrados = term === '' ? estado.productosDisponibles : estado.productosDisponibles.filter(p => p.nombre.toLowerCase().includes(term));
      renderizarProductos(filtrados, onToggleCallback, seleccionarSet());
    });
  }
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      if (inputBuscar) inputBuscar.value = '';
      renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
    });
  }

  // Función que cambia el precio de los productos en la cesta aplicándoles el descuento.
  function aplicarDescuentoAutomatico(porcentaje = 0.20) {
    estado.cesta = estado.cesta.map(p => {
      const copia = new Producto(p);
      copia.precioOriginal = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
      copia.precio = Math.round(copia.precioOriginal * (1 - porcentaje) * 100) / 100;
      return copia;
    });
  }
  aplicarDescuentoAutomatico(0.20);
}


// Estado Actualizado 
// Muestra mis datos después de haber comprado.

function pintarEstadoActualizado() {
  document.getElementById('estado-ataque').textContent = estado.jugador.getAtaqueTotal();
  document.getElementById('estado-defensa').textContent = estado.jugador.getDefensaTotal();
  document.getElementById('estado-vida').textContent = estado.jugador.getVidaTotal();
  document.getElementById('estado-puntos').textContent = estado.jugador.puntos;
}

/* Resumen y descuento */
function actualizarResumenOferta() {

  const format = v => v.toFixed(2).replace('.', ',') + ' €';
  const lista = document.getElementById('resumen-oferta');
  const itemsContainerId = 'resumen-items-list';
  let itemsContainer = document.getElementById(itemsContainerId);
  if (lista && !itemsContainer) {
    const div = document.createElement('div');
    div.id = itemsContainerId;
    div.style.marginTop = '8px';
    div.style.maxHeight = '180px';
    div.style.overflowY = 'auto';
    lista.appendChild(div);
    itemsContainer = div;
  }


  const totalOriginal = estado.cesta.reduce((acc, p) => acc + ((p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0)), 0);
  const totalDescontado = estado.cesta.reduce((acc, p) => acc + (p.precio || 0), 0);
  const descuento = Math.round((totalOriginal - totalDescontado) * 100) / 100;


  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    estado.cesta.forEach(p => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      const nombre = document.createElement('div');
      nombre.textContent = p.nombre;
      const precios = document.createElement('div');
      const orig = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
      const disc = (p.precio !== undefined) ? p.precio : orig;
      precios.textContent = `${format(orig)} → ${format(disc)}`;
      row.appendChild(nombre);
      row.appendChild(precios);
      itemsContainer.appendChild(row);
    });
  }


  const elTotal = document.getElementById('total-seleccion');
  const elDesc = document.getElementById('total-descuento');
  const elCon = document.getElementById('total-con-descuento');
  if (elTotal) elTotal.textContent = format(totalOriginal || 0);
  if (elDesc) elDesc.textContent = format(descuento || 0);
  if (elCon) elCon.textContent = format(totalDescontado || 0);
}

function aplicarDescuentoGlobal(porcentaje) {
  estado.cesta = estado.cesta.map(p => {
    const copia = new Producto(p);
    copia.precioOriginal = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
    copia.precio = Math.round(copia.precioOriginal * (1 - porcentaje) * 100) / 100;
    return copia;
  });
  actualizarResumenOferta();
}

// Enemigos 
// Preparé y muestré la lista de enemigos.

function irAEnemigos() {
  showScene('escena-enemigos');
  estado.enemigos = ENEMIGOS_BASE.map(e => e.jefe ? new Jefe(e) : new Enemigo(e));
  renderizarEnemigos(estado.enemigos);
}

function renderizarEnemigos(lista) {
  const cont = document.getElementById('lista-enemigos');
  cont.innerHTML = '';
  lista.forEach(e => {
    const card = document.createElement('div');
    card.className = 'enemy-card';
    card.innerHTML = `
      <img src="${e.imagen}" alt="${e.nombre}">
      <h4>${e.nombre}</h4>
      <p><strong>Ataque:</strong> ${e.ataque}</p>
      <p><strong>Vida:</strong> ${e.vida}</p>
      ${'multiplicadorDaño' in e ? `<p><strong>Jefe x${e.multiplicadorDaño}</strong></p>` : ''}
    `;
    cont.appendChild(card);
  });
}


// Combates 
// Inicia la pelea contra el siguiente enemigo.
// Además de la lógica del combate, me aseguré de que

function iniciarSiguienteCombate() {
  const enemigo = estado.enemigos[estado.indiceEnemigoActual];
  const { ganador, puntosGanados } = combate(enemigo, estado.jugador);

  const resDiv = document.getElementById('resultado-combate');
  resDiv.innerHTML = `
    <div class="combate-visual">
      <div class="combatiente">
        <img src="${estado.jugador.avatar}" alt="Jugador" />
        <p>${estado.jugador.nombre}</p>
      </div>
      <div class="versus">VS</div>
      <div class="combatiente">
        <img src="${enemigo.imagen}" alt="${enemigo.nombre}" />
        <p>${enemigo.nombre}</p>
      </div>
    </div>
    <p>Ganador: ${ganador} | Puntos ganados: ${puntosGanados}</p>
  `;

  // REINICIO Esto es para que funcione en cada combate
  // Lo que hice aquí fue resetear la animación CSS para que se vuelva a ejecutar.
  // Sin esto, la animación solo se vería en el primer combate.
  setTimeout(() => {
    const combatPlayerImg = document.querySelector('.combatiente:first-child img');
    const combatEnemyImg = document.querySelector('.combatiente:last-child img');
    
    if (combatPlayerImg && combatEnemyImg) {

      combatPlayerImg.style.animation = 'none';
      combatEnemyImg.style.animation = 'none';
      
      combatPlayerImg.offsetHeight;
      combatEnemyImg.offsetHeight;
      
      combatPlayerImg.style.animation = '';
      combatEnemyImg.style.animation = '';
    }
  }, 10); 


  if (ganador === 'Jugador') {
    estado.jugador.sumarPuntos(puntosGanados);
  }

  estado.indiceEnemigoActual++;


  const btn = document.getElementById('btn-siguiente-combate');
  btn.textContent = estado.indiceEnemigoActual >= estado.enemigos.length ? 'Finalizar' : 'Continuar';
}


// Finalizar Juego 
// Calculo el resultado final y el rango.
function finalizarJuego() {
  console.log('Finalizando juego con puntos:', estado.jugador.puntos);
  showScene('escena-final');
  
  document.getElementById('final-puntos').textContent = estado.jugador.puntos;
  
 
}


// Inventario Visual (Barra de abajo)
// Objetivo: Gestiona los iconos de los productos comprados.
// Añade un nuevo producto al primer hueco libre de la barra.
//  además de añadir el producto, le pongo una animación
// de pulso para que se note que se acaba de añadir algo nuevo.

function actualizarInventarioVisual(producto) {
  const idx = estado.inventarioVisual.findIndex(item => item === null);
  if (idx !== -1) {
    estado.inventarioVisual[idx] = { nombre: producto.nombre, imagen: producto.imagen };
  } else {
    alert(`No puedes tener más de ${MAX_INVENTARIO} productos en el inventario.`);
  }
  cargarInventario(estado.inventarioVisual);
  

}

// Quita un producto de la barra de inventario.
function quitarDelInventarioVisual(nombreProducto) {
  const idx = estado.inventarioVisual.findIndex(item => item && item.nombre === nombreProducto);
  if (idx !== -1) {
    estado.inventarioVisual[idx] = null;
  }
  cargarInventario(estado.inventarioVisual);
}

// Llamada para que todo empiece
init();