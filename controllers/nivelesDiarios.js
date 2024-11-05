import dailyLevelModel from '../models/nivelesDiarios.js';

class dailyLevelController{
    constructor(){

    }

    async create (req, res) {
        try{
            const dailyLevel = await dailyLevelModel.create(req.body);
        
            if (dailyLevel)
                res.status(201).send({status: 'Daily Level Created Succesfully'});
        }catch (e) {
            res.status(500).send({error: e});
        }
        
    }

    async getAll (req, res) {
        try{
            const where = {...req.query};
            const lista = await dailyLevelModel.findAll({where});
            res.status(200).send(lista);    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async getOne (req, res) {
        try{
            const { idNivel } = req.params;
            const nivel = await dailyLevelModel.findByPk(idNivel);
            
            if(nivel) {
                res.status(200).send(nivel);
            }else{
                res.status(404).send(
                    {message: 'Daily level not found'}
                );   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async update (req, res) {
        try{
            const idNivel1 = req.params.idNivel;
            const data = {...req.body};
            if (data.idNivel != idNivel1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            const nivel = await dailyLevelModel.update({tipoNivel:data.tipoNivel,estructuraNivel:data.estructuraNivel,estructuraParedes:data.estructuraParedes,listaPiezasNivel:data.listaPiezasNivel},
                {where: {idNivel:idNivel1}});
            
            if (typeof (nivel[0]) != 'undefined' && nivel[0] === 1){
                res.status(200).send({
                    status: true,
                });
            }else{
                res.status(404).send(
                    {message: 'Daily level not found'}
                );   
            }  
        }catch (e) {
            res.status(500).send({error: e});
        }
    }

    async delete (req, res) {
        try{
            const { idNivel } = req.params;
            
            const nivel = await dailyLevelModel.destroy({where: {idNivel}});
            
            if(nivel) {
                res.status(200).send(
                    {message: 'Daily level succesfully deleted'}
                );
            }else{
                res.status(404).send(
                    {message: 'Daily level not found'}
                );   
            }    
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
}

export default new dailyLevelController();