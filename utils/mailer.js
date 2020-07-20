const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = { 
    transporter: nodemailer.createTransport(sendgridTransport({
                        auth:{
                            api_key: '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'
                        }
                    }))
};