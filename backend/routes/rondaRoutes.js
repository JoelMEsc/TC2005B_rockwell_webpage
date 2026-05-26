const router         = require('express').Router();
const verificarToken = require('../middleware/verificarToken');
const ctrl           = require('../controllers/rondaController');

// Cualquier usuario autenticado puede llamar este endpoint.
// El controller valida que solo veas tus propias rondas (salvo que seas admin).
router.get('/:id', verificarToken, ctrl.getRondasUsuario);

module.exports = router;