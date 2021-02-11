const express = require('express');

const {
  guardar,
  update,
  borrar,
  listar,
} = require('../../controller/v1/biblioteca_controller')
const { isAuth, isAdmin } = require('../../middleware/auth');

const router = express.Router();

//rutas
router.get('/biblioteca',[isAuth, isAdmin], listar);
router.post('/biblioteca',[isAuth, isAdmin],  guardar);
router.put('/biblioteca/:bibliotecaId',[isAuth, isAdmin],  update);
router.delete('/biblioteca/:bibliotecaId',[isAuth, isAdmin],  borrar );

module.exports = router;