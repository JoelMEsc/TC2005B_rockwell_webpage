const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// Obtener historial de rondas del usuario
exports.getRondasUsuario = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.usuario.user_id;
  const isAdmin     = req.usuario.is_admin;

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

// Crear una nueva ronda (Llama a la función insert_round)
exports.crearRonda = async (req, res) => {
  const player_id = req.usuario.user_id; // Se obtiene seguro desde el JWT verificado

  try {
    const rows = await sequelize.query(
      `SELECT insert_round(:player_id) AS "round_id"`,
      {
        replacements: { player_id },
        type: QueryTypes.SELECT,
      }
    );

    const round_id = rows[0]?.round_id;
    if (!round_id) {
      return res.status(500).json({ error: 'No se pudo generar el ID de ronda' });
    }

    res.status(201).json({ round_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar la ronda' });
  }
};

// Registrar el inicio de un minijuego en la ronda (Llama a register_game)
exports.registrarJuego = async (req, res) => {
  const { round_id } = req.params;
  const { game_id } = req.body;

  try {
    await sequelize.query(
      `CALL register_game(:round_id, :game_id)`,
      {
        replacements: {
          round_id: parseInt(round_id),
          game_id: parseInt(game_id),
        },
        type: QueryTypes.RAW,
      }
    );
    res.json({ mensaje: 'Minijuego registrado en la ronda' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el minijuego en la ronda' });
  }
};

// Marcar el minijuego de la ronda como ganado (Llama a won_game)
exports.ganarJuego = async (req, res) => {
  const { round_id, game_id } = req.params;

  try {
    await sequelize.query(
      `CALL won_game(:round_id, :game_id)`,
      {
        replacements: {
          round_id: parseInt(round_id),
          game_id: parseInt(game_id),
        },
        type: QueryTypes.RAW,
      }
    );
    res.json({ mensaje: 'Minijuego marcado como ganado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el estado del minijuego' });
  }
};

// Finalizar la ronda al perder las 3 vidas (Llama a finish_round)
exports.finalizarRonda = async (req, res) => {
  const { round_id } = req.params;
  const { score } = req.body;

  try {
    await sequelize.query(
      `CALL finish_round(:round_id, :score)`,
      {
        replacements: {
          round_id: parseInt(round_id),
          score: parseInt(score),
        },
        type: QueryTypes.RAW,
      }
    );
    res.json({ mensaje: 'Ronda marcada como finalizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al finalizar la ronda' });
  }
};