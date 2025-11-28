//-----------------------------------------------------------
//CLASE PRODUCTO
// Es la base para crear los productos y añadirlo al main y se puedan comprar
//-------------------------------------------------------------

export class Producto {
      constructor({ nombre, imagen, precio, rareza, tipo, bonus }) {
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.rareza = rareza; // Puede ser Común , Rara O Epica.
    this.tipo = tipo; // Puede ser Arma, Armadura, Consumible
    this.bonus = bonus; // El número de ataque, defensa o vida que da el objeto.
  }

  //Muestra el precio con el formato correcto.
  formatearPrecio() {
    // Uso toFixed(2) para que siempre tenga dos decimales y luego cambiamos el punto por una coma.
    return `${(this.precio).toFixed(2)} €`.replace('.', ',');
  }

  //  Creo una copia de este producto y le aplica un descuento.
  // Recibe porcentaje del 20%.
  aplicarDescuento(porcentaje) {
    // Hacemos una copia de todos los datos.
    const productoClonado = new Producto({ ...this});
    // Calculamos el nuevo precio asegurándonos de que no sea negativo.
    productoClonado.precio = Math.max(0, Math.round(this.precio * (1 - porcentaje)));
    // Devolvemos la copia con el precio rebajado.
    return productoClonado;
  }
}