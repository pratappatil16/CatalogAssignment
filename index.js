const fs = require('fs');

// Function to decode y values based on the base provided
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation to find the constant term
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        // Calculate the Lagrange basis polynomial for each point
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (j !== i) {
                li *= (0 - points[j].x) / (xi - points[j].x);
            }
        }

        // Accumulate the contribution of each term to the constant
        constantTerm += yi * li;
    }

    // Return the rounded constant term (c)
    return Math.round(constantTerm);
}

// Main function to read JSON, decode roots, and calculate constant term
function findSecretConstant(filename) {
    // Read JSON file
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;

    // Parse roots
    const points = [];
    Object.keys(data).forEach(key => {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = decodeValue(base, value);
            points.push({ x, y });
        }
    });

    // Check if the number of points is sufficient
    if (points.length < k) {
        console.error("Insufficient points to solve for the polynomial coefficients");
        return;
    }

    // Find the constant term (c) using the minimum k points
    const constantTerm = lagrangeInterpolation(points.slice(0, k), k);

    console.log("The secret constant (c) is:", constantTerm);
}

// Provide the JSON filename as argument when calling the function
findSecretConstant('testcase.json');
