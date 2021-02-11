
const ModelLibro = require('../../models/model_libros');
const ModelUsuarios = require('../../models/model_usuarios');
const ModelBiblioteca = require('../../models/model_biblioteca');
const { Prestamo } = require('../../session/model_prestamo');

const union = (a1, a2) =>
  a1.map(item1 => ({
    ...a2.find((item2) => {
      console.log('union' ,item2.libroId,item1.libroId)
      return (item2.libroId.toString() === item1.libroId.toString())
    }),
    ...item1
  }));

const listarCarro = async (prestamo) => {

  let ids = prestamo.libros.map(libro => libro.libroId.toString());
  let  doclibros = await ModelLibro.find({ '_id': { $in: ids } }).exec();
  doclibros = doclibros.map(libro => {return {'libroId' : libro._id.toString()}});

  let _prestamo = {
    libros : union(prestamo.libros, doclibros),
    cantidad : prestamo.cantidad
  }

  return _prestamo;
}

//==========
//	Registrar Prestamo session
//==========

const addSessionPrestamo  = async (req, res, next) => {

  let libroId = req.body.libroID;
  let bibliotecaID = req.body.bibliotecaID;
  
  try {
    docLibro = await ModelLibro.findById(libroId).exec();
    docbiblioteca = await ModelBiblioteca.findById(bibliotecaID).exec();

    if (!docLibro){
      const error = new Error('No existe Libro ');
      error.statusCode = 404;
      throw (error);
    }
    if (!docbiblioteca){
      const error = new Error('No existe la biblioteca');
      error.statusCode = 404;
      throw (error);
    }

    let prestamo = new Prestamo(req.session.prestamo ? req.session.prestamo : [])
    
    let obj = {
      libroId: docLibro._id.toString(),
      cantidad: 1,
    }

    prestamo.add(obj, bibliotecaID);
    req.session.prestamo = prestamo;

    let listar_prestamo = await listarCarro(prestamo);

    res.json({
      result: true,
      data: listar_prestamo
    });

  } catch (error) {
    next(error);
  }
  
}

//==========
//	Listar Prestamo session
//==========

const listarPrestamoSession = async (req, res, next) => {
  try {

    let prestamo = new Prestamo(req.session.prestamo ? req.session.prestamo : [])
    let biblioteca = prestamo.bibliotecaID;
    
    if (prestamo.length === 0) {

      return res.json({
        result: true,
        prestamo: []
      });

    }
    let listar_prestamo = await listarCarro(prestamo);
    const respuesta = {
      biblioteca: biblioteca,
      librosPrestamo : listar_prestamo
    }
    
    console.log('response', respuesta.biblioteca)

    res.json({
      result: true,
      data: {
        biblioteca: biblioteca,
        librosPrestamo : listar_prestamo
      }
    });

  } catch (error) {
    next(error)
  }
  
}

//==========
//	Generar Prestamo
//==========
const generarPrestamo = async (req, res,next) => {
  let usuarioId = req.params.usuarioId;
  let bibliotecaID = req.session.prestamo.bibliotecaID;
  let listaLibros = req.session.prestamo.libros;
  docUsuario = await ModelUsuarios.findById(usuarioId).exec();
  docBiblioteca = await ModelBiblioteca.findById(bibliotecaID).exec();
  if (!docUsuario) {
    let err = new Error('usuario no existe');
    next(err);
  }
  if (docUsuario.tienePrestamo) {
    return res.json({
      result: false,
      message: 'El usuario ya tiene un prestamo'
    })
  }
  let prestamo = req.session.prestamo ? new Prestamo( listaLibros ) : null;
  if(!prestamo) {
    return res.json({
      result: false,
      message: 'Prestamo Vacio'
    })
  }
  await docBiblioteca.prestamo(listaLibros);
  await docUsuario.addPrestamo(listaLibros, bibliotecaID);
  req.session.prestamo = null;
  res.json({
    result: true,
    orden: docUsuario
  })
}

//==========
//	Retornar Prestamo
//==========

const retornarPrestamo = async (req, res,next) =>{
  let usuarioId = req.params.usuarioId;
  docUsuario = await ModelUsuarios.findById(usuarioId).exec();
  docBiblioteca = await ModelBiblioteca.findById(docUsuario.prestamo.bibliotecaID).exec();
  // console.log('docUsuario', docUsuario.prestamo.libros);

  if (!docUsuario) {
    let err = new Error('usuario no existe');
    next(err);
  }
  if ( docUsuario.tienePrestamo === false) {
    return res.json({
      result: false,
      message: 'El usuario no tiene un prestamo registrado'
    })
  }
  docBiblioteca.retorno(docUsuario.prestamo.libros);
  docUsuario.retorno();
  res.json({
    result: true,
    orden: docUsuario
  })
}


module.exports = {
  addSessionPrestamo,
  listarPrestamoSession,
  generarPrestamo,
  retornarPrestamo
}