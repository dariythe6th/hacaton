// Расширенный редактор и анализатор формул с использованием MathJax

// Конфигурация MathJax
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
  svg: {
    fontCache: 'global'
  }
};

// Функция рендеринга формулы
function renderFormula() {
  const latexInput = document.getElementById('latexInput').value;
  const formulaOutput = document.getElementById('formulaOutput');

  formulaOutput.innerHTML = `\\(${latexInput}\\)`;
  MathJax.typesetPromise([formulaOutput]);
}

// Экспорт формулы в формат JSON
function exportLatex() {
  const latexInput = document.getElementById('latexInput').value;
  const jsonOutput = JSON.stringify({ formula: latexInput });

  console.log("Экспортированный LaTeX: ", jsonOutput);
  alert(`Экспортированный LaTeX: ${jsonOutput}`);
}

// Импорт формулы из JSON
function importLatex() {
  const jsonInput = prompt("Введите JSON с формулой:");
  try {
    const parsed = JSON.parse(jsonInput);
    document.getElementById('latexInput').value = parsed.formula;
    renderFormula();
  } catch (error) {
    alert("Ошибка: Неверный формат JSON.");
  }
}

// Сравнение формул (примерно)
function compareFormulas() {
  const latex1 = document.getElementById('latexInput').value;
  const latex2 = document.getElementById('compareInput').value;

  const similarity = calculateSimilarity(latex1, latex2);
  document.getElementById('comparisonResult').innerText = `Процент совпадений: ${similarity.toFixed(2)}%`;
}

// Алгоритм вычисления процента совпадений (упрощенный Левенштейн)
function calculateSimilarity(str1, str2) {
  const longer = str1.length >= str2.length ? str1 : str2;
  const shorter = str1.length < str2.length ? str1 : str2;

  if (longer.length === 0) return 100;

  const distance = levenshteinDistance(longer, shorter);
  return ((longer.length - distance) / longer.length) * 100;
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,       // Удаление
        matrix[j][i - 1] + 1,       // Вставка
        matrix[j - 1][i - 1] + cost // Замена
      );
    }
  }

  return matrix[b.length][a.length];
}
