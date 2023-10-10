import express from "express";

const app = express();
app.use(express.json());
const port = 3000;

const publicacion = require("./routes/publicacion");
const sector = require("./routes/sector");
const usuario = require("./routes/usuario");

app.use("/publicaciones",publicacion);
app.use("/sector",sector);
app.use("/usuarios",usuario);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});