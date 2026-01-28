import { calculateBasic } from "./operation/basic-operation.js";
import {operators} from "../operators.js"

const display = document.getElementById('display');
const history = document.getElementById('history');

const allButtons = document.querySelector('.all-btn');

let screenText = ""; 
let calculationText = "";

allButtons.addEventListener("click", (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if(key) {
        press(key)
        return;
    }

    switch (action) {
        case 'sin':
            scientific('s');
            break;
        case 'cos':
            scientific('c');
            break;
        case 'tan':
            scientific('t');
            break;
        case 'sqrt':
            calculateSqrt();
            break;
        case 'backspace':
            backspace();
            break;
        case 'equals':
            calculate();
            break;
        case 'clear':
            clearAll();
            break;
}})

document.addEventListener('keydown', function (event) {
    event.preventDefault();
    let k = event.key;

    let allowed = ['1','2','3','4','5','6','7','8','9','0','.','+','-','*','/','^','%','l'];
    if (allowed.includes(k)) {
        press(k);
    } else if (k === 'Enter') {
        calculate();
    } else if (k === 'Backspace') {
        backspace();
    } else if (k === 'Escape') {
        clearAll();
    } else if (k === 's') {
        scientific('s');
    } else if (k === 'c') {
        scientific('c');
    } else if (k === 't') {
        scientific('t');
    }
});

function press(key) {
    if (display.innerText === "Error" || display.innerText === "0") {
        screenText = "";
        calculationText = "";
    }
    console.log(`key: ${key}`);
    
    if (key === '.') {
        const lastChar = screenText.slice(-1);

        if (screenText === '' || operators.has(lastChar) || lastChar === '(') {
            screenText += '0.';
            calculationText += '0.';
            display.innerText = screenText;
            return;
        }

        const lastNumber = screenText.split(/[+\-*/^()]/).pop();
        if (lastNumber.includes('.')) return;
        console.log(`calculationText: ${calculationText}`);
    }

    if (operators.has(key)) {
        let lastChar = screenText.slice(-1);

        // 1. Handle Start of Expression or Bracket
        // If screen is empty OR last char is '(', ONLY allow minus
        if (screenText === '' || lastChar === '(') {
            if (key === '-') {
                screenText += '-';
                calculationText += '-';
                display.innerText = screenText;
                return;
            } else {
                // If it's *, /, +, etc. at the start, do nothing (block it)
                return;
            }
        }

        // 2. Handle Double Operators (e.g., "5++")
        // If the last character is already an operator, block the new one
        if (operators.has(lastChar)) {
            return;
        }
    }

    if (key === 'l') {
        screenText = screenText + "log(";
        calculationText = calculationText + "Math.log10(";
    } else if (key === '^') {
        screenText = screenText + "^";
        calculationText = calculationText + "^";
    } else {
        screenText = screenText + key;
        calculationText = calculationText + key;
    }

    display.innerText = screenText;
}


function calculate() {
    if (screenText === "") return;

    try {
        // let openBrackets = (calculationText.split("(").length - 1);
        // let closeBrackets = (calculationText.split(")").length - 1);

        let openBrackets = (calculationText.match(/\(/g) || []).length;
        let closeBrackets = (calculationText.match(/\)/g) || []).length;

        while (openBrackets > closeBrackets) {
            calculationText = calculationText + ")";
            screenText = screenText + ")";
            closeBrackets++;
        }

        history.innerText = screenText;

        let result = calculateBasic(calculationText);
        console.log(`result: ${result}`);
        
        result = Math.round(result * 10000) / 10000;
        console.log(`round up result: ${result}`);
        
        display.innerText = result;
        screenText = result.toString();
        calculationText = result.toString();
    } catch (err) {
        display.innerText = "Error in evalution ";
    }
}


function scientific(type) {
    if (display.innerText === "Error") {
        clearAll();
    }

    if (type === 's') {
        screenText = screenText + "sin(";
        calculationText = calculationText + "sinDegree(";
    } else if (type === 'c') {
        console.log("this is cos");
        
        screenText = screenText + "cos(";
        calculationText = calculationText + "cosDegree(";
    } else if (type === 't') {
        screenText = screenText + "tan(";
        calculationText = calculationText + "tanDegree(";
    }

    display.innerText = screenText;
}

function clearAll() {
    screenText = "";
    calculationText = "";
    display.innerText = "0";
    history.innerText = "";

    if (document.activeElement) {
        document.activeElement.blur();
    }
}

function backspace() {
    screenText = screenText.slice(0, -1);
    calculationText = calculationText.slice(0, -1);

    if (screenText === "") {
        display.innerText = "0";
    } else {
        display.innerText = screenText;
    }
}

function calculateSqrt() {
    try {
        let currentNum = calculate(calculationText);
        let result = Math.sqrt(currentNum);

        history.innerText = "√(" + screenText + ")";
        display.innerText = result;

        screenText = result.toString();
        calculationText = result.toString();
    } catch (e) {
        display.innerText = "Error in calculateSqrt";
    }
}
