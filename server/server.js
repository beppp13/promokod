const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, '..')));

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        message: 'Сервер PROmok0d работает!'
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});