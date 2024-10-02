import Sequelize from 'sequelize';

class DBInstance{
    constructor(){
        const dbCfg = {
            user: 'root',
            host: '127.0.0.1',
            database: 'dbblockygram',
            password: '',
            port: '3306',
        };
        this.sequelize = new Sequelize(dbCfg.database, dbCfg.user, dbCfg.password, {
            host: dbCfg.host,
            dialect: 'mysql',
            logging: false,
        });
    }
}

export default new DBInstance().sequelize;