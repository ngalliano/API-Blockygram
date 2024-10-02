import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';

const playerModel = db.define('jugadores', {
    idUsuario: {
        type: sequilize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    listaCantidadNivelesCompletadosGrupo: {
        type: sequilize.STRING,
        allowNull: false,
    },
    cantidadNivelesDiariosCompletados: {
        type: sequilize.INTEGER,
        allowNull: false,
    },
    cantidadPistas: {
        type: sequilize.INTEGER,
        allowNull: false,
    },
    mejorTiempoNivelDiario:{
        type: sequilize.FLOAT,
        allowNull: false,
    },
    cantidadVecesClasificacion1:{
        type: sequilize.INTEGER,
        allowNull: false,
    },
})

export default playerModel;