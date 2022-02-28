const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async ( req , res = response ) => {

    const eventos = await Evento.find()
                                .populate('user','name');

    res.json({
        ok: true,
        eventos
    })

} 

const crearEvento = async ( req , res = response ) => {

    //Verificar que tenga el evento
    //console.log( req.body );

    const evento = new Evento( req.body );

    try {

        //En el esquema tenemos especificado el id del usuario
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear evento'
        });
    }
} 

const actualizarEvento = async ( req , res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch ( error ) {
        console.log( error ),   
        res.status(500).json({
            ok: false,
            msg: 'Error al editar evento'
        });
    }
} 

const deleteEvento = async ( req , res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            msg: 'Evento Eliminado'
        });

    } catch ( error ) {
        console.log( error ),   
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar evento'
        });
    }
} 

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    deleteEvento
}