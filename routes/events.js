/*
    Rutas de Eventos
    host + /api/events
 */

const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, deleteEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Todas tienen que pasar por la validación de JWT
router.use( validarJWT );

router.get(
    '/', 
    getEventos );


router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento );


router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento );


router.delete(
    '/:id',
    deleteEvento );

module.exports = router;