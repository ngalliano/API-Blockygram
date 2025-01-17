import dailyLevelModel from '../models/nivelesDiarios.js';

class dailyLevelController{
    constructor(){

    }

    async create (req, res) {
        try{
            let aux = 0;
            let day = '';
            let month = '';
            let year = '';
            function isValidIL(fecha){
                //console.log(fecha);
                if (fecha.toString().length == 7){
                    day = fecha.toString()[0];
                    month = fecha.toString().slice(1,3);
                    year = fecha.toString().slice(3);
                }
                else if(fecha.toString().length == 8){
                    day = fecha.toString().slice(0,2);
                    month = fecha.toString().slice(2,4);
                    year = fecha.toString().slice(4);
                }
                else{
                    return false;
                }
                //console.log(day);
                month = (parseInt(month)).toString();
                //console.log(month);
                //console.log(year);
                const fecha2 = month + '/' + day + '/' + year;
                console.log(fecha2);
                const fecha3 = new Date(fecha2);
                console.log(fecha3.getTime()); 
                //console.log(isNaN(fecha3.getTime()));
                if (isNaN(fecha3.getTime())){
                    return false;
                }
                else{
                    return true;
                }    
            }
            function isValidTL(a){
                return (a == 5 || a == 6 || a == 7);
            }
            function isValidLE(lista){
                //console.log(lista);
                for(let i=0; i<lista.length; i++){
                    //console.log(lista[i] != "0"|| lista[i] != "1" || lista[i] != "2");
                    if (lista[i] == "0" || lista[i] == "1" || lista[i] == "2"){
                        
                    }
                    else{
                        return false;
                    }
                }
                return true;
            }
            function isValidWE(listaaux){
                const lista = listaaux.split(',');
                for (let i=0; i<lista.length; i++){
                    //console.log(lista[i]);
                    if((parseFloat(lista[i]) - parseInt(lista[i]) != 0) || parseInt(lista[i]) < 0 || parseInt(lista[i]) > req.body.tipoNivel*(req.body.tipoNivel-1)*2){
                        return false;
                    }
                }
                return true;  
            }
            function isValidLPL(listaaux){
                const lista1 = listaaux.split(',');
                let lista2 = [];
                let lista3 = [];
                lista1.forEach(element => {
                    lista2.push(element.split(':'));
                });
                //console.log(lista2);
                //console.log(lista2.length);
                for (let i=0; i<lista2.length; i++){
                    //console.log(parseInt(lista2[i][0]));
                    if(parseInt(lista2[i][0]) != lista2[i][2].length){
                        return false;
                    }
                }
                return true;
            }
            //console.log(isValidIL(req.body.idNivel));
            if (typeof(req.body.idNivel) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid level id format'});
            }
            else if (!isValidIL(req.body.idNivel)){ 
                aux += 1;
                res.status(422).send({message: 'Invalid level id value'});
            }
            if (typeof(req.body.tipoNivel) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid level type format'});
            }
            else if (!isValidTL(req.body.tipoNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level type value'});
            }
            if (typeof(req.body.estructuraNivel) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid level structure format'});
            }
            else if (req.body.estructuraNivel.length != Math.pow(req.body.tipoNivel,2) || !isValidLE(req.body.estructuraNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level structure value'});
            }
            if (typeof(req.body.estructuraParedes) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid walls structure format'});
            }
            else if (!isValidWE(req.body.estructuraParedes)){
                aux += 1;
                res.status(422).send({message: 'Invalid walls structure value'});
            }
            //console.log(req.body.listaPiezasNivel);
            if (typeof(req.body.listaPiezasNivel) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid level piece list format'});
            }
            else if (!isValidLPL(req.body.listaPiezasNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level piece list value'});
            }
            if (aux == 0){
                const dailyLevel = await dailyLevelModel.create(req.body);
                if (dailyLevel)
                    res.status(201).send({message: 'Daily level created succesfully'});
            }
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
            let aux = 0;
            function isValidTL(a){
                return (a == 5 || a == 6 || a == 7);
            }
            function isValidLE(lista){
                //console.log(lista);
                for(let i=0; i<lista.length; i++){
                    //console.log(lista[i] != "0"|| lista[i] != "1" || lista[i] != "2");
                    if (lista[i] == "0" || lista[i] == "1" || lista[i] == "2"){
                        
                    }
                    else{
                        return false;
                    }
                }
                return true;
            }
            function isValidWE(listaaux){
                const lista = listaaux.split(',');
                for (let i=0; i<lista.length; i++){
                    //console.log(lista[i]);
                    if((parseFloat(lista[i]) - parseInt(lista[i]) != 0) || parseInt(lista[i]) < 0 || parseInt(lista[i]) > req.body.tipoNivel*(req.body.tipoNivel-1)*2){
                        return false;
                    }
                }
                return true;  
            }
            function isValidLPL(listaaux){
                const lista1 = listaaux.split(',');
                let lista2 = [];
                let lista3 = [];
                lista1.forEach(element => {
                    lista2.push(element.split(':'));
                });
                //console.log(lista2);
                //console.log(lista2.length);
                for (let i=0; i<lista2.length; i++){
                    //console.log(parseInt(lista2[i][0]));
                    if(parseInt(lista2[i][0]) != lista2[i][2].length){
                        return false;
                    }
                }
                return true;
            }
            //console.log(isValidIL(req.body.idNivel));
            if (typeof(req.body.tipoNivel) != "number"){
                aux += 1;
                res.status(400).send({message: 'Invalid level type format'});
            }
            else if (!isValidTL(req.body.tipoNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level type value'});
            }
            console.log(aux);
            if (typeof(req.body.estructuraNivel) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid level structure format'});
            }
            else if (req.body.estructuraNivel.length != Math.pow(req.body.tipoNivel,2) || !isValidLE(req.body.estructuraNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level structure value'});
            }
            if (typeof(req.body.estructuraParedes) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid walls structure format'});
            }
            else if (!isValidWE(req.body.estructuraParedes)){
                aux += 1;
                res.status(422).send({message: 'Invalid walls structure value'});
            }
            //console.log(req.body.listaPiezasNivel);
            if (typeof(req.body.listaPiezasNivel) != "string"){
                aux += 1;
                res.status(400).send({message: 'Invalid level piece list format'});
            }
            else if (!isValidLPL(req.body.listaPiezasNivel)){
                aux += 1;
                res.status(422).send({message: 'Invalid level piece list value'});
            }
            if (aux == 0){
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