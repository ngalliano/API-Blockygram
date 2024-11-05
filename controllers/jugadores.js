import playerModel from '../models/Jugadores.js';

class playerController{
    constructor(){

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
            console.log('HOLA');
          
            for(let i = 7; i<7+9*groups+1; i=i+9){
                console.log(list[i]);
                console.log(list[i+1]);
                
                if (isANum(list[i])){
                    console.log('Buneas');
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
                console.log("Daruis");
                
                
            } 
            return true;
        }    
        try{
            if (typeof(req.body.idUsuario) != "string"){
                res.status(400).send({message: 'Invalid user id format'});
            }
            //console.log('CHAU');
            if (typeof(req.body.listaCantidadNivelesCompletadosGrupo) != "string"){
                res.status(400).send({message: 'Invalid list of completed levels by group format'});
            }
            else if(!checkLevelGroupList(req.body.listaCantidadNivelesCompletadosGrupo.toString())){
                res.status(422).send({message: 'At least one of completed levels by group is invalid'})
            }
            if (typeof(req.body.cantidadNivelesDiariosCompletados) != "number"){
                res.status(400).send({message: 'Invalid daily levels completed format'});
            }
            else if(req.body.cantidadNivelesDiariosCompletados != 0){
                res.status(422).send({message: 'Daily levels completed must be 0'});
            }
            console.log('CHAU X2');
            if (typeof(req.body.cantidadPistas) != "number"){
                res.status(400).send({message: 'Invalid number of tracks format'});
            }
            else if(req.body.cantidadPistas != 5){
                res.status(422).send({message: 'Number of tracks must be 5'});
            }
            if (typeof(req.body.mejorTiempoNivelDiario) != "number"){
                res.status(400).send({message: 'Invalid best daily level time format'});
            }
            else if(req.body.mejorTiempoNivelDiario != 1000.0){
                res.status(422).send({message: 'Best daily level time must be 1000.0'});
            }
            if (typeof(req.body.cantidadVecesClasificacion1) != "number"){
                res.status(400).send({message: 'Invalid number of classification 1% format'});
            }
            else if(req.body.cantidadVecesClasificacion1 != 0){
                res.status(422).send({message: 'Number of classification 1% must be 0'});
            }
            
            const player = await playerModel.create(req.body);
        
            if (player)
                res.status(201).send({status: 'Player Created Succesfully'});
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
            console.log('HOLA');
          
            for(let i = 7; i<7+9*groups+1; i=i+9){
                console.log(list[i]);
                console.log(list[i+1]);
                
                if (isANum(list[i])){
                    console.log('Buneas');
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
                console.log("Daruis");
                
                
            } 
            return true;
        }    
        try{
            const idUsuario1 = req.params.idUsuario;
            //console.log(req.params);
            const data = {...req.body};
            if (data.idUsuario != idUsuario1){
                res.status(400).send(
                    {message: 'Data in body and query of request is different'}
                );
            }
            
            //console.log('CHAU');
            if (typeof(req.body.listaCantidadNivelesCompletadosGrupo) != "string"){
                res.status(400).send({message: 'Invalid list of completed levels by group format'});
            }
            else if(!checkLevelGroupList(req.body.listaCantidadNivelesCompletadosGrupo.toString())){
                res.status(422).send({message: 'At least one of completed levels by group is invalid'})
            }
            if (typeof(req.body.cantidadNivelesDiariosCompletados) != "number"){
                res.status(400).send({message: 'Invalid daily levels completed format'});
            }
            console.log('CHAU X2');
            if (typeof(req.body.cantidadPistas) != "number"){
                res.status(400).send({message: 'Invalid number of tracks format'});
            }
            if (typeof(req.body.mejorTiempoNivelDiario) != "number"){
                res.status(400).send({message: 'Invalid best daily level time format'});
            }
            if (typeof(req.body.cantidadVecesClasificacion1) != "number"){
                res.status(400).send({message: 'Invalid number of classification 1% format'});
            }
            
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
                res.status(200).send(
                    {message: 'Player succesfully deleted'}
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