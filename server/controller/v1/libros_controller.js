const ModelLibro = require('../../models/model_libros');
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
//	Registrar Libro
//==========

const guardar = async (req, res,next) => {
  
  let data = {
    titulo : req.body.titulo,
    ISBN : req.body.ISBN,
    editorial : req.body.editorial,
    NumPaginas : req.body.NumPaginas,
    bibliotecaId : req.body.bibliotecaId,
    portada : req.body.portada
  }

  

  let modelLibro = new ModelLibro(data);
  modelLibro.portada.data = req.files.portada.data;
  modelLibro.portada.contentType = req.files.portada.mimetype;

  if(req.files){
    if(req.files.portada.size > 1000000){
      let err = new Error('La imagen es exede el maximo');
      err.statusCode=413;
      return next(err);
    }
  }

  modelLibro.save( async (err, item) => {

    if (err || !item) return errorHandler(err, next, item);
    item = item.toObject();
    delete item.portada;

    docBiblioteca = await ModelBiblioteca.findById(req.body.bibliotecaId).exec();


    var libroObj = {
      idLibro:item._id,
      nombreLibro:item.titulo,
      stock: req.body.stock
    }
    let rpta = await docBiblioteca.addLibro(libroObj);
    console.log('rpta', rpta);

    res.json({
      result: true,
      data: item
    })

  });
 
}

//==========
//	Actualizar Libro
//==========

const update = (req, res, next) => {

  ModelLibro.findByIdAndUpdate(
    req.params.librosId,
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
//	Borrar Libro
//==========

const borrar = (req, res, next) => {

  let id = req.params.librosId;

  

  ModelLibro.findByIdAndRemove(id, async (err, item) =>{
    if (err || !item) return errorHandler(err, next, item);

    docBiblioteca = await ModelBiblioteca.findById(item.bibliotecaId).exec();
    let rpta = await docBiblioteca.deleteLibro(item._id);
    console.log('rpta', rpta);

    res.json({
      result: true,
      data: item
    })

  });

}

//==========
//	Listar Libro
//==========
const listar = (req, res, next) => {

  ModelLibro.find({  })
    .select('-portada')
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