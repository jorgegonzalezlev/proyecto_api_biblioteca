
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelBiblioteca = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  direccion: {
    type: String,
    required: true
  },
  listaLibros: [{
    idLibro:{
      type:String,
    },
    nombreLibro:{
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0
    },
    prestados: {
      type: Number,
      default: 0
    },
  }],
})

modelBiblioteca.methods.addLibro = function( libro ){

  let nuevaLista = [...this.listaLibros];

  nuevaLista.push({
    idLibro:libro.idLibro,
    nombreLibro:libro.nombreLibro,
    stock: libro.stock
  })


  this.listaLibros = nuevaLista;
  return this.save();
  
}

modelBiblioteca.methods.deleteLibro = function( idLibro ){

  let index = this.listaLibros.findIndex( item => {

    if(item.nombreLibro !== undefined){
      return item.idLibro.toString() === idLibro.toString();
    }

  });

  let nuevaLista = [...this.listaLibros];

  if(index != -1){
    nuevaLista.splice(index,1);
  }

  this.listaLibros = nuevaLista;
  return this.save();
}

modelBiblioteca.methods.prestamo = function( listaLibrosPrestamo ){
  
  var librosBiblioteca = [...this.listaLibros];
  for(var x=0;librosBiblioteca.length > x; x++){
    for(var i=0;listaLibrosPrestamo.length > i; i++){
      if(listaLibrosPrestamo[i].libroId === librosBiblioteca[x].idLibro){
        librosBiblioteca[x].stock -= listaLibrosPrestamo[i].cantidad;
        librosBiblioteca[x].prestados += listaLibrosPrestamo[i].cantidad;
      }
    }
  }
  this.listaLibros = librosBiblioteca;
  return this.save();
}

modelBiblioteca.methods.retorno = function( listaLibrosPrestamo ){
  
  var librosBiblioteca = [...this.listaLibros];
  for(var x=0;librosBiblioteca.length > x; x++){
    for(var i=0;listaLibrosPrestamo.length > i; i++){
      if(listaLibrosPrestamo[i].libroId === librosBiblioteca[x].idLibro){
        librosBiblioteca[x].stock += listaLibrosPrestamo[i].cantidad;
        librosBiblioteca[x].prestados -= listaLibrosPrestamo[i].cantidad;
      }
    }
  }
  this.listaLibros = librosBiblioteca;
  console.log('librosBiblioteca- ', librosBiblioteca);
  return this.save();
}

const model = mongoose.model('modelBiblioteca', modelBiblioteca);

module.exports = model;