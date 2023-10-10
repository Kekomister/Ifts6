import { Request, Response } from 'express';

import * as sql from 'mssql';

const {
    config
} = require('../controllers/conection')

// id_Sector : int, descripcion : varchar

const getSector = (async (req: Request, res: Response) => {
    try {
        let sectores;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Sectores');
        sectores = respuesta.recordset;
        console.log("Sectores : ", sectores);
        res.send(sectores);
    } catch (e) {
        res.send(e);
    }
});

const createSector = (async (req: Request, res: Response) => {
    try {
        let pool = await new sql.ConnectionPool(config).connect();

        //let query = `INSERT INTO Alumnos (nombre, apellido, dni, email) 
        //             VALUES ('${alumno.nombre}','${alumno.apellido}',${alumno.dni},'${alumno.email}')`

        // VALUES (@ + nombre variable que le vas a poner en input)
        let query =
            `INSERT INTO Sectores (id_Sector, descripcion) VALUES (@id, @desc)`
        let result = await pool.request()
            .input('id', sql.Int, req.body.id_Sector)
            .input('desc', sql.VarChar, req.body.descripcion)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const updateSector = (async (req: Request, res: Response) => {
    try {
        let query = `UPDATE Sectores SET descripcion = @desc WHERE id_Sector = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('desc', sql.VarChar, req.body.descripcion)
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const deleteSector = (async (req: Request, res: Response) => {
    try {
        let query = `DELETE Sectores WHERE id_Sector = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

module.exports = {
    getSector,
    createSector,
    updateSector,
    deleteSector
};