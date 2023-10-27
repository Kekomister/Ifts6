import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

const app = express();
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

const port = 3000;

const publicacion = require("./routes/publicacion");
const sector = require("./routes/sector");
const usuario = require("./routes/usuario");

app.use("/publicacion",publicacion);
app.use("/sector",sector);
app.use("/usuario",usuario);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});