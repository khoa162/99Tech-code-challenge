import { describe, it, expect } from 'vitest';
import { sumToNLoop, sumToNFormula, sumToNRecursive } from './solutions';

describe('Sum to N Functions', () => {
    // Common test cases for all implementations
    const testCases = [
        { n: 1, expected: 1 },
        { n: 5, expected: 15 },
        { n: 10, expected: 55 },
        { n: 100, expected: 5050 },
        { n: 0, expected: 0 }
    ];

    // Test Loop Implementation
    describe('sumToNLoop', () => {
        it.each(testCases)('should return $expected for input $n', ({ n, expected }) => {
            expect(sumToNLoop(n)).toBe(expected);
        });

        it('should throw error for negative numbers', () => {
            expect(() => sumToNLoop(-1)).toThrow('Input must be a non-negative number');
        });

        it('should handle large numbers', () => {
            expect(sumToNLoop(1000)).toBe(500500);
        });
    });

    // Test Formula Implementation
    describe('sumToNFormula', () => {
        it.each(testCases)('should return $expected for input $n', ({ n, expected }) => {
            expect(sumToNFormula(n)).toBe(expected);
        });

        it('should throw error for negative numbers', () => {
            expect(() => sumToNFormula(-1)).toThrow('Input must be a non-negative number');
        });

        it('should handle large numbers', () => {
            expect(sumToNFormula(1000)).toBe(500500);
        });
    });

    // Test Recursive Implementation
    describe('sumToNRecursive', () => {
        it.each(testCases)('should return $expected for input $n', ({ n, expected }) => {
            expect(sumToNRecursive(n)).toBe(expected);
        });

        it('should throw error for negative numbers', () => {
            expect(() => sumToNRecursive(-1)).toThrow('Input must be a non-negative number');
        });

        it('should handle medium numbers', () => {
            expect(sumToNRecursive(50)).toBe(1275);
        });
    });

    // Test all implementations give same results
    describe('Implementation Comparison', () => {
        it('all implementations should give same results for small numbers', () => {
            const testInputs = [1, 5, 10, 50];
            testInputs.forEach(input => {
                const resultLoop = sumToNLoop(input);
                const resultFormula = sumToNFormula(input);
                const resultRecursive = sumToNRecursive(input);
                
                expect(resultLoop).toBe(resultFormula);
                expect(resultFormula).toBe(resultRecursive);
            });
        });
    });
}); 