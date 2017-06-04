#!/usr/bin/env node

var express = require('express'),
    app = express(),
    port = +(process.env.PORT || 3000), //cast to number
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    smtpHost = process.env.SMTP_HOST,
    smtpPort = process.env.SMTP_PORT,
    user = process.env.MAIL_USER,
    pass = process.env.MAIL_PASS;
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: user,
        pass: pass
    }
});

function sendMail(req, res) {
    if (!req.body) return res.sendStatus(400);
    try {

        var mailOptions = {
            from: '"info@enodia.io" <info@enodia.io>', // sender address
            to: req.body.to, // list of receivers
            subject: 'Enodia Mail Service ✔', // Subject line
            text: req.body.mail // plain text body
        };
        console.log('Sending email using mail options', mailOptions);
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.sendStatus(500);
                console.log(error);
            }
            res.sendStatus(200);
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    } catch (err) {
        console.error('Failed sending email', err.stacktrace);

    }
}


//Convenience for allowing CORS on routes - GET only
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.set('case sensitive routing', false);
app.post('/sendmail', jsonParser, sendMail); // server html files

app.listen(port, function() {
    console.log('listening');
});
