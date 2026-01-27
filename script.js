let display = document.getElementById('display');
let history = document.getElementById('history');

let screenText = ""; 
let calculationText = "";
let operators = ['+','-','*','/','^'];

function press(key) {
    if (display.innerText === "Error" || display.innerText === "0") {
        screenText = "";
        calculationText = "";
    }
    console.log(key);
    
    if(key === '.' && screenText.includes('.')){
        return;
    }

    if (operators.includes(key)) {
        if (screenText === '' && key !== '-') return;

        let lastChar = screenText.slice(-1);
        if (operators.includes(lastChar) && key !== '-') return;
    }


    if (key === 'l') {
        screenText = screenText + "log(";
        calculationText = calculationText + "Math.log10(";
    } else if (key === '^') {
        screenText = screenText + "^";
        calculationText = calculationText + "**";
    } else {
        screenText = screenText + key;
        calculationText = calculationText + key;
    }

    display.innerText = screenText;
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

function sinDegree(angle) {
    return Math.sin(angle * Math.PI / 180);
}
function cosDegree(angle) {
    return Math.cos(angle * Math.PI / 180);
}
function tanDegree(angle) {
    return Math.tan(angle * Math.PI / 180);
}

function calculateSqrt() {
    try {
        let currentNum = eval(calculationText);
        let result = Math.sqrt(currentNum);

        history.innerText = "√(" + screenText + ")";
        display.innerText = result;

        screenText = result.toString();
        calculationText = result.toString();
    } catch (e) {
        display.innerText = "Error";
    }
}

function calculate() {
    if (screenText === "") return;

    try {
        let openBrackets = (calculationText.split("(").length - 1);
        let closeBrackets = (calculationText.split(")").length - 1);

        while (openBrackets > closeBrackets) {
            calculationText = calculationText + ")";
            screenText = screenText + ")";
            closeBrackets++;
        }

        history.innerText = screenText;

        let result = eval(calculationText);
        console.log(result);
        
        result = Math.round(result * 10000) / 10000;
        console.log(result);
        
        display.innerText = result;
        screenText = result.toString();
        calculationText = result.toString();
    } catch (err) {
        display.innerText = "Error";
    }
}

function clearAll() {
    screenText = "";
    calculationText = "";
    display.innerText = "0";
    history.innerText = "";
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

document.addEventListener('keydown', function (event) {
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
    } else if (k === 'l') {
        press('l');
    }
});