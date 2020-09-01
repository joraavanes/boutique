const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = { 
    sendGridTransporter: nodemailer.createTransport(sendgridTransport({
                        auth:{
                            api_key: process.env.EMAIL_API_KEY
                        }
                    })),
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