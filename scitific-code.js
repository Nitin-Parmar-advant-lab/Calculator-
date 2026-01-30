const display = document.getElementById('display');
const history = document.getElementById('history');

const allSciBtn = document.getElementById('all-btn-scientific');

// --- STATE VARIABLES ---
let inputArr = []; // Equivalent to friend's 'expression'
let currentInput = ""; // Equivalent to friend's 'currentNumber'
let memory = 0;        // Equivalent to friend's 'memoryValue'
let isDegree = true;   // To track DEG vs RAD mode

allSciBtn.addEventListener("click", (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const key = btn.dataset.key;
    const action = btn.dataset.action;

    // Handle Numbers and Operators
    if (key) {
        press(key);
        return;
    }

    // Handle Actions
    switch (action) {
        case 'equals': scientificCalc(); break;
        case 'backspace': backspace(); break;
        case 'clear': clearAll(); break;
        
        // Mode & Memory
        case 'deg': deg(); break;
        case 'mc': mc(); break;
        case 'mr': mr(); break;
        case 'm+': mAdd(); break;
        case 'm-': mRem(); break;
        case 'ms': ms(); break;

        // Trigonometry
        case 'sin': sin(); break;
        case 'cos': cos(); break;
        case 'ten': ten(); break;
        case 'cot': cot(); break;
        case 'sec': sec(); break;
        case 'cosec': cosec(); break;
        
        // Math Functions
        case 'nF': nF(); break; // Factorial
        case '1Bx': oneBx(); break; // Inverse
        case 'modX': modX(); break; // Absolute/Modulus
        case 'exp': exp(); break;
        case 'e': ee(); break;
        case 'pi': pi(); break;

        case 'xR2': xR2(); break; // Square
        case 'sqrt': sqrt(); break;
        case '10Rx': tenRx(); break; // 10^x
        case '&lpar': lpar(); break;
        case '&rpar': rpar(); break;
        case 'log': logerithum(); break;
        case 'ln': ln(); break;
    }
});

// Keyboard support
document.addEventListener('keydown', function (event) {
    if(document.getElementById('calculator-container').classList.contains('hidden')) return; // Prevent if hidden

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

// --- CORE LOGIC ---

function displayFn() {
    // Show the full array + what the user is currently typing
    display.innerText = inputArr.join(" ") + " " + currentInput;
    if(inputArr.length === 0 && currentInput === "") display.innerText = "0";
}

function press(key) {
    // If it is a number or decimal
    if (!isNaN(key) || key === '.') {
        if (key === '.' && currentInput.includes('.')) return;
        currentInput += key;
    } 
    // If it is an operator (+, -, *, /, ^, %)
    else {
        if (currentInput === "" && inputArr.length === 0) return; // Can't start with operator
        
        // If user types number then operator, push number first
        if (currentInput !== "") {
            inputArr.push(currentInput);
            currentInput = "";
        }
        
        // Logic to swap operator if user made a mistake (e.g. typed + then changed to *)
        const lastItem = inputArr[inputArr.length - 1];
        if (['+', '-', '*', '/', '^', '%'].includes(lastItem) && currentInput === "") {
            inputArr[inputArr.length - 1] = key; // Replace operator
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

    // --- PARENTHESIS LOGIC (From your Friend's Image) ---
    
    // Optional: Auto-close missing brackets to prevent errors
    let openCount = inputArr.filter(x => x === "(").length;
    let closeCount = inputArr.filter(x => x === ")").length;
    while(openCount > closeCount) {
        inputArr.push(")");
        closeCount++;
    }

    // Loop while there are brackets
    while (inputArr.includes("(")) {
        // Find the innermost opening bracket
        let startIndex = inputArr.lastIndexOf("(");
        
        // Find the matching closing bracket (search forward from start)
        let endIndex = inputArr.indexOf(")", startIndex);
        
        // If something is wrong and no closing bracket, break to avoid infinite loop
        if (endIndex === -1) break;

        // Cut out the part inside the brackets
        // .slice(start, end) creates a NEW array of just the inside stuff
        let subExpression = inputArr.slice(startIndex + 1, endIndex);
        
        // Calculate that small part
        calculateBlock(subExpression);

        // Put the result back into the main array
        // .splice removes the brackets and puts the result (subExpression[0]) in their place
        inputArr.splice(startIndex, endIndex - startIndex + 1, subExpression[0]);
    }

    // --- FINAL CALCULATION ---
    calculateBlock(inputArr);

    // Final Result Display
    if (inputArr.length > 0) {
        let finalResult = inputArr[0];
        // Rounding to avoid huge decimals
        finalResult = Math.round(finalResult * 100000000) / 100000000;
        currentInput = finalResult.toString(); 
        inputArr = [];
        history.innerText = "Ans = " + currentInput;
    }
    displayFn();
}

// This function calculates a specific array (used for brackets and final result)
function calculateBlock(arr) {
    // 1. Power (^)
    while(arr.includes("^")){
        let index = arr.indexOf("^");
        let d = Math.pow(parseFloat(arr[index - 1]), parseFloat(arr[index + 1]));
        arr[index] = d;
        arr.splice(index + 1, 1); 
        arr.splice(index - 1, 1); 
    }

    // 2. Division (/)
    while(arr.includes("/")){
        let index = arr.indexOf("/");
        let d = parseFloat(arr[index - 1]) / parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1); 
        arr.splice(index - 1, 1); 
    }

    // 3. Modulus (%)
    while(arr.includes("%")){
        let index = arr.indexOf("%");
        let d = parseFloat(arr[index - 1]) % parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1); 
        arr.splice(index - 1, 1); 
    }

    // 4. Multiplication (*)
    while(arr.includes("*")){
        let index = arr.indexOf("*");
        let d = parseFloat(arr[index - 1]) * parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1); 
        arr.splice(index - 1, 1); 
    }

    // 5. Addition (+)
    while(arr.includes("+")){
        let index = arr.indexOf("+");
        let d = parseFloat(arr[index - 1]) + parseFloat(arr[index + 1]);
        arr[index] = d;
        arr.splice(index + 1, 1); 
        arr.splice(index - 1, 1); 
    }

    // 6. Subtraction (-)
    while(arr.includes("-")){
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

function clearAll() {
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
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = Math.sin(angle).toString();
    displayFn();
}

function cos() {
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = Math.cos(angle).toString();
    displayFn();
}

function ten() { 
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    currentInput = Math.tan(angle).toString();
    displayFn();
}

function cot() {
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.tan(angle);
    currentInput = (1 / val).toString();
    displayFn();
}

function sec() {
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.cos(angle);
    currentInput = (1 / val).toString();
    displayFn();
}

function cosec() {
    if(currentInput === "") return;
    let angle = getAngle(parseFloat(currentInput));
    let val = Math.sin(angle);
    currentInput = (1 / val).toString();
    displayFn();
}


function nF() {
    if(currentInput === "") return;
    let num = parseInt(currentInput);
    if(num < 0) return;
    let res = 1;
    for(let i = 1; i <= num; i++) {
        res *= i;
    }
    currentInput = res.toString();
    displayFn();
}

function oneBx() {
    if(currentInput === "") return;
    currentInput = (1 / parseFloat(currentInput)).toString();
    displayFn();
}

function modX() {
    if(currentInput === "") return;
    currentInput = Math.abs(parseFloat(currentInput)).toString();
    displayFn();
}

function exp() { 
    if(currentInput === "") return;
    currentInput = Math.exp(parseFloat(currentInput)).toString();
    displayFn();
}

function ee() {
    currentInput = Math.E.toString();
    displayFn();
}

function pi() {
    currentInput = Math.PI.toString();
    displayFn();
}

function xR2() {
    if(currentInput === "") return;
    currentInput = Math.pow(parseFloat(currentInput), 2).toString();
    displayFn();
}

function sqrt() {
    if(currentInput === "") return;
    currentInput = Math.sqrt(parseFloat(currentInput)).toString();
    displayFn();
}

function tenRx() {
    if(currentInput === "") return;
    currentInput = Math.pow(10, parseFloat(currentInput)).toString();
    displayFn();
}

function logerithum() {
    if(currentInput === "") return;
    currentInput = Math.log10(parseFloat(currentInput)).toString();
    displayFn();
}

function ln() {
    if(currentInput === "") return;
    currentInput = Math.log(parseFloat(currentInput)).toString();
    displayFn();
}

//------------------------------------------------------------------------

// --- PARENTHESES (Future Implementation) ---
function lpar() {
    // Logic to be added later as requested
    console.log("Left Parenthesis - Logic pending");
}

function rpar() {
    // Logic to be added later as requested
    console.log("Right Parenthesis - Logic pending");
}

// --- MEMORY FUNCTIONS ---
function mc() {
    memory = 0;
    history.innerText = "Memory Cleared";
}

function mr() {
    currentInput = memory.toString();
    displayFn();
}

function mAdd() {
    if (currentInput !== "") {
        memory += parseFloat(currentInput);
        history.innerText = "Memory: " + memory;
    }
}

function mRem() {
    if (currentInput !== "") {
        memory -= parseFloat(currentInput);
        history.innerText = "Memory: " + memory;
    }
}

function ms() {
    if (currentInput !== "") {
        memory = parseFloat(currentInput);
        history.innerText = "Memory Stored: " + memory;
    }
}