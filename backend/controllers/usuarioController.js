const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario   = require('../models/Usuario');

exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.user_id, {
      attributes: ['user_id', 'name', 'surname', 'email', 'country', 'role', 'max_score', 'nickname', 'is_admin', 'active'],
    });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getKpis = async (req, res) => {
  const {
    country,
    role,
    score_min,
    score_max,
    active,
    is_admin,
    registered_after,
    registered_before,
  } = req.query;

  try {
    const rows = await sequelize.query(
      `SELECT * FROM get_kpis(
        :country::CHAR(3),
        :role::rol_tipo,
        :score_min::INT,
        :score_max::INT,
        :active::BOOLEAN,
        :is_admin::BOOLEAN,
        :registered_after::TIMESTAMP,
        :registered_before::TIMESTAMP
      )`,
      {
        replacements: {
          country:           country           ?? null,
          role:              role              ?? null,
          score_min:         score_min         ? parseInt(score_min)  : null,
          score_max:         score_max         ? parseInt(score_max)  : null,
          active:            active            !== undefined ? active    === 'true' : null,
          is_admin:          is_admin          !== undefined ? is_admin  === 'true' : null,
          registered_after:  registered_after  ?? null,
          registered_before: registered_before ?? null,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.json(rows[0] ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
};

exports.toggleAdmin = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.usuario.user_id) {
    return res.status(400).json({ error: 'No puedes modificar tu propio rol de admin' });
  }

  try {
    await sequelize.query(
      `CALL toggle_admin(:id)`,
      { replacements: { id: parseInt(id) }, type: QueryTypes.RAW }
    );
    res.json({ mensaje: 'Admin status actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar admin status' });
  }
};

exports.toggleActive = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.usuario.user_id) {
    return res.status(400).json({ error: 'No puedes modificar tu propio estado activo' });
  }

  try {
    await sequelize.query(
      `CALL toggle_active(:id)`,
      { replacements: { id: parseInt(id) }, type: QueryTypes.RAW }
    );
    res.json({ mensaje: 'Active status actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar active status' });
  }
};

exports.getUsuarios = async (req, res) => {
  const {
    country,
    role,
    score_min,
    score_max,
    active,
    is_admin,
    registered_after,
    registered_before,
    limit  = 10,
    offset = 0,
  } = req.query;

  try {
    const rows = await sequelize.query(
      `SELECT * FROM get_usuarios(
        :country::CHAR(3),
        :role::rol_tipo,
        :score_min::INT,
        :score_max::INT,
        :active::BOOLEAN,
        :is_admin::BOOLEAN,
        :registered_after::TIMESTAMP,
        :registered_before::TIMESTAMP,
        :limit::INT,
        :offset::INT
      )`,
      {
        replacements: {
          country:           country           ?? null,
          role:              role              ?? null,
          score_min:         score_min         ? parseInt(score_min)  : null,
          score_max:         score_max         ? parseInt(score_max)  : null,
          active:            active            !== undefined ? active    === 'true' : null,
          is_admin:          is_admin          !== undefined ? is_admin  === 'true' : null,
          registered_after:  registered_after  ?? null,
          registered_before: registered_before ?? null,
          limit:             parseInt(limit),
          offset:            parseInt(offset),
        },
        type: QueryTypes.SELECT,
      }
    );

    const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

    res.json({
      total,
      limit:  parseInt(limit),
      offset: parseInt(offset),
      data:   rows.map(({ total_count, ...u }) => u),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}; 