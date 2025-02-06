import { Sequelize, where } from 'sequelize';
import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
import playerModel from '../models/jugadores.js';
import dailyLevelModel from '../models/nivelesDiarios.js';

class playerController{
    constructor(){
       this.timerMidnight();
    }
    
    validateInputs(input, operation,query){
        const min = 0;
        const max = 10;
        const groups = 8;
        function between (num){
            return (num >= min && num <= max);
        }
        function isANum (a){
            return (a == "0" || a == "1" || a == "2" || a == "3" || a == "4" || a == "5" || a == "6" || a == "7" || a == "8" || a == "9");
        }
        function checkLevelGroupList (list){
            for(let i = 7; i<7+9*groups+1; i=i+9){
                if (isANum(list[i])){
                    
                }
                else{
                    return false;
                }
                if (isANum(list[i+1])){
                    
                    if (!between(parseInt(list[i]+list[i+1]))){
                        return false;
                    }
                }
                
                if (!between(parseInt(list[i]))){
                    return false;
                }
            } 
            return true;
        }
        class Resultado{
            constructor (code, messageR){
                this.code = code;
                this.messageR = messageR;
            }
        }
        if ((input.idUsuario != query && operation == "update") || (input.idUsuario != query.idUsuario && operation == "create")){
            return new Resultado(400, 'Data in body and params of request is different')
        }
        if (typeof(input.idUsuario) != "string"){
            return new Resultado(400, 'Invalid user id format');
        }
        if (typeof(input.nombreUsuario) != "string"){
            return new Resultado(400, 'Invalid user name format');
        }
        if (typeof(input.listaCantidadNivelesCompletadosGrupo) != "string"){
            return new Resultado(400, 'Invalid list of completed levels by group format');
        }
        else if(!checkLevelGroupList(input.listaCantidadNivelesCompletadosGrupo.toString())){
            return new Resultado(422, 'At least one of completed levels by group is invalid');
        }
        if (typeof(input.cantidadNivelesDiariosCompletados) != "number"){
            return new Resultado(400, 'Invalid daily levels completed format');
        }
        else if((input.cantidadNivelesDiariosCompletados != 0 && operation == "create") || (input.cantidadNivelesDiariosCompletados < 0 && operation == "update")){
            return new Resultado(422, 'Invalid daily levels completed value');
        }
        if (typeof(input.cantidadPistas) != "number"){
            return new Resultado(400, 'Invalid number of clues format');
        }
        else if((input.cantidadPistas != 5 && operation == "create") || (input.cantidadPistas < 0 && operation == "update")){
            return new Resultado(422, 'Invalid number of clues value');
        }
        if (typeof(input.cantidadPistasAux) != "number"){
            return new Resultado(400, 'Invalid number of clues aux format');
        }
        else if((input.cantidadPistasAux != 0 && operation == "create") || (input.cantidadPistasAux < 0 && operation == "update")){
            return new Resultado(422, 'Invalid number of clues aux value');
        }
        if (typeof(input.mejorTiempoNivelDiario) != "number"){
            return new Resultado(400, 'Invalid best daily level time format');
        }
        else if((input.mejorTiempoNivelDiario != 5999.999 && operation == "create") || (input.mejorTiempoNivelDiario < 0 && operation == "update")){
            return new Resultado(422, 'Invalid best daily level time value');
        }
        if (typeof(input.mejorPuestoClasificacionEnPorcentaje) != "number"){
            return new Resultado(400, 'Invalid best number of classification % format');
        }
        else if((input.mejorPuestoClasificacionEnPorcentaje != 100.0 && operation == "create") || (input.mejorPuestoClasificacionEnPorcentaje < 0 && operation == "update")){
            return new Resultado(422, 'Invalid best number of classification % value');
        }
        if (typeof(input.cantidadVecesClasificacion1) != "number"){
            return new Resultado(400, 'Invalid number of classification 1% format');
        }
        else if((input.cantidadVecesClasificacion1 != 0 && operation == "create") || (input.cantidadVecesClasificacion1 < 0 && operation == "update")){
            return new Resultado(422, 'Invalid number of classification 1% value');
        }
        if (typeof(input.opciones) != "string"){
            return new Resultado(400, 'Invalid options format');
        }
        else{
            return new Resultado(200, 'OK');
        }  
    }

    async timerMidnight(){
        function timeToMidnight(){
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
            const fechaArgentina = new Intl.DateTimeFormat('en-US', opciones).format(fecha1);
            const fechaHoy = new Date(fechaArgentina);
            const fecha2 = new Date(fechaHoy);
            fecha2.setDate(fechaHoy.getDate()+1);
            fecha2.setHours(0,0,0,0);
            if (fecha2-fechaHoy < 0){
                return 0;
            }
            else{
                return fecha2-fechaHoy;
            }
        }
        setTimeout(this.finalDailyUpdate, timeToMidnight());
        setInterval(this.finalDailyUpdate, 24*60*60*1000);
    }
    
    async create (req, res) {
        try{
            const object = new playerController();
            const aux = object.validateInputs(req.body,"create",req.body);
            //console.log(aux);
            if (aux.code == 200){
                const player = await playerModel.create(req.body);
                if (player)
                    res.status(201).send({message: 'Player created succesfully'});
            }
            else{
                res.status(aux.code).send({message: aux.messageR});
            }
            object = null;    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getOne (req, res) {
        try{
            const {idUsuario} = req.params;
            const player = await playerModel.findByPk(idUsuario);
            if(player) {
                res.status(200).send(player);
            }else{
                res.status(404).send({message: 'Player not found'});   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async update (req, res) {
        try{
            const object = new playerController();
            const aux = object.validateInputs(req.body,'update',req.params.idUsuario);
            if (aux.code == 200){
                const player = await playerModel.update({nombreUsuario:req.body.nombreUsuario,listaCantidadNivelesCompletadosGrupo:req.body.listaCantidadNivelesCompletadosGrupo, cantidadNivelesDiariosCompletados:req.body.cantidadNivelesDiariosCompletados,cantidadPistas:req.body.cantidadPistas,cantidadPistasAux:req.body.cantidadPistasAux,mejorTiempoNivelDiario:req.body.mejorTiempoNivelDiario,mejorPuestoClasificacionEnPorcentaje:req.body.mejorPuestoClasificacionEnPorcentaje,cantidadVecesClasificacion1:req.body.cantidadVecesClasificacion1},
                    {where: {idUsuario:req.params.idUsuario}});
                if (typeof (player[0]) != 'undefined' && player[0] === 1){
                    res.status(200).send({message: 'Player updated succesfully'});
                }else{
                    res.status(404).send(
                        {message: 'Player not found'}
                    );   
                }  
            }
            else{
                res.status(aux.code).send({message: aux.messageR});
            }
            object = null;
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async finalDailyUpdate (req, res){
        function fechaActual(){
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
            return fecha2;
        }
        function mejorPuesto(anteriorPuestoPorcent, nuevoPuesto, cantidad){
            const nuevoPuestoPorcent = parseFloat(nuevoPuesto)/parseFloat(cantidad)*100 
            if (anteriorPuestoPorcent < nuevoPuestoPorcent){
                return anteriorPuestoPorcent;
            }
            else{
                return nuevoPuestoPorcent;
            }
        }
        function actualizarClasificacion1(cantidadClasificaciones,estadoClasificacion1){
            if (estadoClasificacion1){
                return cantidadClasificaciones + 1;
            }
            else {
                return cantidadClasificaciones;
            }
        }
        function diaAnterior(){
            const fecha = fechaActual();
            const diaHoy = new Date(fecha.slice(4,8) + '-' + fecha.slice(2,4) + '-' + fecha.slice(0,2));
            const ayer = diaHoy;
            ayer.setDate(diaHoy.getDate());
            const opciones = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit'
            };
            const ayerArgentina = new Intl.DateTimeFormat('es-AR', opciones).format(diaHoy);
            return ayerArgentina.toString().slice(0,2) + ayerArgentina.toString().slice(3,5) + ayerArgentina.toString().slice(6,10)
        }
        async function updateAll(){
            const fechaAnterior = diaAnterior();
            const res = {
                status(code){
                    this.statusCode = code;
                    return this;
                },
                send(data){
                    this.dataResult = data;
                    return this;
                }
            };
            const players = await playerModel.findAll();
            const stats = await dailyLevelStatsModel.findAll({where: {idNivel: parseInt(fechaAnterior)}});
            if (stats.length != 0){
                stats.forEach(element => {
                    const player = players.find((element1) => element1.idUsuario == element.idUsuario);
                    const updatedPlayer = {
                        idUsuario: player.idUsuario,
                        nombreUsuario: player.nombreUsuario,
                        listaCantidadNivelesCompletadosGrupo: player.listaCantidadNivelesCompletadosGrupo,
                        cantidadNivelesDiariosCompletados: player.cantidadNivelesDiariosCompletados,
                        cantidadPistas: player.cantidadPistas,
                        cantidadPistasAux: player.cantidadPistasAux,
                        mejorTiempoNivelDiario: player.mejorTiempoNivelDiario,
                        mejorPuestoClasificacionEnPorcentaje: mejorPuesto(player.mejorPuestoClasificacionEnPorcentaje, element.puestoClasificacion, stats.length),
                        cantidadVecesClasificacion1: actualizarClasificacion1(player.cantidadVecesClasificacion1,element.estadoClasificacion1),
                        opciones: player.opciones 
                    };
                    const playerUpdate = playerModel.update({nombreUsuario:updatedPlayer.nombreUsuario,listaCantidadNivelesCompletadosGrupo:updatedPlayer.listaCantidadNivelesCompletadosGrupo, cantidadNivelesDiariosCompletados:updatedPlayer.cantidadNivelesDiariosCompletados,cantidadPistas:updatedPlayer.cantidadPistas,cantidadPistasAux:updatedPlayer.cantidadPistasAux,mejorTiempoNivelDiario:updatedPlayer.mejorTiempoNivelDiario,mejorPuestoClasificacionEnPorcentaje:updatedPlayer.mejorPuestoClasificacionEnPorcentaje,cantidadVecesClasificacion1:updatedPlayer.cantidadVecesClasificacion1},
                        {where: {idUsuario:updatedPlayer.idUsuario}});
                    if (typeof (playerUpdate[0]) != 'undefined' && playerUpdate[0] === 1){
                        
                    }else{
                        res.status(500);
                        return res;  
                    }  
                });
                res.status(200);
            }
            else{
                res.status(404);
            }            
            return res;
        }
        
            const update = await updateAll();
            
            if (update.status() == 200){
                res.status(200).send({message:'Final Daily Update Successfully Completed'});
            }
            else if (update.status() == 404) {
                res.status(404).send({message:'Final Daily Update is not neccesary'});
            }
            else if (update.status() == 500){
                res.status(500).send({message:'Error in Final Daily Update'});
            }
    }

    async delete (req, res) {
        try{
            const { idUsuario } = req.params;
            
            const player = await playerModel.destroy({where: {idUsuario}});
            
            if(player) {
                res.status(200).send({message: 'Player deleted succesfully'});
            }else{
                res.status(404).send({message: 'Player not found'});   
            }    

        }catch (e) {
            res.status(500).send({error: e});
        }
    }
    
}

export default new playerController();