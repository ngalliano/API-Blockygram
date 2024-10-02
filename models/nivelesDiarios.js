import sequilize, { Sequelize } from 'sequelize';
import db from '../db.js';

const dailyLevelModel = db.define('nivelesDiarios', {
    idNivel: {
        type: sequilize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    tipoNivel: {
        type: sequilize.TINYINT,
        allowNull: false,
    },
    estructuraNivel: {
        type: sequilize.STRING,
        allowNull: false,
    },
    estructuraParedes: {
        type: sequilize.STRING,
        allowNull: false,
    },
    listaPiezasNivel: {
        type: sequilize.STRING,
        allowNull: false,
    },
})

export default dailyLevelModel;