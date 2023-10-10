import express from 'express';

const router = express.Router();

router.use(express.json());

const  { 
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuario')

router.get('/',getUsuario)

router.post('/',createUsuario)

router.put('/:id',updateUsuario)

router.delete('/:id',deleteUsuario)

module.exports = router;