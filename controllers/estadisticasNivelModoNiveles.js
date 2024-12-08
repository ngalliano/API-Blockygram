import { where } from 'sequelize';
import levelModeLevelStatsModel from '../models/estadisticasNivelModoNiveles.js';
import playerModel from '../models/Jugadores.js';

class levelModeLevelStatController{
    constructor(){

    }

    async create (req, res) {
        try{
            let aux = 0;
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
                    res.status(201).send({message: 'Level stat created succesfully'});
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