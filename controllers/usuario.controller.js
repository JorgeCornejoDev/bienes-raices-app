import { check, validationResult } from 'express-validator'
// Importamos el modelo para la gestión de las base de datos
import Usuario from '../models/Usuario.js'
import { generarToken } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'

const formularioLogin = (req,res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
       
    });
};

const formularioRegistro = ( req,res ) => {
    
    console.log("csrfToken:" + req.csrfToken());
    
    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
};

const registrar = async ( req, res ) => {

    // validamos formulario 
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El correo es incorrecto').run(req)
    await check('password').isLength({min: 6}).withMessage('Debe contener por lo menos 6 caracteres').run(req)
    await check('repetirPassword').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    let resultado = validationResult(req)
    
    // Verficiar que el resultado esta vacio de errores para poder registrar los usuarios 
    if(!resultado.isEmpty()) {
        // Agregamos a muestra vista los errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    // verficiar que el usuario no este duplicado
    const { email,nombre,password } = req.body;
    const existeUsuario = await Usuario.findOne( { where : { email }})
    if( existeUsuario ) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    
    // aLmacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarToken()
    })

    // Eviamos email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de confirmación
    res.render('template/confirmacion', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Se ha enviado un mensaje a su correo electrónico, favor de presionar el enlace para confirmar su cuenta'
    })
    
};

const confirmar = async ( req, res ) => {

    const { token } = req.params


    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token}})

    if( !usuario ) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Lo sentimos, hubo un error en tu confirmación, intenta de nuevo',
            error: true
        })
    }

    // confirmamos y limpiamos token - cambio de usuario a confirmado
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Confirmación exitosa',
        mensaje: 'Gracias por confirmar en BienesRaices.com'
    })
    
}


const formularioResetPassword = ( req,res ) => {
    res.render('auth/reset-pass', {
        pagina: 'Reestablecer password'
    });
}


export {
    formularioLogin,
    formularioRegistro,
    confirmar,
    formularioResetPassword,
    registrar
}