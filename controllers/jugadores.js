import playerModel from '../models/Jugadores.js';

class playerController{
    constructor(){

    }

    async create (req, res) {
        try{
            const player = await playerModel.create(req.body);
        
            if (player)
                res.status(200).send({status: 'Player Created Succesfully'});
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
        try{
            const idUsuario1 = req.params.idUsuario;
            //console.log(req.params);
            const data = {...req.body};
           
            const player = await playerModel.update({listaCantidadNivelesCompletadosGrupo:data.listaCantidadNivelesCompletadosGrupo, cantidadNivelesDiariosCompletados:data.cantidadNivelesDiariosCompletados,cantidadPistas:data.cantidadPistas,mejorTiempoNivelDiario:data.mejorTiempoNivelDiario,cantidadVecesClasificacion1:data.cantidadVecesClasificacion1},
                {where: {idUsuario:idUsuario1}});
            
            if (typeof (player[0]) != 'undefined' && player[0] === 1){
                res.status(200).send({
                    status: true,
                });
            }else{
                res.status(404).send(
                    {message: 'Player not found'}
                );   
            }  

        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async delete (req, res) {
        try{
            const { idUsuario } = req.params;
            
            const player = await playerModel.destroy({where: {idUsuario}});
            
            if(player) {
                res.status(200).send({status: true});
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