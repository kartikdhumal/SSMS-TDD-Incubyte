const express = require('express');
const authRouter = require('./routes/auth.router');
const sweetRouter = require('./routes/sweet.router');

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetRouter);

module.exports = app;
