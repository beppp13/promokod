
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Проверка сервера
app.get('/api', (req, res) => {
    res.json({ message: 'Сервер PROmokod работает!' });
});

// Получение всех промокодов
app.get('/api/coupons', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, title, code, category AS cat,
                   status, description AS "desc"
            FROM promo_codes
            ORDER BY id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка загрузки' });
    }
});

// Добавление промокода
app.post('/api/coupons', async (req, res) => {
    try {
        const { title, code, cat, status, desc } = req.body;

        const result = await pool.query(`
            INSERT INTO promo_codes
            (title, code, category, status, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [title, code, cat, status, desc]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления' });
    }
});

// Изменение промокода
app.put('/api/coupons/:id', async (req, res) => {
    try {
        const { title, code, cat, status, desc } = req.body;

        const result = await pool.query(`
            UPDATE promo_codes
            SET title = $1, code = $2, category = $3,
                status = $4, description = $5
            WHERE id = $6
            RETURNING *
        `, [title, code, cat, status, desc, req.params.id]);

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Промокод не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения' });
    }
});

// Удаление промокода
app.delete('/api/coupons/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM promo_codes WHERE id = $1 RETURNING id',
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Промокод не найден' });
        }

        res.json({ message: 'Промокод удалён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
