const display = document.getElementById('display');
const history = document.getElementById('history');

const allSciBtn = document.getElementById('all-btn-scientific');
const memoryHeader = document.querySelector('.memory-header p');
const memoryContainer = document.querySelector('.memory-content');

let inputArr = [];
let currentInput = "";
let isDegree = true;
let memoryArr = [];

allSciBtn.addEventListener("click", (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if (key) {
        press(key);
        return;
    }

    switch (action) {
        case 'equals': scientificCalc(); break;
        case 'backspace': backspace(); break;
        case 'clear': clearAll(); break;

        case 'deg': deg(); break;
        case 'mc': mc(); break;
        case 'mr': mr(); break;
        case 'm+': mAdd(); break;
        case 'm-': mRem(); break;
        case 'ms': ms(); break;

        case 'sin': sin(); break;
        case 'cos': cos(); break;
        case 'tan': tan(); break;
        case 'cot': cot(); break;
        case 'sec': sec(); break;
        case 'cosec': cosec(); break;

        case 'nF': nF(); break;
        case '1Bx': oneBx(); break;
        case 'modX': modX(); break;
        case 'exp': exp(); break;
        case 'e': ee(); break;
        case 'pi': pi(); break;

        case 'xR2': xR2(); break;
        case 'sqrt': sqrt(); break;
        case '10Rx': tenRx(); break;
        case '&lpar': lpar(); break;
        case '&rpar': rpar(); break;
        case 'log': logerithum(); break;
        case 'ln': ln(); break;
        case '+/-': plusMinus(); break;
    }
})

document.addEventListener('keydown', function (event) {
    event.preventDefault();
    const k = event.key;

    if (!isNaN(k) || k === '.' || ['+', '-', '*', '/', '^', '%'].includes(k)) {
        press(k);
    } else if (k === 'Enter') {
        scientificCalc();
    } else if (k === 'Backspace') {
        backspace();
    } else if (k === 'Escape') {
        clearAll();
    }
});

function roundFigure(val) {
    return Math.round(val * 10000) / 10000;
}
function displayFn() {
    display.innerText = currentInput || "0";
    console.log(inputArr);

    history.innerText = inputArr.join('');
}

function press(key) {
    if (!isNaN(key) || key === '.') {
        if (key === '.' && currentInput.includes('.')) return;
        currentInput += key;
    }
    else {
        if (currentInput === "" && inputArr.length === 0) return;

        if (currentInput !== "") {
            inputArr.push(currentInput);
            currentInput = "";
        }

        const lastItem = inputArr[inputArr.length - 1];
        if (['+', '-', '*', '/', '^', '%'].includes(lastItem)) {
            inputArr[inputArr.length - 1] = key;
        } else {
            inputArr.push(key);
        }
    }
    displayFn();
}

function scientificCalc() {
    if (currentInput !== "") {
        inputArr.push(currentInput);
        currentInput = "";
    }

    let temp = [...inputArr];

    let openCount = inputArr.filter(x => x === "(").length;
    let closeCount = inputArr.filter(x => x === ")").length;
    while (openCount > closeCount) {
        inputArr.push(")");
        closeCount++;
    }

    while (inputArr.includes("(")) {
        let startIndex = inputArr.lastIndexOf("(");

        let endIndex = inputArr.indexOf(")", startIndex);

        if (endIndex === -1) break;
        let subExpression = inputArr.slice(startIndex + 1, endIndex);

        calculateBlock(subExpression);

        inputArr.splice(startIndex, endIndex - startIndex + 1, subExpression[0]);
    }

    calculateBlock(inputArr);

    if (inputArr.length > 0) {
        let finalResult = inputArr[0];
        currentInput = roundFigure(finalResult).toString();
    }
    console.log(inputArr);

    history.innerText = temp.join('');
    display.innerText = currentInput || "0";
    inputArr = [];
}

function calculateBlock(arr) {
    while (arr.includes("^")) {
        let index = arr.indexOf("^");
        let d = Math.pow(parseFloat(arr[index - 1]), parseFloat(arr[index + 1]));
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }

    while (arr.includes("/")) {
        let index = arr.indexOf("/");
        let d = parseFloat(arr[index - 1]) / parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }

    while (arr.includes("%")) {
        let index = arr.indexOf("%");
        let d = parseFloat(arr[index - 1]) % parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }

    while (arr.includes("*")) {
        let index = arr.indexOf("*");
        let d = parseFloat(arr[index - 1]) * parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }

    while (arr.includes("+")) {
        let index = arr.indexOf("+");
        let d = parseFloat(arr[index - 1]) + parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }

    while (arr.includes("-")) {
        let index = arr.indexOf("-");
        let d = parseFloat(arr[index - 1]) - parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1);
        arr.splice(index - 1, 1);
    }
}

function backspace() {
    if (currentInput !== "") {
        currentInput = currentInput.slice(0, -1);
    } else {
        inputArr.pop();
    }
    displayFn();
}

export function clearAll() {
    inputArr = [];
    currentInput = "";
    display.innerText = "0";
    history.innerText = "";
}

function getAngle(val) {
    if (isDegree) {
        return val * (Math.PI / 180);
    } else {
        return val;
    }
}
function deg() {
    isDegree = !isDegree;
    const degBtn = document.querySelector('[data-action="deg"]');
    degBtn.innerText = isDegree ? "DEG" : "RAD";
}

function sin() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = roundFigure(Math.sin(angle)).toString();
    displayFn();
}

function cos() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = roundFigure(Math.cos(angle)).toString();
    displayFn();
}

function ten() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = roundFigure(Math.tan(angle)).toString();
    displayFn();
}

function cot() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.tan(angle);
    currentInput = roundFigure(1 / val).toString();
    displayFn();
}

function sec() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.cos(angle);
    currentInput = roundFigure(1 / val).toString();
    displayFn();
}

function cosec() {
    if (currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.sin(angle);
    currentInput = roundFigure(1 / val).toString();
    displayFn();
}

function nF() {
    if (currentInput === "") return;
    let num = parseInt(currentInput);
    if (num < 0) return;
    
    let res = 1;
    for (let i = 1; i <= num; i++) {
        res *= i;
    }
    currentInput = res.toString();
    displayFn();
}


function oneBx() {
    if (currentInput === "") return;
    currentInput = roundFigure(1 / parseFloat(currentInput)).toString();
    displayFn();
}

function modX() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.abs(parseFloat(currentInput))).toString();
    displayFn();
}

function exp() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.exp(parseFloat(currentInput))).toString();
    displayFn();
}

function ee() {
    currentInput = roundFigure(Math.E).toString();
    displayFn();
}

function pi() {
    currentInput = roundFigure(Math.PI).toString();
    displayFn();
}

function xR2() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.pow(parseFloat(currentInput), 2)).toString();
    displayFn();
}

function sqrt() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.sqrt(parseFloat(currentInput))).toString();
    displayFn();
}

function tenRx() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.pow(10, parseFloat(currentInput))).toString();
    displayFn();
}

function logerithum() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.log10(parseFloat(currentInput))).toString();
    displayFn();
}

function ln() {
    if (currentInput === "") return;
    currentInput = roundFigure(Math.log(parseFloat(currentInput))).toString();
    displayFn();
}

function plusMinus() {
    if (currentInput === "") return;
    currentInput = roundFigure(parseFloat(currentInput) * -1).toString();
    displayFn();
}

function lpar() {
    if (currentInput !== "") {
        inputArr.push(currentInput);
        currentInput = "";
    }
    inputArr.push("(");
    console.log(`from lpar ${inputArr}`);

    displayFn();
}

function rpar() {
    if (currentInput !== "") {
        inputArr.push(currentInput);
        currentInput = "";
    }
    inputArr.push(")");
    console.log(`from rpar ${inputArr}`);
    displayFn();
}

//--------------Memory Fun---------------------

function ms() {
    let valToStore = currentInput === "" ? "0" : currentInput;
    if (memoryArr.length > 0 && memoryArr[0] === parseFloat(valToStore)) {
        return;
    }
    memoryArr.unshift(parseFloat(valToStore));
    updateMemoryUI();
}

function mr() {
    if (memoryArr.length === 0) return;
    let topValue = memoryArr[0];
    currentInput = topValue.toString();
    displayFn();
}

function mAdd() {
    if (memoryArr.length === 0) {
        ms();
        return;
    }

    let valToAdd = parseFloat(currentInput === "" ? "0" : currentInput);
    memoryArr[0] += valToAdd;
    updateMemoryUI();
}

function mRem() {
    if (memoryArr.length === 0) {
        let valToStore = currentInput === "" ? "0" : currentInput;
        memoryArr.unshift(-parseFloat(valToStore));
        updateMemoryUI();
        return;
    }

    let valToSub = parseFloat(currentInput === "" ? "0" : currentInput);
    memoryArr[0] -= valToSub;
    updateMemoryUI();
}

function mc() {
    memoryArr = [];
    updateMemoryUI();
}

function updateMemoryUI() {
    memoryContainer.innerHTML = "";

    if (memoryArr.length === 0) {
        memoryHeader.innerText = "Memory's empty";
    } else {
        memoryHeader.innerText = "";
        memoryArr.forEach((val) => {
            const memItem = document.createElement("div");
            memItem.className = "p-2 text-right text-xl font-bold hover:bg-gray-600 cursor-pointer border-b border-gray-600 break-words mr-1";
            memItem.innerText = val;
            memoryContainer.appendChild(memItem);
        });
    }
}
