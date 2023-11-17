import { Request, Response } from 'express';

import * as sql from 'mssql';

const {
    config
} = require('../controllers/conection')

// id_Pagina : int, nombre : varchar, id_Sector : int | null

const getPaginas = (async (req: Request, res: Response) => {
    try {
        let paginas;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM Paginas');
        paginas = respuesta.recordset;
        //console.log("Paginas : ", paginas);
        res.send(paginas);
    } catch (e) {
        res.send(e);
    }
});

const getPagina = (async (req: Request, res: Response) => {
    try {
        let paginas;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request()
            .input('nom', sql.VarChar, req.params.nombre)
            .query(`SELECT * FROM Paginas WHERE nombre = @nom`);
        paginas = respuesta.recordset;
        //console.log("Paginas : ", paginas);
        res.send(paginas);
    } catch (e) {
        res.send(e);
    }
});

const getConexion = (async (req: Request, res: Response) => {
    try {
        let paginas;
        const pool = await new sql.ConnectionPool(config).connect();
        var respuesta = await pool.request().query('SELECT * FROM PaginasXSectores');
        paginas = respuesta.recordset;
        //console.log("Conexiones : ", paginas);
        res.send(paginas);
    } catch (e) {
        res.send(e);
    }
});

const getPaginasLegibles = (async (req: Request, res: Response) => {
    try {
        let paginas;
        const pool = await new sql.ConnectionPool(config).connect();
        let query = `SELECT 
        PaginasXSectores.id_Conexion, Sectores.id_Sector , Paginas.id_Pagina ,
        Sectores.descripcion,Paginas.nombre
        FROM Sectores
		LEFT JOIN PaginasXSectores ON Sectores.id_Sector = PaginasXSectores.id_Sector
		LEFT JOIN Paginas ON Paginas.id_Pagina = PaginasXSectores.id_Pagina`;
        var respuesta = await pool.request().query(query);
        paginas = respuesta.recordset;
        //console.log("Paginas : ", paginas);
        res.send(paginas);
    } catch (e) {
        res.send(e);
    }
});

const getPaginaLegible = (async (req: Request, res: Response) => {
    try {
        let paginas;
        const pool = await new sql.ConnectionPool(config).connect();
        let query = `SELECT 
        PaginasXSectores.id_Conexion, Paginas.id_Pagina,
        Paginas.nombre, Sectores.descripcion, Sectores.id_Sector
        FROM Paginas
		LEFT JOIN PaginasXSectores ON Paginas.id_Pagina = PaginasXSectores.id_Pagina
        LEFT JOIN Sectores ON Sectores.id_Sector = PaginasXSectores.id_Sector
		WHERE Paginas.nombre = @nom`;
        var respuesta =
            await pool.request().input('nom', sql.VarChar, req.params.nombre).query(query);
        paginas = respuesta.recordset;
        //console.log("Pagina : ", paginas);
        res.send(paginas);
    } catch (e) {
        res.send(e);
    }
});

const createPagina = (async (req: Request, res: Response) => {
    try {
        let pool = await new sql.ConnectionPool(config).connect();
        let query =
            `INSERT INTO Paginas (nombre) VALUES (@nom)`
        let result = await pool.request()
            .input('nom', sql.VarChar, req.body.nombre)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

// query?variable=''&variable=

const createConexionPagina = (async (req: Request, res: Response) => {
    try {
        let query = `INSERT INTO PaginasXSectores (id_Pagina,id_Sector) VALUES (@pag,@sec)`;
        let pool = await new sql.ConnectionPool(config).connect();

        let secID = req.body.sectores;
        
        if (secID == undefined) {
            secID = await pool.request()
            .query(`SELECT TOP 1 * FROM Sectores
            ORDER BY id_Sector DESC`);
            secID = secID.recordset[0].id_Sector;
        }
        console.log("SEC ID : AA");
        console.log(secID);

        let result = await pool.request()
            .input('pag', sql.Int, req.body.id_Pagina)
            .input('sec', sql.Int, secID)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const deletePagina = (async (req: Request, res: Response) => {
    try {
        let query = `DELETE Paginas WHERE id_Pagina = @id`;
        let pool = await new sql.ConnectionPool(config).connect();
        let result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(query);
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

const deleteConexion = (async (req: Request, res: Response) => {
    console.log(req.params.id);

    try {
        let query = `DELETE PaginasXSectores WHERE id_Conexion = @id`;
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
    getPaginas,
    getPagina,
    getPaginasLegibles,
    getPaginaLegible,
    getConexion,
    createPagina,
    createConexionPagina,
    deletePagina,
    deleteConexion
};