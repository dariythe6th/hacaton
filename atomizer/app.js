// Функция для рендеринга формулы
function renderFormula() {
  const latexInput = document.getElementById('latexInput').value;
  const formulaOutput = document.getElementById('formulaOutput');

  // Используем MathJax для рендеринга LaTeX в HTML
  formulaOutput.innerHTML = `\\(${latexInput}\\)`;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, formulaOutput]);
}

// Функция для экспорта LaTeX
function exportLatex() {
  const latexInput = document.getElementById('latexInput').value;
  const jsonOutput = JSON.stringify({ formula: latexInput });

  // Логика экспорта, например, вывод в консоль
  console.log("Экспортированный LaTeX: ", jsonOutput);
  alert(`Экспортированный LaTeX: ${jsonOutput}`);
}
