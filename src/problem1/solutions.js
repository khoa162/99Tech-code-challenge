// USe Loop solution
export const sum_to_n_a = function(n) {
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

// Math formula solution
export const sum_to_n_b = function(n) {
    if (n >= 0) {
        return (n * (n + 1)) / 2;
    } else {
        return -((Math.abs(n) * (Math.abs(n) + 1)) / 2);
    }
};

// Use Recursive solution
export const sum_to_n_c = function(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === -1) return -1;
    return n + sum_to_n_c(n > 0 ? n - 1 : n + 1);
};
