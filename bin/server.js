#!/usr/bin/env node

var express = require('express'),
    app = express(),
    port = +(process.env.PORT || 3000), //cast to number
    mailer = require('express-mailer'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    smtpHost = process.env.SMTP_HOST,
    smtpPort = process.env.SMTP_PORT,
    user = process.env.MAIL_USER,
    pass = process.env.MAIL_PASS,
    templates = process.cwd() + '/views';

mailer.extend(app, {
    from: '"info@enodia.io" <info@enodia.io>',
    host: smtpHost, // hostname
    secureConnection: true, // use SSL
    port: smtpPort, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: user,
        pass: pass
    }
});

app.set('views', templates);
app.set('view engine', 'jade');
//Convenience for allowing CORS on routes - GET only
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/email/register', jsonParser, function(req, res) {
    try {
        app.mailer.send('email', {
            to: req.body.to, // REQUIRED. This can be a comma delimited string just like a normal email to field.
            subject: 'Enodia Mail Service ✔' // REQUIRED.
            // otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
        }, function(err) {
            if (err) {
                // handle error
                console.log(err);
                res.status(500).send('There was an error sending the email');
            }
            res.send('Email Sent');
        });

    } catch (err) {
        console.log(e.stack);
        res.status(500).send('Errorrrrr!!');
    }
});


app.listen(port, function() {
    console.log('listening');
});
