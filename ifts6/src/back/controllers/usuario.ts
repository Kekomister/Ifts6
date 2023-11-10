import { Request, Response } from 'express';

import * as sql from 'mssql';

const {
    config
} = require('../controllers/conection')

// id_Usuario : int, nombre_Usuario : varchar, clave : varchar, rol : varchar

const getUsuario = (async (req: Request, res: Response) => {
    try {
        let usuarios;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Usuarios');
        usuarios = respuesta.recordset;
        console.log("Usuarios : ", usuarios);
        res.send(usuarios);
    } catch (e) {
        res.send(e);
    }
});

const getUsuarioLegible = (async (req: Request, res: Response) => {
    try {
        let usuarios;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query(
        `SELECT id_Usuario, nombre_Usuario, clave, Usuarios.id_Sector, descripcion
        FROM Usuarios
        INNER JOIN Sectores ON Usuarios.id_Sector = Sectores.id_Sector`);
        usuarios = respuesta.recordset;
        console.log("Usuarios : ", usuarios);
        res.send(usuarios);
    } catch (e) {
        res.send(e);
    }
});

const createUsuario = (async (req: Request, res: Response) => {
    try {
        let pool = await new sql.ConnectionPool(config).connect();
        let query =
            `INSERT INTO Usuarios (nombre_Usuario, clave, id_Sector) 
            VALUES (@nomUser, @clave, @secID)`
        let result = await pool.request()
            .input('nomUser', sql.VarChar, req.body.nombre_Usuario)
            .input('clave', sql.VarChar, req.body.clave)
            .input('secID', sql.VarChar, req.body.id_Sector)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const updateUsuario = (async (req: Request, res: Response) => {
    try {
        //console.log(req.body);
        
        let query =
            `UPDATE Usuarios SET 
            nombre_Usuario = @nomUser, 
            clave = @clave
            WHERE id_Usuario = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('nomUser', sql.VarChar, req.body.nombre_Usuario)
            .input('clave', sql.VarChar, req.body.clave)
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const deleteUsuario = (async (req: Request, res: Response) => {
    try {
        let query = `DELETE Usuarios WHERE id_Usuario = @id`;
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
    getUsuario,
    getUsuarioLegible,
    createUsuario,
    updateUsuario,
    deleteUsuario
};