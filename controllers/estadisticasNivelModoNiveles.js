import { where } from 'sequelize';
import levelModeLevelStatsModel from '../models/estadisticasNivelModoNiveles.js';
import playerModel from '../models/Jugadores.js';
import playerController from '../controllers/jugadores.js';

class levelModeLevelStatController{
    constructor(){

    }

    async create (req, res) {
        try{
            let aux = 0;
            let flag = false;
            function actualizarPistas(pistas){
                if (flag){
                    flag = false;
                    return (pistas + 1);
                }
                else{
                    return pistas;
                }
            }
            function actualizarPistasAux(pistasAux){
                if (pistasAux + 1 == 5){
                    flag = true;
                    return 0;
                }
                else{
                    return (pistasAux + 1);
                }
            }
            function completarNivelesGrupo(listaAux){
                console.log(listaAux.length);
                let lista = '';
                if (req.body.idNivel >= 1 && req.body.idNivel <= 10){
                    lista = listaAux.slice(0,7) +(parseInt(listaAux[7])+1).toString() + listaAux.slice(8,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >= 11 && req.body.idNivel <= 20){
                    lista = listaAux.slice(0,16) +(parseInt(listaAux[16])+1).toString() + listaAux.slice(17,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=21 && req.body.idNivel <= 30){
                    lista = listaAux.slice(0,25) +(parseInt(listaAux[25])+1).toString() + listaAux.slice(26,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=31 && req.body.idNivel <= 40){
                    lista = listaAux.slice(0,34) +(parseInt(listaAux[34])).toString() + listaAux.slice(35,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=41 && req.body.idNivel <= 50){
                    lista = listaAux.slice(0,43) +(parseInt(listaAux[43])+1).toString() + listaAux.slice(44,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=51 && req.body.idNivel <= 60){
                    lista = listaAux.slice(0,52) +(parseInt(listaAux[52])+1).toString() + listaAux.slice(53,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=61 && req.body.idNivel <= 70){
                    lista = listaAux.slice(0,61) +(parseInt(listaAux[61])+1).toString() + listaAux.slice(62,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=71 && req.body.idNivel <= 80){
                    lista = listaAux.slice(0,70) +(parseInt(listaAux[70])+1).toString() + listaAux.slice(71,listaAux.length); 
                    console.log(lista);
                }
                else if (req.body.idNivel >=81 && req.body.idNivel <= 90){
                    lista = listaAux.slice(0,79) +(parseInt(listaAux[79])+1).toString()
                    console.log(lista);
                }
                return lista;
            }
            if (typeof(req.body.idUsuario) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid user id format'});
            }
            if (typeof(req.body.idNivel) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid level id format'});
            }
            else if (req.body.idNivel < 0 || parseInt(req.body.idNivel) - req.body.idNivel != 0){ 
                aux += 1;
                res.status(422).send({message: 'Invalid level id value'});
            }
            if (typeof(req.body.mejorTiempoResolucion) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid best level time format'});
            }
            else if (req.body.mejorTiempoResolucion < 0 ){
                aux += 1;
                res.status(422).send({message: 'Invalid best level time value'});
            }
            if (aux == 0){
                const levelModeLevelStat = await levelModeLevelStatsModel.create(req.body);
                console.log('HOLA');
                if (levelModeLevelStat){
                    const player = await playerModel.findByPk(req.body.idUsuario);
                        if (player){
                            //console.log(player.listaCantidadNivelesCompletadosGrupo);
                            const pistasAuxActualizadas = actualizarPistasAux(player.cantidadPistasAux);
                            const pistasActualizadas = actualizarPistas(player.cantidadPistas);
                            const nivelesActualizados = completarNivelesGrupo(player.listaCantidadNivelesCompletadosGrupo);
                            
                            const req2 ={
                                params:{
                                    idUsuario: req.body.idUsuario
                                },
                                body:{
                                    idUsuario: player.idUsuario,
                                    nombreUsuario: player.nombreUsuario,
                                    listaCantidadNivelesCompletadosGrupo: nivelesActualizados,
                                    cantidadNivelesDiariosCompletados: player.cantidadNivelesDiariosCompletados,
                                    cantidadPistas: pistasActualizadas,
                                    cantidadPistasAux: pistasAuxActualizadas,
                                    mejorTiempoNivelDiario: player.mejorTiempoNivelDiario,
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
                            res.status(201).send({message: 'Level stat created succesfully'});
                        }
                }
            }
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getAll (req, res) {
        try{
            const where = {...req.query};
            const lista = await levelModeLevelStatsModel.findAll({where});
            res.status(200).send(lista);    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
    
    async getOne (req, res) {
        try{
            const idNivel1 = req.query.idNivel;
            const idUsuario1 = req.query.idUsuario;
            
            const nivel = await levelModeLevelStatsModel.findOne({
                where: {idUsuario:idUsuario1, idNivel: idNivel1}
            });
            
            if(nivel) {
                res.status(200).send(nivel);
            }else{
                res.status(404).send(
                    {message: 'Level stat not found'}
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
            let aux = 0;
            //console.log(idNivel1);
            const stat = await levelModeLevelStatsModel.findOne({
                where: {idUsuario: idUsuario1, idNivel: idNivel1}
            });
            console.log(stat.dataValues.mejorTiempoResolucion);
            if (data1.idUsuario != idUsuario1 || data1.idNivel != idNivel1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            if (typeof(req.body.mejorTiempoResolucion) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid best level time format'});
            }
            else if (req.body.mejorTiempoResolucion < 0 || req.body.mejorTiempoResolucion > stat.dataValues.mejorTiempoResolucion){
                aux += 1;
                res.status(422).send({message: 'Invalid best level time value'});
            } 
            
            if (aux == 0)
            {
                const nivel = await levelModeLevelStatsModel.update({mejorTiempoResolucion:data1.mejorTiempoResolucion},
                    {where: {idNivel:idNivel1, idUsuario:idUsuario1}});
                //console.log('Hola');            
                if (typeof (nivel[0]) != 'undefined' && nivel[0] === 1){
                    res.status(200).send({
                        message: 'Level stat updated succesfully',
                    });
                }else{
                    res.status(404).send(
                        {message: 'Level stat not found'}
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
            
            const nivel = await levelModeLevelStatsModel.destroy({where: {idNivel:idNivel1, idUsuario:idUsuario1}});
            
            if(nivel) {
                res.status(200).send(
                    {message: 'Level stat deleted succesfully'}
                );
            }else{
                res.status(404).send(
                    {message: 'Level stat not found'}
                );   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
}

export default new levelModeLevelStatController();