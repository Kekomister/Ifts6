import express from 'express';
import multer from 'multer';

const router = express.Router();
var upload = multer({ dest: './.uploads' })

router.use(express.json());

const  { 
    getPublicacion,
    getPublicacionLegible,
    createPublicacion,
    updatePublicacion,
    deletePublicacion
} = require('../controllers/publicacion')

router.get('/',getPublicacion)

router.get('/legible',getPublicacionLegible)

router.post('/', upload.any(),createPublicacion)

router.put('/:id', upload.any(),updatePublicacion)

router.delete('/:id',deletePublicacion)

module.exports = router;