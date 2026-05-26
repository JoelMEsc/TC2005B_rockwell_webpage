const router         = require('express').Router();
const verificarToken = require('../middleware/verificarToken');
const esAdmin        = require('../middleware/esAdmin');
const ctrl           = require('../controllers/juegoController');

router.get('/', verificarToken, esAdmin, ctrl.getJuegos);

module.exports = router;