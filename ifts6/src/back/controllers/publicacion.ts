import { Request, Response } from 'express';

import * as sql from 'mssql';

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const {
    config
} = require('../controllers/conection')

// id_Publicacion, titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector
//  int,           varchar,varchar,   varbinary,   date,             int,        int

const getPublicacion = (async (req: Request, res: Response) => {
    try {
        let publicaciones;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Publicaciones');
        publicaciones = respuesta.recordset;
        console.log("Publicaciones : ", publicaciones);
        res.send(publicaciones);
    } catch (e) {
        res.send(e);
    }
});

const createPublicacion = (async (req: Request, res: Response) => {
    fs.createReadStream(req.body.img);
    try {
        let pool = await new sql.ConnectionPool(config).connect();
        
        //let query = `INSERT INTO Alumnos (nombre, apellido, dni, email) 
        //             VALUES ('${alumno.nombre}','${alumno.apellido}',${alumno.dni},'${alumno.email}')`

        // VALUES (@ + nombre variable que le vas a poner en input)
        let query =
            `INSERT INTO Publicaciones 
        (titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector)
        VALUES (@titulo, @desc, @img, @fecha, @user, @sector)`
        let result = await pool.request()
            .input('titulo', sql.VarChar, req.body.titulo)
            .input('desc', sql.VarChar, req.body.descripcion)
            .input('img', sql.VarBinary, req.body.otto.jpg)
            .input('fecha', sql.Date, req.body.fecha_Publicacion)
            .input('user', sql.VarChar, req.body.id_Usuario)
            .input('sector', sql.VarChar, req.body.id_Sector)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const updatePublicacion = (async (req: Request, res: Response) => {
    try {
        let query =
        `UPDATE Publicaciones SET 
        titulo = @titulo,
        descripcion = @desc,
        imagen = @img,
        fecha_Publicacion = @fecha,
        id_Usuario = @user,
        id_Sector = @sector
        WHERE id_Publicacion = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('titulo', sql.VarChar, req.body.titulo)
            .input('desc', sql.VarChar, req.body.descripcion)
            .input('img', sql.VarBinary, req.body.imagen)
            .input('fecha', sql.Date, req.body.fecha_Publicacion)
            .input('user', sql.VarChar, req.body.id_Usuario)
            .input('sector', sql.VarChar, req.body.id_Sector)
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const updatePublicacionCampo = (async (req: Request, res: Response) => {
    try {
        let query =
        `UPDATE Publicaciones SET 
        ${req.params.campo} = @campo
        WHERE id_Publicacion = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('campo', sql.VarChar, req.body.campo)
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const deletePublicacion = (async (req: Request, res: Response) => {
    try {
        let query = `DELETE Publicaciones WHERE id_Publicacion = @id`;
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
    getPublicacion,
    createPublicacion,
    updatePublicacion,
    updatePublicacionCampo,
    deletePublicacion
};