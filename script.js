function add(a,b) {
    return a + b;
}


function subtract(a,b) {
    return a - b;
}


function multiply(a,b) {
    return a*b;
}


function divide(a,b) {
    return a/b;
}


function operate(functionName, a, b) {
    return functionName(a,b);
}


function updateDisplay(number) {
    const screen = document.querySelector("#screen");
    screen.textContent = number;
}


function clearScreen() {
    currentScreen = "";
    updateDisplay(currentScreen);
}


let currentScreen = "";
let currentNumber = "";
let operatorArray = [];
let numberArray = [];
let digitNextClear = false; 
let ans;
let evaluateNext = false;

const digits = document.querySelectorAll("button.digit"); // 0-9 and period
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        if (digitNextClear) {
            updateDisplay(currentNumber); // Clear screen, current number is ""
            digitNextClear = false; // Only digit just after operator will clear screen
        }
        currentNumber += digit.textContent;
        updateDisplay(currentNumber);
    })
})

const operators = document.querySelectorAll("button.operator"); // + - x /
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        numberArray.push(+currentNumber); // Store digit string as number in array
        currentNumber = ""; // Reset to empty string for future use
        digitNextClear = true; // After operator, next digit will clear screen
        const clicked = operator.textContent;
        operatorArray.push(clicked);
        if (evaluateNext) {
            evaluateNow();
            evaluateNext = false; // Instant display of multiplication and division
            operatorArray.push(clicked); // Stored again, cleared by evaluateNow()
        }
        evaluateNext = (clicked == '×' || clicked == '÷'); // Preparing instant display
    })
})

const equal = document.querySelector("#equal");
equal.addEventListener("click", () => {
    evaluateNow();
    numberArray = [];
});

function evaluateNow() {
    numberArray.push(+currentNumber);
    currentNumber = "";
    digitNextClear = true;
    if (numberArray.length === 1) ans = numberArray[0];
    else {
        switch (operatorArray[0]) {
            case ('+'):
                ans = operate(add, numberArray[0], numberArray[1]);
                break;
            case ('–'):
                ans = operate(subtract, numberArray[0], numberArray[1]);
                break;
            case ('÷'):
                ans = operate(divide, numberArray[0], numberArray[1]);
                break;
            case ('×'):
                ans = operate(multiply, numberArray[0], numberArray[1]);
                break;
        }
    } 
    updateDisplay(ans);
    operatorArray = [];
    numberArray = [ans];
}
