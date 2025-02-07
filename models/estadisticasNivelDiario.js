import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';
import playerModel from './jugadores.js';
import dailyLevelModel from './nivelesDiarios.js';

const dailyLevelStatsModel = db.define('estadisticasNivelDiario', {
    tiempoResolucion: {
        type: sequilize.FLOAT,
        allowNull: false,
    },
    puestoClasificacion: {
        type: sequilize.INTEGER,
        allowNull: false,
    },
    estadoClasificacion1:{
        type: sequilize.BOOLEAN,
        allowNull: false,
    },
});

dailyLevelStatsModel.belongsTo(playerModel, { foreignKey: "idUsuario" });
playerModel.hasMany(dailyLevelStatsModel, { foreignKey: "idUsuario" });


dailyLevelModel.hasMany(dailyLevelStatsModel, {
    foreignKey: {
        name: 'idNivel',
        type: sequilize.INTEGER,
        primaryKey: true,
        allowNull: false,
    }
});

export default dailyLevelStatsModel;