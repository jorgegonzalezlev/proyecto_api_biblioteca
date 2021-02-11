const express = require('express');

const {
  guardar,
  update,
  borrar,
  listar,
} = require('../../controller/v1/libros_controller')
const { isAuth, isAdmin } = require('../../middleware/auth');

const router = express.Router();

//rutas
router.get('/libros', listar);
router.post('/libros', [isAuth, isAdmin],  guardar);
router.put('/libros/:librosId', [isAuth, isAdmin],  update);
router.delete('/libros/:librosId', [isAuth, isAdmin],  borrar );

module.exports = router;