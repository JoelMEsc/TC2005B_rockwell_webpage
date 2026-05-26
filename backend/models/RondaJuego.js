    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/database');

    const RondaJuego = sequelize.define('RondaJuego', {

    round_game_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    round_id:   { type: DataTypes.INTEGER, allowNull: false },
    game_id:    { type: DataTypes.INTEGER, allowNull: false },
    won:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    start_time: { type: DataTypes.DATE,    allowNull: false, defaultValue: DataTypes.NOW }

    }, {
    tableName: 'ronda_juego',
    timestamps: false,
    });

    module.exports = RondaJuego;