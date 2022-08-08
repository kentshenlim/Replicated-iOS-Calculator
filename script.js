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


let currentScreen = "";
let currentNumber = "";
let currentOperator = [];
let numberArray = [];
let digitNextClear = false;
let ans;
const digits = document.querySelectorAll("button.digit");
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        if (digitNextClear) {
            currentScreen = "";
            updateDisplay(currentScreen);
            digitNextClear = false; // Digits after operator will clear screen
        }
        currentNumber += digit.textContent;
        currentScreen += digit.textContent;
        updateDisplay(currentScreen);
    })
})

const operators = document.querySelectorAll("button.operator");
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        numberArray.push(+currentNumber); // Store digit string as number in array
        currentNumber = ""; // Reset to empty string for future use
        digitNextClear = true; // After clicked, next digit will clear screen
        currentOperator.push(operator.textContent);
    })
})

const equal = document.querySelector("#equal");
equal.addEventListener("click", () => {
    numberArray.push(+currentNumber);
    currentNumber = "";
    digitNextClear = true;
    switch (currentOperator[0]) {
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
    updateDisplay(ans);
    currentOperator = [];
    numberArray = [];
})

