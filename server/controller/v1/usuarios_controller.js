const ModelUsuarios = require('../../models/model_usuarios');

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
//	Registrar Usuarios
//==========

const guardar = (req, res,next) => {
  
  let data = {
    nombre : req.body.nombre,
    email : req.body.email,
    password : req.body.password,
    role : req.body.role,
  }

  let modelUsuarios = new ModelUsuarios(data);

  modelUsuarios.save( (err, item) => {

    if (err || !item) return errorHandler(err, next, item);

    res.json({
      result: true,
      data: item
    })

  });
 
}

//==========
//	Actualizar Usuarios
//==========

const update = (req, res, next) => {

  ModelUsuarios.findByIdAndUpdate(
    req.params.usuId,
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
//	Borrar Usuarios
//==========

const borrar = (req, res, next) => {

  let id = req.params.usuId;

  ModelUsuarios.findByIdAndRemove(id, (err, item) =>{
    if (err || !item) return errorHandler(err, next, item);

    res.json({
      result: true,
      data: item
    })

  });

}

//==========
//	Listar Usuarios
//==========
const listar = (req, res, next) => {
  ModelUsuarios.find({  })
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