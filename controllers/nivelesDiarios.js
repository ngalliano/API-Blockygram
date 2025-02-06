import dailyLevelModel from '../models/nivelesDiarios.js';

class dailyLevelController{
    constructor(){

    }

    validateInputs(input){
        let day = '';
        let month = '';
        let year = '';
        function isValidIL(fecha){
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
            if (parseInt(year) > 2023){
                if (parseInt(month) == 2){
                    if ((parseInt(year) % 4 == 0 && parseInt(year) % 100 != 0) || (parseInt(year) % 4 == 0 && parseInt(year) % 100 == 0 && parseInt(year) % 400 == 0)){
                        if(parseInt(day)>=1 && parseInt(day) <=29){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        if (parseInt(day)>=1 && parseInt(day) <=28){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
                else if (parseInt(month) == 1 || parseInt(month) == 3 || parseInt(month) == 5 || parseInt(month) == 7 || parseInt(month) == 8 || parseInt(month) == 10 || parseInt(month) == 12){
                    if (parseInt(day)>=1 && parseInt(day) <=31){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else if (parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11){
                    if (parseInt(day)>=1 && parseInt(day) <=30){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
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
                if((parseFloat(lista[i]) - parseInt(lista[i]) != 0) || parseInt(lista[i]) < 0 || parseInt(lista[i]) > input.tipoNivel*(input.tipoNivel-1)*2){
                    return false;
                }
            }
            return true;  
        }
        function isValidLPL(listaaux){
            const lista1 = listaaux.split(',');
            const lista2 = [];
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
        class Resultado{
            constructor (code, messageR){
                this.code = code;
                this.messageR = messageR;
            }
        }
        if (typeof(input.idNivel) != "number"){
            return new Resultado(400, 'Invalid level id format');
        }
        else if (!isValidIL(input.idNivel)){ 
            return new Resultado(422, 'Invalid level id value');
        }
        if (typeof(input.tipoNivel) != "number"){
            return new Resultado(400, 'Invalid level type format');
        }
        else if (!isValidTL(input.tipoNivel)){
            return new Resultado(422, 'Invalid level type value');
        }
        if (typeof(input.estructuraNivel) != "string"){
            return new Resultado(400, 'Invalid level structure format');
        }
        else if (input.estructuraNivel.length != Math.pow(input.tipoNivel,2) || !isValidLE(input.estructuraNivel)){
            return new Resultado(422, 'Invalid level structure value');
        }
        if (typeof(input.estructuraParedes) != "string"){
            return new Resultado(400, 'Invalid walls structure format');
        }
        else if (!isValidWE(input.estructuraParedes)){
            return new Resultado(422, 'Invalid walls structure value');
        }
        if (typeof(input.listaPiezasNivel) != "string"){
            return new Resultado(400, 'Invalid level piece list format');
        }
        else if (!isValidLPL(input.listaPiezasNivel)){
            return new Resultado(422, 'Invalid level piece list value');
        }
        else{
            return new Resultado(200,'OK');
        }
    }

    async create (req, res) {
        try{
            const object = new dailyLevelController()            
            const aux = object.validateInputs(req.body);
            if (aux.code == 200){
                const dailyLevel = await dailyLevelModel.create(req.body);
                if (dailyLevel)
                    res.status(201).send({message: 'Daily level created succesfully'});
            }
            else{
                res.status(aux.code).send({message: aux.messageR});
            }
            object = null;
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
            console.log(fecha2);    
            res.status(200).send(fecha2);
        }
        catch{
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
            const object = new dailyLevelController()            
            const aux = object.validateInputs(req.body);
            if (aux.code == 200){
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
            else{
                res.status(aux.code).send({message: aux.messageR});
            }
            object = null;
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