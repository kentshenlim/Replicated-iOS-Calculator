// Function declaration
function getNewNumberArray(tempNumberArray) {
    // If inputCurrentDisplay not empty, store into number array and clear
    // Input: numberArray; output: the modified number array
    if (currentDisplay) { // If not empty
        tempNumberArray.push(+currentDisplay); // Store digit string as number in array
    }
    return tempNumberArray;
}


function getBinaryOperationAnswer(operatorString, a, b) {
    // Calculate answer for binary operation
    // Input: string specifying type of operation, then first and second operand
    // Output: answer for that binary operation
    // Does not take into account sequence of keys pressed
    switch (operatorString) {
        case ('+'):
            return a + b;
        case ('–'):
            return a - b;
        case ('×'):
            return a*b;
        case ('÷'):
            return a/b;
    }
}


function getOneAnswer(tempNumberArray, tempOperatorArray) {
    // Evaluate expression based on sequence of keys pressed
    // Input: numberArray then operatorArray; output: answer
    // getOneAnswer includes handling based on condition, not to be confused with operate
    // Handling when = pressed with only one number having been entered
    if (tempNumberArray.length === 1 && !operatorSet) return tempNumberArray[0];
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
        return getBinaryOperationAnswer(tempOperatorArray[tempOperatorArray.length-1], secondLast, last);
    }
}


function getFinalAnswerAndUpdateNumOperate(tempNumberArray, tempOperatorArray) {
    // Evaluate everything, taking into account sequence of keys pressed
    // Input and output: exactly same as getOneAnswer
    let output;
    if (numberArray.length == 1 && operatorArray.length == 0) output = numberArray[numberArray.length-1]
    else {
        while (tempOperatorArray.length >= 1) {
            output = getOneAnswer(tempNumberArray, tempOperatorArray);
            tempOperatorArray.pop(); // The getOneAnswer always uses last element, so pop out after using
            tempNumberArray.push(output); // Store exact value for carry-on calculations
        }
    }   
    return output;
}


function getNDPIfNonInteger(number, N) {
    // Return number with at most N DP without introducing DP to integers
    // Input: any number, then number of DP; output: number with at most 4 DP
    return Math.round(number*10**N)/10**N;
}


function getAtMostNineDigitsAndEForCalculated(number) {
    // Return decimals with at most nine digits, char e in exponential included
    // Period and comma excluded
    // Input: any number for calculated output; output: trim unwanted dp
    // For while keying in

    
    if (number > 1e9 || number < 1e-9) {
        number = number.toExponential().replace("+", "");
        let frontPart = number.split("e")[0],
        exponentialPart = number.split("e")[1],
        placesForFrontPart = 9 - 1 - exponentialPart.length;
        if (frontPart.length - placesForFrontPart > 0) {
            let beforeDecimal = frontPart.split(".")[0],
            supposedDP = placesForFrontPart - beforeDecimal.length;
            if (number < 1e-9) supposedDP -= 1; // One taken for - in negative exponential
            frontPart = getNDPIfNonInteger(frontPart, supposedDP);
        }
        return frontPart + "e" + exponentialPart;
    }
    else if (String(number).length > 9) {
        let beforeDecimal = String(number).split(".")[0],
        supposedDP = 9 - beforeDecimal.length;
        return getNDPIfNonInteger(number, supposedDP);
    }
    else return number;
}


function updateDisplay(number) {
    // Update display, padding comma if necessary
    // Input: new content; output: none
    const screen = document.querySelector("#screen");
    if (number === Infinity) number = "Error";
    else if (!String(number).includes("e") && number >= 1000 && String(number).length > 3 && String(number).length <= 9) { // Add commas
        number = String(number);
        let i = number.length-3;
        while (i > 0) {
            number = number.slice(0,i) + "," + number.slice(i);
            i -= 3;
        }
    } 
    screen.textContent = number;
}


function clearAll() {
    // Initialize calculator, for AC button
    // Input and output: none
    currentDisplay = "";
    operatorArray = [];
    numberArray = [];
    evaluateNext = false;
    operatorSet = false;
    updateDisplay(0);
}


function check() {
    // Checker function for debugging, will be removed
    console.log(`Current display: ${currentDisplay}`);
    console.log(`Operator array: ${operatorArray}`);
    console.log(`Number array: ${numberArray}`);
}




// Global variable initialization
let currentDisplay = "",
operatorArray = [],
numberArray = [],
evaluateNext = false, // For precedence rule
lastOperator, // For successive = after outputting answer
lastNumber, // For successive = after outputting answer
operatorSet = false, // For the sequence operator followed directly by =
ans; // Answer




// Event listeners
// Digit buttons
const digits = document.querySelectorAll("button.digit"); // 0-9 and period
digits.forEach(digit => {
    digit.addEventListener("click", () => {
        operatorSet = false; // Abort possibility of operator followed directly by =
            if (currentDisplay.length < 9) { // While keying digits allow only at most 9
                if (currentDisplay === "0" || currentDisplay === "-0") {
                    currentDisplay = currentDisplay.replace("0", "");
                } // Never start display with 0, unless decimal
                currentDisplay += digit.textContent; // Concatenate numbers
                updateDisplay(currentDisplay);
                /* After a calculation completed, pressing a digit implies no longer
                interested in current answer, so can abort.
                */
                if (numberArray.length != 0 && operatorArray.length == 0) {
                    numberArray = [];
                } // Bug fix 1, cf README.md
            }
        check();
    })
});


// Period button extra
const period = document.querySelector("#period");
period.addEventListener("click", () => {
    if (currentDisplay.split(".").length == 3) currentDisplay = currentDisplay.slice(0, this.length-1);
    // If there are two periods, .split will break string into three. Remove the last period.
    if (currentDisplay === ".") currentDisplay = "0.";
    // Padding start with 0, so the display never be something like ".3, .7"
    updateDisplay(currentDisplay);
})


// Operator buttons, + - x ÷
const operators = document.querySelectorAll("button.operator");
operators.forEach(operator => {
    operator.addEventListener("click", () => {
        numberArray = getNewNumberArray(numberArray); // Update numberArray when operator pressed
        currentDisplay = ""; // Prepare to store next number
        const clicked = operator.textContent;
        lastOperator = clicked; // For successive = 
        if (evaluateNext && operatorArray.length >= 1) { // Precedence rule
            ans = getOneAnswer(numberArray, operatorArray); // The numberArray is now [ans]
            updateDisplay(getAtMostNineDigitsAndEForCalculated(ans));
            operatorArray.pop();
            numberArray.push(ans); 
            evaluateNext = false; // Higher precedence operator removed, so set back to default false
        }
        if (!operator.classList.contains("priority") && operatorArray.length >= 1) { // If in addition + or - pressed
            ans = getFinalAnswerAndUpdateNumOperate(numberArray, operatorArray);
            updateDisplay(getAtMostNineDigitsAndEForCalculated(ans));
        } // The first if always removes * and /, the second if triggers complete calculation if + or - pressed
        if (!operatorSet && numberArray.length == 1) {
            operatorSet = true; 
            lastNumber = numberArray[numberArray.length - 1];
        } // Sequence operator followed directly by =
        operatorArray.push(clicked);
        evaluateNext = operator.classList.contains("priority"); // Preparing instant evaluation when x ÷ pressed
        check();
    })
}); 
/* Precedence rule: × or ÷ followed by digits and then followed by any operator will cause instant evaluation.
The above will always remove x and ÷. Subsequent + or - will trigger complete calculation */


// Equal button, =
const equal = document.querySelector("#equal");
equal.addEventListener("click", () => {
    operators.forEach(button => {
        button.classList.remove("clicked")
    }); // Remove color of all operator buttons every time = is pressed
    if (currentDisplay != "" && operatorArray.length != 0) {
        lastOperator = operatorArray[operatorArray.length-1];
        lastNumber = currentDisplay;
    } // Handling for operator followed directly by =
    if (currentDisplay == "" && operatorArray.length == 0 && lastOperator) {
        currentDisplay = lastNumber;
        operatorArray.push(lastOperator);
    } // Handling for successive =
    numberArray = getNewNumberArray(numberArray);
    currentDisplay = "";
    ans = getFinalAnswerAndUpdateNumOperate(numberArray, operatorArray);
    updateDisplay(getAtMostNineDigitsAndEForCalculated(ans));
    evaluateNext = false;
    operatorSet = false;
    check();
}); // When = pressed, always evaluate everything until operatorArray becomes empty


// Clear button, AC
const clc = document.querySelector("#clc");
clc.addEventListener("click", () => {
    clearAll();
    color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"));
    check();
});


// Percentage button, %
const percentage = document.querySelector("#percentage");
percentage.addEventListener("click", () => {
    currentDisplay /= 100;
    updateDisplay(currentDisplay);
})


// Sign inversion, +/-
const sign = document.querySelector("#sign");
sign.addEventListener("click", () => {
    if (!currentDisplay && numberArray.length == 0 && operatorArray.length == 0 || currentDisplay === "0") {
        currentDisplay = "-0";
    } // When +/- pressed at the beginning is 0
    else if (currentDisplay === "-0") {
        currentDisplay = "0";
    } // When +/- pressed again at the beginning
    else if (!currentDisplay && numberArray.length > 0 && operatorArray.length == 0) {
        currentDisplay = "-".concat(String(numberArray[numberArray.length-1]));
        numberArray.pop();
    } // For inversion of previous answer, extract the previous answer out from number array, invert the sign
    else if (operatorArray.length > 0) {
        currentDisplay = "-0";
    } // For +/- after an operator
    else {
        currentDisplay = String(-1*currentDisplay);
    }
    updateDisplay(currentDisplay);
    check();
})


// Color handling
const color1And3AndEqual = document.querySelectorAll(".color1, .color3, #equal"),
color3 = document.querySelectorAll(".color3"),
color2WithoutEqual = Array.from(document.querySelectorAll(".color2"));

color1And3AndEqual.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("clicked");
    })
    button.addEventListener("transitionend", () => {
        button.classList.remove("clicked");
    }) // Blinking button when clicked
});

color2WithoutEqual.forEach(button => {
    button.addEventListener("click", () => {
        color2WithoutEqual.forEach(button => button.classList.remove("clicked"));
        button.classList.add("clicked");
    })
});

color3.forEach(button => {
    button.addEventListener("click", () => {
        color2WithoutEqual.forEach(ori => ori.classList.remove("clicked"))
    })
});