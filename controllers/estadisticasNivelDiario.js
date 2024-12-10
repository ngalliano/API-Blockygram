import { and, DATE, where } from 'sequelize';
import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
import playerController from '../controllers/jugadores.js'
import fastifyMysql from '@fastify/mysql';
import playerModel from '../models/Jugadores.js';
import fastify from 'fastify';

class dailyLevelStatController{
    constructor(){

    }

    async create (req, res) {
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
            function mejorTiempo(tiempo){
                if (req.body.tiempoResolucion < tiempo){
                    return req.body.tiempoResolucion;
                }
                else{
                    return tiempo;
                }
            }
            function actualizarContador(cantidad){
                return (cantidad + 1);
            }
            function actualizarEstadoClasificacion(puesto,cantidadpuestos){
                return (puesto/cantidadpuestos < 1/100);
            }
            //console.log(req);
            let aux = 0;
            if (req.body.idNivel != parseInt(fecha2)){
                aux +=1;
                res.status(500).send({message: 'Invalid action'});
            }
            if (typeof(req.body.tiempoResolucion) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid level time format'});
            }
            else if(req.body.tiempoResolucion < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid level time value'});
            }
            if (typeof(req.body.puestoClasificacion) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of classification format'});
            }
            else if(req.body.puestoClasificacion < 0 || parseInt(req.body.puestoClasificacion) - req.body.puestoClasificacion != 0 || req.body.puestoClasificacion != 100){
                aux += 1;
                res.status(422).send({message: 'Invalid number of classification value'});
            }
            if (typeof(req.body.estadoClasificacion1) != "boolean"){
                aux += 1;
                res.status(400).send({message: 'Invalid state of classification 1% format'});
            }
            else if (req.body.estadoClasificacion1 != false){
                aux += 1;
                res.status(422).send({message: 'Invalid state of classification 1% value'});
            }
            if (aux == 0){
                const lista = await dailyLevelStatsModel.findAll(
                    {where:{ idNivel:req.body.idNivel, idUsuario:req.body.idUsuario}}
                );
                if (lista.length == 0){
                    const dailyLevelStat = await dailyLevelStatsModel.create(req.body);
                    if (dailyLevelStat){
                        const player = await playerModel.findByPk(req.body.idUsuario);
                        if (player){
                            console.log(player.listaCantidadNivelesCompletadosGrupo);
                            const tiempoActualizado = mejorTiempo(player.mejorTiempoNivelDiario);
                            const nivelesDiariosActualizados = actualizarContador(player.cantidadNivelesDiariosCompletados);
                            const lista1 = await dailyLevelStatsModel.findAll({
                                where: {idNivel:parseInt(fecha2)},
                                order: [['tiempoResolucion', 'ASC']]
                            });
                            let index = 0;
                            console.log('RYZE');
                            const leaderBoard1 = lista1.map((user, index) => ({
                                idUsuario: user.idUsuario,
                                idNivel: user.idNivel,
                                nombreUsuario: user.nombreUsuario,
                                tiempoResolucion: user.tiempoResolucion,
                                puestoClasificacion: index + 1,
                                estadoClasificacion1: user.estadoClasificacion1
                            }));
                            console.log(leaderBoard1.length);
                            const leaderBoard2 = leaderBoard1.map((user) => ({
                                idUsuario: user.idUsuario,
                                idNivel: user.idNivel,
                                nombreUsuario: user.nombreUsuario,
                                tiempoResolucion: user.tiempoResolucion,
                                puestoClasificacion: user.puestoClasificacion,
                                estadoClasificacion1: actualizarEstadoClasificacion(user.puestoClasificacion,leaderBoard1.length)
                            }));
                            console.log(leaderBoard2[0]);
                            leaderBoard2.forEach(element => {
                                let req4 ={
                                    params:{
                                        idNivel: element.idNivel,
                                        idUsuario: element.idUsuario
                                    },
                                    body:{
                                        idUsuario: element.idUsuario,
                                        idNivel: element.idNivel,
                                        nombreUsuario: element.nombreUsuario,
                                        tiempoResolucion: element.tiempoResolucion,
                                        puestoClasificacion: element.puestoClasificacion,
                                        estadoClasificacion1: element.estadoClasificacion1
                                    }
                                }
                                let res4={
                                    status(code){
                                        this.statusCode = code;
                                        return this;
                                    },
                                    send(data){
                                        this.dataResult = data;
                                        return this; 
                                    }
                                }
                                //console.log(req4);
                                //console.log(res4);
                                dailyLevelStatsModel.update({nombreUsuario:element.nombreUsuario, puestoClasificacion:element.puestoClasificacion, estadoClasificacion1:element.estadoClasificacion1}
                                    ,{where: {idNivel:element.idNivel, idUsuario:element.idUsuario}});
                            });
                            
                            const req2 ={
                                params:{
                                    idUsuario: req.body.idUsuario,
                                },
                                body:{
                                    idUsuario: player.idUsuario,
                                    nombreUsuario: player.nombreUsuario,
                                    listaCantidadNivelesCompletadosGrupo: player.listaCantidadNivelesCompletadosGrupo,
                                    cantidadNivelesDiariosCompletados: nivelesDiariosActualizados,
                                    cantidadPistas: player.cantidadPistas,
                                    cantidadPistasAux: player.cantidadPistasAux,
                                    mejorTiempoNivelDiario: tiempoActualizado,
                                    mejorPuestoClasificacionEnPorcentaje: player.mejorPuestoClasificacionEnPorcentaje,
                                    cantidadVecesClasificacion1: player.cantidadVecesClasificacion1, 
                                }
                            };
                            const res2 = {
                                status(code){
                                    this.statusCode = code;
                                    return this;
                                },
                                send(data){
                                    this.dataResult = data;
                                    return this;
                                }
                            };
                            playerController.update(req2, res2);
                            console.log(res2);
                            res.status(201).send({message: 'Daily level stat created succesfully'});
                            
                        }
                    }
                }
                else{
                    res.status(500).send({message: 'Daily Level Stat already exist'});
                }
            }
            console.log(req.body);
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
                attributes: ['puestoClasificacion','nombreUsuario','tiempoResolucion'],
                where: {idNivel:parseInt(fecha2)},
                limit: 20,
                order: [['tiempoResolucion', 'ASC']]
            });
            const leaderBoard = lista.map((user, index) => ({
                nombreUsuario: user.nombreUsuario,
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
                attributes: ['puestoClasificacion','idUsuario','nombreUsuario','tiempoResolucion'],
                where: {idNivel:parseInt(fecha2)},
                order: [['tiempoResolucion', 'ASC']]
            });
            
            const lista2 = lista1.map((user, index) => ({
                idUsuario: user.idUsuario,
                nombreUsuario: user.nombreUsuario,
                puestoClasificacion: index + 1,
                tiempoResolucion: user.tiempoResolucion
            }));
            
            class Registro{
                constructor (nombreUsuario, puestoClasificacion, tiempoResolucion){
                    this.nombreUsuario = nombreUsuario;
                    this.puestoClasificacion = puestoClasificacion;
                    this.tiempoResolucion = tiempoResolucion;
                }
            }
            
            const lista3 = [];
            lista2.forEach(element => {
                lista3.push(new Registro (element.nombreUsuario, element.puestoClasificacion, element.tiempoResolucion));
            });
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
            console.log(lista3.length);
            console.log(player.puestoClasificacion);
            if (lista3.length > 20){
                if (player.puestoClasificacion < 11){
                    for (let i=0; i < player.puestoClasificacion; i++){
                        leaderBoard[i] = lista3[i];
                    }
                    for (let i=player.puestoClasificacion; i<20; i++){
                        leaderBoard[i] = lista3[i];
                    }
                }
                if (player.puestoClasificacion >= 11 && player.puestoClasificacion < lista3.length-9){
                    let j=0;
                    for (let i=player.puestoClasificacion-10; i<player.puestoClasificacion; i++){
                        leaderBoard[j] = lista3[i];
                        j++;
                        console.log(j);
                        console.log(i);
                    }
                    console.log("AAA");
                    for (let i=player.puestoClasificacion; i<player.puestoClasificacion+10; i++){
                        leaderBoard[j] = lista3[i];
                        j++;
                        console.log(j);
                        console.log(i);
                    }
                }
                if (player.puestoClasificacion >= lista3.length-9){
                    
                    for (let i=0; i<20; i++){
                        leaderBoard[19-i] = lista3[lista3.length-1-i];
                    }
                }
            }
            else{
                for (let i = 0; i<lista3.length; i++){
                    leaderBoard[i] = lista3[i];
                }
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
            let aux = 0;
            /*function actualizarMejorPuesto(puestoAnterior, puestoActual){
                if (tiempoAnterior > tiempoActual){
                    return tiempoActual;
                }
                else{
                    return tiempoAnterior;
                }
            }
            const cantidadClasificaciones =  await dailyLevelStatsModel.count({
                where: {idUsuario:req.body.idUsuario,estadoClasificacion1:true}
            });*/
            const data1 = {...req.body};
            const idNivel1 = req.query.idNivel;
            const idUsuario1 = req.query.idUsuario;
            //console.log(idNivel1);             
            if (data1.idUsuario != idUsuario1 || data1.idNivel != idNivel1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            if (typeof(req.body.puestoClasificacion) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of classification format'});
            }
            else if(req.body.puestoClasificacion < 0 || parseInt(req.body.puestoClasificacion) - req.body.puestoClasificacion != 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of classification value'});
            }
            if (typeof(req.body.estadoClasificacion1) != "boolean"){
                aux += 1;
                res.status(400).send({message: 'Invalid state of classification 1% format'});
            }
            if (aux == 0){
                const nivel = await dailyLevelStatsModel.update({nombreUsuario:data1.nombreUsuario,puestoClasificacion:data1.puestoClasificacion, estadoClasificacion1:data1.estadoClasificacion1},
                    {where: {idNivel:idNivel1, idUsuario:idUsuario1}});
                           
                if (typeof (nivel[0]) != 'undefined' && nivel[0] === 1){
                    
                    res.status(200).send({
                        message: 'Daily level stat updated succesfully',
                    });
                }else{
                    res.status(404).send(
                        {message: 'Daily level stat not found'}
                    );   
                }  
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
                    {message: 'Daily level stat deleted succesfully'}
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