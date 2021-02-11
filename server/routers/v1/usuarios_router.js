const express = require('express');

const {
  guardar,
  update,
  borrar,
  listar,
} = require('../../controller/v1/usuarios_controller')
const { isAuth, isAdmin } = require('../../middleware/auth');

const router = express.Router();

//rutas
router.get('/usuarios', [isAuth, isAdmin], listar);
// router.post('/usuarios', [isAuth, isAdmin], guardar);
router.put('/usuarios/:usuId', [isAuth, isAdmin], update);
router.delete('/usuarios/:usuId', [isAuth, isAdmin], borrar);

module.exports = router;