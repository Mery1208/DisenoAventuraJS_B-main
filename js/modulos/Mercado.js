import { PRODUCTOS_BASE, RAREZAS } from './constants.js';
import { Producto } from '../clases/Producto.js';

//-----------------------------------------------------------
//CLASE MERCADO
// Aqui añado funciones de mercado 
//-------------------------------------------------------------

// Función crearProductoDesdeBase la usé para que crear un objeto Producto a partir de los datos base fuera más rápido.
function crearProductoDesdeBase(base) {
    return new Producto(base);
}

// Función obtenerProductosConDescuentoAleatorio
// Lo que hice aquí fue preparar la lista de productos que el jugador verá en la tienda.
// Aplico un descuento especial a los productos de una rareza elegida al azar.
//  y asi muestra una lista de objetos Producto.

export function obtenerProductosConDescuentoAleatorio() {
    //Elegí una rareza al azar Común, Rara, o Épica de la lista RAREZAS.
    const rarezaObjetivo = RAREZAS[Math.floor(Math.random() * RAREZAS.length)];
    const porcentajeDescuento = 0.13; // Mi descuento especial es del 13%.



    //Recorrí todos los productos base con map para crear las tarjetas.
    return PRODUCTOS_BASE.map(productoBase => {
        const producto = crearProductoDesdeBase(productoBase);
        // Si la rareza del producto coincide con la que elegí al azar
        if (productoBase.rareza === rarezaObjetivo) {
            // ... le aplico el descuento especial del 13%.
            return producto.aplicarDescuento(porcentajeDescuento);
        }
        // Si no coincide, devuelvo el producto normal sin descuento.
        return producto;
    });
}

//funcion filtrarPorRareza la hice para poder filtrar una lista de productos por su rareza (si fuera necesario).
export function filtrarPorRareza(productos, rareza) {
    return productos.filter(producto => producto.rareza === rareza);
}

// Función auxiliar: la hice para poder buscar un producto por su nombre (aunque no la usé en el archivo principal).
export function buscarPorNombre(productos, nombre) {
    return productos.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

// Función renderizarProductos
//  Me encargo de dibujar todas las tarjetas de los productos en la pantalla del Mercado.
//productos: La lista de productos que telamo cuando el jugador pulsa Añadir o Retirar para que se actualice la cesta.
//seleccionados: Una lista con los nombres ngo que dibujar.
//alHacerToggle: Es la función clave que lde los productos que ya están en la cesta para marcarlos.

export function renderizarProductos(productos, alHacerToggle, seleccionados = new Set()) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';
        // Pongo el contenido HTML de la tarjeta con la imagen, nombre, bonus y precio.
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" />
                <h4>${producto.nombre}</h4>
                <p><strong>Bonus:</strong> ${producto.bonus}</p>
                <p><strong>Precio:</strong> ${producto.formatearPrecio()}</p>
                <p><strong>Rareza:</strong> ${producto.rareza}</p>
                <button class="btn-toggle">Añadir</button>
            `;

        const boton = tarjeta.querySelector('.btn-toggle');

        // Compruebo si el producto ya está seleccionado. Si es así, le cambio el estilo y el texto a 'Retirar'.
        if (seleccionados.has(producto.nombre)) {
            tarjeta.classList.add('selected');
            boton.textContent = 'Retirar';
        }

        // Pongo el 'escuchador' de eventos: le digo al botón lo que tiene que hacer al ser pulsado.
        boton.addEventListener('click', (evento) => {
            evento.stopPropagation();
            // Uso 'toggle' para cambiar el estado de la tarjeta y saber si la acaban de añadir o retirar.
            const estaSeleccionado = tarjeta.classList.toggle('selected');
            // Cambio el texto del botón según el nuevo estado.
            boton.textContent = estaSeleccionado ? 'Retirar' : 'Añadir';
            // Llamo a la función principal ('alHacerToggle') para que se actualice la cesta real y los stats.
            alHacerToggle(producto, estaSeleccionado);
        });

        contenedor.appendChild(tarjeta);
    });
}

// Función renderizarCesta
// Dibuje un resumen simple de los productos que el jugador ha seleccionado.
// Así recibe la lista de productos que tengo que dibujar productosCesta.

export function renderizarCesta(productosCesta) {
    const contenedor = document.getElementById('cesta-productos');
    contenedor.innerHTML.HTML = '';

    productosCesta.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';
        // Muestro solo el nombre, el tipo y el bonus en esta vista de resumen.
        tarjeta.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p>${producto.tipo} (+${producto.bonus})</p>
            `;
            contenedor.appendChild(tarjeta);
    });
}