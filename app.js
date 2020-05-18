const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');

const {connectionString, options} = require('./db/db');
const port = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
    res.send('Hello ... this is boutique');
});

mongoose.connect(connectionString, options)
    .then(res => {
        app.listen(port, () => console.log(colors.bgGreen(colors.black(`App is running on port:${port}`))))
    })
    .catch(err => { 
        console.log(colors.red(`Database failed to connect: ${err} `));
    });