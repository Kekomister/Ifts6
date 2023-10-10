import express from 'express';

const router = express.Router();

router.use(express.json());

const  { 
    getPublicacion,
    createPublicacion,
    updatePublicacion,
    updatePublicacionCampo,
    deletePublicacion
} = require('../controllers/publicacion')

router.get('/',getPublicacion)

router.post('/',createPublicacion)

router.put('/:id',updatePublicacion)

router.put('/:id/:campo',updatePublicacionCampo)

router.delete('/:id',deletePublicacion)

module.exports = router;