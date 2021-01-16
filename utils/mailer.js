const nodemailer = require('nodemailer');

module.exports = { 
    gmailTransporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        port: 587,
        auth:{
            user: 'jora.dust@gmail.com',
            pass: 'europe@2018'
        }        
    })
};