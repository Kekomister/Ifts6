import { Request, Response } from 'express';

import * as sql from 'mssql';
import { Buffer } from 'buffer';
import folder from 'fs/promises';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';


const {
    config
} = require('../controllers/conection')

const multer = require("multer");
const path = require("path");
const fs = require('fs');

// id_Publicacion, titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector
//  int,           varchar,varchar,   varbinary,   date,             int,        int

const getPublicacion = (async (req: Request, res: Response) => {
    console.log("HELLO");
    try {
        let publicaciones;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Publicaciones');
        publicaciones = respuesta.recordset;
        console.log("Publicaciones : ", publicaciones);
        publicaciones = convertirAImagenes(publicaciones);
        res.send(publicaciones);
    } catch (e) {
        console.log(e);
    }
});

const getPublicacionesLegible = (async (req: Request, res: Response) => {
    try {
        let publicaciones;
        const pool = await new sql.ConnectionPool(config).connect();
        let query = `SELECT 
        id_Publicacion, titulo, Publicaciones.descripcion, imagen, fecha_Publicacion, 
        Sectores.descripcion as sector, Usuarios.nombre_Usuario 
        FROM Publicaciones
        INNER JOIN Sectores ON Sectores.id_Sector = Publicaciones.id_Sector
        INNER JOIN Usuarios ON Usuarios.id_Usuario = Publicaciones.id_Usuario
        ORDER BY fecha_Publicacion DESC`;
        var respuesta = await pool.request().query(query);
        publicaciones = respuesta.recordset;
        console.log("Publicaciones : ", publicaciones);
        publicaciones = convertirAImagenes(publicaciones);
        res.send(publicaciones);
    } catch (e) {
        console.log(e);
    }
});

const getPublicacionLegible = (async (req: Request, res: Response) => {
    try {
        let publicaciones;
        const pool = await new sql.ConnectionPool(config).connect();
        let query = `SELECT 
        id_Publicacion, titulo, Publicaciones.descripcion, imagen, fecha_Publicacion, 
        Sectores.descripcion as sector, Usuarios.nombre_Usuario 
        FROM Publicaciones
        INNER JOIN Sectores ON Sectores.id_Sector = Publicaciones.id_Sector
        INNER JOIN Usuarios ON Usuarios.id_Usuario = Publicaciones.id_Usuario
        WHERE id_Publicacion = @id`;
        var respuesta = await pool.request().input('id',sql.Int,req.params.id).query(query);
        publicaciones = respuesta.recordset;
        console.log("Publicacion : ", publicaciones);
        publicaciones = convertirAImagenes(publicaciones);
        res.send(publicaciones);
    } catch (e) {
        console.log(e);
    }
});

function convertirAImagenes(array: any) {
    console.log(array.length);
    for (let i = 0; i < array.length; i++) {
        array[i].imagen = Buffer.from(array[i].imagen).toString('base64');
    }
    return array;
}


dayjs.extend(utc);
dayjs.extend(timezone);

const createPublicacion = (async (req: Request, res: Response) => {
    let bod = req.body;
    console.log(req.body);
    
    let dat = new Date().toISOString();
    const timeZone: string = 'America/Buenos_Aires';
    const formattedDate = dayjs(dat).tz(timeZone).format('DD/MM/YYYY');
    //console.log(formattedDate); // Salida: 06/11/2023
    try {
        handleMultipartData(req, res, async (err: { message: any; }) => {
            if (err) {
                //res.json({ msgs: err.message });
            }
            let pool = await new sql.ConnectionPool(config).connect();

            let img = await convertirABuffer(req.files);

            let query =
                `INSERT INTO Publicaciones 
            (titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector)
            VALUES (@titulo, @desc, @img, @fecha, @user, @sector)`
            let result = await pool.request()
                .input('titulo', sql.VarChar, bod.titulo)
                .input('desc', sql.VarChar, bod.descripcion)
                .input('img', sql.VarBinary, img)
                .input('fecha', sql.Date, formattedDate)
                .input('user', sql.Int, bod.id_Usuario)
                .input('sector', sql.Int, bod.id_Sector)
                .query(query);
            vaciarCarpeta();
            res.send(result);
        });
    } catch (e) {
        console.log(e);
    }
})

async function vaciarCarpeta() {
    let dirPath = ".uploads";
    try {
        let files = await folder.readdir(dirPath);
        const deleteFilePromises = files.map(file =>
            folder.unlink(path.join(dirPath, file)),
        );
        await Promise.all(deleteFilePromises);
    } catch (e) {
        console.log(e);
    }
}

async function convertirABuffer(img: any) {
    console.log(img);

    return fs.readFileSync(img[0].path);
}

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => cb(null, ".uploads"), // cb -> callback
    filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single("image");


const updatePublicacion = (async (req: Request, res: Response) => {
    let bod = req.body;
    let img = Buffer.from(req.body.file);
    console.log(`Img : ${img}`);
    try {
        handleMultipartData(req, res, async (err: { message: any; }) => {
            if (err) {
                //res.json({ msgs: err.message });
                console.log("ERROR : " + err);
            }

            let pool = await new sql.ConnectionPool(config).connect();
            console.log(bod.fecha_Publicacion);
            
            //let img = await convertirABuffer(req.files);

            let query =
                `UPDATE Publicaciones SET 
        titulo = @titulo,
        descripcion = @desc,
        imagen = @img,
        fecha_Publicacion = @fecha,
        id_Usuario = @user,
        id_Sector = @sector
        WHERE id_Publicacion = @id`;
            let result = await pool.request()
                .input('titulo', sql.VarChar, bod.titulo)
                .input('desc', sql.VarChar, bod.descripcion)
                .input('img', sql.VarBinary, img)
                .input('fecha', sql.Date, new Date(Date.parse(bod.fecha_Publicacion)))
                .input('user', sql.Int, bod.id_Usuario)
                .input('sector', sql.Int, bod.id_Sector)
                .input('id', sql.Int, req.params.id)
                .query(query);
            vaciarCarpeta();
            res.send(result);
        });
    } catch (e) {
        console.log(e);
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
    getPublicacionesLegible,
    getPublicacionLegible,
    createPublicacion,
    updatePublicacion,
    deletePublicacion
};