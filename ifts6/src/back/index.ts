import express from 'express';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const publicacion = require("./routes/publicacion");
const sector = require("./routes/sector");
const usuario = require("./routes/usuario");

app.use("/publicacion",publicacion);
app.use("/sector",sector);
app.use("/usuario",usuario);

app.use('/my-virtual-directory',express.static(__dirname + '/public/images'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});