import playerController from "./controllers/jugadores.js";
import dailyLevelController from "./controllers/nivelesDiarios.js";
import dailyLevelStatController from "./controllers/estadisticasNivelDiario.js";
import levelModeLevelStatController from "./controllers/estadisticasNivelModoNiveles.js";


const rutas = [
    // Player Routes
    {
        method: "POST",
        url: "/jugadores",
        handler: playerController.create,
    },
    {
        method: "GET",
        url: "/jugadores",
        handler: playerController.getAll, 
    },
    {
        method: "GET",
        url: "/jugadores/:idUsuario",
        handler: playerController.getOne, 
    },
    {
        method: "PUT",
        url: "/jugadores/:idUsuario",
        handler: playerController.update,
    },
    {
        method: "DELETE",
        url: "/jugadores/:idUsuario",
        handler: playerController.delete,
    },
    // Daily Level Routes
    {
        method: "POST",
        url: "/nivelesDiarios",
        handler: dailyLevelController.create,
    },
    {
        method: "GET",
        url: "/nivelesDiarios",
        handler: dailyLevelController.getAll, 
    },
    {
        method: "GET",
        url: "/nivelesDiarios/fechaActual",
        handler: dailyLevelController.getDate, 
    },
    {
        method: "GET",
        url: "/nivelesDiarios/:idNivel",
        handler: dailyLevelController.getOne, 
    },
    {
        method: "PUT",
        url: "/nivelesDiarios/:idNivel",
        handler: dailyLevelController.update,
    },
    {
        method: "DELETE",
        url: "/nivelesDiarios/:idNivel",
        handler: dailyLevelController.delete,
    },
    // Daily Level Stat Routes
    {
        method: "POST",
        url: "/estadisticasnivelesDiarios",
        handler: dailyLevelStatController.create,
    },
    {
        method: "GET",
        url: "/estadisticasnivelesDiarios",
        handler: dailyLevelStatController.getAll, 
    },
    {
        method: "GET",
        url: "/estadisticasnivelesDiarios/top20",
        handler: dailyLevelStatController.getTop20, 
    },
    {
        method: "GET",
        url: "/estadisticasnivelesDiarios/topJugador/:idUsuario",
        handler: dailyLevelStatController.getPlayerPositionGroup, 
    },
    {
        method: "GET",
        url: "/estadisticasnivelesDiarios/:data1",
        handler: dailyLevelStatController.getOne, 
    },
    {
        method: "PUT",
        url: "/estadisticasnivelesDiarios/:data",
        handler: dailyLevelStatController.update,
    },
    {
        method: "DELETE",
        url: "/estadisticasnivelesDiarios/:data",
        handler: dailyLevelStatController.delete,
    },
    // Level Mode Level Stat Routes
    {
        method: "POST",
        url: "/estadisticasnivelesModoNiveles",
        handler: levelModeLevelStatController.create,
    },
    {
        method: "GET",
        url: "/estadisticasnivelesModoNiveles",
        handler: levelModeLevelStatController.getAll, 
    },
    {
        method: "GET",
        url: "/estadisticasnivelesModoNiveles/:data1",
        handler: levelModeLevelStatController.getOne, 
    },
    {
        method: "PUT",
        url: "/estadisticasnivelesModoNiveles/:data",
        handler: levelModeLevelStatController.update,
    },
    {
        method: "DELETE",
        url: "/estadisticasnivelesModoNiveles/:data",
        handler: levelModeLevelStatController.delete,
    },
]

export default rutas;