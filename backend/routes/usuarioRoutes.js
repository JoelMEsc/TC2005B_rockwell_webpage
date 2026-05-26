const router         = require('express').Router();
const verificarToken = require('../middleware/verificarToken');
const esAdmin        = require('../middleware/esAdmin');
const ctrl           = require('../controllers/usuarioController');

router.get('/perfil',               verificarToken,          ctrl.getPerfil);
router.get('/kpis',                verificarToken, esAdmin, ctrl.getKpis);
router.get('/',                    verificarToken, esAdmin, ctrl.getUsuarios);
router.patch('/:id/toggle-admin',  verificarToken, esAdmin, ctrl.toggleAdmin);
router.patch('/:id/toggle-active', verificarToken, esAdmin, ctrl.toggleActive);

module.exports = router;
