import dailyLevelModel from '../models/nivelesDiarios.js';

class dailyLevelController{
    constructor(){

    }

    async create (req, res) {
        try{
            const dailyLevel = await dailyLevelModel.create(req.body);
        
            if (dailyLevel)
                res.status(201).send({message: 'Daily level created succesfully'});
        }catch (e) {
            res.status(500).send({error: e});
        }
        
    }

    async getDate (req, res) {
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
            res.status(200).send(fecha2);    
        }
        catch{
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
                    message: 'Daily level updated succesfully',
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
                    {message: 'Daily level deleted succesfully'}
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