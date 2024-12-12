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

// Сравнение формул
function compareFormulas() {
  const formula1 = document.getElementById('latexInput').value;
  const formula2 = document.getElementById('comparisonInput').value;

  const similarity = calculateSimilarity(formula1, formula2);
  const comparisonResult = document.getElementById('comparisonResult');

  comparisonResult.innerHTML = `Сходство: ${similarity}%`;

  highlightDifferences(formula1, formula2);
}

// Подсчёт сходства (простой пример)
function calculateSimilarity(formula1, formula2) {
  if (formula1 === formula2) return 100;

  const common = formula1.split('').filter(char => formula2.includes(char)).length;
  return Math.floor((2 * common / (formula1.length + formula2.length)) * 100);
}

// Подсветка различий
function highlightDifferences(formula1, formula2) {
  const formulaOutput = document.getElementById('formulaOutput');
  formulaOutput.innerHTML = `\\(${formula1}\\)<br>\\(${formula2}\\)`;

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, formulaOutput]);
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
// Сравнение двух формул
function compareFormulas() {
  const formula1 = document.getElementById('latexInput').value;
  const formula2 = document.getElementById('comparisonInput').value;

  const similarity = calculateSimilarity(formula1, formula2);
  const comparisonResult = document.getElementById('comparisonResult');
  comparisonResult.innerHTML = `Сходство: ${similarity}%`;

  highlightDifferences(formula1, formula2);
}

// Подсветка совпадающих частей формул
function highlightDifferences(formula1, formula2) {
  const output = document.getElementById('formulaOutput');
  const common = findCommonElements(formula1, formula2);
  const highlighted = formula1.split('').map(char => {
      return common.includes(char) ? `<span class="highlight">${char}</span>` : char;
  }).join('');

  output.innerHTML = highlighted;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, output]);
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
  const formula = document.getElementById('latexInput').value;
  fetch('/api/formulas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formula }),
  })
      .then(response => response.json())
      .then(data => {
          alert('Формула сохранена!');
          console.log(data);
      })
      .catch(error => console.error('Error:', error));
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