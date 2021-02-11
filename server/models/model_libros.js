
var mongoose = require('mongoose');
const ModelBiblioteca = require('./model_biblioteca');

var Schema = mongoose.Schema;

const validator_biblioteca = async (val) => {
  
  let rpta = await ModelBiblioteca.exists(
    { _id: val}
  )

  return rpta;

}

var modeLibro = new Schema({
  titulo: {
    type: String,
    required: true,
    unique: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  editorial: {
    type: String,
    required: true
  },
  NumPaginas: {
    type: Number,
    default: 0
  },
  portada: {
    data: Buffer,
    contentType: String
  },
  bibliotecaId: {
    type: String,
    required: true
  }

  
});

modeLibro.path('bibliotecaId').validate(
  {
    validator: validator_biblioteca,
    message: 'ID de biblioteca no encontrado : {VALUE}'
  }
);
const model = mongoose.model('modeLibro', modeLibro);

module.exports = model;