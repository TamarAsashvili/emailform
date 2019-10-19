const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder (public)

app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', { layout: false });
});

app.post('/send', (req, res) => {
    const output = `
    <p>you have new contact request</p>
    <h3>contact Details</h3>
    <ul>
    <i>Name: ${req.body.name}</i>
     <i>Company: ${req.body.company}</i>
      <i>Email: ${req.body.email}</i>
       <i>Phone: ${req.body.phone}</i>
    
    </ul>
        <h3>Message</h3>
      <p>  ${req.body.message} </p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'asashvi@gmail.com', // generated ethereal user
            pass: 'password' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <asashvi@gmail.com>', // sender address
        to: 'ab@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world Tamuna', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
});

app.listen(3000, () => console.log('Server started...'));