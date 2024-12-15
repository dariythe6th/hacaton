// Рендеринг формулы
function renderFormula() {
  const latexInput = document.getElementById('latexInput').value;
  const formulaOutput = document.getElementById('formulaOutput');

  formulaOutput.innerHTML = `\\(${latexInput}\\)`;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, formulaOutput]);
}

// Экспорт формулы в JSON
function exportLatex() {
  const latexInput = document.getElementById('latexInput').value;
  const jsonOutput = JSON.stringify({ formula: latexInput });

  console.log("Экспортированный LaTeX: ", jsonOutput);
  alert(`Экспортированный LaTeX: ${jsonOutput}`);

  // Создание Blob с JSON содержимым
  const blob = new Blob([jsonOutput], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Создание временной ссылки для скачивания файла
  const link = document.createElement('a');
  link.href = url;
  link.download = 'latex_formula.json';  // Название файла для скачивания
  link.click();

  // Освобождение созданного URL
  URL.revokeObjectURL(url);
}


// Импорт формулы из JSON
function importLatex() {
  const fileInput = document.getElementById('latexFile');
  fileInput.click();
  fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const data = JSON.parse(e.target.result);
              document.getElementById('latexInput').value = data.formula || '';
              renderFormula();
          };
          reader.readAsText(file);
      }
  };
}

// Сравнение формул с учетом структуры и степеней
function compareFormulas() {
  const formula1 = document.getElementById('latexInput').value;
  const formula2 = document.getElementById('comparisonInput').value;

  const similarity = calculateStructuralSimilarity(formula1, formula2);
  const comparisonResult = document.getElementById('comparisonResult');
  comparisonResult.innerHTML = `Сходство: ${similarity}%`;

  // Показать новое поле с выделением
  showComparisonHighlight(formula1, formula2);
}

// Подсчёт структурного сходства с учётом содержимого и степеней
function calculateStructuralSimilarity(formula1, formula2) {
  const parsedFormula1 = parseLatex(formula1);
  const parsedFormula2 = parseLatex(formula2);

  if (compareParsedFormulas(parsedFormula1, parsedFormula2)) {
    return 100;
  }

  const common = calculateCommonStructure(parsedFormula1, parsedFormula2);
  const maxElements = Math.max(countElements(parsedFormula1), countElements(parsedFormula2));

  return Math.floor((common / maxElements) * 100);
}

// Сравнение парсенных формул с учетом структуры и степеней
function compareParsedFormulas(parsedFormula1, parsedFormula2) {
  if (parsedFormula1.length !== parsedFormula2.length) {
    return false;
  }

  for (let i = 0; i < parsedFormula1.length; i++) {
    if (parsedFormula1[i] !== parsedFormula2[i]) {
      return false;
    }
  }
  return true;
}

// Расширенный парсинг LaTeX-формулы
function parseLatex(latex) {
  return latex
    .replace(/\s+/g, '') // Убираем пробелы
    .replace(/\left|\right/g, '') // Убираем скобочные элементы
    .replace(/\sqrt\{(.*?)\}/g, (_, content) => `sqrt(${parseLatex(content)})`)
    .replace(/\frac\{(.*?)\}\{(.*?)\}/g, (_, num, denom) => `(${parseLatex(num)})/(${parseLatex(denom)})`)
    .replace(/\^{([^}]+)}/g, (_, exp) => `^(${parseLatex(exp)})`)
    .replace(/\{([^}]+)}/g, (_, content) => `(${parseLatex(content)})`)
    .split(/([+\-*/^=()])/).filter(Boolean); // Разбиваем формулу на элементы
}

// Подсчёт общих структурных элементов
function calculateCommonStructure(parsedFormula1, parsedFormula2) {
  const common = new Set(parsedFormula1.filter(el => parsedFormula2.includes(el)));
  return common.size;
}

// Подсчёт общего числа элементов
function countElements(parsedFormula) {
  return parsedFormula.length;
}

// Обновленная подсветка различий
function showComparisonHighlight(formula1, formula2) {
  const parsedFormula1 = parseLatex(formula1);
  const parsedFormula2 = parseLatex(formula2);

  const comparisonFormula1 = document.getElementById('comparisonFormula1');
  const comparisonFormula2 = document.getElementById('comparisonFormula2');

  const highlightedFormula1 = highlightDifferences(parsedFormula1, parsedFormula2);
  const highlightedFormula2 = highlightDifferences(parsedFormula2, parsedFormula1);

  comparisonFormula1.innerHTML = highlightedFormula1;
  comparisonFormula2.innerHTML = highlightedFormula2;

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, comparisonHighlight]);
  openModal();
}

// Подсветка различий между формулами
function highlightDifferences(formula, reference) {
  return formula
    .map(el => reference.includes(el) ? `<span class="highlight">${el}</span>` : el)
    .join('');
}

// Вставка стандартного элемента в LaTeX
function insertElement(element) {
  const input = document.getElementById('latexInput');
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const text = input.value;

  input.value = text.slice(0, start) + element + text.slice(end);
  input.focus();
  input.setSelectionRange(start + element.length, start + element.length);
}


// Пример: поиск общих элементов (упрощённый)
function findCommonElements(formula1, formula2) {
  return formula1.split('').filter(char => formula2.includes(char));
}

// Отправка формулы на сервер (POST запрос)
function sendFormulaToServer(formula) {
  fetch('/api/formulas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formula })
  })
  .then(response => response.json())
  .then(data => console.log('Formula saved:', data))
  .catch(error => console.error('Error:', error));
}
// Сохранение формулы в базу данных
function saveFormula() {
  const formula = document.getElementById('latexInput').value.trim();
  if (!formula) {
    alert('Введите формулу перед сохранением!');
    return;
  }

  fetch('/api/formulas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formula }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.statusText}`);
      }
      return response.json();
  })
  .then(data => {
      alert('Формула успешно сохранена!');
      console.log('Ответ сервера:', data);
  })
  .catch(error => {
      console.error('Ошибка при сохранении формулы:', error);
      alert('Произошла ошибка при сохранении формулы.');
  });
}


// Получение и сравнение формул
function fetchAndCompare() {
  const formula = document.getElementById('latexInput').value;
  fetch('/api/formulas/compare', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formula }),
  })
      .then(response => response.json())
      .then(data => {
          const result = data.data;
          const comparisonResult = document.getElementById('comparisonResult');
          comparisonResult.innerHTML = result
              .map(item => `Формула: ${item.dbFormula}, Сходство: ${item.similarity}%`)
              .join('<br>');
      })
      .catch(error => console.error('Error:', error));
}

function openModal() {
  const modal = document.getElementById('comparisonHighlight');
  modal.style.display = 'flex'; // Показываем окно
}

// Закрыть модальное окно
function closeModal() {
  const modal = document.getElementById('comparisonHighlight');
  modal.style.display = 'none'; // Скрываем окно
}
