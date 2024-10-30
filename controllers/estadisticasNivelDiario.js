import { and, DATE, where } from 'sequelize';
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
            //const fecha2 = fecha1.getUTCDate().toString() + (parseInt(fecha1.getUTCMonth().toString())+1).toString() + fecha1.getUTCFullYear().toString();
            const fecha2 = '29102024';
            const index = 0
            console.log(fecha2);
            const lista = await dailyLevelStatsModel.findAll({
                attributes: ['puestoClasificacion','idUsuario','tiempoResolucion'],
                where: {idNivel:parseInt(fecha2)},
                limit: 20,
                order: [['tiempoResolucion', 'ASC']]
            });
            const leaderBoard = lista.map((user, index) => ({
                idUsuario: user.idUsuario,
                puestoClasificacion: index + 1,
                tiempoResolucion: user.tiempoResolucion
            }));
    
            //console.log("hola");
  
            res.status(202).send(leaderBoard);
        }catch (e){
            res.status(500).send({error: e}); 
        }
    }
    
    async getPlayerPositionGroup (req, res) {
        try {
            const idUsuario1 = req.query.idUsuario;
            const fecha1 = new Date();
            //const fecha2 = fecha1.getUTCDate().toString() + (parseInt(fecha1.getUTCMonth().toString())+1).toString() + fecha1.getUTCFullYear().toString();
            //console.log(fecha2);
            const index = 0;
            const fecha2 = '29102024';
            
            console.log("hola");
            //console.log(nivel);
            const lista1 = await dailyLevelStatsModel.findAll({
                attributes: ['puestoClasificacion','idUsuario','tiempoResolucion'],
                where: {idNivel:parseInt(fecha2)},
                order: [['tiempoResolucion', 'ASC']]
            });
            
            const lista2 = lista1.map((user, index) => ({
                idUsuario: user.idUsuario,
                puestoClasificacion: index + 1,
                tiempoResolucion: user.tiempoResolucion
            }));
                        
            //console.log(lista2[0].idUsuario);
            const player = lista2.find((element) => element.idUsuario === idUsuario1)
            
            console.log("hola");
            
            const leaderBoard = [];
            const leaderBoard2 = [];
            //const player = lista2.find((user) => user.idUsuario === idUsuario1);
            console.log(player.puestoClasificacion);
            
            if (lista2.length > 20){
                for (let i=0; i<11; i++){
                    leaderBoard[i] = lista2[player.puestoClasificacion-(10-i)-1];
                    console.log(player.puestoClasificacion-(10-i)-1);
                    console.log(i);
                }
                for (let i=0; i<10; i++){
                    leaderBoard[11+i] = lista2[player.puestoClasificacion+i];
                    console.log(player.puestoClasificacion+i);
                    console.log(11+i);
                }
                
                let j=0;
                for (let i=0; i<20; i++){
                    
                    if (leaderBoard[i] != null){
                        leaderBoard2[j] = leaderBoard[i];
                        j = j + 1;
                    }
                }
                //console.log(leaderBoard2);
                //leaderBoard = lista2.slice(player.puestoClasificacion-10,player.puestoClasificacion+10);
                //console.log(leaderBoard);
            }
            else{
                leaderBoard2 = lista2;
            }
                        
            console.log("hola");            
            res.status(202).send(leaderBoard2);
            
        } catch (e) {
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