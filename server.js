const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;
app.use(express.static('public'));

app.use(bodyParser.json());

// Путь к файлу, где будут храниться формулы
const formulasFilePath = './formulas.json';

// Проверка существования файла и создание его, если не существует
if (!fs.existsSync(formulasFilePath)) {
  fs.writeFileSync(formulasFilePath, JSON.stringify([])); // Пустой массив формул
}

// Сохранение формулы в файл
app.post('/api/formulas', (req, res) => {
  const { formula } = req.body;
  if (!formula) {
    return res.status(400).json({ error: 'Formula is required' });
  }

  // Чтение текущих формул из файла
  fs.readFile(formulasFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading formulas file' });
    }

    const formulas = JSON.parse(data);
    const newFormula = { formula, createdAt: new Date() };

    formulas.push(newFormula); // Добавляем новую формулу в массив
    fs.writeFile(formulasFilePath, JSON.stringify(formulas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving formula' });
      }
      res.status(201).json({ message: 'Formula saved', formula: newFormula });
    });
  });
});

// Сравнение формул
app.post('/api/formulas/compare', (req, res) => {
  const { formula } = req.body;
  if (!formula) {
    return res.status(400).json({ error: 'Formula is required' });
  }

  // Чтение текущих формул из файла
  fs.readFile(formulasFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading formulas file' });
    }

    const storedFormulas = JSON.parse(data);

    // Массив для хранения результатов сравнения
    const results = storedFormulas.map((storedFormula) => {
      const similarity = calculateSimilarity(formula, storedFormula.formula);
      return { dbFormula: storedFormula.formula, similarity };
    });

    res.json({ data: results });
  });
});

// Простой метод для подсчета сходства формул (реальная логика может быть сложнее)
function calculateSimilarity(formula1, formula2) {
    // Убираем пробелы для чистоты сравнения
    const clean1 = formula1.replace(/\s+/g, '');
    const clean2 = formula2.replace(/\s+/g, '');
  
    // Если формулы идентичны
    if (clean1 === clean2) {
      return 100;
    }
  
    // Преобразуем формулы в массив символов
    const set1 = new Set(clean1.split(''));
    const set2 = new Set(clean2.split(''));
  
    // Считаем пересечение
    const intersection = [...set1].filter(char => set2.has(char)).length;
  
    // Считаем объединение
    const union = new Set([...set1, ...set2]).size;
  
    // Коэффициент Жаккара: (пересечение / объединение) * 100
    const similarity = (intersection / union) * 100;
  
    return Math.round(similarity);
  }
  

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
