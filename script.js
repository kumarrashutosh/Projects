const input = document.querySelector('input');

function append(char) {
  if (input.value === 'Error') {
    input.value = '';
  }
  input.value += char;
}

function clearAll() {
  input.value = '';
}

function removeLast() {
  input.value = input.value.slice(0, -1);
}

function calculate() {
  try {
    const result = Function('"use strict";return (' + input.value + ')')();
    input.value = result;
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
                       'Enter', 'Backspace', 'Delete'];

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
      clearAll();
      break;

    default:
      append(key);
      break;
  }
});
