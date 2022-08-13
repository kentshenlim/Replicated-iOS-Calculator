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
    if (number === Infinity) number = "Error";
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
    if (numberArray.length === 1 && !operatorSet) ans = numberArray[0];
    else {
        let last;
        let secondLast;
        if (operatorSet) {
          last = lastNumber;
          secondLast = numberArray.pop();
        } else {
          last = numberArray.pop();
          secondLast = numberArray.pop();
        }
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
    numberArray.push(ans); // Store exact value for carry-on calculations
    check();
}


function evaluateEverythingNow() {
    while (operatorArray.length >= 1) {
        evaluateNow();
    }
}


let currentDisplay = "",
operatorArray = [],
numberArray = [],
digitNextClear = false,
evaluateNext = false,
lastOperator, // For successive =
lastNumber, // For successive =
operatorSet = false,
ans;

const digits = document.querySelectorAll("button.digit"); // 0-9 and period
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        operatorSet = false;
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
});

const operators = document.querySelectorAll("button.operator"); // + - x /
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        storeNonEmptyCurrentDisplay();
        const clicked = operator.textContent;
        lastOperator = clicked;
        if (evaluateNext && operatorArray.length >= 1) { // If currently not empty
            evaluateNow(); // The numberArray is now [ans]
            evaluateNext = false; // x / removed, so set back to default false
        }
        if (!operator.classList.contains("priority") && operatorArray.length >= 1) { // If in addition + or - pressed
            evaluateEverythingNow()
        } /*The first if always removes * and /, the second if triggers complete calculation if + or - pressed*/
        if (!operatorSet && numberArray.length == 1) {
            operatorSet = true; 
            lastNumber = numberArray[numberArray.length - 1];
        }
        operatorArray.push(clicked);
        evaluateNext = operator.classList.contains("priority"); // Preparing instant display
        check();
    })
}); // × or ÷ followed by digits and then followed by any operator will cause instant evaluation

const equal = document.querySelector("#equal");
equal.addEventListener("click", () => {
    if (currentDisplay != "" && operatorArray.length != 0) {
        lastOperator = operatorArray[operatorArray.length-1];
        lastNumber = currentDisplay;
    }
    if (currentDisplay == "" && operatorArray.length == 0) {
        currentDisplay = lastNumber;
        operatorArray.push(lastOperator);
    } // For successive =
    storeNonEmptyCurrentDisplay();
    evaluateEverythingNow();
    evaluateNext = false;
    operatorSet = false;
    check();
}); // When = pressed, always evaluate everything until operatorArray becomes empty

const clc = document.querySelector("#clc");
clc.addEventListener("click", () => {
    clearAll();
    updateDisplay(0);
    color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"))
    check();
});

const percentage = document.querySelector("#percentage");
percentage.addEventListener("click", () => {
    currentDisplay /= 100;
    updateDisplay(currentDisplay);
})

const sign = document.querySelector("#sign");
sign.addEventListener("click", () => {
    if (currentDisplay != 0) {
        currentDisplay = -1*currentDisplay;
        updateDisplay(currentDisplay);
        check();
    }
})

const color1And3AndEqual = document.querySelectorAll(".color1, .color3, #equal"),
color3 = document.querySelectorAll(".color3"),
color2WithoutEqual = Array.from(document.querySelectorAll(".color2"));

color1And3AndEqual.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("clicked");
    })
    button.addEventListener("transitionend", () => {
        button.classList.remove("clicked");
    })
});

color2WithoutEqual.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("clicked");
    })
});

color3.forEach(button => {
    button.addEventListener("click", () => {
        color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"))
    })
});
