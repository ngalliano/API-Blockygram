import { Sequelize, where } from 'sequelize';
import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
import playerModel from '../models/Jugadores.js';
import dailyLevelModel from '../models/nivelesDiarios.js';

class playerController{
    constructor(){
       this.timerMidnight(); 
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
            console.log(fechaHoy);
            const fecha2 = new Date(fechaHoy);
            fecha2.setDate(fechaHoy.getDate()+1);
            fecha2.setHours(0,0,0,0);
            console.log(fecha2);
            if (fecha2-fechaHoy < 0){
                return 0;
            }
            else{
                return 0;
            }
        }
        setTimeout(this.finalDailyUpdate, timeToMidnight());
        setInterval(this.finalDailyUpdate, 24*60*60*1000);
    }
    
    async create (req, res) {
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
        try{
            let aux = 0;
                if (typeof(req.body.idUsuario) != "string"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid user id format'});
                }
                if (typeof(req.body.nombreUsuario) != "string"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid user name format'});
                }
                //console.log('CHAU');
                if (typeof(req.body.listaCantidadNivelesCompletadosGrupo) != "string"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid list of completed levels by group format'});
                }
                else if(!checkLevelGroupList(req.body.listaCantidadNivelesCompletadosGrupo.toString())){
                    aux += 1;
                    res.status(422).send({message: 'At least one of completed levels by group is invalid'})
                }
                if (typeof(req.body.cantidadNivelesDiariosCompletados) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid daily levels completed format'});
                }
                else if(req.body.cantidadNivelesDiariosCompletados != 0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid daily levels completed value'});
                }
                console.log('CHAU X2');
                if (typeof(req.body.cantidadPistas) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid number of clues format'});
                }
                else if(req.body.cantidadPistas != 5){
                    aux += 1;
                    res.status(422).send({message: 'Invalid number of clues value'});
                }
                if (typeof(req.body.cantidadPistasAux) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid number of clues aux format'});
                }
                else if(req.body.cantidadPistasAux != 0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid number of clues aux value'});
                }
                if (typeof(req.body.mejorTiempoNivelDiario) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid best daily level time format'});
                }
                else if(req.body.mejorTiempoNivelDiario != 1000.0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid best daily level time value'});
                }
                if (typeof(req.body.mejorPuestoClasificacionEnPorcentaje) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid best number of classification % format'});
                }
                else if(req.body.mejorPuestoClasificacionEnPorcentaje != 100.0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid best number of classification % value'});
                }
                if (typeof(req.body.cantidadVecesClasificacion1) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid number of classification 1% format'});
                }
                else if(req.body.cantidadVecesClasificacion1 != 0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid number of classification 1% value'});
                }
            if (aux == 0){
                const player = await playerModel.create(req.body);
                
                if (player)
                    res.status(201).send({message: 'Player created succesfully'});
            }    
            
        
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getAll (req, res) {
        try{
            const where = {...req.query};
            const lista = await playerModel.findAll({where});
            res.status(200).send(lista);    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getOne (req, res) {
        try{
            
            const { idUsuario } = req.params;
            const player = await playerModel.findByPk(idUsuario);
            
            if(player) {
                res.status(200).send(player);
                console.log(res);
            }else{
                res.status(404).send(
                    {message: 'Player not found'}
                );   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async update (req, res) {
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
        try{
            const idUsuario1 = req.params.idUsuario;
            //console.log(req.params);
            const data = {...req.body};
            let aux = 0;
            if (data.idUsuario != idUsuario1){
                aux += 1;
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            
            //console.log('CHAU');
            if (typeof(req.body.listaCantidadNivelesCompletadosGrupo) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid list of completed levels by group format'});
            }
            if (typeof(req.body.nombreUsuario) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid user name format'});
            }
            else if(!checkLevelGroupList(req.body.listaCantidadNivelesCompletadosGrupo)){
                aux += 1;
                res.status(422).send({message: 'At least one of completed levels by group is invalid'})
            }
            if (typeof(req.body.cantidadNivelesDiariosCompletados) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid daily levels completed format'});
            }
            else if (req.body.cantidadNivelesDiariosCompletados < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid daily levels completed value'});
            }
            if (typeof(req.body.cantidadPistas) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of clues format'});
            }
            else if (req.body.cantidadPistas < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of clues value'});
            }
            if (typeof(req.body.cantidadPistasAux) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of clues aux format'});
            }
            else if(req.body.cantidadPistasAux < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of clues aux value'});
            }
            if (typeof(req.body.mejorTiempoNivelDiario) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid best daily level time format'});
            }
            else if (req.body.mejorTiempoNivelDiario < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid best daily level time value'});
            }
            if (typeof(req.body.mejorPuestoClasificacionEnPorcentaje) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid best number of classification % format'});
            }
            else if (req.body.mejorPuestoClasificacionEnPorcentaje < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid best number of classification % value'});
            }
            if (typeof(req.body.cantidadVecesClasificacion1) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of classification 1% format'});
            }
            else if (req.body.cantidadVecesClasificacion1 < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of classification 1% value'});
            }
            if (aux == 0){
                const player = await playerModel.update({nombreUsuario:data.nombreUsuario,listaCantidadNivelesCompletadosGrupo:data.listaCantidadNivelesCompletadosGrupo, cantidadNivelesDiariosCompletados:data.cantidadNivelesDiariosCompletados,cantidadPistas:data.cantidadPistas,cantidadPistasAux:data.cantidadPistasAux,mejorTiempoNivelDiario:data.mejorTiempoNivelDiario,mejorPuestoClasificacionEnPorcentaje:data.mejorPuestoClasificacionEnPorcentaje,cantidadVecesClasificacion1:data.cantidadVecesClasificacion1},
                    {where: {idUsuario:idUsuario1}});
                
                if (typeof (player[0]) != 'undefined' && player[0] === 1){
                    res.status(200).send({
                        message: 'Player updated succesfully'
                    });
                }else{
                    res.status(404).send(
                        {message: 'Player not found'}
                    );   
                }  
            }
            

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
            console.log(fechaArgentina);
            const fecha2 = fechaArgentina.toString().slice(0,2) + fechaArgentina.toString().slice(3,5) + fechaArgentina.toString().slice(6,10);
            return fecha2;
        }
        function mejorPuesto(anteriorPuestoPorcentaje, nuevoPuesto, cantidad){
            const nuevopuestoPorcentaje = parseFloat(nuevoPuesto)/parseFloat(cantidad) 
            if (anteriorPuestoPorcentaje < nuevopuestoPorcentaje){
                return anteriorPuestoPorcentaje;
            }
            else{
                return nuevopuestoPorcentaje;
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
            // ARREGLAR ERROR EN FECHA NO USAR SLICE SINO TOLOCALESTRING
            const fecha = fechaActual();
            console.log(fecha);
            let hoy = fecha.slice(4,8) + '-' + fecha.slice(2,4) + '-' + fecha.slice(0,2);
            const diaHoy = new Date(hoy)
            const ayer = diaHoy;
            console.log(diaHoy.getDate());
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
            const fechaAyer = ayerArgentina.toString().slice(0,2) + ayerArgentina.toString().slice(3,5) + ayerArgentina.toString().slice(6,10)
            console.log(ayerArgentina);
            console.log(fechaAyer);
            return fechaAyer;
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
                        console.log(res);
                        return res;  
                    }  
                });
                res.status(200);
            }
            else{
                res.status(404);
            }            
            console.log(res);
            return res;
        }
        
            const update = await updateAll();
            console.log(update);
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
                res.status(200).send(
                    {message: 'Player deleted succesfully'}
                );
            }else{
                res.status(404).send(
                    {message: 'Player not found'}
                );   
            }    

        }catch (e) {
            res.status(500).send({error: e});
        }
    }
    
}

export default new playerController();