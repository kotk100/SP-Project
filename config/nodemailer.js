var nodemailer = require('nodemailer');
var logger = require('./logger');

var transporter = nodemailer.createTransport({
    service: 'Zoho',
    auth: {
        user: 'registration@zbudim.se',
        pass: '9d755002e5f7523752110d7bf8d6f464'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendEmail: function(user, content){
        var mailOptions = {
            from: 'registration@zbudim.se', // sender address
            to: user.email, // list of receivers
            subject: 'Verify Account', // Subject line
            html: content // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Error sending email!', error);
            } else {
                logger.info('Email sent:' + info.response);
            }
        });
    },


};

