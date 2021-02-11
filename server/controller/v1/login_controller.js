const ModelUsuarios = require('../../models/model_usuarios');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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
//	Signup  -> crear usuario
//==========

const signin = (req, res, next) => {

  let salt = parseInt(process.env.SALTH)


  let data = {
    nombre : req.body.nombre,
    email : req.body.email,
    password : bcrypt.hashSync(req.body.password, salt),
    role : req.body.role,
  }

  let modelUsuario = new ModelUsuarios(data);

  modelUsuario.save((err, item) => {

    if (err || !item) return errorHandler(err, next, item);

    let payload = {
      usuarioId: item._id,
      role: item.role
    }

    let token = jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
    res.json({
      result: true,
      data: {
        usuarioId: item._id,
        role: item.role,
        token: token
      }
    })

  });
}

//==========
//	Login
//==========
const login = (req, res, next) => {

  let email = req.body.email;
  let password = req.body.password;
  

  ModelUsuarios.findOne({ email: email}, (err, item) =>{
    if(err || !item )
      return errorHandler(err, next, item)

    if (!bcrypt.compareSync(password, item.password) ){
      return res.status(401).json({
        result: true,
        message: 'usuario o (password) incorrecto'
      });
    }

    let payload ={
      usuarioId: item._id,
      role: item.role
    }

    let token = jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: process.env.CADUCIDAD_TOKEN  }
    );

    let user = item.toObject();
    delete user.password;

    res.json({
      result: true,
      data: {
        usuarioId: item._id,
        role: item.role,
        token: token
      }
    });
    
  } )


}

const logout = (req, res) => {
  if(req.session){
    req.session.destroy( item => {
      res.json({
        result: true
      })
    })
  }
}
module.exports ={
  signin,
  login,
  logout
}