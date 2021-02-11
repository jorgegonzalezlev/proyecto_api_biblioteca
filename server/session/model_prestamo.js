
class Prestamo {


  constructor(prestamo) {
    this.libros = prestamo.libros || [];
    this.bibliotecaID = prestamo.bibliotecaID || '';
  }

  add(data, bibliotecaID) {
    
    if(!this.bibliotecaID){
      this.bibliotecaID = bibliotecaID;

    } else if(this.bibliotecaID !== bibliotecaID){
      const error = new Error('No puede pedir libros en mas de una biblioteca');
      error.statusCode = 404;
      throw (error);
    }

    let index = this.libros.findIndex(item => item.libroId.toString() === data.libroId.toString());
    let newlibros = [...this.libros];
    if (index === -1) {
      newlibros.push(data)
    } else {
      newlibros[index].cantidad++;
    }
    this.libros = newlibros;


  }

  // remove(data) {

  //   let index = this.items.findIndex(item => item.productId.toString() === data.productId.toString());

  //   let _cantidad = this.items[index].cantidad;
  //   let newitems = [...this.items];
  //   if (_cantidad > 1) {
  //     _cantidad = this.items[index].cantidad - 1;
  //     newitems[index].cantidad = _cantidad;
  //     newitems[index].total = data.total * _cantidad;
  //   } else {
  //     delete newitems[index];
  //   }

  //   this.items = newitems;
  //   this.unidades = this.items.reduce((unidades, item) => unidades += item.cantidad, 0);
  //   this.total = this.items.reduce((total, item) => total += item.total, 0);
  // }


}

module.exports = { Prestamo }