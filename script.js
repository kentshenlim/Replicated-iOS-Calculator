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


function fourDPIfNonInteger(number) {
    return Math.round(number*10**4)/10**4; // At most 4 dp
}


function check() {
    console.log(`Current display: ${currentDisplay}`);
    console.log(`Operator array: ${operatorArray}`);
    console.log(`Number array: ${numberArray}`);
}


function clearAll() {
    currentDisplay = "";
    operatorArray = [];
    numberArray = [];
    digitNextClear = false;
    evaluateNext = false;
}


function storeNonEmptyCurrentDisplay() {
    if (currentDisplay) { // If not empty
        numberArray.push(+currentDisplay); // Store digit string as number in array
        currentDisplay = ""; // Reset to empty string for future use
    }
}


function evaluateNow() {
    if (numberArray.length === 1) ans = numberArray[0];
    else {
        const last = numberArray[numberArray.length-1];
        const secondLast = numberArray[numberArray.length-2];
        switch (operatorArray[operatorArray.length-1]) {
            case ('+'):
                ans = operate(add, secondLast, last);
                break;
            case ('–'):
                ans = operate(subtract, secondLast, last);
                break;
            case ('×'):
                ans = operate(multiply, secondLast, last);
                break;
            case ('÷'):
                ans = operate(divide, secondLast, last);
                break;
        }
    }
    updateDisplay(fourDPIfNonInteger(ans)); // 4 dp display if not integer
    operatorArray.pop(); // This function always uses last element, so pop out after using
    numberArray = [ans]; // Store exact value for carry-on calculations
    check();
}


function evaluateEverythingNow() {
    while (operatorArray.length >= 1) {
        let tempNumberArray = [...numberArray]; // Store first, don't modify numberArray
        tempNumberArray.splice(tempNumberArray.length-2,2); // Remove the last two, store all previous numbers
        evaluateNow();
        numberArray = tempNumberArray.concat(numberArray);
    }
}


let currentDisplay = "",
operatorArray = [],
numberArray = [],
digitNextClear = false,
evaluateNext = false,
ans;

const digits = document.querySelectorAll("button.digit"); // 0-9 and period
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        currentDisplay += digit.textContent; // Concatenate numbers
        updateDisplay(currentDisplay);
        /* After a calculation completed, pressing a digit implies no longer
        interested in current answer, so can abort.
        */
        if (numberArray.length != 0 && operatorArray.length == 0) {
            numberArray = [];
        } // Bug fix 1, cf README.md
        check();
    })
})

const operators = document.querySelectorAll("button.operator"); // + - x /
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        storeNonEmptyCurrentDisplay();
        const clicked = operator.textContent;
        if (evaluateNext && operatorArray.length >= 1) { // If currently not empty
            let tempNumberArray = [...numberArray]; // Store first, don't modify numberArray
            tempNumberArray.splice(tempNumberArray.length-2,2); // Remove the last two, store all previous numbers
            evaluateNow(); // The numberArray is now [ans]
            numberArray = tempNumberArray.concat(numberArray); // Get back previous unused num + ans
            evaluateNext = false; // x / removed, so set back to default false
        }
        if (!operator.classList.contains("priority") && operatorArray.length >= 1) { // If in addition + or - pressed
            evaluateEverythingNow()
        } /*The first if always removes * and /, the second if triggers complete calculation if + or - pressed*/
        operatorArray.push(clicked);
        evaluateNext = operator.classList.contains("priority"); // Preparing instant display
        check();
    })
}) // × or ÷ followed by digits and then followed by any operator will cause instant evaluation

const equal = document.querySelector("#equal");
equal.addEventListener("click", () => {
    storeNonEmptyCurrentDisplay();
    evaluateEverythingNow();
    evaluateNext = false;
    check();
}); // When = pressed, always evaluate everything until operatorArray becomes empty

const clc = document.querySelector("#clc");
clc.addEventListener("click", () => {
    clearAll();
    updateDisplay(0);
    check();
})