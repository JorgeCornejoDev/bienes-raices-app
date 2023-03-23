import nodemailer from 'nodemailer'

const mensajeHTML = (nombre,token) => {
    return `
        <p>Hola ${ nombre }, bienvenido a BienesRaices.com</p>
        
        <p>Tu cuenta esta lista para ser activada, solo debemos confirmar en el siguiente enlace: </p>
        <p><a href="${process.env.BACKEND_URL}:${process.env.PORT || 3000}/auth/confirmar/${token}">Activar mi cuenta de BienesRaices.com</a></p>


        <span>Si tu no creaste esta cuenta, puedes ignorar el mensaje</span>
    
    `

}


const emailRegistro = async datos => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const { email, nombre, token } = datos
    //   Enviar email
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirmar tu cuenta en BienesRaices.com',
        text: 'Por favor ayudanos a confirmar tu cuenta',
        html: mensajeHTML(nombre,token),
      })
}


export {

    emailRegistro,
}