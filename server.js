const express = require('express');
const path = require('path');
const figlet = require('figlet');

const logger = require('./logger');

var app = express();
var port = 3000;

app.use(express.static(path.join(__dirname, 'dashboard')));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    logger.info('Sirviendo index.html');
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.listen(port, () => {
    console.clear();
    console.log(figlet.textSync('Iwakura').green);
    logger.info(`Servidor corriendo en http://localhost:${port}`);
});