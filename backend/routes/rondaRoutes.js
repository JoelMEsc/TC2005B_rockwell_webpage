const router         = require('express').Router();
const verificarToken = require('../middleware/verificarToken');
const ctrl           = require('../controllers/rondaController');

// Obtener historial de rondas del usuario
router.get('/:id', verificarToken, ctrl.getRondasUsuario);

// Endpoints que llamará Unity
router.post('/', verificarToken, ctrl.crearRonda);
router.post('/:round_id/juegos', verificarToken, ctrl.registrarJuego);
router.patch('/:round_id/juegos/:game_id/ganar', verificarToken, ctrl.ganarJuego);
router.patch('/:round_id/finalizar', verificarToken, ctrl.finalizarRonda);

module.exports = router;