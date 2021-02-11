const express = require('express');

const {
  listarPrestamoSession,
  addSessionPrestamo,
  generarPrestamo,
  retornarPrestamo,
} = require('../../controller/v1/prestamo_controller')
const { isAuth } = require('../../middleware/auth');

const router = express.Router();

//router
router.post('/prestamo/session/addlibro', addSessionPrestamo);
router.get('/prestamo/session/listar', listarPrestamoSession);
router.get('/prestamo/generar-orden/:usuarioId',[isAuth], generarPrestamo);
router.get('/prestamo/retornar-prestamo/:usuarioId',[isAuth], retornarPrestamo);

module.exports = router;