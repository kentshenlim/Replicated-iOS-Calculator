# Project Description
Web version of replicated iOS built-in calculator app, written to practice 
JavaScript, under the guidance of TOP. Only the vertical-screen mode of the App
will be written.   

eval() and new Function() will not be used in this project.  

# Features Added and Test Cases
1) Successive calculation (without AC) with different starting values  
Key pressed: 2 + 3 = 5 - 4 = 7 x 3 = 1 / 2 =  
All binary operations must return correct values, without refreshing the page
or AC the calculator after = has been pressed.  
2) Successive calculation with carry-on value  
Key pressed: 2 + 3 = + 5 = * 4 = / 2 =  
Binary operations using value from previous calculations.  
3) Precedence rules for > binary operation  
Key pressed: 2 * 3 + 5 =  
When + or - pressed, previous operations will all be evaluated and result shown.  
Key pressed: 2 + 5 * 3 =  
Must return 17 but not 13  
Key pressed: 2 + 5 * 3 - 2 + 5 * 11 =  
Must return 70. Result will be evaluated as soon as precedence rule can be 
resolved.

# Bug Fixed
1) After some calculations, with one number entered, pressing = will not return
that number, but return the last answer instead.  
Key pressed: 1 + 1 = 3 =  
Fix: When digits pressed, if the operatorArray is empty and the numberArray is
not empty, empty the numberArray to remove the last answer.  

2) If +/- is pressed first followed by a digit, the number will start with 0.  
Key pressed: pm 1  
Fix: Operate only if currentDisplay != 0  

# Image Credits
icon.png: https://pnghut.com/png/RDcWqJiKEw/scientific-calculator-symbol-mathematics-logo-transparent-png

# Coming features
- [ ] One number followed by = will output NaN  
- [ ] Handling of +/- first followed by digits  
- [ ] Exact action of AC button, including changing of text content into C  
- [ ] Output auto-wrapping  
- [ ] Auto-conversion of too small or too big numbers into scientific notation    
- [ ] Difference in color change during holding and tapping  