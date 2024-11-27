import levelModeLevelStatsModel from '../models/estadisticasNivelModoNiveles.js';
import playerModel from '../models/Jugadores.js';

class levelModeLevelStatController{
    constructor(){

    }

    async create (req, res) {
        try{
            const levelModeLevelStat = await levelModeLevelStatsModel.create(req.body);
            console.log('HOLA');
            const flag = false;
            function calculoPistas (pistas){
                if (flag){
                    return pistas+1;
                }
                else{
                    return pistas;
                }
            }

            function calculoPistasAux (aux){
                if (aux+1 == 5){
                    flag = true;
                    return 0;
                }
                else{
                    return aux+1;
                } 
            }

            if (levelModeLevelStat){
                /*const player = await playerModel.findAll({where: {idUsuario:req.body.idUsuario}});
                player2 = player.map((user) => ({
                    idUsuario: user.idUsuario,
                    nombreUsuario: user.nombreUsuario,
                    listaCantidadNivelesCompletadosGrupo: user.listaCantidadNivelesCompletadosGrupo,
                    cantidadNivelesDiariosCompletados: user.cantidadNivelesDiariosCompletados,
                    cantidadPistasAux: calculoPistasAux(user.cantidadPistasAux),
                    cantidadPistas: calculoPistas(user.cantidadPistas),
                    mejorTiempoNivelDiario: user.mejorTiempoNivelDiario,
                    mejorPuestoClasificacionEnPorcentaje: user.mejorPuestoClasificacionEnPorcentaje,
                    cantidadVecesClasificacion1: user.cantidadVecesClasificacion1 
                }));
                const player3 = await playerModel.update({cantidadPistas: player2.calculoPistas, cantidadPistasAux: player2.cantidadPistasAux},
                    {where: {idUsuario:req.body.idUsuario}});
                
                if (typeof (player3[0]) != 'undefined' && player3[0] === 1){
                    console.log('OK');
                }else{
                    console.log('ERROR'); 
                }  */
                res.status(201).send({message: 'Level stat created succesfully'});
            }
            else{
                console.log('AYUDA');
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
            //console.log(idNivel1);
            if (data1.idUsuario != idUsuario1 || data1.idNivel != idNivel1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
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