var jwt = require('jsonwebtoken');
let isAuth = (req, res, next) => {

  let token = req.get('Authorization');
  if(!token){
    let err = new Error('No se ha proporcionado un token');
    err.statusCode = 401;
    next(err)
  }
  
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if(err){
      err.statusCode = 401;
      next(err);
    }
    req.usuario = decoded;
    next();
  });
}

let isAdmin = (req, res, next) => {
  let usuario = req.usuario;
  if(usuario.role === 'ADMIN'){
    next();
  }else{
    let err = new Error('Rol no valido');
    err.statusCode = 401;
    next(err)
  }
}

module.exports = {
  isAuth,
  isAdmin
}