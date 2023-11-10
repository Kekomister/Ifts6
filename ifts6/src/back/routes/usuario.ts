import express from 'express';

const router = express.Router();

router.use(express.json());

const  { 
    getUsuario,
    getUsuarioLegible,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuario')

router.get('/',getUsuario)

router.get('/legible',getUsuarioLegible)

router.post('/',createUsuario)

router.put('/:id',updateUsuario)

router.delete('/:id',deleteUsuario)

module.exports = router;