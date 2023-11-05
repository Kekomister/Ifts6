const config = {
    user: 'admin6',
    password: 'ifts6',
    // DESKTOP-EHIVGLA\SQLEXPRESS
    server: 'localhost',
    // TENES QUE ESPECIFICARLE LA BASE DE DATOS A LA QUE SE LE ASIGNO EN
    // SQL SERVER -> LOGIN -> USER MAPPING
    // Y EL NIVEL DE PERMISO
    //database: 'prueba',
    database: 'prueba_leppen',
    options: {
        // PARA CONECTARSE DIRECTAMENTE CON WINDOWS
        // trustedConnection : true,
        encrypt: false, // Deshabilitar el uso de SSL
    },
  };

  
module.exports = {
    config
}