import { and, DATE, where } from 'sequelize';
import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
import fastifyMysql from '@fastify/mysql';

class dailyLevelStatController{
    constructor(){

    }

    async create (req, res) {
        try{
            console.log(req.body);
            const lista = await dailyLevelStatsModel.findAll(
                {where:{ idNivel:req.body.idNivel, idUsuario:req.body.idUsuario}}
            );
            console.log(lista.length);
            if (lista.length == 0){
                const dailyLevelStat = await dailyLevelStatsModel.create(req.body);
                if (dailyLevelStat)
                    res.status(201).send({status: 'Daily Level Stat Created Succesfully'});
            }
            else{
                res.status(500).send({message: 'Daily Level Stat already exist'});
            }
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getAll (req, res) {
        try{
            const where = {...req.query};
            const lista = await dailyLevelStatsModel.findAll({where});
            res.status(200).send(lista);    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getTop20 (req, res){
        try{
            const fecha1 = new Date();
            const opciones = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit'
            };
            const fechaArgentina = new Intl.DateTimeFormat('es-AR', opciones).format(fecha1);
            const fecha2 = fechaArgentina.toString().slice(0,2) + fechaArgentina.toString().slice(3,5) + fechaArgentina.toString().slice(6,10);
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
  
            res.status(200).send(leaderBoard);
        }catch (e){
            res.status(500).send({error: e}); 
        }
    }
    
    async getPlayerPositionGroup (req, res) {
        try {
            const idUsuario1 = req.query.idUsuario;
            const fecha1 = new Date();
            const opciones = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit'
            };
            const fechaArgentina = new Intl.DateTimeFormat('es-AR', opciones).format(fecha1);
            const fecha2 = fechaArgentina.toString().slice(0,2) + fechaArgentina.toString().slice(3,5) + fechaArgentina.toString().slice(6,10);
            const index = 0;
                       
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
            if (player == undefined){
                res.status(404).send(
                    {message: 'Daily level stat for player not found'}
                );   
            }
            console.log("hola");
            
            const leaderBoard = [];
                        
            console.log(lista2.length);
            console.log(player.puestoClasificacion);
            if (lista2.length > 20){
                if (player.puestoClasificacion < 11){
                    for (let i=0; i < player.puestoClasificacion; i++){
                        leaderBoard[i] = lista2[i];
                    }
                    for (let i=player.puestoClasificacion; i<20; i++){
                        leaderBoard[i] = lista2[i];
                    }
                }
                if (player.puestoClasificacion >= 11 && player.puestoClasificacion < lista2.length-9){
                    for (let i=0; i<11; i++){
                        leaderBoard[i] = lista2[player.puestoClasificacion-(11-i)];
                        
                        console.log(i);
                    }
                    console.log("AAA");
                    for (let i=player.puestoClasificacion-1; i<player.puestoClasificacion+8; i++){
                        leaderBoard[i] = lista2[i+1];
                        
                        console.log(i);
                    }
                }
                if (player.puestoClasificacion >= lista2.length-9){
                    
                    for (let i=0; i<20; i++){
                        leaderBoard[19-i] = lista2[lista2.length-1-i];
                    }
                }
            }
            else{
                leaderBoard = lista2;
            }
                        
            console.log("hola");            
            res.status(200).send(leaderBoard);
            
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
                res.status(200).send(nivel);
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
            if (data1.idUsuario != idUsuario1 || data1.idNivel != idNivel1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            const nivel = await dailyLevelStatsModel.update({puestoClasificacion:data1.puestoClasificacion, estadoClasificacion1:data1.estadoClasificacion1},
                {where: {idNivel:idNivel1, idUsuario:idUsuario1}});
            //console.log('Hola');            
            if (typeof (nivel[0]) != 'undefined' && nivel[0] === 1){
                res.status(200).send({
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
                res.status(200).send(
                    {message: 'Daily level stat succesfully deleted'}
                );
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