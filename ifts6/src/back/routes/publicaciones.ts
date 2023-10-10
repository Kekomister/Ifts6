import express from 'express';
import {Request, Response} from 'express';

import * as sql from 'mssql';

const router = express.Router();

router.use(express.json());

const  { 
    config
} = require('../controllers/conection')

router.get('/', async (req : Request, res : Response) => {
    try{
        let publicaciones;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Publicaciones');
        publicaciones = respuesta.recordset;
        console.log("Publicaciones : ", publicaciones);
        res.send(publicaciones);
    }catch(e){
        res.send(e);
    }
});

// router.get('/', async (req : Request, res : Response) => {
//     try{
//         let tipo_producto;
//         const pool = await new sql.ConnectionPool(config).connect();
//         var respuesta = await pool.request().query('SELECT * FROM TipoProducto');
//         tipo_producto = respuesta.recordset;
//         console.log("Tipos de productos : ", tipo_producto);
//         res.send(tipo_producto);
//     }catch(e){
//         res.send(e);
//     }
// });

// router.post('/', async (req : Request, res : Response) => {
//     try{
//         let pool = await new sql.ConnectionPool(config).connect();
    
//         //let query = `INSERT INTO Alumnos (nombre, apellido, dni, email) 
//         //             VALUES ('${alumno.nombre}','${alumno.apellido}',${alumno.dni},'${alumno.email}')`
        
//         // VALUES (@ + nombre variable que le vas a poner en input)
//         let query = `INSERT INTO TipoProducto (descripcion) VALUES (@desc)`
//         let result = await pool.request()
//             .input('desc',sql.VarChar, req.body.descripcion)
//             .query(query);
//         res.send(result);
//     }catch(e){
//         res.send(e);
//     }
// })

// router.put('/:id', async (req : Request, res : Response) => {
//     try{
//         let query = `UPDATE TipoProducto SET descripcion = @desc WHERE id=@id`;
//         let pool = await new sql.ConnectionPool(config).connect();
//         let result = await pool.request()
//             .input('desc',sql.VarChar, req.body.descripcion)
//             .input('id',sql.Int,req.params.id)
//             .query(query);
//         res.send(result);
//     }catch(e){
//         res.send(e);
//     }
// })

// router.delete('/:id',async (req : Request, res : Response) => {
//     try{
//         let query = `DELETE TipoProducto WHERE id=@id`;
//         let pool = await new sql.ConnectionPool(config).connect();
//         let result = await pool.request()
//             .input('id',sql.Int, req.params.id)
//             .query(query);
//         res.send(result);
//     }catch(e){
//         res.send(e);
//     }
// })

module.exports = router;
//export default router;