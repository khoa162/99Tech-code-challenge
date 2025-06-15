# Sum to N Implementation

This repository contains three different implementations of a function that calculates the sum of all numbers from 1 to n.

## Problem Statement

Given an integer n, calculate the sum of all numbers from 1 to n.
Example: For n = 5, the result should be 1 + 2 + 3 + 4 + 5 = 15

For negative numbers, the function calculates the sum from n to -1.
Example: For n = -3, the result should be -3 + (-2) + (-1) = -6

## Implementations

### 1. Iterative Approach (sum_to_n_a)
```javascript
var sum_to_n_a = function(n) {
    let sum = 0;
    if (n >= 0) {
        for (let i = 1; i <= n; i++) {
            sum += i;
        }
    } else {
        for (let i = n; i <= -1; i++) {
            sum += i;
        }
    }
    return sum;
};
```
- Uses a simple for loop to iterate from 1 to n (for positive n) or from n to -1 (for negative n)
- Accumulates the sum in a variable
- Time Complexity: O(n)
- Space Complexity: O(1)
- Best for: Small to medium values of n
- Pros: Simple to understand, straightforward implementation
- Cons: Less efficient for large values of n

### 2. Mathematical Formula (sum_to_n_b)
```javascript
var sum_to_n_b = function(n) {
    if (n >= 0) {
        return (n * (n + 1)) / 2;
    } else {
        return -((Math.abs(n) * (Math.abs(n) + 1)) / 2);
    }
};
```
- Uses the arithmetic sequence sum formula: n*(n+1)/2 for positive n
- For negative n, calculates sum of absolute values and negates the result
- Calculates the result in constant time
- Time Complexity: O(1)
- Space Complexity: O(1)
- Best for: Any value of n (most efficient)
- Pros: Most efficient solution, constant time operation
- Cons: Less intuitive if you don't know the formula

### 3. Recursive Approach (sum_to_n_c)
```javascript
var sum_to_n_c = function(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === -1) return -1;
    return n + sum_to_n_c(n > 0 ? n - 1 : n + 1);
};
```
- Uses recursion to break down the problem
- Base cases: returns 0 for n = 0, 1 for n = 1, -1 for n = -1
- Recursive case: adds current number to sum of previous numbers
- For negative n, recursively adds numbers from n to -1
- Time Complexity: O(n)
- Space Complexity: O(n) due to call stack
- Best for: Educational purposes, understanding recursion
- Pros: Elegant solution, demonstrates recursion
- Cons: Less efficient due to call stack overhead, can cause stack overflow for large n

## Usage

```javascript
console.log(sum_to_n_a(5));  // Output: 15
console.log(sum_to_n_b(5));  // Output: 15
console.log(sum_to_n_c(5));  // Output: 15

console.log(sum_to_n_a(-3)); // Output: -6
console.log(sum_to_n_b(-3)); // Output: -6
console.log(sum_to_n_c(-3)); // Output: -6
```

## Notes

- All implementations assume the result will be less than Number.MAX_SAFE_INTEGER
- The mathematical formula (sum_to_n_b) is the most efficient solution
- For production use, consider using sum_to_n_b for its efficiency
- The recursive approach (sum_to_n_c) is mainly for educational purposes
- All implementations handle both positive and negative integers correctly 