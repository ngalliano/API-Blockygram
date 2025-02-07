import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';
import playerModel from './jugadores.js';


const levelModeStatsModel = db.define('estadisticasNivelModoNiveles', {
    idNivel: {
        type: sequilize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    mejorTiempoResolucion: {
        type: sequilize.FLOAT,
        allowNull: false,
    },
});

playerModel.hasMany(levelModeStatsModel, {
    foreignKey: {
        name: 'idUsuario',
        type: sequilize.STRING,
        primaryKey: true,
        allowNull: false,
    }
});

export default levelModeStatsModel;