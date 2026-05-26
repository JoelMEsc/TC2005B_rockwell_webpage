const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ronda = sequelize.define('Ronda', {

  round_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  player_id: { type: DataTypes.INTEGER, allowNull: false },
  score:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  finished:  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }

}, {
  tableName: 'ronda',
  timestamps: false,
});

module.exports = Ronda;