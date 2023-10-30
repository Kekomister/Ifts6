import express from 'express';

const router = express.Router();

router.use(express.json());

const  { 
    getPaginas,
    getPaginasLegibles,
    getPaginaLegible,
    getConexion,
    createPagina,
    createConexionPagina,
    deletePagina,
    deleteConexion
} = require('../controllers/pagina')

router.get('/',getPaginas)

router.get('/legible',getPaginasLegibles)

router.get('/legible/:nombre',getPaginaLegible)

router.get('/conexion',getConexion)

router.post('/',createPagina)

router.post('/conexion',createConexionPagina)

router.delete('/:id',deletePagina)

router.delete('/conexion/:id',deleteConexion)

module.exports = router;