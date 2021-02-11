const librosRouter = require('./libros_router');
const bibliotecaRouter = require('./bibliotecas_router');
const usuariosRouter = require('./usuarios_router');
const prestamoRouter = require('./prestamo_router');
const loginRouter = require('./login_router');

module.exports = (app) => {

  app.use('/api/v1', librosRouter);
  app.use('/api/v1', bibliotecaRouter);
  app.use('/api/v1', usuariosRouter);
  app.use('/api/v1', prestamoRouter);
  app.use('/api/v1', loginRouter);

}