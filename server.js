const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Подключение к базе данных PostgreSQL
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'formulas_db',
    password: 'your_password',
    port: 5432,
});

app.use(bodyParser.json());

// Маршрут для сохранения формулы
app.post('/api/formulas', async (req, res) => {
    const { formula } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO formulas (formula) VALUES ($1) RETURNING *',
            [formula]
        );
        res.json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        console.error('Error saving formula:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Маршрут для получения всех формул
app.get('/api/formulas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM formulas');
        res.json({ status: 'success', data: result.rows });
    } catch (error) {
        console.error('Error fetching formulas:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Маршрут для сравнения формул
app.post('/api/formulas/compare', async (req, res) => {
    const { formula } = req.body;
    try {
        const result = await pool.query('SELECT formula FROM formulas');
        const formulas = result.rows.map(row => row.formula);

        // Простой алгоритм сравнения
        const similarities = formulas.map(dbFormula => {
            const similarity = calculateSimilarity(formula, dbFormula);
            return { dbFormula, similarity };
        });

        res.json({ status: 'success', data: similarities });
    } catch (error) {
        console.error('Error comparing formulas:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Пример расчёта процента сходства
function calculateSimilarity(formula1, formula2) {
    const common = formula1.split('').filter(char => formula2.includes(char)).length;
    return Math.floor((2 * common / (formula1.length + formula2.length)) * 100);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
