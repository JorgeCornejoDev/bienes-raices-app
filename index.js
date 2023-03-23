// Aplicación bienes raices marzo 2023
// const express = require('express');
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuariosRoutes.js';
import db from './config/db.js'




// Creamos la app 
const app = express();

// Habilitamos lectura de datos de formularios
app.use( express.urlencoded({ extended: true }));

// habilitar cookie parser
app.use( cookieParser() )
app.use( csrf({ cookie: true }))


// Conexión con nuestra base de datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexión con nuestra Base de datos exitosa");
} catch (error) {
    console.log(error);
}


// habilitar Pug como motoro HTML
app.set('view engine', 'pug');
app.set('views', './views');

// Routing
app.use('/auth', usuarioRoutes );

// Carpeta pública
app.use( express.static('public'));


// Definir un puerto y arranque el proyecto
const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log(`El servidor esta funcionando correctamente en el puerto ${port}`);
});