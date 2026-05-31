const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.getRondasUsuario = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.usuario.user_id;
  const isAdmin     = req.usuario.is_admin;

  // Un usuario solo puede ver sus propias rondas, los admins pueden ver cualquiera
  if (!isAdmin && parseInt(id) !== requesterId) {
    return res.status(403).json({ error: 'No tienes permiso para ver estas rondas' });
  }

  try {
    const rows = await sequelize.query(
      `SELECT * FROM get_rondas_usuario(:id)`,
      {
        replacements: { id: parseInt(id) },
        type: QueryTypes.SELECT,
      }
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener rondas' });
  }
};