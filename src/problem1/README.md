# Sum to N Implementation

This repository contains three different implementations of a function that calculates the sum of all numbers from 1 to n.

## Problem Statement

Given an integer n, calculate the sum of all numbers from 1 to n.
Example: For n = 5, the result should be 1 + 2 + 3 + 4 + 5 = 15

## Implementations

### 1. Iterative Approach (sumToNLoop)
```javascript
var sumToNLoop = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
```
- Uses a simple for loop to iterate from 1 to n
- Accumulates the sum in a variable
- Time Complexity: O(n)
- Space Complexity: O(1)
- Best for: Small to medium values of n
- Pros: Simple to understand, straightforward implementation
- Cons: Less efficient for large values of n

### 2. Mathematical Formula (sumToNFormula)
```javascript
var sumToNFormula = function(n) {
    return (n * (n + 1)) / 2;
};
```
- Uses the arithmetic sequence sum formula: n*(n+1)/2
- Calculates the result in constant time
- Time Complexity: O(1)
- Space Complexity: O(1)
- Best for: Any value of n (most efficient)
- Pros: Most efficient solution, constant time operation
- Cons: Less intuitive if you don't know the formula

### 3. Recursive Approach (sumToNRecursive)
```javascript
var sumToNRecursive = function(n) {
    if (n === 1) return 1;
    return n + sumToNRecursive(n - 1);
};
```
- Uses recursion to break down the problem
- Base case: returns 1 when n = 1
- Recursive case: adds current number to sum of previous numbers
- Time Complexity: O(n)
- Space Complexity: O(n) due to call stack
- Best for: Educational purposes, understanding recursion
- Pros: Elegant solution, demonstrates recursion
- Cons: Less efficient due to call stack overhead, can cause stack overflow for large n

## Usage

```javascript
console.log(sumToNLoop(5)); // Output: 15
console.log(sumToNFormula(5)); // Output: 15
console.log(sumToNRecursive(5)); // Output: 15
```

## Notes

- All implementations assume the result will be less than Number.MAX_SAFE_INTEGER
- The mathematical formula (sumToNFormula) is the most efficient solution
- For production use, consider using sumToNFormula for its efficiency
- The recursive approach (sumToNRecursive) is mainly for educational purposes 