function getBinaryOperationAnswer(operatorString, a, b) {
    // Calculate answer for binary operation
    // Input: string specifying type of operation, then first and second operand
    // Output: answer for that binary operation
    // Does not take into account sequence of keys pressed
    let calculated;
    switch (operatorString) {
        case ('+'):
            calculated = a + b;
            break;
        case ('–'):
            calculated = a - b;
            break;
        case ('×'):
            calculated = a*b;
            break;
        case ('÷'):
            calculated = a/b;
    }
    return calculated;
}


function updateDisplay(number) {
    // Update display
    // Input: new content; output: none
    const screen = document.querySelector("#screen");
    if (number === Infinity) number = "Error";
    screen.textContent = number;
}


function getFourDPIfNonInteger(number) {
    // Return number with at most 4 d.p. without introducing d.p. to integers
    // Input: any number; output: number with at most 4 d.p.
    return Math.round(number*10**4)/10**4;
}


function check() {
    // Checker function for debugging, will be removed
    console.log(`Current display: ${currentDisplay}`);
    console.log(`Operator array: ${operatorArray}`);
    console.log(`Number array: ${numberArray}`);
}


function clearAll() {
    // Initialize calculator
    // Input and output: none
    currentDisplay = "";
    operatorArray = [];
    numberArray = [];
    digitNextClear = false;
    evaluateNext = false;
    operatorSet = false;
}


function getNewNumberArray(tempNumberArray) {
    // If inputCurrentDisplay not empty, store into number array and clear
    // Input: numberArray; output: the modified number array
    if (currentDisplay) { // If not empty
        tempNumberArray.push(+currentDisplay); // Store digit string as number in array
    }
    return tempNumberArray;
}


function getOneAnswer(tempNumberArray, tempOperatorArray) {
    // Evaluate expression based on sequence of keys pressed
    // Input: numberArray then operatorArray; output: answer
    // getOneAnswer includes handling based on condition, not to be confused with operate
    let output;
    // Handling when = pressed with only one number having been entered
    if (tempNumberArray.length === 1 && !operatorSet) output = tempNumberArray[0];
    else {
        let last;
        let secondLast;
        if (operatorSet) { // Handing for operator followed by successive =
          last = lastNumber;
          secondLast = tempNumberArray.pop();
        } else { // Handling for normal binary operation
          last = tempNumberArray.pop();
          secondLast = tempNumberArray.pop(); 
        }
        output = getBinaryOperationAnswer(tempOperatorArray[tempOperatorArray.length-1], secondLast, last);
    }
    check();
    return output;
}


function getFinalAnswerAndUpdateNumOperate(tempNumberArray, tempOperatorArray) {
    // Evaluate everything, taking into account sequence of keys pressed
    // Input and output: exactly same as getOneAnswer
    let output;
    while (tempOperatorArray.length >= 1) {
        output = getOneAnswer(tempNumberArray, tempOperatorArray);
        tempOperatorArray.pop(); // The getOneAnswer always uses last element, so pop out after using
        tempNumberArray.push(output); // Store exact value for carry-on calculations
    }
    return output;
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
        numberArray = getNewNumberArray(numberArray);
        currentDisplay = "";
        const clicked = operator.textContent;
        lastOperator = clicked;
        if (evaluateNext && operatorArray.length >= 1) { // If currently not empty
            ans = getOneAnswer(numberArray, operatorArray); // The numberArray is now [ans]
            updateDisplay(getFourDPIfNonInteger(ans)); // 4 dp display if not integer
            operatorArray.pop(); // This function always uses last element, so pop out after using
            numberArray.push(ans); // Store exact value for carry-on calculations
            evaluateNext = false; // x / removed, so set back to default false
        }
        if (!operator.classList.contains("priority") && operatorArray.length >= 1) { // If in addition + or - pressed
            ans = getFinalAnswerAndUpdateNumOperate(numberArray, operatorArray);
            updateDisplay(getFourDPIfNonInteger(ans));
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
    operators.forEach(button => {
        button.classList.remove("clicked")
    });
    if (currentDisplay != "" && operatorArray.length != 0) {
        lastOperator = operatorArray[operatorArray.length-1];
        lastNumber = currentDisplay;
    }
    if (currentDisplay == "" && operatorArray.length == 0 && lastOperator) {
        currentDisplay = lastNumber;
        operatorArray.push(lastOperator);
    } // For successive =
    numberArray = getNewNumberArray(numberArray);
    currentDisplay = "";
    ans = getFinalAnswerAndUpdateNumOperate(numberArray, operatorArray);
    updateDisplay(getFourDPIfNonInteger(ans));
    evaluateNext = false;
    operatorSet = false;
    check();
}); // When = pressed, always evaluate everything until operatorArray becomes empty

const clc = document.querySelector("#clc");
clc.addEventListener("click", () => {
    clearAll();
    updateDisplay(0);
    color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"));
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
        /* color2WithoutEqual.forEach(button => button.classList.remove("clicked")); */
        button.classList.add("clicked");
    })
});

color3.forEach(button => {
    button.addEventListener("click", () => {
        color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"))
    })
});
