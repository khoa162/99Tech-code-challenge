import { describe, it, expect } from 'vitest';
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './solutions';

describe('sum_to_n functions', () => {
    const testCases = [
        { n: 5, expected: 15 },
        { n: 10, expected: 55 },
        { n: 1, expected: 1 },
        { n: 0, expected: 0 },
        { n: -1, expected: -1 },
        { n: -5, expected: -15 }
    ];

    describe('sum_to_n_a', () => {
        testCases.forEach(({ n, expected }) => {
            it(`should return ${expected} for input ${n}`, () => {
                expect(sum_to_n_a(n)).toBe(expected);
            });
        });
    });

    describe('sum_to_n_b', () => {
        testCases.forEach(({ n, expected }) => {
            it(`should return ${expected} for input ${n}`, () => {
                expect(sum_to_n_b(n)).toBe(expected);
            });
        });
    });

    describe('sum_to_n_c', () => {
        testCases.forEach(({ n, expected }) => {
            it(`should return ${expected} for input ${n}`, () => {
                expect(sum_to_n_c(n)).toBe(expected);
            });
        });
    });
}); 