const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {

  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name:                 { type: DataTypes.STRING(128), allowNull: false },
  surname:              { type: DataTypes.STRING(255), allowNull: false },
  email:                { type: DataTypes.STRING(254), allowNull: false, unique: true },
  password:             { type: DataTypes.STRING(255), allowNull: false },
  country:              { type: DataTypes.CHAR(3),     allowNull: false },
  role:                 { type: 'rol_tipo', allowNull: false },
  max_score:            { type: DataTypes.INTEGER, defaultValue: 0 },
  nickname:             { type: DataTypes.STRING(20), allowNull: false, unique: true },
  is_admin:             { type: DataTypes.BOOLEAN,  defaultValue: false },
  registration_date:    { type: DataTypes.DATE,     defaultValue: DataTypes.NOW },
  active:               { type: DataTypes.BOOLEAN,  defaultValue: true },
  last_update_date:     { type: DataTypes.DATE,     allowNull: true, defaultValue: null }

}, {
  tableName: 'usuario',
  timestamps: false,
});

module.exports = Usuario;