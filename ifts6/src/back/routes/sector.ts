import express from 'express';

const router = express.Router();

router.use(express.json());

const  { 
    getSector,
    createSector,
    updateSector,
    deleteSector
} = require('../controllers/sector')

router.get('/',getSector)

router.post('/',createSector)

router.put('/:id',updateSector)

router.delete('/:id',deleteSector)

module.exports = router;