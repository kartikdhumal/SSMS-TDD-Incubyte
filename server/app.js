const express = require('express');
const authRouter = require('./routes/auth.router');
const sweetRouter = require('./routes/sweet.router');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetRouter);

module.exports = app;
