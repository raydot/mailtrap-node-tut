const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const validator = require('validator')
const nodemailer = require('nodemailer')
const app = express()
const port = 8001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

// pull in the creds
var env = process.env.NODE_ENV || 'development'
var config = require('./config')[env]

app.post('/email', (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    const err = new Error('Invalid e-mail address!')
    err.status = 400
    return next(err)
  }

  const mailOptions = {
    from: '"Dave Rules Email" <daverules@daverules.com>',
    to: req.body.email,
    subject: 'Email Test',
    text: 'This is an email test to verify Dave Rules Mailtrap.io'
  }

  const transporter = nodemailer.createTransport({
    host: config.mailtrap.host,
    port: config.mailtrap.port,
    auth: {
      user: config.mailtrap.auth.user,
      pass: config.mailtrap.auth.pass
    }
  })

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
      return next (err)
    }
    console.log('Info: ', info)
    res.json({
      message: 'The email made it!'
    })
  })
})

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  })
})

app.listen(port, () => {
  console.log(`Jammin to some e-mail on port:${port}`)
})


