import {operators} from "../operators.js"

// String to Postfix (shunting yard)
const operation = {
    '+': { prec: 2, exec: (a, b) => a + b },
    '-': { prec: 2, exec: (a, b) => a - b },
    '*': { prec: 3, exec: (a, b) => a * b },
    '/': { prec: 3, exec: (a, b) => a / b },
    '^': { prec: 4, exec: (a, b) => power(a, b)},
    '%': { prec: 3, exec: (a, b) => a % b }
};

export function calculateBasic(input) {
    const tokens = input.match(/\d*\.\d+|\d+|[+\-*/^()%]/g);
    const outputQueue = [];
    const opStack = [];

    tokens.forEach((token, i) => {
        if (!isNaN(token)) {
            outputQueue.push(parseFloat(token));
        }

        else if (token === '-' && (i === 0 || operators.has(tokens[i-1]))) {
            outputQueue.push(0);
            opStack.push('-');
        }

        else if (token === '(') {
            opStack.push(token);
        }
        
        else if (token === ')') {
            while (opStack.length && opStack[opStack.length - 1] !== '(') {
                outputQueue.push(opStack.pop());
            }
            opStack.pop();
        } 
        
        else {
            while (
                opStack.length && opStack[opStack.length - 1] !== '(' &&
                (operation[opStack[opStack.length - 1]].prec > operation[token].prec || 
                (operation[opStack[opStack.length - 1]].prec === operation[token].prec && token !== '^'))
                ) {
                    outputQueue.push(opStack.pop());
            }
            opStack.push(token);
        }
    });
    while (opStack.length) {
        outputQueue.push(opStack.pop());
    }

    console.log(`outputQueue: ${outputQueue}`)

    const stack = [];
    outputQueue.forEach(token => {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(operation[token].exec(a, b));
        }
    });
    return stack[0];
}

function power(a, b) {
    // let result = 1; 
    // for(let i = 0 ; i < b ; i++){
    //     result = result*a;
    // }
    // return result
    return a**b
}

// console.log(power(2, 3));


// console.log(calculateBasic("2 ^ 3 ^ 2"));
// console.log(calculateBasic("5^2"));
// console.log(calculateBasic("0.5+2.5"));
// console.log(calculateBasic("-5-5"));