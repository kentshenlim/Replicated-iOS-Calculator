# Project Description
Web version of replicated iOS built-in calculator app, written to practice 
JavaScript, under the guidance of TOP.

# Features Added and Test Cases
1) Successive calculation (without AC) with different starting values  
Key pressed: 2 + 3 = 5 - 4 = 7 x 3 = 1 / 2 =  
All binary operations must return correct values, without refreshing the page
or AC the calculator after = has been pressed.  
2) Successive calculation with carry-on value  
Key pressed: 2 + 3 = + 5 = * 4 = / 2 =  
Binary operations using value from previous calculations.  

# Bug fixed
1) After some calculations, with one number entered, pressing = will not return
that number, but return the last answer instead.  
Key pressed: 1 + 1 = 3 =  
Fix: When digits pressed, if the operatorArray is empty and the numberArray is
not empty, empty the numberArray to remove the last answer.

# Image Credits
icon.png: https://pnghut.com/png/RDcWqJiKEw/scientific-calculator-symbol-mathematics-logo-transparent-png