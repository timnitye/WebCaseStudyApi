const express = require('express');
const app = express();

const confidenceRoutes = require('./api/routes/confidence');

app.use('/confidence', confidenceRoutes)

module.exports = app;