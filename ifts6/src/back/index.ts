import express from "express";
import {Request, Response} from 'express';

import * as sql from 'mssql';

const app = express();
app.use(express.json());
const port = 3000;

const publicaciones = require("./routes/publicaciones");

app.use("/publicaciones",publicaciones);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});