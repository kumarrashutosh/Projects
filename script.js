const input = document.querySelector('input');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Initialize theme from localStorage or default to light
function initTheme() {
  const savedTheme = localStorage.getItem('calculatorTheme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Toggle between light and dark theme
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Update icon
  if (document.body.classList.contains('dark-mode')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('calculatorTheme', 'dark');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('calculatorTheme', 'light');
  }
});

function append(char) {
  if (input.value === 'Error') {
    input.value = '';
  }
  
  // Replace the math symbols with more visually appealing ones on display
  let displayChar = char;
  switch(char) {
    case '*':
      displayChar = '×';
      break;
    case '-':
      displayChar = '−';
      break;
    case '/':
      displayChar = '÷';
      break;
  }
  
  input.value += displayChar;
}

function clearAll() {
  input.value = '';
}

function removeLast() {
  if (input.value === 'Error') {
    input.value = '';
    return;
  }
  
  input.value = input.value.slice(0, -1);
}

function calculate() {
  try {
    // Convert display symbols back to calculation operators
    let expression = input.value
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/÷/g, '/');
    
    const result = Function('"use strict";return (' + expression + ')')();
    
    // Format the result to avoid excessive decimal places
    input.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
  } catch (error) {
    input.value = 'Error';
  }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (input.value === 'Error') {
    input.value = '';
  }

  const allowedKeys = ['0','1','2','3','4','5','6','7','8','9',
                      '+','-','*','/','.', '%',
                      'Enter', 'Backspace', 'Delete', 'Escape'];

  if (!allowedKeys.includes(key)) return;

  event.preventDefault();

  switch(key) {
    case 'Enter':
      calculate();
      break;

    case 'Backspace':
      removeLast();
      break;

    case 'Delete':
    case 'Escape':
      clearAll();
      break;

    default:
      append(key);
      break;
  }
});

// Initialize theme on page load
initTheme();
