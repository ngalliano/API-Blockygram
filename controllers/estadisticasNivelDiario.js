import { DATE, where } from 'sequelize';
import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
import fastifyMysql from '@fastify/mysql';

class dailyLevelStatController{
    constructor(){

    }

    async create (req, res) {
        try{
            console.log(req.body);
            const dailyLevelStat = await dailyLevelStatsModel.create(req.body);
            
            if (dailyLevelStat)
                res.status(202).send({status: 'Daily Level Stat Created Succesfully'});
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getAll (req, res) {
        try{
            const where = {...req.query};
            const lista = await dailyLevelStatsModel.findAll({where});
            res.status(202).send(lista);    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

   async getTop20 (req, res){
        try{
            const fecha1 = new Date();
            const fecha2 = fecha1.getUTCDate().toString() + fecha1.getUTCMonth().toString() + fecha1.getUTCFullYear().toString();
            
            const lista = await dailyLevelStatsModel.findAll({
                where: {idNivel:parseInt(fecha2)},
                atributtes: ['puestoClasificacion','idUsuario','tiempoResolucion']
            });
            
            console.log("hola");
  
            res.status(202).send(lista);
        }catch (e){
            res.status(500).send({error: e}); 
        }
    }
    
    async getOne (req, res) {
        try{
            const idNivel1 = req.query.idNivel;
            const idUsuario1 = req.query.idUsuario;
            
            const nivel = await dailyLevelStatsModel.findOne({
                where: {idUsuario:idUsuario1, idNivel: idNivel1}
            });
            
            if(nivel) {
                res.status(202).send(nivel);
            }else{
                res.status(404).send(
                    {message: 'Daily level stat not found'}
                );   
            }   
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
    
    async update (req, res) {
        try{
            const data1 = {...req.body};
            const idNivel1 = req.query.idNivel;
            const idUsuario1 = req.query.idUsuario;
            //console.log(idNivel1);             
            const nivel = await dailyLevelStatsModel.update({puestoClasificacion:data1.puestoClasificacion, estadoClasificacion1:data1.estadoClasificacion1},
                {where: {idNivel:idNivel1, idUsuario:idUsuario1}});
            //console.log('Hola');            
            if (typeof (nivel[0]) != 'undefined' && nivel[0] === 1){
                res.status(202).send({
                    status: true,
                });
            }else{
                res.status(404).send(
                    {message: 'Daily level stat not found'}
                );   
            }  
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async delete (req, res) {
        try{
            const idNivel1 = req.query.idNivel;
            const idUsuario1 = req.query.idUsuario;
            
            const nivel = await dailyLevelStatsModel.destroy({where: {idNivel:idNivel1, idUsuario:idUsuario1}});
            
            if(nivel) {
                res.status(202).send({status: true});
            }else{
                res.status(404).send(
                    {message: 'Daily level stat not found'}
                );   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
}

export default new dailyLevelStatController();