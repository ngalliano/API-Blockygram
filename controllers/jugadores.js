import dailyLevelStatsModel from '../models/estadisticasNivelDiario.js';
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
                    res.status(400).send({message: 'Invalid number of tracks format'});
                }
                else if(req.body.cantidadPistas != 5){
                    aux += 1;
                    res.status(422).send({message: 'Invalid number of tracks value'});
                }
                if (typeof(req.body.cantidadPistasAux) != "number"){
                    aux += 1;
                    res.status(400).send({message: 'Invalid number of tracks aux format'});
                }
                else if(req.body.cantidadPistasAux != 0){
                    aux += 1;
                    res.status(422).send({message: 'Invalid number of tracks aux value'});
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
                /*const listaNivelesDiarios = await dailyLevelStatsModel.findAll({
                    where: {idUsuario: player.idUsuario},
                    atributes: ['tiempoResolucion', 'estadoClasificacion1', 'puestoClasificacion'],
                    order: [['tiempoResolucion', 'ASC']]
                });
                
                let cantidadClasificaciones = 0;
                listaNivelesDiarios.forEach(stat => {
                    if (stat.estadoClasificacion1 == true){
                        cantidadClasificaciones += 1;
                    }
                });
                
                const player2 = player.map((jugador) => ({
                    idUsuario: jugador.idUsuario,
                    nombreUsuario: jugador.nombreUsuario,
                    listaCantidadNivelesCompletadosGrupo: jugador.listaCantidadNivelesCompletadosGrupo,
                    cantidadNivelesDiariosCompletados: listaNivelesDiarios.length,
                    cantidadPistas : jugador.cantidadPistas,
                    mejorTiempoNivelDiario: listaNivelesDiarios[0].tiempoResolucion,
                    cantidadVecesClasificacion1: cantidadClasificaciones,
                    mejorPuestoClasificacionEnPorcentaje: jugador.mejorPuestoClasificacionEnPorcentaje,
                }))
                */
                 
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
            else if(!checkLevelGroupList(req.body.listaCantidadNivelesCompletadosGrupo.toString())){
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
            console.log('CHAU X2');
            if (typeof(req.body.cantidadPistas) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of tracks format'});
            }
            else if (req.body.cantidadPistas < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of tracks value'});
            }
            if (typeof(req.body.cantidadPistasAux) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid number of tracks aux format'});
            }
            else if(req.body.cantidadPistasAux < 0){
                aux += 1;
                res.status(422).send({message: 'Invalid number of tracks aux value'});
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
                const player = await playerModel.update({nombreUsuario:data.nombreUsuario,listaCantidadNivelesCompletadosGrupo:data.listaCantidadNivelesCompletadosGrupo, cantidadNivelesDiariosCompletados:data.cantidadNivelesDiariosCompletados,cantidadPistas:data.cantidadPistas,mejorTiempoNivelDiario:data.mejorTiempoNivelDiario,mejorPuestoClasificacionEnPorcentaje:data.mejorPuestoClasificacionEnPorcentaje,cantidadVecesClasificacion1:data.cantidadVecesClasificacion1},
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