const display = document.getElementById('display');
const history = document.getElementById('history');

const allStdBtn = document.getElementById('all-btn-stn');

let firstValue = "";
let secondValue = "";
let operator = "";
let result;

allStdBtn.addEventListener("click", (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if (key) {
        press(key);
        return;
    }

    switch (action) {
        case 'equals':simpleCalculate();
            break;
        case 'backspace':backspace();
            break;
        case 'clear':clearAll();
            break;
    }
});

document.addEventListener('keydown', function (event) {
    event.preventDefault();
    const k = event.key;

    if (!isNaN(k) || k === '.' || ['+', '-', '*', '/', '^', '%'].includes(k)) {
        press(k);
    } else if (k === 'Enter') {
        simpleCalculate();
    } else if (k === 'Backspace') {
        backspace();
    } else if (k === 'Escape') {
        clearAll();
    }
});

function press(key) {
    if (display.innerText === "Error") clearAll();

    if (!isNaN(key) || key === '.') {
        append(key);
        return;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(key)) {
        setOperator(key);
    }
}

function append(value) {
    if (operator === "") {
        if (value === '.' && firstValue.includes('.')) return;
        firstValue += value;
    } else {
        if (value === '.' && secondValue.includes('.')) return;
        secondValue += value;
    }
    displayFn();
}

function setOperator(value) {
    if (firstValue === "") return;

    if (secondValue !== "") {
        simpleCalculate();
    }
    operator = value;
    displayFn();
}

function simpleCalculate() {
    if (!firstValue || !secondValue || !operator) return;


    switch (operator) {
        case '+':
            result = parseFloat(firstValue) + parseFloat(secondValue);
            break;
        case '-':
            result = parseFloat(firstValue) - parseFloat(secondValue);
            break;
        case '*':
            result = parseFloat(firstValue) * parseFloat(secondValue);
            break;
        case '/':
            if (parseFloat(secondValue) === 0) {
                display.innerText = "Error";
                clearAll();
                return;
            }
            result = parseFloat(firstValue) / parseFloat(secondValue);
            break;
        case '%':
            result = parseFloat(firstValue) % parseFloat(secondValue);
            break;
        case '^':
            result = parseFloat(firstValue) ** parseFloat(secondValue);
            break;
    }

    history.innerText = firstValue + operator + secondValue;
    result = Math.round(result * 10000) / 10000;
    firstValue = result.toString();
    secondValue = "";
    operator = "";
    display.innerText = firstValue;
}

function displayFn() {
    display.innerText = firstValue + operator + secondValue || 0;
}

function backspace() {
    if (secondValue !== "") {
        secondValue = secondValue.slice(0, -1);
    } else if (operator !== "") {
        operator = "";
    } else {
        firstValue = firstValue.slice(0, -1);
    }
    displayFn();
}

function clearAll() {
    firstValue = "";
    secondValue = "";
    operator = "";
    display.innerText = "0";
    history.innerText = "";
}