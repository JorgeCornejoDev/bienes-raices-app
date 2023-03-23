import express from 'express';
import { formularioLogin, 
         formularioRegistro, 
         registrar, 
         confirmar, 
         formularioResetPassword } from '../controllers/usuario.controller.js';

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar)
router.get('/reestablecer-password', formularioResetPassword);
    




export default router;