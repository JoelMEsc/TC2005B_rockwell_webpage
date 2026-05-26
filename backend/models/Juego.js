const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Juego = sequelize.define('Juego', {

  game_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name:         { type: DataTypes.STRING(255),    allowNull: false },
  difficulty:   { type: DataTypes.INTEGER,        allowNull: false },
  times_played: { type: DataTypes.INTEGER,        allowNull: false,    defaultValue: 0 },
  completion:   { type: DataTypes.DECIMAL(5, 4),  allowNull: false,    defaultValue: 0 }

}, {
  tableName: 'juego',
  timestamps: false,
});

module.exports = Juego;