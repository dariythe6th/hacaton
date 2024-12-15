# Atomizer Formula Editor

**Atomizer Formula Editor** — это веб-приложение для работы с математическими формулами в формате LaTeX. Оно предоставляет пользователю интерфейс для создания, редактирования, сохранения, сравнения и экспорта формул. Приложение состоит из клиентской части, реализованной на HTML/JavaScript, и серверной части, работающей на Node.js.

## Особенности

- **Визуальное редактирование LaTeX-формул** с использованием MathJax.
- **Экспорт и импорт формул** в формате JSON.
- **Сохранение формул** в локальной базе данных (JSON-файл).
- **Сравнение формул**, включая оценку структурного сходства.
- **Подсветка различий** между формулами.

## Используемые технологии

- **Node.js**: Для работы сервера.
- **Express.js**: Для создания REST API.
- **MathJax**: Для рендеринга математических формул.
- **HTML/CSS**: Для интерфейса.
- **JavaScript**: Для обработки логики клиента.

---

## Установка

1. Убедитесь, что установлен [Docker](https://www.docker.com/).
2. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/dariythe6th/hacaton.git
   ```
3. Перейдите в директорию проекта:
   ```bash
   cd hacaton
   ```
4. Постройте и запустите контейнер Docker:
   ```bash
   docker-compose up --build
   ```

## Использование

1. Откройте браузер и перейдите по адресу: `http://localhost:5000`.
2. Введите формулу в поле редактора и наблюдайте визуализацию.
3. Используйте кнопки для:
   - Экспорта или импорта формулы в формате JSON.
   - Сохранения формулы в базу данных.
   - Сравнения формулы с другими сохраненными формулами.
  

## Клиентская часть

### Основные функции

#### Рендеринг формул

Функция `renderFormula` обновляет отображение формулы при изменении содержимого текстового поля.

```javascript
function renderFormula() {
  const latexInput = document.getElementById('latexInput').value;
  const formulaOutput = document.getElementById('formulaOutput');

  formulaOutput.innerHTML = `\(${latexInput}\)`;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, formulaOutput]);
}
```

#### Экспорт и импорт

- **Экспорт**: Функция `exportLatex` сохраняет формулу в файл JSON.
- **Импорт**: Функция `importLatex` загружает формулу из файла JSON.

#### Сравнение формул

Функция `compareFormulas` вычисляет структурное сходство между двумя введенными формулами.

```javascript
function compareFormulas() {
  const formula1 = document.getElementById('latexInput').value;
  const formula2 = document.getElementById('comparisonInput').value;

  const similarity = calculateStructuralSimilarity(formula1, formula2);
  document.getElementById('comparison2Result').innerHTML = `Сходство: ${similarity}%`;
}
```

---

## Серверная часть

### Конфигурация сервера

Сервер работает на порту `5000` и предоставляет API для сохранения и сравнения формул.


## API

### `POST /api/formulas`

Сохраняет формулу в базу данных.

**Параметры:**

- `formula` (string): Формула в формате LaTeX.

**Ответ:**

- `201 Created`: Формула успешно сохранена.
- `400 Bad Request`: Формула не предоставлена.

### `POST /api/formulas/compare`

Сравнивает формулу с сохраненными в базе данных.

**Параметры:**

- `formula` (string): Формула в формате LaTeX.

**Ответ:**

- `200 OK`: Список сохраненных формул с процентом схожести.
- `400 Bad Request`: Формула не предоставлена.

## Структура проекта

- `index.html`: Главная страница с редактором формул.
- `styles.css`: Стили страницы.
- `app.js`: Логика клиентской части для работы с формулами.
- `server.js`: Серверная часть на Node.js для хранения и сравнения формул.
- `formulas.json`: Локальная база данных для сохранения формул.
- `Dockerfile`: Конфигурация для Docker-образа.
- `docker-compose.yml`: Конфигурация Docker Compose.

## Лицензия

Этот проект распространяется под лицензией MIT.

