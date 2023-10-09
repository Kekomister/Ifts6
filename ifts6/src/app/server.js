const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const connection = mysql.createPool({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos'
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password]);

    if (rows.length > 0) {
        res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
        res.json({ success: false, message: 'Credenciales incorrectas' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
