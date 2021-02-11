const ModelBiblioteca = require('../../models/model_biblioteca');

function errorHandler(err, next, item,) {

  if (err) {
    return next(err);
  }
  if (!item) {
    const error = new Error('No existe');
    error.statusCode = 404;
    return next(error);
  }

}

//==========
//	Registrar Biblioteca
//==========

const guardar = (req, res,next) => {
  
  let data = {
    nombre : req.body.nombre,
    direccion : req.body.direccion,
  }

  
  let modelBiblioteca = new ModelBiblioteca(data);


  modelBiblioteca.save( (err, item) => {

    if (err || !item) return errorHandler(err, next, item);

    res.json({
      result: true,
      data: item
    })

  });
 
}

//==========
//	Actualizar Biblioteca
//==========

const update = (req, res, next) => {

  ModelBiblioteca.findByIdAndUpdate(
    req.params.bibliotecaId,
    req.body,
    { new: true },
    (err, item) =>{

      if (err || !item) return errorHandler(err, next, item);
      
      res.json({
        result: true,
        data: item
      })

    }
  )

}

//==========
//	Borrar Biblioteca
//==========

const borrar = (req, res, next) => {

  let id = req.params.bibliotecaId;

  ModelBiblioteca.findByIdAndRemove(id, (err, item) =>{
    if (err || !item) return errorHandler(err, next, item);

    res.json({
      result: true,
      data: item
    })

  });

}

//==========
//	Listar Biblioteca
//==========
const listar = (req, res, next) => {
  ModelBiblioteca.find({  })
    .exec((err, items) => {
      if (err || !items)
        return errorHandler(err, next, items);
      res.json({
        result: true,
        data: items
      })
    });
}





module.exports ={
  guardar,
  update,
  borrar,
  listar,
}