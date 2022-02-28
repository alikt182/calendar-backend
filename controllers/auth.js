const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async ( req, res = response )=>{
     
    
    // if ( name.length < 5 ) {
        //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe tener mínimo 5 letras'
    //     });
    // }

    // //manejo de errores
    // const errors = validationResult( req );
    // if ( !errors.isEmpty() ) {
        //     return res.status(400).json({
            //         ok: false,
            //         errors: errors.mapped()
            //     });
            // }
            
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne( { email })
        //console.log( usuario );

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'

            });
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch ( error ) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        })

    }
}

const loginUsuario = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {

        const usuario = await Usuario.findOne( { email })

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el correo'

            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch ( error ) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        })
    }
}

const revalidarToken = async ( req, res = response ) => {

    const { uid, name } = req;

    //Generar nuevo token
    //Generar JWT
    const token = await generarJWT( uid , name );

    res.json({
        ok: true,
        token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}


//db mongodb://mern_user:Otio8nfBhEDElW9J@cluster0-shard-00-00.51ify.mongodb.net:27017,cluster0-shard-00-01.51ify.mongodb.net:27017,cluster0-shard-00-02.51ify.mongodb.net:27017/test?replicaSet=atlas-ey71i2-shard-0&ssl=true&authSource=admin

// db user: mern_user
// db password: aBkmY1XYc4ixClxY

// alikt182
// 74axAenlNfRMTQMh

// mongodb+srv://mern_user:Otio8nfBhEDElW9J@cluster0.51ify.mongodb.net
// mongodb+srv://mern_user:Otio8nfBhEDElW9J@cluster0.51ify.mongodb.net/test

// mongodb+srv://mern_user:<password>@cluster0.51ify.mongodb.net/test
