
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const moment = require('moment');

var modelUsuario = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  tienePrestamo: {
    type: Boolean,
    default:false
  },
  prestamo:{
    fechaEntrega: {
      type: String,
    },
    bibliotecaID:{
      type: String,
    },
    libros:[]
  }
})

modelUsuario.methods.addPrestamo = function (listaLibros, bibliotecaID){
  this.prestamo.fechaEntrega = moment().add(5, 'days').format('YYYY-MM-DD');
  this.tienePrestamo = true;
  this.prestamo.libros = listaLibros;
  this.prestamo.bibliotecaID = bibliotecaID;
  return this.save();
}

modelUsuario.methods.retorno = function(  ){

  var now = moment(); //todays date
  var end = moment(this.prestamo.fechaEntrega); // another date
  var duration = moment.duration(now.diff(end));
  var days = duration.days();
  if(days >= 0){
    console.log('prestamo atrasado');
    return false;
  } else {
    this.tienePrestamo = false;
    this.prestamo.libros = [];
    this.prestamo.bibliotecaID = '';
    this.prestamo.fechaEntrega = '';
    return this.save();
  }
}


const model = mongoose.model('modelUsuario', modelUsuario);

module.exports = model;