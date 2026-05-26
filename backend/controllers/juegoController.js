const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.getJuegos = async (req, res) => {
  const {
    difficulty_min,
    difficulty_max,
    completion_min,
    completion_max,
    limit  = 10,
    offset = 0,
  } = req.query;

  try {
    const rows = await sequelize.query(
      `SELECT * FROM get_juegos(
        :difficulty_min::INT,
        :difficulty_max::INT,
        :completion_min::DECIMAL,
        :completion_max::DECIMAL,
        :limit::INT,
        :offset::INT
      )`,
      {
        replacements: {
          difficulty_min: difficulty_min ? parseInt(difficulty_min)           : null,
          difficulty_max: difficulty_max ? parseInt(difficulty_max)           : null,
          // El frontend manda 0-100, la BD guarda 0.0-1.0
          completion_min: completion_min ? parseFloat(completion_min) / 100   : null,
          completion_max: completion_max ? parseFloat(completion_max) / 100   : null,
          limit:          parseInt(limit),
          offset:         parseInt(offset),
        },
        type: QueryTypes.SELECT,
      }
    );

    const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

    res.json({
      total,
      limit:  parseInt(limit),
      offset: parseInt(offset),
      data:   rows.map(({ total_count, ...j }) => j),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
};