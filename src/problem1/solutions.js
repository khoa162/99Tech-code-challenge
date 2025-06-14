//Solution 1: Use Loop
//This solution uses a simple for loop to iterate from 1 to N
export const sumToNLoop = function(n) {
    try {
        if (n < 0) throw new Error('Input must be a non-negative number');
        if (n === 0) return 0;
        
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    } catch (error) {
        throw error;
    }
};

// Soluton 2: Use Math Formula
// This solution uses the arithmetic sequence sum formula: n*(n+1)/2
export const sumToNFormula = function(n) {
    try {
        if (n < 0) throw new Error('Input must be a non-negative number');
        if (n === 0) return 0;
        
        return (n * (n + 1)) / 2;
    } catch (error) {
        throw error;
    }
};

// Soluton 3: Recursive
// This solution breaks down the problem into smaller subproblems using recursion.
export const sumToNRecursive = function(n) {
    try {
        if (n < 0) throw new Error('Input must be a non-negative number');
        if (n === 0) return 0;
        if (n === 1) return 1;
        
        return n + sumToNRecursive(n - 1);
    } catch (error) {
        throw error;
    }
};
