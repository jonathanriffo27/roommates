const nodemailer = require('nodemailer')

const transp = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mbensan.test@gmail.com',
    pass: 'mbensan.2022'
  }
})

function send (receivers, subject, html) {
  const options = {
    from: 'mbensan.test@gmail.com',
    //to: ['inzunzapaula1@gmail.com','javiera@plataforma5.la'],
    to: receivers,
    //subject: 'Eres la ganadora del sorteo millonario!!!',
    subject,
    html
    //html: `<a href="sitiopeligroso.php">Click aquí</a>`
  }
  console.log(options)
  transp.sendMail(options, () => {
    console.log('Email enviado');
  })
}
// send('mbensan@gmail.com', 'Prueba', '<h3>Hola, esto es una prueba</h3>')
module.exports = {send}