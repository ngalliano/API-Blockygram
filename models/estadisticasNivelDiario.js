import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';
import playerModel from './Jugadores.js';
import dailyLevelModel from './nivelesDiarios.js';

const dailyLevelStatsModel = db.define('estadisticasNivelDiario', {
    nombreUsuario: {
        type: sequilize.STRING,
        allowNull: false,
    },
    tiempoResolucion: {
        type: sequilize.FLOAT,
        allowNull: false,
    },
    puestoClasificacion: {
        type: sequilize.INTEGER,
        allowNull: false,
    },
    estadoNivel:{
        type: sequilize.BOOLEAN,
        allowNull: false,
    },
    estadoClasificacion1:{
        type: sequilize.BOOLEAN,
        allowNull: false,
    },
});

playerModel.hasMany(dailyLevelStatsModel, {
    foreignKey: {
        name: 'idUsuario',
        type: sequilize.STRING,
        primaryKey: true,
        allowNull: false,
    }
});

dailyLevelModel.hasMany(dailyLevelStatsModel, {
    foreignKey: {
        name: 'idNivel',
        type: sequilize.INTEGER,
        primaryKey: true,
        allowNull: false,
    }
});

export default dailyLevelStatsModel;