import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';
import playerModel from './Jugadores.js';


const levelModeLevelStatsModel = db.define('estadisticasNivelModoNiveles', {
    idNivel: {
        type: sequilize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    mejorTiempoResolucion: {
        type: sequilize.FLOAT,
        allowNull: false,
    },
    estadoNivel:{
        type: sequilize.BOOLEAN,
        allowNull: false,
    },
});

playerModel.hasMany(levelModeLevelStatsModel, {
    foreignKey: {
        name: 'idUsuario',
        type: sequilize.STRING,
        primaryKey: true,
        allowNull: false,
    }
});

export default levelModeLevelStatsModel;