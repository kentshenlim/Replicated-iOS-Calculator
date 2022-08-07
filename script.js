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
digits = document.querySelectorAll("button.digit");
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        currentNumber += digit.textContent;
        currentScreen += digit.textContent;
        updateDisplay(currentScreen);
    })
})

operators = document.querySelectorAll("button.operator");
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        currentOperator.push(operator.textContent);
        currentScreen = "";
        updateDisplay(currentScreen);
    })
})