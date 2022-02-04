const express = require('express');

//Crear el servidor de express
const app = express();

//Rutas
app.get('/', (req, res)=>{

    console.log('se requiere el /');
    res.json({
        ok: true
    })


})

//Escuchar Peticiones
app.listen( 4000,()=>{
    console.log(`Servidor corriendo en puerto ${ 4000 }`);
} )